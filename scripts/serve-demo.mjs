import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {createServer} from 'node:http';
import {extname, join, resolve, sep} from 'node:path';

const root = resolve('dist/demo/browser');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

createServer(async (request, response) => {
  let file;

  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    file = resolve(root, `.${pathname}`);

    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }

    if ((await stat(file)).isDirectory()) {
      file = join(file, 'index.html');
    }

    await stat(file);
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4173, '127.0.0.1', () => {
  console.info('Serving production demo on http://127.0.0.1:4173');
});
