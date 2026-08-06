import './library';
import './main.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found.');
}

app.innerHTML = `
  <main class="playground">
    <section class="playground__card">
      <p class="playground__eyebrow">Web Components</p>
      <h1 class="playground__title">PEAUI WC Playground</h1>
      <p class="playground__description">
        This Vite + TypeScript sandbox is ready for local web component development.
        Add your library imports in <strong>src/library.ts</strong> and render them here.
      </p>
      <span class="playground__code">npm run dev</span>

      <section class="playground__preview">
        <h2 class="playground__preview-title">Preview</h2>
        <div class="playground__row">
          <peaui-tag-chip label="Default"></peaui-tag-chip>
          <peaui-tag-chip label="Active" variant="green" active="true"></peaui-tag-chip>
          <peaui-tag-chip label="Outline" variant="outline"></peaui-tag-chip>
          <peaui-tag-chip label="Span mode" variant="violet" as="span"></peaui-tag-chip>
        </div>
      </section>
    </section>
  </main>
`;
