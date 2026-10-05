// Production form regression fixture. Deliberately preserves controlled React props.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const esbuild = require('esbuild');
const { chromium, firefox, webkit } = require('playwright');
const root = path.resolve(__dirname, '..');
const fixture = "import vueListLimitControl from '@peaui/ui/vue/navigation/ListLimitControl';\nimport reactListLimitControl from '@peaui/ui/react/navigation/ListLimitControl';\nimport wcListLimitControl from '@peaui/ui/wc/navigation/ListLimitControl';import vueFormButtonCheckbox from '@peaui/ui/vue/form/FormButtonCheckbox';\nimport reactFormButtonCheckbox from '@peaui/ui/react/form/FormButtonCheckbox';\nimport wcFormButtonCheckbox from '@peaui/ui/wc/form/FormButtonCheckbox';\nimport vueFormButtonGroup from '@peaui/ui/vue/form/FormButtonGroup';\nimport reactFormButtonGroup from '@peaui/ui/react/form/FormButtonGroup';\nimport wcFormButtonGroup from '@peaui/ui/wc/form/FormButtonGroup';\nimport vueFormCheckbox from '@peaui/ui/vue/form/FormCheckbox';\nimport reactFormCheckbox from '@peaui/ui/react/form/FormCheckbox';\nimport wcFormCheckbox from '@peaui/ui/wc/form/FormCheckbox';\nimport vueFormColorPicker from '@peaui/ui/vue/form/FormColorPicker';\nimport reactFormColorPicker from '@peaui/ui/react/form/FormColorPicker';\nimport wcFormColorPicker from '@peaui/ui/wc/form/FormColorPicker';\nimport vueFormContainer from '@peaui/ui/vue/form/FormContainer';\nimport reactFormContainer from '@peaui/ui/react/form/FormContainer';\nimport wcFormContainer from '@peaui/ui/wc/form/FormContainer';\nimport vueFormDatePicker from '@peaui/ui/vue/form/FormDatePicker';\nimport reactFormDatePicker from '@peaui/ui/react/form/FormDatePicker';\nimport wcFormDatePicker from '@peaui/ui/wc/form/FormDatePicker';\nimport vueFormDateRangePicker from '@peaui/ui/vue/form/FormDateRangePicker';\nimport reactFormDateRangePicker from '@peaui/ui/react/form/FormDateRangePicker';\nimport wcFormDateRangePicker from '@peaui/ui/wc/form/FormDateRangePicker';\nimport vueFormDateTimePicker from '@peaui/ui/vue/form/FormDateTimePicker';\nimport reactFormDateTimePicker from '@peaui/ui/react/form/FormDateTimePicker';\nimport wcFormDateTimePicker from '@peaui/ui/wc/form/FormDateTimePicker';\nimport vueFormField from '@peaui/ui/vue/form/FormField';\nimport reactFormField from '@peaui/ui/react/form/FormField';\nimport wcFormField from '@peaui/ui/wc/form/FormField';\nimport vueFormFieldLabel from '@peaui/ui/vue/form/FormFieldLabel';\nimport reactFormFieldLabel from '@peaui/ui/react/form/FormFieldLabel';\nimport wcFormFieldLabel from '@peaui/ui/wc/form/FormFieldLabel';\nimport vueFormFileUpload from '@peaui/ui/vue/form/FormFileUpload';\nimport reactFormFileUpload from '@peaui/ui/react/form/FormFileUpload';\nimport wcFormFileUpload from '@peaui/ui/wc/form/FormFileUpload';\nimport vueFormFileUploadSimple from '@peaui/ui/vue/form/FormFileUploadSimple';\nimport reactFormFileUploadSimple from '@peaui/ui/react/form/FormFileUploadSimple';\nimport wcFormFileUploadSimple from '@peaui/ui/wc/form/FormFileUploadSimple';\nimport vueFormInput from '@peaui/ui/vue/form/FormInput';\nimport reactFormInput from '@peaui/ui/react/form/FormInput';\nimport wcFormInput from '@peaui/ui/wc/form/FormInput';\nimport vueFormMultiSelect from '@peaui/ui/vue/form/FormMultiSelect';\nimport reactFormMultiSelect from '@peaui/ui/react/form/FormMultiSelect';\nimport wcFormMultiSelect from '@peaui/ui/wc/form/FormMultiSelect';\nimport vueFormNumber from '@peaui/ui/vue/form/FormNumber';\nimport reactFormNumber from '@peaui/ui/react/form/FormNumber';\nimport wcFormNumber from '@peaui/ui/wc/form/FormNumber';\nimport vueFormPassword from '@peaui/ui/vue/form/FormPassword';\nimport reactFormPassword from '@peaui/ui/react/form/FormPassword';\nimport wcFormPassword from '@peaui/ui/wc/form/FormPassword';\nimport vueFormPinInput from '@peaui/ui/vue/form/FormPinInput';\nimport reactFormPinInput from '@peaui/ui/react/form/FormPinInput';\nimport wcFormPinInput from '@peaui/ui/wc/form/FormPinInput';\nimport vueFormRadio from '@peaui/ui/vue/form/FormRadio';\nimport reactFormRadio from '@peaui/ui/react/form/FormRadio';\nimport wcFormRadio from '@peaui/ui/wc/form/FormRadio';\nimport vueFormRatingInput from '@peaui/ui/vue/form/FormRatingInput';\nimport reactFormRatingInput from '@peaui/ui/react/form/FormRatingInput';\nimport wcFormRatingInput from '@peaui/ui/wc/form/FormRatingInput';\nimport vueFormSelect from '@peaui/ui/vue/form/FormSelect';\nimport reactFormSelect from '@peaui/ui/react/form/FormSelect';\nimport wcFormSelect from '@peaui/ui/wc/form/FormSelect';\nimport vueFormSwitchToggle from '@peaui/ui/vue/form/FormSwitchToggle';\nimport reactFormSwitchToggle from '@peaui/ui/react/form/FormSwitchToggle';\nimport wcFormSwitchToggle from '@peaui/ui/wc/form/FormSwitchToggle';\nimport vueFormTagsInput from '@peaui/ui/vue/form/FormTagsInput';\nimport reactFormTagsInput from '@peaui/ui/react/form/FormTagsInput';\nimport wcFormTagsInput from '@peaui/ui/wc/form/FormTagsInput';\nimport vueFormTextarea from '@peaui/ui/vue/form/FormTextarea';\nimport reactFormTextarea from '@peaui/ui/react/form/FormTextarea';\nimport wcFormTextarea from '@peaui/ui/wc/form/FormTextarea';\nimport vueFormTimePicker from '@peaui/ui/vue/form/FormTimePicker';\nimport reactFormTimePicker from '@peaui/ui/react/form/FormTimePicker';\nimport wcFormTimePicker from '@peaui/ui/wc/form/FormTimePicker';\nimport vueFormYearPicker from '@peaui/ui/vue/form/FormYearPicker';\nimport reactFormYearPicker from '@peaui/ui/react/form/FormYearPicker';\nimport wcFormYearPicker from '@peaui/ui/wc/form/FormYearPicker';\nimport vueButtonAction from '@peaui/ui/vue/data-entry/ButtonAction';\nimport reactButtonAction from '@peaui/ui/react/data-entry/ButtonAction';\nimport wcButtonAction from '@peaui/ui/wc/data-entry/ButtonAction';\nimport vueButtonExport from '@peaui/ui/vue/data-entry/ButtonExport';\nimport reactButtonExport from '@peaui/ui/react/data-entry/ButtonExport';\nimport wcButtonExport from '@peaui/ui/wc/data-entry/ButtonExport';\nimport vueCopyButton from '@peaui/ui/vue/data-entry/CopyButton';\nimport reactCopyButton from '@peaui/ui/react/data-entry/CopyButton';\nimport wcCopyButton from '@peaui/ui/wc/data-entry/CopyButton';\nimport vueInlineEdit from '@peaui/ui/vue/data-entry/InlineEdit';\nimport reactInlineEdit from '@peaui/ui/react/data-entry/InlineEdit';\nimport wcInlineEdit from '@peaui/ui/wc/data-entry/InlineEdit';\nimport vueInputSlider from '@peaui/ui/vue/data-entry/InputSlider';\nimport reactInputSlider from '@peaui/ui/react/data-entry/InputSlider';\nimport wcInputSlider from '@peaui/ui/wc/data-entry/InputSlider';\nimport vueSearchInput from '@peaui/ui/vue/data-entry/SearchInput';\nimport reactSearchInput from '@peaui/ui/react/data-entry/SearchInput';\nimport wcSearchInput from '@peaui/ui/wc/data-entry/SearchInput';\nimport vueSegmentedControl from '@peaui/ui/vue/data-entry/SegmentedControl';\nimport reactSegmentedControl from '@peaui/ui/react/data-entry/SegmentedControl';\nimport wcSegmentedControl from '@peaui/ui/wc/data-entry/SegmentedControl';\nimport vueSelectableCard from '@peaui/ui/vue/data-entry/SelectableCard';\nimport reactSelectableCard from '@peaui/ui/react/data-entry/SelectableCard';\nimport wcSelectableCard from '@peaui/ui/wc/data-entry/SelectableCard';\nimport vueSplitButton from '@peaui/ui/vue/data-entry/SplitButton';\nimport reactSplitButton from '@peaui/ui/react/data-entry/SplitButton';\nimport wcSplitButton from '@peaui/ui/wc/data-entry/SplitButton';\nimport vueToggleButton from '@peaui/ui/vue/data-entry/ToggleButton';\nimport reactToggleButton from '@peaui/ui/react/data-entry/ToggleButton';\nimport wcToggleButton from '@peaui/ui/wc/data-entry/ToggleButton';\nimport vueToggleGroup from '@peaui/ui/vue/data-entry/ToggleGroup';\nimport reactToggleGroup from '@peaui/ui/react/data-entry/ToggleGroup';\nimport wcToggleGroup from '@peaui/ui/wc/data-entry/ToggleGroup';\nimport vueTransferList from '@peaui/ui/vue/data-entry/TransferList';\nimport reactTransferList from '@peaui/ui/react/data-entry/TransferList';\nimport wcTransferList from '@peaui/ui/wc/data-entry/TransferList';\nimport '@peaui/ui/styles.css';\nimport {createApp,h,nextTick,shallowRef} from 'vue';\nimport {createElement} from 'react';\nimport {createRoot} from 'react-dom/client';\nimport {flushSync} from 'react-dom';\nimport {computeAccessibleName,computeAccessibleDescription} from 'dom-accessibility-api';\nconst components={vue:{ListLimitControl:vueListLimitControl,FormButtonCheckbox:vueFormButtonCheckbox,FormButtonGroup:vueFormButtonGroup,FormCheckbox:vueFormCheckbox,FormColorPicker:vueFormColorPicker,FormContainer:vueFormContainer,FormDatePicker:vueFormDatePicker,FormDateRangePicker:vueFormDateRangePicker,FormDateTimePicker:vueFormDateTimePicker,FormField:vueFormField,FormFieldLabel:vueFormFieldLabel,FormFileUpload:vueFormFileUpload,FormFileUploadSimple:vueFormFileUploadSimple,FormInput:vueFormInput,FormMultiSelect:vueFormMultiSelect,FormNumber:vueFormNumber,FormPassword:vueFormPassword,FormPinInput:vueFormPinInput,FormRadio:vueFormRadio,FormRatingInput:vueFormRatingInput,FormSelect:vueFormSelect,FormSwitchToggle:vueFormSwitchToggle,FormTagsInput:vueFormTagsInput,FormTextarea:vueFormTextarea,FormTimePicker:vueFormTimePicker,FormYearPicker:vueFormYearPicker,ButtonAction:vueButtonAction,ButtonExport:vueButtonExport,CopyButton:vueCopyButton,InlineEdit:vueInlineEdit,InputSlider:vueInputSlider,SearchInput:vueSearchInput,SegmentedControl:vueSegmentedControl,SelectableCard:vueSelectableCard,SplitButton:vueSplitButton,ToggleButton:vueToggleButton,ToggleGroup:vueToggleGroup,TransferList:vueTransferList},react:{ListLimitControl:reactListLimitControl,FormButtonCheckbox:reactFormButtonCheckbox,FormButtonGroup:reactFormButtonGroup,FormCheckbox:reactFormCheckbox,FormColorPicker:reactFormColorPicker,FormContainer:reactFormContainer,FormDatePicker:reactFormDatePicker,FormDateRangePicker:reactFormDateRangePicker,FormDateTimePicker:reactFormDateTimePicker,FormField:reactFormField,FormFieldLabel:reactFormFieldLabel,FormFileUpload:reactFormFileUpload,FormFileUploadSimple:reactFormFileUploadSimple,FormInput:reactFormInput,FormMultiSelect:reactFormMultiSelect,FormNumber:reactFormNumber,FormPassword:reactFormPassword,FormPinInput:reactFormPinInput,FormRadio:reactFormRadio,FormRatingInput:reactFormRatingInput,FormSelect:reactFormSelect,FormSwitchToggle:reactFormSwitchToggle,FormTagsInput:reactFormTagsInput,FormTextarea:reactFormTextarea,FormTimePicker:reactFormTimePicker,FormYearPicker:reactFormYearPicker,ButtonAction:reactButtonAction,ButtonExport:reactButtonExport,CopyButton:reactCopyButton,InlineEdit:reactInlineEdit,InputSlider:reactInputSlider,SearchInput:reactSearchInput,SegmentedControl:reactSegmentedControl,SelectableCard:reactSelectableCard,SplitButton:reactSplitButton,ToggleButton:reactToggleButton,ToggleGroup:reactToggleGroup,TransferList:reactTransferList},wc:{ListLimitControl:wcListLimitControl,FormButtonCheckbox:wcFormButtonCheckbox,FormButtonGroup:wcFormButtonGroup,FormCheckbox:wcFormCheckbox,FormColorPicker:wcFormColorPicker,FormContainer:wcFormContainer,FormDatePicker:wcFormDatePicker,FormDateRangePicker:wcFormDateRangePicker,FormDateTimePicker:wcFormDateTimePicker,FormField:wcFormField,FormFieldLabel:wcFormFieldLabel,FormFileUpload:wcFormFileUpload,FormFileUploadSimple:wcFormFileUploadSimple,FormInput:wcFormInput,FormMultiSelect:wcFormMultiSelect,FormNumber:wcFormNumber,FormPassword:wcFormPassword,FormPinInput:wcFormPinInput,FormRadio:wcFormRadio,FormRatingInput:wcFormRatingInput,FormSelect:wcFormSelect,FormSwitchToggle:wcFormSwitchToggle,FormTagsInput:wcFormTagsInput,FormTextarea:wcFormTextarea,FormTimePicker:wcFormTimePicker,FormYearPicker:wcFormYearPicker,ButtonAction:wcButtonAction,ButtonExport:wcButtonExport,CopyButton:wcCopyButton,InlineEdit:wcInlineEdit,InputSlider:wcInputSlider,SearchInput:wcSearchInput,SegmentedControl:wcSegmentedControl,SelectableCard:wcSelectableCard,SplitButton:wcSplitButton,ToggleButton:wcToggleButton,ToggleGroup:wcToggleGroup,TransferList:wcTransferList}};\nlet cleanup=()=>{}, events=[],update=()=>{},updateSlots=()=>{};\nconst frame=()=>new Promise(r=>requestAnimationFrame(r));\nconst record=(event,value)=>events.push({event,value,time:performance.now()});\nwindow.componentTest={\n async mount({framework,name,props={},slots={},controlled=false}){\n  cleanup();await nextTick();document.body.replaceChildren();events=[];\n  const heading=document.createElement('h1');heading.textContent='Component test';document.body.append(heading);\n  const external=document.createElement('span');external.id='external-label';external.textContent='External field name';document.body.append(external);\n  const host=document.createElement(name==='FormContainer'?'div':'form');host.id='root';host.addEventListener('submit',e=>{e.preventDefault();record('submit',true)});document.body.append(host);\n  let current={...props};\n  if(framework==='react'){\n   const app=createRoot(host);const draw=()=>{const actual={...current,...slots};if(!controlled&&'value' in actual){actual.defaultValue=actual.value;delete actual.value;}if(slots.default){actual.children=slots.default;delete actual.default;}\n   for(const key of ['Value','InputValue','File','Files','Open','Search','Export','Change','Select','PrimaryClick','Submit','Click','Save','Cancel'])actual['on'+key+(key==='Value'||key==='InputValue'||key==='File'||key==='Files'||key==='Open'?'Change':'')]=v=>record(key,v instanceof Event?v.type:v);\n   if(controlled) actual.onValueChange=v=>{current={...current,value:v};record('Value',v);draw()}; flushSync(()=>app.render(createElement(components.react[name],actual)));};draw();update=patch=>{current={...current,...patch};draw()};updateSlots=patch=>{Object.assign(slots,patch);draw()};cleanup=()=>flushSync(()=>app.unmount());\n  }else if(framework==='vue'){\n   const state=shallowRef(current);const app=createApp({render:()=>h(components.vue[name],{...state.value,'onUpdate:value':v=>{state.value={...state.value,value:v};record('Value',v)},'onUpdate:open':v=>{state.value={...state.value,open:v};record('Open',v)},'onUpdate:file':v=>record('File',v),'onUpdate:files':v=>record('Files',v),onChange:v=>record('Change',v instanceof Event?v.type:v),onSelect:v=>record('Select',v),'onOn:submit':()=>record('Submit','component'),'onOn:search':v=>record('Search',v),'onOn:export':v=>record('Export',v)},Object.fromEntries(Object.entries(slots).filter(([,value])=>value!==null).map(([key,value])=>[key,()=>value])))});app.mount(host);update=patch=>{state.value={...state.value,...patch}};updateSlots=patch=>{Object.assign(slots,patch);state.value={...state.value}};cleanup=()=>app.unmount();\n  }else{\n   const element=new components.wc[name]();const assign=patch=>{for(const [key,value] of Object.entries(patch)){if(key.startsWith('aria-')||key==='form'||key==='name')element.setAttribute(key,String(value));else Reflect.set(element,key,value);}};assign(current);\n   const slotNodes=new Map();const assignSlots=patch=>{for(const [key,text] of Object.entries(patch)){slotNodes.get(key)?.remove();slotNodes.delete(key);if(text===null)continue;const node=document.createElement('span');if(key!=='default')node.slot=key;node.textContent=text;slotNodes.set(key,node);element.append(node)}};assignSlots(slots);updateSlots=assignSlots;\n   for(const key of ['update:value','update:file','update:files','update:open','change','on:submit','on:search','on:export','select'])element.addEventListener(key,e=>record(key,e.detail));host.append(element);update=assign;cleanup=()=>element.remove();\n  }\n  if(name==='FormFieldLabel'){const input=document.createElement('input');input.id='associated';document.body.append(input)}\n  await nextTick();await frame();await frame();\n },\n async update(patch){update(patch);await nextTick();await frame();await frame()},\n async updateSlots(patch){updateSlots(patch);await nextTick();await frame();await frame()},\n snapshot(){const host=document.querySelector('#root');const form=host.tagName==='FORM'?host:host.querySelector('form');return {events:events.map(e=>({event:e.event,value:typeof e.value==='object'&&e.value?.target?'[event]':e.value})),formData:form?[...new FormData(form)].map(([k,v])=>[k,typeof v==='string'?v:v.name]):[],valid:form?.checkValidity(),nodes:host.querySelectorAll('*').length,html:host.innerHTML.slice(0,18000),controls:[...host.querySelectorAll('input,textarea,select,button,[role=\"slider\"],[role=\"listbox\"],[role=\"radiogroup\"],[role=\"radio\"],[role=\"toolbar\"]')].map(el=>{const r=el.getBoundingClientRect();return {tag:el.localName,type:el.type,role:el.getAttribute('role'),id:el.id,name:computeAccessibleName(el),description:computeAccessibleDescription(el),value:el.value,checked:el.checked??el.getAttribute('aria-checked'),pressed:el.getAttribute('aria-pressed'),valueNow:el.getAttribute('aria-valuenow'),required:el.required,disabled:el.disabled,readonly:el.readOnly,ariaDisabled:el.getAttribute('aria-disabled'),ariaReadonly:el.getAttribute('aria-readonly'),ariaInvalid:el.getAttribute('aria-invalid'),invalid:el.validity?!el.validity.valid:undefined,tabIndex:el.tabIndex,visible:r.width>0&&r.height>0,width:r.width,height:r.height,focus:el===document.activeElement}})}},\n};\nwindow.componentTest.components=components;\nwindow.componentTest.multi=async({framework,name,props={},slots={}})=>{\n cleanup();await nextTick();document.body.replaceChildren();const root=document.createElement('main');document.body.append(root);\n const samples=[0,1].map(i=>({...props,id:'multi-'+i,name:'field-'+i,for:'association-'+i}));\n if(framework==='react'){const app=createRoot(root);flushSync(()=>app.render(samples.map((p,i)=>createElement(components.react[name],{...p,...slots,key:i,children:slots.default}))));cleanup=()=>flushSync(()=>app.unmount());}\n else if(framework==='vue'){const app=createApp({render:()=>samples.map(p=>h(components.vue[name],p,Object.fromEntries(Object.entries(slots).map(([k,v])=>[k,()=>v]))))});app.mount(root);cleanup=()=>app.unmount();}\n else {for(const p of samples){const el=new components.wc[name]();for(const [k,v] of Object.entries(p)){if(k==='name')el.setAttribute(k,v);else Reflect.set(el,k,v)}for(const [k,v]of Object.entries(slots)){const s=document.createElement('span');if(k!=='default')s.slot=k;s.textContent=v;el.append(s)}root.append(el)}cleanup=()=>root.remove();}\n await nextTick();await frame();await frame();const counts=new Map();for(const e of root.querySelectorAll('[id]'))if(e.id)counts.set(e.id,(counts.get(e.id)||0)+1);return {duplicates:[...counts].filter(([,n])=>n>1),elements:root.querySelectorAll('*').length};\n};";
const samples = {
  "FormButtonCheckbox": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": false
    },
    "slots": {
      "default": "Test field"
    }
  },
  "FormButtonGroup": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "options": [
        {
          "key": "a",
          "id": "a",
          "label": "Alpha",
          "value": "a"
        },
        {
          "key": "b",
          "id": "b",
          "label": "Beta",
          "value": "b"
        },
        {
          "key": "c",
          "id": "c",
          "label": "Blocked",
          "value": "c",
          "disabled": true
        }
      ],
      "value": "a"
    },
    "slots": {}
  },
  "FormCheckbox": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": false
    },
    "slots": {
      "default": "Test field"
    }
  },
  "FormColorPicker": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "#4c9a2a"
    },
    "slots": {}
  },
  "FormContainer": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false
    },
    "slots": {
      "default": "Form content"
    }
  },
  "FormDatePicker": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "2026-10-02"
    },
    "slots": {}
  },
  "FormDateRangePicker": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": [
        "2026-10-02",
        "2026-10-05"
      ]
    },
    "slots": {}
  },
  "FormDateTimePicker": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": {
        "date": "2026-10-02",
        "time": "10:30"
      }
    },
    "slots": {}
  },
  "FormField": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "Alpha"
    },
    "slots": {}
  },
  "FormFieldLabel": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "required": false,
      "for": "associated",
      "text": "Test label"
    },
    "slots": {}
  },
  "FormFileUpload": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false
    },
    "slots": {}
  },
  "FormFileUploadSimple": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false
    },
    "slots": {}
  },
  "FormInput": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "Alpha"
    },
    "slots": {}
  },
  "FormMultiSelect": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "options": [
        {
          "key": "a",
          "id": "a",
          "label": "Alpha",
          "value": "a"
        },
        {
          "key": "b",
          "id": "b",
          "label": "Beta",
          "value": "b"
        },
        {
          "key": "c",
          "id": "c",
          "label": "Blocked",
          "value": "c",
          "disabled": true
        }
      ],
      "value": [
        "a"
      ]
    },
    "slots": {}
  },
  "FormNumber": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": 2
    },
    "slots": {}
  },
  "FormPassword": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "Alpha"
    },
    "slots": {}
  },
  "FormPinInput": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "123456"
    },
    "slots": {}
  },
  "FormRadio": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "",
      "optionValue": "a"
    },
    "slots": {
      "default": "Test field"
    }
  },
  "FormRatingInput": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": 2
    },
    "slots": {}
  },
  "FormSelect": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "options": [
        {
          "key": "a",
          "id": "a",
          "label": "Alpha",
          "value": "a"
        },
        {
          "key": "b",
          "id": "b",
          "label": "Beta",
          "value": "b"
        },
        {
          "key": "c",
          "id": "c",
          "label": "Blocked",
          "value": "c",
          "disabled": true
        }
      ],
      "value": "a"
    },
    "slots": {}
  },
  "FormSwitchToggle": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": false
    },
    "slots": {}
  },
  "FormTagsInput": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": [
        "a"
      ]
    },
    "slots": {}
  },
  "FormTextarea": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "Alpha"
    },
    "slots": {}
  },
  "FormTimePicker": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "10:30"
    },
    "slots": {}
  },
  "FormYearPicker": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": 2026
    },
    "slots": {}
  },
  "ButtonAction": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false
    },
    "slots": {
      "default": "Test field"
    }
  },
  "ButtonExport": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false
    },
    "slots": {}
  },
  "CopyButton": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "text": "Copy payload"
    },
    "slots": {}
  },
  "InlineEdit": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "Alpha"
    },
    "slots": {}
  },
  "InputSlider": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": 0.5
    },
    "slots": {}
  },
  "SearchInput": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": "Alpha"
    },
    "slots": {}
  },
  "SegmentedControl": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "items": [
        {
          "key": "a",
          "id": "a",
          "label": "Alpha",
          "value": "a"
        },
        {
          "key": "b",
          "id": "b",
          "label": "Beta",
          "value": "b"
        },
        {
          "key": "c",
          "id": "c",
          "label": "Blocked",
          "value": "c",
          "disabled": true
        }
      ],
      "value": "a"
    },
    "slots": {}
  },
  "SelectableCard": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false
    },
    "slots": {
      "title": "Test field"
    }
  },
  "SplitButton": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "items": [
        {
          "key": "a",
          "id": "a",
          "label": "Alpha",
          "value": "a"
        },
        {
          "key": "b",
          "id": "b",
          "label": "Beta",
          "value": "b"
        },
        {
          "key": "c",
          "id": "c",
          "label": "Blocked",
          "value": "c",
          "disabled": true
        }
      ]
    },
    "slots": {}
  },
  "ToggleButton": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "value": false
    },
    "slots": {}
  },
  "ToggleGroup": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "items": [
        {
          "key": "a",
          "id": "a",
          "label": "Alpha",
          "value": "a"
        },
        {
          "key": "b",
          "id": "b",
          "label": "Beta",
          "value": "b"
        },
        {
          "key": "c",
          "id": "c",
          "label": "Blocked",
          "value": "c",
          "disabled": true
        }
      ],
      "value": "a"
    },
    "slots": {}
  },
  "TransferList": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "items": [
        {
          "key": "a",
          "id": "a",
          "label": "Alpha",
          "value": "a"
        },
        {
          "key": "b",
          "id": "b",
          "label": "Beta",
          "value": "b"
        },
        {
          "key": "c",
          "id": "c",
          "label": "Blocked",
          "value": "c",
          "disabled": true
        }
      ],
      "value": [
        "a"
      ]
    },
    "slots": {}
  },
  "ListLimitControl": {
    "props": {
      "id": "test-field",
      "name": "test-field",
      "label": "Test field",
      "ariaLabel": "Test field",
      "required": false,
      "limit": 10
    },
    "slots": {}
  }
};
function defaults(name) { return samples[name]; }
async function withPage(run, engine='chromium') {
 const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'peaui-independent-forms-'));
 let browser,server;
 try {
  await esbuild.build({stdin:{contents:fixture,resolveDir:root},bundle:true,minify:true,splitting:true,format:'esm',outdir:directory,define:{'process.env.NODE_ENV':'"production"'},logLevel:'silent'});
  fs.writeFileSync(path.join(directory,'index.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Form regression checks</title><link rel="stylesheet" href="/stdin.css"><script type="module" src="/stdin.js"></script></head><body></body></html>');
  server=http.createServer((req,res)=>{const file=path.resolve(directory,'.'+(req.url==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));if(!file.startsWith(directory+path.sep)||!fs.existsSync(file))return res.writeHead(404).end();res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await ({chromium,firefox,webkit}[engine]).launch();const page=await browser.newPage({viewport:{width:1100,height:850},reducedMotion:'reduce'});page.setDefaultTimeout(3500);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.componentTest);
  const mount=(framework,name,props={},options={})=>page.evaluate(args=>window.componentTest.mount(args),{framework,name,props:{...defaults(name).props,...props},slots:defaults(name).slots,...options});
  const snapshot=()=>page.evaluate(()=>window.componentTest.snapshot());
  const update=patch=>page.evaluate(p=>window.componentTest.update(p),patch);
  return await run({page,mount,snapshot,update,errors});
 } finally {await browser?.close(); if(server)await new Promise(r=>server.close(r));}
}
module.exports={withPage,defaults};
