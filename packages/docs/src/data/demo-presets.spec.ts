import { describe, expect, it } from 'vitest';
import { parse, compileTemplate } from '@vue/compiler-sfc';
import ts from 'typescript';
import { generatedComponentApi } from '../generated/component-api';
import { generatedReactComponentApi } from '../generated/framework-component-api';
import { getDemoPreset, getExampleCode, getReactExampleCode } from './demo-presets';

describe('demo defaults', () => {
  it('passes object defaults to component editors as objects rather than HTML attributes', () => {
    const component = {
      name: 'InlineEdit',
      slug: 'inline-edit',
      importPath: '@peaui/ui/vue/data-entry/InlineEdit',
      models: [],
      props: [
        {
          name: 'editorProps',
          type: 'Record<string, unknown>',
          default: '{}',
          required: false,
          description: '',
        },
      ],
    };
    const first = getDemoPreset(component);
    const second = getDemoPreset(component);
    expect(first.props.editorProps).toEqual({});
    expect(first.props.editorProps).not.toBe(second.props.editorProps);
  });

  it('keeps nonempty array defaults as arrays and ignores unevaluated expressions', () => {
    const component = {
      name: 'Example',
      slug: 'example',
      importPath: '@peaui/ui/vue/form/Example',
      models: [],
      props: [
        {
          name: 'limits',
          type: 'number[]',
          default: '[5, 10, 25, 50]',
          required: false,
          description: '',
        },
        {
          name: 'referenceDate',
          type: 'Date',
          default: 'new Date()',
          required: false,
          description: '',
        },
      ],
    };
    const preset = getDemoPreset(component);
    expect(preset.props.limits).toEqual([5, 10, 25, 50]);
    expect(preset.props.referenceDate).toBeUndefined();
  });
});

describe('copyable component examples', () => {
  const component = {
    name: 'SectionHeading',
    slug: 'section-heading',
    importPath: '@peaui/ui/vue/data-display/SectionHeading',
    models: [],
    props: [],
  };

  it('keeps named Vue slots and every configured prop after the eighth entry', () => {
    const props = Object.fromEntries(
      Array.from({ length: 12 }, (_, index) => [`prop${index}`, index]),
    );
    const code = getExampleCode(component, props);
    expect(code).toContain('prop11');
    expect(code).toContain('<template #title>');
    expect(code).toContain('<template #description>');
  });

  it('escapes string and object values so Vue and TSX examples compile', () => {
    const props = {
      label: 'Say "Hello" & <world>',
      options: [{ label: "O'Reilly", value: 'a"b' }],
    };
    const vueCode = getExampleCode(component, props);
    const vue = parse(vueCode);
    expect(vue.errors).toEqual([]);
    expect(
      compileTemplate({
        source: vue.descriptor.template!.content,
        filename: 'Example.vue',
        id: 'example',
      }).errors,
    ).toEqual([]);
    const reactCode = getReactExampleCode(
      { ...component, importPath: '@peaui/ui/react/data-display/SectionHeading' },
      props,
    );
    const react = ts.transpileModule(reactCode, {
      reportDiagnostics: true,
      fileName: 'Example.tsx',
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX },
    });
    expect(react.diagnostics).toEqual([]);
  });

  it('renders each carousel slide as a separate child in both frameworks', () => {
    const carousel = { ...component, name: 'CardCarousel', slug: 'card-carousel' };
    expect(getExampleCode(carousel, {}).match(/<div>/g)).toHaveLength(4);
    expect(getReactExampleCode(carousel, {}).match(/<div>/g)).toHaveLength(4);
  });

  it('produces syntactically valid default examples for every Vue and React component', () => {
    for (const entry of generatedComponentApi) {
      const definition = { ...entry, slug: entry.name };
      const code = getExampleCode(definition, getDemoPreset(definition).props);
      const parsed = parse(code);
      expect(parsed.errors, entry.name).toEqual([]);
      expect(
        compileTemplate({
          source: parsed.descriptor.template!.content,
          filename: `${entry.name}.vue`,
          id: entry.name,
        }).errors,
        entry.name,
      ).toEqual([]);
    }
    for (const entry of generatedReactComponentApi) {
      const definition = { ...entry, slug: entry.name };
      const code = getReactExampleCode(definition, getDemoPreset(definition).props);
      const parsed = ts.transpileModule(code, {
        reportDiagnostics: true,
        fileName: `${entry.name}.tsx`,
        compilerOptions: { jsx: ts.JsxEmit.ReactJSX },
      });
      expect(parsed.diagnostics, entry.name).toEqual([]);
    }
  });
});
