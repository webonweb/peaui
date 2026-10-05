import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function resolveRequestPath(root, requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const candidate = resolve(root, normalize(relativePath));

  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) return undefined;
  if (!existsSync(candidate)) return undefined;

  return statSync(candidate).isDirectory() ? join(candidate, 'index.html') : candidate;
}

/** Serve the same built catalog in browser suites and the catalog check. */
export async function startStaticServer(directory, port = 0) {
  const root = resolve(directory);
  for (const entry of ['index.json', 'iframe.html']) {
    if (!existsSync(join(root, entry))) {
      throw new Error(`Missing ${join(root, entry)}. Build this Storybook before running browser tests.`);
    }
  }
  const server = createServer((request, response) => {
    let filePath;
    try {
      filePath = resolveRequestPath(root, request.url ?? '/');
    } catch {
      response.writeHead(400).end('Bad request');
      return;
    }

    if (!filePath || !existsSync(filePath)) {
      response.writeHead(404).end('Not found');
      return;
    }

    response.writeHead(200, {
      'cache-control': 'no-store',
      'content-type': mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  });

  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(port, '127.0.0.1', resolveListen);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error(`Cannot serve ${root}.`);

  return {
    close: () => new Promise((resolveClose) => server.close(resolveClose)),
    url: `http://127.0.0.1:${address.port}`,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await startStaticServer(process.argv[2] ?? 'storybook-static', Number(process.argv[3] ?? 6006));
  console.log(`Serving built Storybook at ${server.url}`);
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => {
      await server.close();
      process.exit(0);
    });
  }
}
