import MagicString from 'magic-string';
import type { Plugin } from 'vite';
import { componentImports } from './component-imports';

/** Keep named framework imports convenient while loading CSS only for imported components. */
export function peauiImports(): Plugin {
  return {
    name: 'peaui:component-imports',
    enforce: 'post',
    transform(code, id) {
      if (!code.includes('@peaui/ui') || !/\.(?:[cm]?[jt]sx?|vue)(?:\?|$)/.test(id)) return;
      const ast = this.parse(code);
      const output = new MagicString(code);
      // Rollup's parser supplies offsets; ESTree's nested node types omit those fields.
      const sourceFor = (node: object): string => {
        const { start, end } = node as { start: number; end: number };
        return code.slice(start, end);
      };
      for (const statement of ast.body) {
        if (statement.type !== 'ImportDeclaration') continue;
        const source = statement.source.value;
        if (source !== '@peaui/ui' && source !== '@peaui/ui/vue' && source !== '@peaui/ui/react')
          continue;
        const framework = source === '@peaui/ui/react' ? 'react' : 'vue';
        const imports: string[] = [];
        const remaining: string[] = [];
        for (const specifier of statement.specifiers) {
          if (specifier.type !== 'ImportSpecifier') {
            // Namespace and default imports retain the compatibility entry.
            remaining.push(sourceFor(specifier));
            continue;
          }
          const name =
            specifier.imported.type === 'Identifier'
              ? specifier.imported.name
              : specifier.imported.value;
          const component = componentImports[String(name)];
          if (component)
            imports.push(
              `import ${specifier.local.name} from '@peaui/ui/${framework}/${component}';`,
            );
          else remaining.push(sourceFor(specifier));
        }
        if (!imports.length) continue;
        // A namespace/default import cannot be combined with named specifiers in generated braces.
        const other = statement.specifiers.filter(
          (specifier) => specifier.type !== 'ImportSpecifier',
        );
        const named = statement.specifiers.filter(
          (specifier) =>
            specifier.type === 'ImportSpecifier' && remaining.includes(sourceFor(specifier)),
        );
        if (other.length)
          imports.push(`import ${other.map(sourceFor).join(', ')} from '${source}';`);
        if (named.length)
          imports.push(`import { ${named.map(sourceFor).join(', ')} } from '${source}';`);
        const range = statement as typeof statement & { start: number; end: number };
        output.overwrite(range.start, range.end, imports.join('\n'));
      }
      return output.hasChanged()
        ? {
            code: output.toString(),
            map: output.generateMap({ hires: true, source: id, includeContent: true }),
          }
        : undefined;
    },
  };
}
