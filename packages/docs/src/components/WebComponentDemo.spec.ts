import { mount, shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import ts from 'typescript';
import { generatedWebComponentApi } from '../generated/framework-component-api';
import { setLocale } from '../i18n';
import type { FrameworkComponentDefinition } from '../types';
import WebComponentDemo from './WebComponentDemo.vue';
import CodeBlock from './CodeBlock.vue';

const definition: FrameworkComponentDefinition = {
  name: 'Example',
  sourceName: 'Example',
  category: 'form',
  categoryLabel: 'Forms',
  framework: 'web-components',
  importPath: '@peaui/ui/wc/form/Example',
  tagName: 'peaui-example',
  status: 'stable',
  slug: 'example',
  copy: { description: 'Example', input: 'Value', purpose: ['Example'] },
  props: [
    { name: 'searchable', type: 'boolean', required: false, default: 'false', description: '' },
  ],
  models: [{ name: 'value', type: 'number', required: false, default: '1', description: '' }],
  events: [{ name: 'update:value', description: '' }],
  slots: [],
};

describe('Web Component documentation snippets', () => {
  beforeEach(() => setLocale('en', false));

  it('assigns false as a property and synchronizes controlled update events', async () => {
    const wrapper = mount(WebComponentDemo, { props: { definition } });
    const codeButton = wrapper.findAll('button').find((button) => button.text().includes('Code'));
    expect(codeButton).toBeDefined();
    await codeButton!.trigger('click');
    const code = wrapper.get('pre').text();
    expect(code).toContain('component.searchable = false;');
    expect(code).not.toContain('searchable="false"');
    expect(code).toContain("component.addEventListener('update:value'");
    expect(code).toContain('component.value = event.detail;');
    wrapper.unmount();
  });

  it('produces valid HTML and JavaScript examples for all 87 Web Components', async () => {
    for (const component of generatedWebComponentApi) {
      const wrapper = shallowMount(WebComponentDemo, {
        props: {
          definition: {
            ...component,
            // Exercise snippet generation without loading every live preview.
            sourceName: 'SnippetOnly',
            slug: component.name,
            copy: definition.copy,
          },
        },
      });
      const codeButton = wrapper.findAll('button').find((button) => button.text().includes('Code'));
      await codeButton!.trigger('click');
      const code = wrapper.findComponent(CodeBlock).props('code') as string;
      const html = document.createElement('template');
      html.innerHTML = code;
      expect(html.content.querySelectorAll(component.tagName), component.name).toHaveLength(1);
      const scripts = html.content.querySelectorAll('script');
      expect(scripts, component.name).toHaveLength(1);
      const parsed = ts.transpileModule(scripts[0]!.textContent ?? '', {
        reportDiagnostics: true,
        fileName: `${component.name}.js`,
        compilerOptions: { allowJs: true },
      });
      expect(parsed.diagnostics, component.name).toEqual([]);
      wrapper.unmount();
    }
  });
});
