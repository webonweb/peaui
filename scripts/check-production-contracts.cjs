// Production-browser probes of public component contracts; leaves component sources unchanged.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const esbuild=require('esbuild');
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const root=process.cwd();
const verify=process.argv.includes('--verify');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'peaui-production-contracts-'));
const catalog={FormInput:'form/FormInput',FormNumber:'form/FormNumber',FormTextarea:'form/FormTextarea',FormSelect:'form/FormSelect',FormMultiSelect:'form/FormMultiSelect',FormCheckbox:'form/FormCheckbox',FormRadio:'form/FormRadio',FormButtonCheckbox:'form/FormButtonCheckbox',FormButtonGroup:'form/FormButtonGroup',SearchInput:'data-entry/SearchInput',ButtonExport:'data-entry/ButtonExport',InfoTooltip:'overlayer/InfoTooltip',PopoverOverlayer:'overlayer/PopoverOverlayer'};
catalog.TransferList='data-entry/TransferList';
catalog.FormPassword='form/FormPassword';
catalog.ModalDialog='overlayer/ModalDialog';
catalog.TableList='data-display/TableList';
const imports=Object.entries(catalog).flatMap(([name,location])=>['vue','react','wc'].map(framework=>`import ${framework}${name} from '@peaui/ui/${framework}/${location}';`));
const fixture=`${imports.join('\n')}
import {createApp,h,nextTick,shallowRef} from 'vue';
import {createElement} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {computeAccessibleName,computeAccessibleDescription} from 'dom-accessibility-api';
const components={${['vue','react','wc'].map(f=>`${f}:{${Object.keys(catalog).map(n=>`${n}:${f}${n}`).join(',')}}`).join(',')}};
let cleanup=()=>{}, events=[];
const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
const emit=(event,value)=>events.push({event,value,time:performance.now()});
window.componentTest={
 async mount({framework,name,props={},slots={}}){
   cleanup();await nextTick(); document.body.replaceChildren(); events=[];
   const external=document.createElement('span');external.id='external-label';external.textContent='External accessible name';document.body.append(external);
   const hint=document.createElement('span');hint.id='external-description';hint.textContent='External help';document.body.append(hint);
   const host=document.createElement('form');host.id='root';document.body.append(host);
   if(framework==='react'){
     const app=createRoot(host);
     const {value,...other}=props;
     const actual={...other,...slots,defaultValue:value,onValueChange:v=>emit('value',v),onSearch:v=>emit('search',v),onExport:v=>emit('export',v)};
     if(slots.default){actual.children=slots.default;delete actual.default;}
     flushSync(()=>app.render(createElement(components.react[name],actual)));cleanup=()=>flushSync(()=>app.unmount());
   } else if(framework==='vue'){
     const value=shallowRef(props.value);
     const app=createApp({render:()=>h(components.vue[name],{...props,value:value.value,'onUpdate:value':v=>{value.value=v;emit('value',v);},'onOn:search':v=>emit('search',v),'onOn:export':v=>emit('export',v)},Object.fromEntries(Object.entries(slots).map(([name,text])=>[name,()=>text])))});
     app.mount(host);cleanup=()=>app.unmount();
   } else {
     const element=new components.wc[name]();
     for(const [key,value] of Object.entries(props)){
       if(key.startsWith('aria-'))element.setAttribute(key,String(value));else Reflect.set(element,key,value);
     }
     for(const [name,text] of Object.entries(slots)){const node=document.createElement('span');if(name!=='default')node.slot=name;node.textContent=text;element.append(node);}
     for(const name of ['update:value','on:search','on:export'])element.addEventListener(name,e=>emit(name,e.detail));
     host.append(element);cleanup=()=>element.remove();
   }
   await nextTick();await frame();await frame();
 },
 snapshot(){
   const root=document.querySelector('#root');
   return {html:root.innerHTML,events,formData:[...new FormData(root)],nativeSelects:[...root.querySelectorAll('select')].map(el=>({required:el.required,invalid:el.validity.valueMissing})),controls:[...root.querySelectorAll('input,textarea,button,[role="radiogroup"],[role="radio"]')].map(el=>({tag:el.localName,type:el.type,role:el.getAttribute('role'),id:el.id,name:computeAccessibleName(el),description:computeAccessibleDescription(el),describedBy:el.getAttribute('aria-describedby'),labelledBy:el.getAttribute('aria-labelledby'),ariaLabel:el.getAttribute('aria-label'),ariaInvalid:el.getAttribute('aria-invalid'),invalid:el.validity?.valueMissing,required:el.required,readonly:el.readOnly,disabled:el.disabled,checked:el.checked??el.getAttribute('aria-checked'),tabIndex:el.tabIndex,value:el.value,focus:document.activeElement===el,html:el.outerHTML.slice(0,750)})),ids:[...root.querySelectorAll('[id]')].map(el=>el.id),tooltips:[...root.querySelectorAll('[role="tooltip"]')].map(el=>({text:el.textContent,id:el.id,visible:!!(el.offsetWidth||el.offsetHeight)})),dialogs:root.querySelectorAll('[role="dialog"],dialog').length,menus:root.querySelectorAll('[role="menu"]').length};
 }
};`;
(async()=>{
 await esbuild.build({stdin:{contents:fixture,resolveDir:root},bundle:true,minify:true,splitting:true,outdir:temp,format:'esm',platform:'browser',define:{'process.env.NODE_ENV':'"production"'},logLevel:'silent'});
 fs.writeFileSync(path.join(temp,'index.html'),'<html lang="en"><meta charset="utf-8"><link rel="stylesheet" href="/stdin.css"><script type="module" src="/stdin.js"></script></html>');
 const server=http.createServer((req,res)=>{const requested=new URL(req.url,'http://localhost').pathname;const file=path.resolve(temp,'.'+(requested==='/'?'/index.html':requested));if(!file.startsWith(temp+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch();const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const cdp=await page.context().newCDPSession(page);
 const results=[];const mount=args=>page.evaluate(args=>window.componentTest.mount(args),args);
 const snap=async()=>{
   const result=await page.evaluate(()=>window.componentTest.snapshot());
   result.tooltipStyles=await page.evaluate(()=>[...document.querySelectorAll('[role="tooltip"]')].map(el=>({id:el.id,opacity:getComputedStyle(el).opacity,visibility:getComputedStyle(el).visibility,pointerEvents:getComputedStyle(el).pointerEvents})));
   const {root:document}=await cdp.send('DOM.getDocument');
   const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:document.nodeId,selector:'#root input:not([type="hidden"]),#root textarea'});
   if(nodeId){const {nodes}=await cdp.send('Accessibility.getPartialAXTree',{nodeId,fetchRelatives:false});result.chromiumAX=nodes.map(({role,name,description,ignored})=>({role:role?.value,name:name?.value,description:description?.value,ignored}));}
   return result;
 };
 try{
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.componentTest);
  if(process.argv.includes('--extra')) {
   for(const framework of ['vue','react','wc']) {
    for(const name of ['FormSelect','FormMultiSelect']) {
     const options=[{label:'Alpha',value:'a'},{label:'Beta',value:'b'}];
     const props={id:'native-choice',name:'choice',label:'Choice',options,value:name==='FormSelect'?'b':['a','b']};
     await mount({framework,name,props});
     const values=await page.evaluate(()=>new FormData(document.querySelector('#root')).getAll('choice'));
     await mount({framework,name,props:{...props,disabled:true}});
     const disabledValues=await page.evaluate(()=>new FormData(document.querySelector('#root')).getAll('choice'));
     results.push({framework,name,scenario:'native-select-values',values,disabledValues});
     await mount({framework,name,props:{...props,value:name==='FormSelect'?undefined:[],searchable:false,required:true}});
     const validBefore=await page.evaluate(()=>document.querySelector('#root').reportValidity());
     await page.getByRole('combobox').press('ArrowDown');
     await page.getByRole('option',{name:'Alpha',exact:true}).click();
     const after=await page.evaluate(()=>({valid:document.querySelector('#root').checkValidity(),values:new FormData(document.querySelector('#root')).getAll('choice'),invalid:document.querySelector('[role="combobox"]').getAttribute('aria-invalid')}));
     results.push({framework,name,scenario:'native-select-required',validBefore,after});
     await mount({framework,name,props:{...props,required:true}});
     await page.getByRole('combobox').press('ArrowDown');
     await page.waitForFunction(()=>document.querySelector('[role="combobox"]').value==='');
     results.push({framework,name,scenario:'required-select-search',valid:await page.locator('#root').evaluate(form=>form.checkValidity()),required:await page.getByRole('combobox').getAttribute('aria-required'),values:await page.locator('#root').evaluate(form=>new FormData(form).getAll('choice'))});
    }
    await mount({framework,name:'FormSelect',props:{id:'custom-choice',name:'choice',label:'Choice',options:[],canWrite:true,required:true}});
    await page.getByRole('combobox').fill('Custom value');
    await page.getByRole('combobox').press('Tab');
    results.push({framework,name:'FormSelect',scenario:'writable-select',value:await page.getByRole('combobox').inputValue(),valid:await page.locator('#root').evaluate(form=>form.checkValidity()),...await snap()});
    if(framework!=='vue') {
     await mount({framework,name:'FormInput',props:{id:'reset-field',name:'field',label:'Field',value:'Alpha'}});
     await page.getByRole('textbox').fill('Beta');
     await page.evaluate(()=>document.querySelector('#root').reset());
     await page.waitForFunction(()=>document.querySelector('#root input').value==='Alpha');
     results.push({framework,name:'FormInput',scenario:'native-form-reset',...await snap()});
    }
    await mount({framework,name:'TableList',props:{columns:[{key:'name',label:'Name',type:'editable',manage:{type:'text',required:true}}],records:[{id:'a',name:'Ada'}],canSelectRows:false}});
    await page.getByRole('button',{name:'Edytuj kolumne',exact:true}).click();
    await page.getByRole('textbox').fill('');
    await page.getByRole('button',{name:'Zapisz zmiane w kolumnie',exact:true}).click();
    const invalidCell=await page.getByRole('textbox').getAttribute('aria-invalid');
    await page.getByRole('textbox').fill('Grace');
    await page.getByRole('button',{name:'Zapisz zmiane w kolumnie',exact:true}).click();
    await page.getByRole('button',{name:'Edytuj kolumne',exact:true}).click();
    await page.getByRole('textbox').fill('Uncommitted');
    await page.getByRole('button',{name:'Anuluj edycje kolumny',exact:true}).click();
    results.push({framework,name:'TableList',scenario:'editable-cell',invalidCell,content:await page.locator('#root tbody').innerText(),editors:await page.getByRole('textbox').count()});
    await mount({framework,name:'TransferList',props:{id:'transfer',virtual:true,optionHeight:40,items:Array.from({length:100},(_,i)=>({id:String(i),key:i,value:i,label:'Item '+i}))}});
    const virtualSnapshot=()=>page.locator('[role="listbox"]').first().evaluate(el=>({height:el.clientHeight,rows:el.querySelectorAll('[role="option"]').length,lastRowBottom:el.querySelector('[role="option"]:last-of-type')?.getBoundingClientRect().bottom,html:el.innerHTML.slice(-800)}));
    const beforeResize=await virtualSnapshot();
    await page.locator('[role="listbox"]').first().evaluate(el=>{el.style.maxHeight='none';el.style.minHeight='0';el.style.height='800px';el.style.maxBlockSize='none';el.style.blockSize='800px';});
    await page.waitForTimeout(100);
    results.push({framework,name:'TransferList',scenario:'virtual-resize',before:beforeResize,after:await virtualSnapshot()});
    for(const name of ['FormCheckbox','FormRadio','FormSelect']) {
     await mount({framework,name,props:{id:'field',name:'field',label:'Required field',required:true,optionValue:'a',value:name==='FormCheckbox'?false:undefined,options:[{label:'Alpha',value:'a'}]},slots:{default:'Accept terms'}});
     results.push({framework,name,scenario:'required-empty',...await snap()});
    }
    await mount({framework,name:'FormInput',props:{id:'field',name:'field',label:'Field'},slots:{hint:'Supporting hint'}});
    const hint=page.locator('.peaui-info-tooltip').first();
    if(await hint.count())await hint.focus();
    await page.waitForTimeout(150);
    const before=await snap();await page.keyboard.press('Escape');await page.waitForTimeout(300);
    results.push({framework,name:'FormInput',scenario:'hint-escape',before,after:await snap()});
   }
   await mount({framework:'wc',name:'FormCheckbox',props:{id:'controlled',name:'controlled',value:true},slots:{default:'Accept terms'}});
   await page.evaluate(()=>{
    const element=document.querySelector('peaui-form-checkbox');
    element.addEventListener('update:value',()=>{element.value=true;});
   });
   await page.getByRole('checkbox').click();
   await page.waitForFunction(()=>document.querySelector('peaui-form-checkbox input').checked);
   results.push({framework:'wc',name:'FormCheckbox',scenario:'controlled-rejection',value:await page.locator('peaui-form-checkbox').evaluate(el=>el.value),checked:await page.getByRole('checkbox').isChecked()});
   for(const name of ['FormInput','FormPassword']){
    await mount({framework:'wc',name,props:{id:'attributes',name:'attributes',label:'Attributes',value:'8'}});
    await page.locator('#root > *').evaluate(el=>{el.setAttribute('aria-invalid','true');el.setAttribute('autocomplete','off');});
    await page.waitForFunction(()=>document.querySelector('#root input').getAttribute('aria-invalid')==='true');
    const input=page.locator('#root input');
    const ariaInvalid=await input.getAttribute('aria-invalid');
    const autocomplete=await input.getAttribute('autocomplete');
    if(name==='FormInput'){
     await page.locator('peaui-form-input').evaluate(el=>{el.setAttribute('type','number');el.setAttribute('max','5');});
     await page.waitForFunction(()=>document.querySelector('#root input').validity.rangeOverflow);
    }
    results.push({framework:'wc',name,scenario:'dynamic-native-attributes',ariaInvalid,autocomplete,rangeOverflow:await input.evaluate(el=>el.validity.rangeOverflow)});
   }
   await mount({framework:'wc',name:'FormCheckbox',props:{id:'dynamic-label',name:'dynamic-label',value:false}});
   await page.locator('peaui-form-checkbox').evaluate(el=>{const label=document.createElement('span');label.textContent='Async label';el.append(label);});
   await page.getByRole('checkbox',{name:'Async label'}).waitFor();
   results.push({framework:'wc',name:'FormCheckbox',scenario:'dynamic-slot-label',...await snap()});
   await mount({framework:'wc',name:'ModalDialog',props:{open:true,ariaLabel:'Fallback'}});
   await page.locator('peaui-modal-dialog').evaluate(el=>{const header=document.createElement('span');header.slot='header';header.textContent='Async title';el.append(header);});
   await page.getByRole('dialog',{name:'Async title'}).waitFor();
   await page.locator('peaui-modal-dialog [slot="header"]').evaluate(el=>el.remove());
   await page.getByRole('dialog',{name:'Fallback'}).waitFor();
   results.push({framework:'wc',name:'ModalDialog',scenario:'dynamic-slot-header',label:await page.getByRole('dialog').getAttribute('aria-label')});
   await mount({framework:'wc',name:'FormSelect',props:{id:'first',name:'first',label:'First',options:[{label:'Alpha',value:'a'}]}});
   await page.evaluate(async()=>{
    const second=document.createElement('peaui-form-select');second.id='second';second.name='second';second.label='Second';second.options=[{label:'Beta',value:'b'}];document.querySelector('#root').append(second);await new Promise(resolve=>requestAnimationFrame(resolve));
   });
   const before=await snap();
   await page.locator('input').nth(1).focus();await page.keyboard.press('ArrowDown');await page.waitForTimeout(100);
   results.push({framework:'wc',name:'FormSelect',scenario:'multiple-instances',before,after:await snap(),relationships:await page.evaluate(()=>[...document.querySelectorAll('input')].map(el=>({label:el.getAttribute('aria-label'),id:el.id,controls:el.getAttribute('aria-controls'),active:el.getAttribute('aria-activedescendant'),matches:[...document.querySelectorAll('[id]')].filter(node=>node.id===el.getAttribute('aria-controls')).map(node=>node.outerHTML.slice(0,250))})))});
  } else for(const framework of ['vue','react','wc']){
   for(const name of ['FormInput','FormNumber','FormTextarea','FormSelect','FormMultiSelect','FormCheckbox','FormRadio','FormButtonCheckbox']){
    for(const attr of ['aria-label','aria-labelledby']){
     await mount({framework,name,props:{id:'field',name:'machineField',value:name==='FormMultiSelect'?[]:undefined,[attr]:attr==='aria-label'?'Explicit accessible name':'external-label',options:[{label:'Alpha',value:'a'}],isValid:false}});
     results.push({framework,name,scenario:attr,...await snap()});
    }
   }
   for(const name of ['FormInput','FormTextarea','FormSelect']){
    for(const slot of ['description','success','error','hint']){
     await mount({framework,name,props:{id:'field',name:'field',label:'Field',value:'a',options:[{label:'Alpha',value:'a'}]},slots:{[slot]:'Supporting '+slot}});
     if(slot==='hint'){const trigger=page.locator('.peaui-info-tooltip').first();if(await trigger.count())await trigger.focus();}
     results.push({framework,name,scenario:'slot-'+slot,...await snap()});
    }
   }
   for(const name of ['FormInput','FormNumber']){
    await mount({framework,name,props:{id:'field',name:'field',label:'Field',value:name==='FormNumber'?5:'Secret',readonly:true,canErase:true}});
    const erase=page.locator('.peaui-form-field__erase-button');const before=await snap();if(await erase.count())await erase.first().click();
    results.push({framework,name,scenario:'readonly-erase',before,after:await snap()});
   }
   await mount({framework,name:'FormCheckbox',props:{id:'field',name:'field',value:true,disabled:true},slots:{default:'Accept terms'}});
   results.push({framework,name:'FormCheckbox',scenario:'disabled-checked',...await snap()});
   await mount({framework,name:'FormButtonGroup',props:{id:'field',name:'field',label:'Group',value:'a',options:[{label:'Alpha',value:'a',key:'a'},{label:'Beta',value:'b',key:'b'}]}});
   await page.locator('[role="radio"]').first().focus();await page.keyboard.press('ArrowRight');
   results.push({framework,name:'FormButtonGroup',scenario:'ArrowRight',...await snap()});
   await mount({framework,name:'SearchInput',props:{debounceTime:80,ariaLabel:'Search',value:''}});
   await page.locator('input').fill('ab');await page.waitForTimeout(150);const short=await snap();await page.locator('input').fill('abcd');const immediate=await snap();await page.waitForTimeout(160);
   results.push({framework,name:'SearchInput',scenario:'debounce-and-minimum',short,immediate,settled:await snap()});
   await mount({framework,name:'ButtonExport',props:{forceExport:false,selectedItemsCount:0},slots:{default:'Export'}});
   const trigger=page.locator('button').first();await trigger.focus();await page.keyboard.press('Enter');await page.waitForTimeout(120);const open=await snap();await page.keyboard.press('Escape');await page.waitForTimeout(70);const escaped=await snap();
   if(!(await page.locator('.peaui-button-export__content-button').first().isVisible()))await trigger.click();
   await page.locator('.peaui-button-export__content-button').first().click();await page.waitForTimeout(150);
   results.push({framework,name:'ButtonExport',scenario:'keyboard-and-confirmation',open,escaped,afterExport:await snap()});
  }
 }finally{
  fs.writeFileSync(path.join(process.env.PEAUI_TEST_OUTPUT || temp,process.argv.includes('--extra')?'extra-reproductions.json':'reproductions.json'),JSON.stringify({date:new Date().toISOString(),browser:browser.version(),errors,results},null,2)+'\n');
  await browser.close();await new Promise(resolve=>server.close(resolve));
 }
 if(verify){
  assert.deepEqual(errors,[], 'Production bundle must not throw browser errors');
  for(const item of results){
   const label=`${item.framework} ${item.name} ${item.scenario}`;
   const state=item.after||item;
   if(state.ids) assert.equal(new Set(state.ids).size,state.ids.length,`${label}: duplicate IDs`);
   const inputs=(item.controls||[]).filter(c=>['input','textarea'].includes(c.tag)&&c.type!=='hidden');
   if(item.scenario==='aria-label'||item.scenario==='aria-labelledby'){
    const expected=item.scenario==='aria-label'?'Explicit accessible name':'External accessible name';
    assert.ok(inputs.length>0,label); for(const c of inputs)assert.equal(c.name,expected,label);
   }
   if(['slot-description','slot-success','slot-error'].includes(item.scenario)){
    for(const c of inputs)assert.equal(c.description,'Supporting '+item.scenario.slice(5),label);
   }
   if(item.scenario==='disabled-checked')assert.ok(inputs[0].disabled&&inputs[0].checked,label);
   if(item.scenario==='readonly-erase'){
    assert.equal(item.after.controls[0].value,item.before.controls[0].value,label);
    assert.ok(!item.after.html.includes('peaui-form-field__erase-button'),label);
   }
   if(item.scenario==='ArrowRight') assert.ok(item.events.some(e=>e.value==='b'),label);
   if(item.scenario==='debounce-and-minimum'){
    assert.equal(item.short.events.filter(e=>e.event.includes('search')).length,0,label);
    assert.equal(item.immediate.events.filter(e=>e.event.includes('search')).length,0,label);
    assert.equal(item.settled.events.filter(e=>e.event.includes('search')).length,1,label);
   }
   if(item.scenario==='keyboard-and-confirmation'){
    assert.equal(item.afterExport.events.filter(e=>e.event.includes('export')).length,0,label);
    assert.ok(item.afterExport.dialogs>0,label);
   }
   if(item.scenario==='controlled-rejection')assert.ok(item.value===true&&item.checked===true,label);
   if(item.scenario==='dynamic-native-attributes'){
    assert.equal(item.ariaInvalid,'true',label);
    assert.equal(item.autocomplete,'off',label);
    if(item.name==='FormInput')assert.equal(item.rangeOverflow,true,label);
   }
   if(item.scenario==='dynamic-slot-label')assert.equal(inputs[0].name,'Async label',label);
   if(item.scenario==='dynamic-slot-header')assert.equal(item.label,'Fallback',label);
   if(item.scenario==='required-empty'){
    const controls=item.name==='FormSelect'?item.nativeSelects:inputs;
    assert.ok(controls.length>0,label);
    for(const c of controls)assert.ok(c.required&&c.invalid,label);
   }
   if(item.scenario==='required-select-search'){
    assert.equal(item.valid,true,label);
    assert.equal(item.required,'true',label);
    assert.deepEqual(item.values,item.name==='FormSelect'?['b']:['a','b'],label);
   }
   if(item.scenario==='writable-select'){
    assert.equal(item.value,'Custom value',label);
    assert.equal(item.valid,true,label);
    assert.deepEqual(item.formData,[['choice','Custom value']],label);
    assert.ok(item.events.some(event=>event.value==='Custom value'),label);
   }
   if(item.scenario==='hint-escape'){
    assert.ok(item.before.tooltipStyles.some(t=>Number(t.opacity)>0),label);
    assert.ok(item.after.tooltipStyles.every(t=>Number(t.opacity)===0),label);
   }
   if(item.scenario==='virtual-resize') assert.ok(item.after.rows>item.before.rows,label);
   if(item.scenario==='multiple-instances')for(const r of item.relationships){if(r.active)assert.equal(r.matches.length,1,label);else assert.ok(r.matches.length<=1,label);}
   if(item.scenario==='native-select-values'){
    assert.deepEqual(item.values,item.name==='FormSelect'?['b']:['a','b'],label);
    assert.deepEqual(item.disabledValues,[],label);
   }
   if(item.scenario==='native-select-required'){
    assert.equal(item.validBefore,false,label);
    assert.equal(item.after.valid,true,label);
    assert.deepEqual(item.after.values,['a'],label);
    assert.notEqual(item.after.invalid,'true',label);
   }
   if(item.scenario==='native-form-reset')assert.equal(inputs[0].value,'Alpha',label);
   if(item.scenario==='editable-cell'){
    assert.equal(item.invalidCell,'true',label);
    assert.equal(item.editors,0,label);
    assert.match(item.content,/Grace/,label);
    assert.ok(!item.content.includes('Uncommitted'),label);
   }
  }
 }
 console.log('Recorded',results.length,'contract scenarios; page errors:',errors.length);
})().catch(e=>{console.error(e);process.exitCode=1});
