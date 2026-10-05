const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const http = require("node:http");
const { build } = require("esbuild");
const playwright = require("playwright");
const root = path.resolve(__dirname, "..");
function createCatalog(categories) {
  return Object.fromEntries(
    categories.flatMap((category) =>
      fs
        .readdirSync(
          path.join(root, "packages/library/src/components", category),
          { withFileTypes: true },
        )
        .filter(
          (entry) =>
            entry.isDirectory() &&
            fs.existsSync(
              path.join(
                root,
                "packages/library/src/components",
                category,
                entry.name,
                "index.vue",
              ),
            ),
        )
        .map((entry) => [entry.name, `${category}/${entry.name}`]),
    ),
  );
}
const catalog = createCatalog(["basic", "data-display", "feedback"]);
function createFixture(catalog) {
  const imports = Object.entries(catalog)
    .flatMap(([name, location]) =>
      ["vue", "react", "wc"].map(
        (framework) =>
          `import ${framework}${name} from '@peaui/ui/${framework}/${location}';`,
      ),
    )
    .join("\n");
  return `${imports}
import '@peaui/ui/styles.css';
import {createApp,h,shallowRef,nextTick,ref} from 'vue';
import {createElement,createRef} from 'react';import {createRoot} from 'react-dom/client';import {flushSync} from 'react-dom';
import {computeAccessibleName,computeAccessibleDescription} from 'dom-accessibility-api';
const components={${["vue", "react", "wc"]
    .map(
      (framework) =>
        `${framework}:{${Object.keys(catalog)
          .map((name) => `${name}:${framework}${name}`)
          .join(",")}}`,
    )
    .join(",")}};
const eventMap={'on:action':'onAction','on:submit':'onSubmit','on:cancel':'onCancel','on:select:row':'onSelectRow','on:check:row':'onCheckRow','on:sort':'onSort','on:remove':'onRemove','on:simulate':'onSimulate','on:close':'onClose','update:page':'onPageChange','update:open':'onOpenChange','update:activeIndex':'onActiveIndexChange','update:activeFilter':'onActiveFilterChange','update:selectedId':'onSelectedIdChange',select:'onSelect',action:'onAction',overflowClick:'onOverflowClick',markRead:'onMarkRead',markUnread:'onMarkUnread',markAllRead:'onMarkAllRead',loadMore:'onLoadMore',filterChange:'onFilterChange',retry:'onRetry',visibleRangeChange:'onVisibleRangeChange',reachEnd:'onReachEnd',scroll:'onScroll',itemFocus:'onItemFocus',measureError:'onMeasureError',load:'onLoad',error:'onError'};
Object.assign(eventMap,{'on:search':'onSearch','on:create':'onCreate','on:export':'onExport','on:reset-filters':'onResetFilters','on:change:page':'onChangePage','on:change:limit':'onChangeLimit','update:filtersOpen':'onFiltersOpenChange','update:openMenu':'onOpenMenuChange',click:'onClick'});
let cleanup=()=>{},current={},events=[],update=()=>{},slotUpdate=()=>{},handle=null;
const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
const flush=async()=>{await nextTick();await frame();await frame();};
const revive=value=>Array.isArray(value)?value.map(revive):value&&typeof value==='object'?('$fn'in value?Function('return ('+value.$fn+')')():Object.fromEntries(Object.entries(value).map(([key,value])=>[key,revive(value)]))):value;
const renderNode=(value,create,scope={})=>Array.isArray(value)?value.map(x=>renderNode(x,create,scope)):value&&typeof value==='object'?create(value.tag??'span',{...(value.bindSlotProps?scope.props:{}),...value.props},value.text || undefined):value;
const applyStyle=(element,value)=>{for(const[key,entry]of Object.entries(value))if(key.startsWith('--'))element.style.setProperty(key,String(entry));else element.style[key]=entry;};
const eventValue=value=>{try{return JSON.parse(JSON.stringify(value))}catch{return String(value)}};
function record(event,args){events.push({event,args:args.map(eventValue)});}
window.display={
 async mount({framework,name,props={},slots={},controlled=true}){
  cleanup();await nextTick();document.body.replaceChildren();events=[];current=revive(props);handle=null;
  const root=document.createElement('main');root.id='root';document.body.append(root);
  const handleEvent=(event,args)=>{record(event,args);if(controlled&&event.startsWith('update:'))update({[event.slice(7)]:args[0]});};
  const vueSlots=()=>Object.fromEntries(Object.entries(slots).filter(([,value])=>value!==null).map(([key,value])=>[key,scope=>renderNode(value,h,scope)]));
  if(framework==='vue'){
   const state=shallowRef(current),reference=ref();const handlers=Object.fromEntries(Object.keys(eventMap).map(event=>['on'+event[0].toUpperCase()+event.slice(1),(...args)=>handleEvent(event,args)]));
   const app=createApp({render:()=>h(components.vue[name],{...state.value,...handlers,ref:reference},vueSlots())});app.mount(root);update=patch=>{current={...current,...patch};state.value=current};slotUpdate=patch=>{Object.assign(slots,patch);state.value={...state.value}};cleanup=()=>app.unmount();handle=()=>reference.value;
  }else if(framework==='react'){
   const app=createRoot(root),reference=createRef();const draw=()=>{const actual={...current,ref:reference};for(const[event,key]of Object.entries(eventMap))actual[key]=(...args)=>handleEvent(event,args);for(const[key,value]of Object.entries(slots)){const target=key==='default'?'children':key.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());actual[target]=renderNode(value,createElement);}flushSync(()=>app.render(createElement(components.react[name],actual)))};draw();update=patch=>{current={...current,...patch};draw()};slotUpdate=patch=>{Object.assign(slots,patch);draw()};cleanup=()=>flushSync(()=>app.unmount());handle=()=>reference.current;
  }else{
   const element=new components.wc[name]();const apply=patch=>{for(const[key,value]of Object.entries(patch)){if(key.startsWith('aria-'))element.setAttribute(key,String(value));else if(key==='style' && value && typeof value==='object')applyStyle(element,value);else Reflect.set(element,key,value)}};apply(current);
   const nodes=new Map();slotUpdate=patch=>{for(const[key,value]of Object.entries(patch)){for(const node of nodes.get(key)??[])node.remove();nodes.delete(key);if(value===null)continue;const elements=(Array.isArray(value)?value:[value]).map(item=>{const node=document.createElement(typeof item==='object'?item.tag??'span':'span');if(key!=='default')node.slot=key;node.textContent=typeof item==='string'?item:item.text??'';if(item.props)for(const[k,v]of Object.entries(item.props))if(k==='className')node.className=String(v);else if(k==='style'&&v&&typeof v==='object')applyStyle(node,v);else if(typeof v==='boolean'&&k in node)Reflect.set(node,k,v);else if(k!=='key')node.setAttribute(k,String(v));element.append(node);return node});nodes.set(key,elements)}};slotUpdate(slots);
   for(const event of Object.keys(eventMap))element.addEventListener(event,customEvent=>{const detail=customEvent.detail;record(event,Array.isArray(detail)?detail:[detail??customEvent.type])});root.append(element);update=patch=>{current={...current,...patch};apply(patch)};cleanup=()=>element.remove();handle=()=>element;
  }
  await flush();
 },
 async update(patch){update(revive(patch));await flush();},
 async slots(patch){slotUpdate(patch);await flush();},
 async action(name,args=[]){handle()?.[name]?.(...args);await flush();},
 async mutateRecords(index,patch){Object.assign(current.records[index],patch);update({records:[...current.records]});await flush();},
 async clear(){cleanup();await flush();document.body.replaceChildren()},
 events(){return events},
 clearEvents(){events=[]},
 props(){return eventValue(current)},
 snapshot(){const root=document.querySelector('#root');return {text:root.textContent,html:root.innerHTML,events,controls:[...root.querySelectorAll('button,input,a,summary,svg,[role]')].map(element=>({tag:element.localName,role:element.getAttribute('role'),name:computeAccessibleName(element),description:computeAccessibleDescription(element),checked:element.checked,disabled:element.disabled,expanded:element.getAttribute('aria-expanded'),pressed:element.getAttribute('aria-pressed'),selected:element.getAttribute('aria-selected'),value:element.value,tabIndex:element.tabIndex,focus:element===document.activeElement})),rows:[...root.querySelectorAll('tbody tr')].map(row=>({id:row.getAttribute('data-id'),text:row.textContent,inputs:[...row.querySelectorAll('input')].map(input=>({value:input.value,checked:input.checked,type:input.type}))}))}}
};`;
}
const fixture = createFixture(catalog);
async function boot(options = {}) {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "peaui-display-verification-"),
  );
  await build({
    stdin: {
      contents:
        (options.categories
          ? createFixture(createCatalog(options.categories))
          : fixture) + (options.additionalFixture ?? ""),
      resolveDir: root,
    },
    bundle: true,
    splitting: true,
    minify: true,
    format: "esm",
    outdir: directory,
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "silent",
    alias: { "@": path.join(root, "packages/library/src") },
  });
  fs.writeFileSync(
    path.join(directory, "index.html"),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Display verification</title><link rel="stylesheet" href="/stdin.css"><script type="module" src="/stdin.js"></script></head><body></body></html>',
  );
  const server = http.createServer((request, response) => {
    const file = path.resolve(
      directory,
      "." +
        (request.url === "/"
          ? "/index.html"
          : new URL(request.url, "http://localhost").pathname),
    );
    if (!file.startsWith(directory + path.sep) || !fs.existsSync(file))
      return response.writeHead(404).end();
    response.setHeader(
      "Content-Type",
      file.endsWith(".js")
        ? "text/javascript"
        : file.endsWith(".css")
          ? "text/css"
          : "text/html",
    );
    response.end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser =
    await playwright[
      process.env.PEAUI_BROWSER || process.env.VERIFICATION_ENGINE || "chromium"
    ].launch();
  const page = await browser.newPage({
    viewport: options.viewport ?? { width: 1000, height: 800 },
    reducedMotion: "reduce",
  });
  page.setDefaultTimeout(3000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:" + server.address().port);
  await page.waitForFunction(() => window.display);
  return {
    page,
    errors,
    close: async () => {
      await browser.close();
      await new Promise((resolve) => server.close(resolve));
    },
  };
}
module.exports = { boot, catalog, fixture };
