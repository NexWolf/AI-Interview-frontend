import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = readFileSync(new URL('../apps/client/app/api/auth/login/route.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
} });

function route(fetch) {
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module, exports: module.exports,
    require: name => name === '@/constants/routes' ? { API_URL: 'http://backend.test/' } : require(name),
    fetch, AbortSignal, process: { env: { NODE_ENV: 'test' } }, console: { error() {} },
  });
  return module.exports.POST;
}
const request = (body = JSON.stringify({ email: 'test@example.invalid', password: 'test-password' })) =>
  new Request('http://localhost:3000/api/auth/login', { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });

test('unavailable backend produces an actionable 503 rather than a generic 500', async () => {
  const post = route(async () => { throw Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNREFUSED' } }); });
  const response = await post(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, 'AUTH_BACKEND_UNAVAILABLE');
});
test('backend timeouts return 504', async () => {
  const response = await route(async () => { throw Object.assign(new Error(), { name: 'TimeoutError' }); })(request());
  assert.equal(response.status, 504);
});
test('backend validation and authentication errors keep their status and message', async () => {
  const response = await route(async () => Response.json({ success: false, message: 'Invalid email or password' }, { status: 401 }))(request());
  assert.equal(response.status, 401);
  assert.equal((await response.json()).message, 'Invalid email or password');
});
test('invalid request JSON never reaches the backend', async () => {
  let calls = 0;
  const response = await route(async () => { calls++; throw new Error(); })(request('{'));
  assert.equal(response.status, 400);
  assert.equal(calls, 0);
});
test('invalid upstream replies cannot silently create an authenticated session', async () => {
  assert.equal((await route(async () => new Response('<html>Bad gateway</html>'))(request())).status, 502);
  assert.equal((await route(async () => Response.json({ success: true }))(request())).status, 502);
});
test('successful login preserves cookies and normalizes the backend URL', async () => {
  const payload = { success: true, data: { accessToken: 'access', refreshToken: 'refresh', user: { onboardingDone: true } } };
  const response = await route(async (url, options) => {
    assert.equal(url, 'http://backend.test/api/v1/auth/login');
    assert.equal(options.method, 'POST');
    return Response.json(payload);
  })(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), payload);
  assert.equal(response.cookies.get('accessToken').value, 'access');
  assert.equal(response.cookies.get('refreshToken').value, 'refresh');
  assert.equal(response.cookies.get('onboardingDone').value, 'true');
  assert.match(response.headers.get('set-cookie'), /HttpOnly/);
});
test('header-only tokens remain supported', async () => {
  const headers = new Headers();
  headers.append('set-cookie', 'accessToken=header-access; Path=/; HttpOnly');
  headers.append('set-cookie', 'refreshToken=header-refresh; Path=/; HttpOnly');
  const response = await route(async () => Response.json({ success: true, data: { user: {} } }, { headers }))(request());
  assert.equal(response.status, 200);
  assert.equal(response.cookies.get('accessToken').value, 'header-access');
  assert.equal(response.cookies.get('refreshToken').value, 'header-refresh');
});
