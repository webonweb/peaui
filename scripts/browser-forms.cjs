const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { withPage } = require('./browser-forms-harness.cjs');
const engine = process.env.PEAUI_BROWSER || process.argv[2] || process.env.PEAUI_FORMS_ENGINE || 'chromium';
const reportDirectory = path.resolve(process.env.PEAUI_FORMS_REPORT_DIR || 'test-results/forms');
fs.mkdirSync(reportDirectory, { recursive: true });

withPage(async ({ page, mount, snapshot, update, errors }) => {
  const results = [];
  async function check(id, framework, component, run) {
    if (process.env.PEAUI_FORMS_CASE && id !== process.env.PEAUI_FORMS_CASE) return;
    try { results.push({ id, framework, component, pass: true, evidence: await run() }); }
    catch (error) { results.push({ id, framework, component, pass: false, error: error.stack }); }
    console.log(id, framework, component, results.at(-1).pass ? 'PASS' : 'FAIL');
  }
  const native = 'input:not([type=hidden]):not([aria-hidden=true])';
  async function verifyLabelFocus(nativeSelector) {
    const definition = await page.locator(nativeSelector).first().evaluate(element => ({ tag: element.localName, type: element.type }));
    await page.evaluate(definition => {
      const wrapper = document.createElement('div'); wrapper.id = 'native-reference';
      const control = document.createElement(definition.tag); control.id = 'native-reference-control'; control.type = definition.type;
      const label = document.createElement('label'); label.htmlFor = control.id; label.id = 'native-reference-label'; label.textContent = 'Native reference';
      wrapper.append(label, control); document.body.append(wrapper);
    }, definition);
    await page.locator('#native-reference-label').click();
    const nativeFocused = await page.locator('#native-reference-control').evaluate(control => document.activeElement === control);
    await page.locator('#native-reference').evaluate(element => element.remove());
    await page.locator('#proof-label').click();
    const componentFocused = await page.locator(nativeSelector).first().evaluate(control => document.activeElement === control);
    assert.equal(componentFocused, nativeFocused, 'Label focus must match the browser native control');
    return { nativeFocused, componentFocused };
  }
  const nativeData = (selector = '#root') => page.evaluate(s => [...new FormData(document.querySelector(s))], selector);
  async function resetButton(external = false) {
    await page.evaluate(external => {
      let form = document.querySelector(external ? '#external-form' : '#root');
      if (!form) { form = document.createElement('form'); form.id = 'external-form'; document.body.append(form); }
      const button = document.createElement('button'); button.type = 'reset'; button.id = 'reset-proof'; button.textContent = 'Reset'; button.style.display = 'block'; button.style.marginBlockStart = '6rem'; form.append(button);
      window.resetEvents = [];
      form.addEventListener('reset', event => setTimeout(() => window.resetEvents.push({ trusted: event.isTrusted, canceled: event.defaultPrevented }), 0));
    }, external);
  }
  async function edit(component) {
    if (['FormButtonGroup', 'SegmentedControl'].includes(component)) await page.getByRole('radio', { name: 'Beta', exact: true }).click();
    else if (['FormDatePicker', 'FormYearPicker'].includes(component)) { await page.locator(native).first().press('ArrowDown'); await page.locator('[role=gridcell][aria-selected=false] button:not(:disabled)').first().click(); }
    else if (component === 'FormRatingInput') await page.locator('input[type=range]').press('ArrowRight');
    else {
      await page.locator(native).first().fill(component === 'FormColorPicker' ? '#ff0000' : component === 'FormTimePicker' ? '16:30' : component === 'FormDateTimePicker' ? '03.01.2027 16:30' : component === 'FormDateRangePicker' ? '03.01.2027' : component === 'FormPinInput' ? '9' : 'New tag');
      await page.locator(native).first().press(component === 'FormTagsInput' ? 'Enter' : 'Tab');
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(30);
  }
  for (const framework of ['vue', 'react', 'wc']) {
    for (const component of ['FormColorPicker', 'FormTimePicker', 'FormDateTimePicker', 'FormDateRangePicker']) await check('V-F01', framework, component + ':invalid-draft', async () => {
      await mount(framework, component); await resetButton();
      const field = page.locator(native).first(); const initial = await field.inputValue();
      await field.fill('invalid'); await page.locator('#reset-proof').focus(); await page.waitForTimeout(35);
      assert.notEqual(await field.inputValue(), initial);
      await page.evaluate(() => document.querySelector('#root').addEventListener('reset', event => event.preventDefault(), { once: true }));
      await page.locator('#reset-proof').click(); await page.waitForTimeout(35); assert.equal(await field.inputValue(), 'invalid');
      await page.locator('#reset-proof').click(); await page.waitForTimeout(35); await update({ dataTestId: 'draft-reset' });
      const reset = await field.inputValue(); assert.equal(reset, initial); assert.notEqual(await field.getAttribute('aria-invalid'), 'true');
      const resetEvents = await page.evaluate(() => window.resetEvents);
      assert.equal(resetEvents.length, 2); assert(resetEvents.every(event => event.trusted)); assert(resetEvents[0].canceled && !resetEvents[1].canceled);
      return { initial, invalid: 'invalid', reset, modelOwner: framework === 'vue' ? 'application; model unchanged' : 'component' };
    });
    if (framework !== 'vue') for (const component of ['FormButtonGroup', 'SegmentedControl', 'FormYearPicker', 'FormDatePicker', 'FormColorPicker', 'FormTimePicker', 'FormDateTimePicker', 'FormDateRangePicker']) {
      await check('V-F01', framework, component, async () => {
        await mount(framework, component); await resetButton();
        const initial = await nativeData(); await edit(component); const changed = await nativeData(); assert.notDeepEqual(changed, initial);
        await page.evaluate(() => document.querySelector('#root').addEventListener('reset', event => event.preventDefault(), { once: true }));
        await page.locator('#reset-proof').click(); await page.waitForTimeout(35); assert.deepEqual(await nativeData(), changed);
        await page.locator('#reset-proof').click(); await page.waitForTimeout(35); await update({ dataTestId: 'reset-verified' });
        const reset = await nativeData(); assert.deepEqual(reset, initial);
        const events = await page.evaluate(() => window.resetEvents); assert.equal(events.length, 2); assert(events.every(event => event.trusted)); assert(events[0].canceled && !events[1].canceled);
        return { initial, changed, reset, resetEvents: events };
      });
    }
    await check('V-F02', framework, 'FormButtonCheckbox', async () => {
      await mount(framework, 'FormButtonCheckbox', { required: true, value: false }); assert.equal((await snapshot()).valid, false);
      await page.locator('input').first().press('Space'); assert.equal((await snapshot()).valid, true);
      return { checked: true, nativeRequired: await page.locator('input').first().evaluate(input => input.required) };
    });
    await check('V-F03', framework, 'FormTimePicker', async () => {
      await mount(framework, 'FormTimePicker', { variant: 'segmented', value: undefined, required: true }, { controlled: true });
      assert.equal((await snapshot()).valid, false);
      await update({ value: '10:30' }); assert.equal((await snapshot()).valid, true);
      await update({ disabled: true }); assert.deepEqual(await nativeData(), []);
      await update({ disabled: false, value: undefined, readonly: true }); assert.equal((await snapshot()).valid, true);
      return { requiredEmpty: 'invalid', disabledData: [], readonlyEmpty: 'valid' };
    });
    await check('V-F04', framework, 'FormDateTimePicker', async () => {
      await mount(framework, 'FormDateTimePicker', { variant: 'split-input', value: undefined, required: true }, { controlled: true });
      assert.equal((await snapshot()).valid, false);
      await update({ value: { date: '2026-10-02', time: '10:30' } }); const data = await nativeData();
      assert.deepEqual(data, [['test-field', '02.10.2026'], ['test-field', '10:30']]);
      assert.equal((await snapshot()).valid, true); return { data };
    });
    for (const component of ['FormPinInput', 'FormTagsInput', 'FormRatingInput']) {
      await check('V-F05', framework, component, async () => {
        const empty = component === 'FormTagsInput' ? [] : component === 'FormRatingInput' ? null : '';
        await mount(framework, component, { form: 'external-form', value: empty, required: true }); await resetButton(true);
        assert.equal(await page.locator('#external-form').evaluate(form => form.checkValidity()), false);
        const selector = component === 'FormRatingInput' ? 'input[type=range]' : native;
        assert.equal(await page.locator(selector).first().evaluate(input => input.form?.id), 'external-form');
        await mount(framework, component, { form: 'external-form' }); await resetButton(true);
        const initial = await nativeData('#external-form'); await edit(component); const changed = await nativeData('#external-form'); assert.notDeepEqual(changed, initial);
        if (framework === 'vue') return { initial, changed, reset: 'application owns v-model; not reset by the component' };
        await page.locator('#reset-proof').click(); await page.waitForTimeout(35); await update({ dataTestId: 'external-reset-verified' });
        const reset = await nativeData('#external-form'); assert.deepEqual(reset, initial);
        const events = await page.evaluate(() => window.resetEvents); assert.equal(events.length, 1); assert(events[0].trusted && !events[0].canceled);
        return { initial, changed, reset };
      });
    }
    await check('V-F06', framework, 'InputSlider', async () => {
      await mount(framework, 'InputSlider', { form: 'external-form' }); await resetButton(true);
      const data = await nativeData('#external-form'); assert.deepEqual(data, [['test-field', '0.5']]);
      assert.deepEqual(await nativeData(), []); return { externalData: data };
    });
    await check('V-F07', framework, 'FormContainer', async () => {
      await mount(framework, 'FormContainer', { disabled: true, showActions: false });
      await page.evaluate(() => { const input = document.createElement('input'); input.id = 'implicit-submit'; document.querySelector('#root form').append(input); });
      await page.locator('#implicit-submit').fill('Submit'); await page.locator('#implicit-submit').press('Enter');
      const events = (await snapshot()).events; assert(!events.some(event => ['Submit', 'on:submit'].includes(event.event)));
      await update({ disabled: false }); await page.locator('#implicit-submit').press('Enter');
      assert((await snapshot()).events.some(event => ['Submit', 'on:submit'].includes(event.event))); return { disabledEvents: events };
    });
    for (const component of ['FormTimePicker', 'FormDateTimePicker']) await check('V-F08', framework, component, async () => {
      await mount(framework, component, framework === 'react' ? { hint: 'Hint content' } : {}, framework === 'react' ? {} : { slots: { hint: 'Hint content' } });
      const trigger = page.locator('.peaui-info-tooltip[tabindex="0"]'); assert.equal(await trigger.count(), 1);
      await trigger.focus(); await page.waitForTimeout(260); assert.equal(await page.locator('.peaui-info-tooltip[data-open=true]').count(), 1);
      await trigger.press('Escape'); assert.equal(await page.locator('.peaui-info-tooltip[data-open=true]').count(), 0);
      return { focus: 'opens', escape: 'closes' };
    });
    await check('V-F09', framework, 'FormButtonGroup', async () => {
      await page.evaluate(framework => window.componentTest.mount({ framework, name: 'FormButtonGroup', controlled: true, props: { id: 'test-field', name: 'test-field', required: true, options: [{ key: 'a', label: 'Alpha', active: true }, { key: 'b', label: 'Beta', active: true }] } }), framework);
      assert.equal(await page.locator('[role=radio][aria-checked=true]').count(), 1);
      assert.equal((await snapshot()).valid, true); const data = await nativeData(); assert.deepEqual(data, [['test-field', 'a']]);
      await update({ required: false, isToggle: true }); await page.getByRole('radio', { name: 'Alpha', exact: true }).click();
      assert.equal(await page.locator('[role=radio][aria-checked=true]').count(), 0);
      await update({ value: 'a' }); await update({ value: undefined }); assert.equal(await page.locator('[role=radio][aria-checked=true]').count(), 0);
      return { data, toggleOff: true, explicitClear: true };
    });
    for (const component of ['FormCheckbox', 'FormButtonCheckbox', 'FormRadio']) await check('V-F10', framework, component, async () => {
      await mount(framework, component); await page.locator('input').first().press('Enter');
      assert.equal(await page.locator('input').first().isChecked(), true); return { checked: true };
    });
    await check('V-F11', framework, 'FormTextarea', async () => { await mount(framework, 'FormTextarea'); const rows = await page.locator('textarea').evaluate(input => input.rows); assert.equal(rows, 5); return { rows }; });
    await check('V-F12', framework, 'FormContainer', async () => { await mount(framework, 'FormContainer', { sizeButton: 'l' }); const count = await page.locator('.peaui-form-container__actions-button.peaui-button-action--size-l').count(); assert.equal(count, 2); return { sizedActions: count }; });
    await check('V-F13', framework, 'FormTagsInput', async () => {
      const samples = [];
      for (const size of [100, 200, 400]) {
        await mount(framework, 'FormTagsInput', { value: [], suggestions: [] }, { controlled: true });
        samples.push(await page.evaluate(async size => {
          let calls = 0; const value = Array.from({ length: size }, (_, id) => ({ id, label: 'Selected ' + id })); const suggestions = Array.from({ length: size }, (_, id) => ({ id: size + id, label: 'Option ' + id }));
          await window.componentTest.update({ value, suggestions, getTagKey: tag => { calls++; return tag.id; } });
          document.querySelector('input:not([type=hidden])').focus(); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return { size, keyGetterCalls: calls, suggestions: document.querySelectorAll('[role=option]').length };
        }, size));
      }
      // A list crossing the viewport threshold can cause one extra placement render.
      assert(samples.at(-1).keyGetterCalls <= samples[0].keyGetterCalls * (samples.at(-1).size / samples[0].size) * 1.5, JSON.stringify(samples));
      assert(samples.every(sample => sample.keyGetterCalls <= sample.size * 60), JSON.stringify(samples)); return { samples };
    });
    await check('V-F14', framework, 'InputSlider', async () => {
      await mount(framework, 'InputSlider');
      const state = await page.evaluate(framework => {
        const input = document.querySelector('#root input'); const label = document.createElement('label'); label.htmlFor = input.id; label.textContent = 'External slider'; label.id = 'proof-label'; document.querySelector('#root').prepend(label);
        const ids = [...document.querySelectorAll('[id]')].map(element => element.id); return { framework, id: input.id, unique: new Set(ids).size === ids.length, labelControl: label.control === input };
      }, framework);
      assert(state.unique && state.labelControl); return { ...state, ...await verifyLabelFocus('#root input') };
    });
  }
  for (const component of ['ButtonAction', 'FormFieldLabel']) await check('V-F14', 'wc', component, async () => {
    await mount('wc', component);
    const nativeSelector = component === 'ButtonAction' ? '#root button' : '#root label';
    const nativeId = await page.locator(nativeSelector).first().getAttribute('id'); assert.equal(nativeId, 'test-field-control');
    assert.equal(await page.locator('#test-field').count(), 1);
    if (component === 'ButtonAction') {
      await page.evaluate(() => { const label = document.createElement('label'); label.id = 'proof-label'; label.htmlFor = 'test-field-control'; label.textContent = 'External button'; document.querySelector('#root').prepend(label); });
      assert.equal(await page.locator('#proof-label').evaluate(label => label.control?.id), 'test-field-control');
      await verifyLabelFocus(nativeSelector);
    }
    await update({ id: 'updated-id' }); assert.equal(await page.locator(nativeSelector).first().getAttribute('id'), 'updated-id-control');
    return { nativeId, dynamicId: 'updated-id-control', hostIsNotFormAssociated: true };
  });
  for (const framework of ['vue', 'react', 'wc']) {
    await check('V-F15', framework, 'FormInput:clear-icon-alignment', async () => {
      await mount(framework, 'FormInput', { canErase: true });
      const geometry = await page.locator('.peaui-form-field__erase-button').evaluate(button => {
        const control = button.getBoundingClientRect();
        const icon = button.querySelector('svg').getBoundingClientRect();
        return { controlCenter: control.y + control.height / 2, iconCenter: icon.y + icon.height / 2 };
      });
      assert(Math.abs(geometry.controlCenter - geometry.iconCenter) < 0.1, JSON.stringify(geometry));
      return geometry;
    });
    for (const component of ['FormDatePicker', 'FormYearPicker']) await check('V-F15', framework, component + ':readonly-clear', async () => {
      await mount(framework, component, { readonly: true });
      const before = await nativeData();
      assert.equal(await page.locator('.peaui-form-field__erase-button').count(), 0);
      assert.deepEqual(await nativeData(), before);
      await update({ readonly: false });
      await page.locator('.peaui-form-field__erase-button').click();
      assert.equal(await page.locator(native).first().inputValue(), '');
      return { readonlyValue: before, editableClear: true };
    });
    for (const component of ['FormDateRangePicker', 'FormDateTimePicker']) await check('V-F15', framework, component + ':alignment', async () => {
      await mount(framework, component, { description: 'Supporting text' });
      const geometry = await page.evaluate(() => {
        document.documentElement.style.fontSize = '16px';
        document.documentElement.style.setProperty('--peaui-font-scale', '0.95');
        const host = document.querySelector('#root').getBoundingClientRect();
        const trigger = document.querySelector('#root .peaui-popover-overlayer').getBoundingClientRect();
        return { hostTop: host.top, triggerTop: trigger.top, hostWidth: host.width, triggerWidth: trigger.width };
      });
      assert.equal(geometry.triggerTop, geometry.hostTop);
      assert.equal(geometry.triggerWidth, geometry.hostWidth);
      return geometry;
    });
    await check('V-F15', framework, 'FormColorPicker:optional', async () => {
      await page.evaluate(framework => window.componentTest.mount({ framework, name: 'FormColorPicker', props: { label: 'Brand color' } }), framework);
      assert.equal(await page.locator('.peaui-form-label__optional').count(), 1);
      await update({ required: true });
      assert.equal(await page.locator('.peaui-form-label__optional').count(), 0);
      return { optionalByDefault: true, requiredHidesNote: true };
    });
    await check('V-F15', framework, 'FormFieldLabel:hint-fill', async () => {
      await mount(framework, 'FormFieldLabel', {}, { slots: { hint: 'Field help' } });
      const colors = await page.locator('.peaui-form-label__hint-icon').evaluate(icon => ({
        icon: getComputedStyle(icon).fill,
        path: getComputedStyle(icon.querySelector('path')).fill,
      }));
      assert.equal(colors.path, colors.icon);
      return colors;
    });
    await check('V-F15', framework, 'FormFileUploadSimple:format-spacing', async () => {
      await mount(framework, 'FormFileUploadSimple');
      const description = (await page.locator('.peaui-form-file-upload-simple__description').textContent()).replace(/\s+/g, ' ');
      assert(description.includes('DOC ,PDF ,DOCX ,JPEG ,JPG ,PNG '), description);
      return { description };
    });
  }
  for (const framework of ['vue', 'react', 'wc']) {
    for (const component of ['FormFieldLabel', 'FormInput', 'FormTextarea', 'FormButtonGroup', 'FormDateRangePicker', 'FormDateTimePicker', 'FormTimePicker', 'FormColorPicker', 'FormTagsInput']) await check('V-F16', framework, component + ':hint', async () => {
      const slot = framework === 'react' && ['FormColorPicker', 'FormTagsInput'].includes(component) ? 'hintContent' : 'hint';
      await mount(framework, component, {}, { slots: { [slot]: 'Field help' } });
      const icon = page.locator('.peaui-form-label__hint-icon');
      assert.equal(await icon.count(), 1);
      const colors = await icon.evaluate(icon => ({ icon: getComputedStyle(icon).fill, path: getComputedStyle(icon.querySelector('path')).fill }));
      assert.equal(colors.path, colors.icon);
      const trigger = page.locator('.peaui-info-tooltip[tabindex="0"]');
      assert.equal(await trigger.count(), 1);
      await trigger.focus();
      await page.waitForFunction(() => document.querySelector('.peaui-info-tooltip[data-open=true]'));
      const tooltipId = await page.locator('[role=tooltip]').getAttribute('id');
      assert((await trigger.getAttribute('aria-describedby')).split(' ').includes(tooltipId));
      await trigger.press('Escape');
      await page.waitForFunction(() => !document.querySelector('.peaui-info-tooltip[data-open=true]'));
      return { colors, keyboardFocus: 'opens', escape: 'closes', description: tooltipId };
    });
  }
  const messageIcons = new Map();
  for (const framework of ['vue', 'react', 'wc']) {
    for (const [component, state] of [
      ['FormInput', 'error'], ['FormInput', 'success'], ['FormInput', 'maxLength'],
      ['FormColorPicker', 'error'], ['FormDateRangePicker', 'error'],
      ['FormDateTimePicker', 'error'], ['FormTimePicker', 'error'],
    ]) await check('V-F17', framework, component + ':' + state, async () => {
      await mount(framework, component, state === 'maxLength' ? { value: 'Alpha', maxLength: 5 } : {}, { slots: state === 'maxLength' ? {} : { [state]: 'Validation message' } });
      const icon = page.locator('svg.peaui-message-text__icon');
      assert.equal(await icon.count(), 1);
      const shape = await icon.evaluate(icon => ({
        viewBox: icon.getAttribute('viewBox'),
        paths: [...icon.querySelectorAll('path')].map(path => ({ d: path.getAttribute('d').replace(/\s+/g, ''), fill: getComputedStyle(path).fill })),
      }));
      const key = component + ':' + state;
      if (framework === 'vue') messageIcons.set(key, shape);
      else assert.deepEqual(shape, messageIcons.get(key));
      return shape;
    });
  }
  const disabledStyles = new Map();
  for (const framework of ['vue', 'react', 'wc']) {
    for (const [component, state] of [['FormButtonGroup', 'disabled'], ['FormFileUpload', 'disabled'], ['FormFileUploadSimple', 'disabled'], ['FormColorPicker', 'disabled'], ['SearchInput', 'disabled'], ['SearchInput', 'readonly']]) await check('V-F18', framework, component + ':' + state, async () => {
      await mount(framework, component, { [state]: true });
      const styles = await page.locator('#root').evaluate(root => ({
        buttons: [...root.querySelectorAll('button')].filter(button => button.getBoundingClientRect().height > 0).map(button => ({
          disabled: button.disabled, color: getComputedStyle(button).color,
          background: getComputedStyle(button).backgroundColor, opacity: getComputedStyle(button).opacity,
        })),
        overlayOpacity: root.querySelector('.peaui-form-color-picker') ? getComputedStyle(root.querySelector('.peaui-form-color-picker')).opacity : null,
      }));
      assert(styles.buttons.every(button => button.disabled));
      const key = component + ':' + state;
      if (framework === 'vue') disabledStyles.set(key, styles);
      else assert.deepEqual(styles, disabledStyles.get(key));
      return styles;
    });
    for (const component of ['FormInput', 'FormPassword', 'FormNumber', 'FormTextarea', 'FormSelect', 'FormMultiSelect', 'FormDatePicker', 'FormYearPicker', 'FormTimePicker', 'FormDateTimePicker', 'FormDateRangePicker', 'FormColorPicker', 'FormButtonGroup']) await check('V-F19', framework, component + ':readonly-label', async () => {
      await mount(framework, component, { readonly: true, required: false });
      assert.equal(await page.locator('.peaui-form-label__optional').count(), 0);
      assert.equal(await page.locator('.peaui-form-label__text--readonly').count(), 1);
      await update({ readonly: false });
      assert.equal(await page.locator('.peaui-form-label__optional').count(), 1);
      assert.equal(await page.locator('.peaui-form-label__text--readonly').count(), 0);
      return { readonlyHidesOptional: true, restoresEditableLabel: true };
    });
  }
  const variantStyles = new Map();
  for (const framework of ['vue', 'react', 'wc']) {
    for (const variant of ['loading', 'inline']) await check('V-F20', framework, 'FormColorPicker:' + variant, async () => {
      await mount(framework, 'FormColorPicker', { value: '#4C9A2AE6', alpha: true, description: 'Pick a color or enter its HEX value.', savedColors: ['#4C9A2A', '#17314B', '#2C7CB5', '#C63C35'], recentColors: ['#744EA7', '#D97024'], ...(variant === 'loading' ? { loading: true } : { variant: 'inline' }) });
      const geometry = await page.locator('.peaui-form-color-picker').evaluate(root => {
        const input = root.querySelector('input'), panel = root.querySelector('[role=group]');
        return { opacity: getComputedStyle(root).opacity, inputOpacity: getComputedStyle(input).opacity, inputDisabled: input.disabled, panelHeight: panel?.getBoundingClientRect().height ?? null, inputTop: input.getBoundingClientRect().top - root.getBoundingClientRect().top, hiddenPanelContent: panel ? panel.scrollHeight - panel.clientHeight : null };
      });
      assert.equal(geometry.inputDisabled, variant === 'loading');
      if (framework === 'vue') variantStyles.set(variant, geometry);
      else assert.deepEqual(geometry, variantStyles.get(variant));
      return geometry;
    });
    await check('V-F20', framework, 'FormFileUpload:danger-message', async () => {
      await mount(framework, 'FormFileUpload', { variant: 'danger' });
      const message = await page.locator('.peaui-form-file-upload__message').textContent();
      assert.equal(message.trim(), 'Pole jest wymagane');
      return { message: message.trim() };
    });
  }
  for (const framework of ['vue', 'react', 'wc']) {
    for (const state of ['disabled', 'readonly']) await check('V-F21', framework, 'FormNumber:' + state + '-inset', async () => {
      await mount(framework, 'FormNumber', { value: 42, canErase: true, [state]: true });
      const input = page.locator('input');
      const padding = await input.evaluate(element => getComputedStyle(element).paddingRight);
      assert.equal(padding, '48px');
      assert.equal(await page.locator('.peaui-form-field__erase-button').count(), 0);
      await update({ canErase: false });
      await page.waitForFunction(() => getComputedStyle(document.querySelector('#root input')).paddingRight === '12px');
      return { padding, clearAction: false };
    });
  }
  fs.writeFileSync(path.join(reportDirectory, `browser-${engine}.json`), JSON.stringify({ engine, generatedAt: new Date().toISOString(), results, errors, summary: { cases: results.length, passed: results.filter(result => result.pass).length } }, null, 2));
  if (errors.length || results.some(result => !result.pass)) process.exitCode = 1;
}, engine).catch(error => { console.error(error); process.exitCode = 1; });
