import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
function load(path, mocks = {}, globals = {}) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module, exports: module.exports, require: name => name in mocks ? mocks[name] : require(name),
    process: { env: {} }, console, Buffer, Date, URL, ...globals,
  });
  return module.exports;
}

const jwt = (role, exp) => `header.${Buffer.from(JSON.stringify({ role, exp })).toString('base64url')}.signature`;
const { NextRequest } = require('next/server');
const { middleware } = load('apps/company/middleware.ts');
function request(path, token, refresh = '') {
  const cookies = [token && `accessToken=${token}`, refresh && `refreshToken=${refresh}`].filter(Boolean).join('; ');
  return new NextRequest(`http://localhost:3002${path}`, { headers: { cookie: cookies } });
}

test('company login remains accessible with missing, expired, or malformed access tokens', () => {
  for (const token of [undefined, jwt('COMPANY', 1), 'invalid']) {
    const response = middleware(request('/login', token, 'stale-refresh'));
    assert.equal(response.headers.get('location'), null);
  }
});
test('only an unexpired company/admin token redirects login to the dashboard', () => {
  for (const role of ['COMPANY', 'ADMIN', 'SUPER_ADMIN']) {
    assert.equal(middleware(request('/login', jwt(role, Date.now() / 1000 + 3600))).headers.get('location'), 'http://localhost:3002/');
  }
  assert.equal(middleware(request('/login', jwt('USER', Date.now() / 1000 + 3600))).headers.get('location'), null);
});
test('anonymous protected pages redirect once to login and the login page stays put', () => {
  const response = middleware(request('/candidates'));
  const destination = new URL(response.headers.get('location'));
  assert.equal(destination.pathname, '/login');
  assert.equal(middleware(request(destination.pathname)).headers.get('location'), null);
});

function browser(path, fetchImpl = async () => Response.json({}, { status: 401 })) {
  let onError;
  const redirects = [];
  const storage = new Map();
  const client = Object.assign(async config => ({ config, status: 200 }), {
    interceptors: { request: { use() {} }, response: { use(ok, fail) { onError = fail; } } },
  });
  const api = load('packages/shared/src/lib/AxiosAPI.ts', {
    axios: { create: () => client },
  }, {
    window: { location: { pathname: path, replace: target => redirects.push(target) } },
    sessionStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
    fetch: fetchImpl,
  });
  return { api, redirects, fail: () => onError({ response: { status: 401 }, config: { headers: {} } }) };
}
test('failed company refresh redirects to /login once instead of cycling through /auth', async () => {
  const b = browser('/candidates');
  b.api.setAuthLoginPath('/login');
  await assert.rejects(b.fail());
  await assert.rejects(b.fail());
  assert.deepEqual(b.redirects, ['/login']);
});
test('an authentication failure on the company login page does not reload it', async () => {
  const b = browser('/login');
  b.api.setAuthLoginPath('/login');
  await assert.rejects(b.fail());
  assert.deepEqual(b.redirects, []);
});
test('client login destination and candidate interview access retain their existing behavior', async () => {
  const client = browser('/dashboard');
  await assert.rejects(client.fail());
  assert.deepEqual(client.redirects, ['/auth']);
  for (const path of ['/interview/123', '/dashboard']) {
    const candidate = browser(path);
    candidate.api.setCandidateToken('candidate-token');
    await assert.rejects(candidate.fail());
    assert.deepEqual(candidate.redirects, []);
  }
});
test('a refresh network error also respects the company login destination', async () => {
  const b = browser('/candidates', async () => { throw new Error('network unavailable'); });
  b.api.setAuthLoginPath('/login');
  await assert.rejects(b.fail(), /network unavailable/);
  assert.deepEqual(b.redirects, ['/login']);
});
test('successful refresh retries the request without navigation', async () => {
  const b = browser('/candidates', async () => Response.json({ accessToken: 'new-token' }));
  b.api.setAuthLoginPath('/login');
  const result = await b.fail();
  assert.equal(result.config.headers.Authorization, 'Bearer new-token');
  assert.deepEqual(b.redirects, []);
});

test('rendering the company login shell makes no profile request; protected pages do', () => {
  let requests = 0;
  const hooks = load('packages/shared/src/hooks/useCompany.ts', {
    '@tanstack/react-query': { useQuery: options => {
      if (options.enabled !== false) options.queryFn();
      return { data: undefined };
    } },
    '../services/company.service': { companyService: { getProfile: () => { requests++; } } },
    '../constants/query-key': { companyQueryKeys: { profile: ['company-profile'] } },
    sonner: { toast: {} },
  });
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  for (const pathname of ['/login', '/candidates']) {
    const { CompanyLayout } = load('apps/company/shared/components/CompanyLayout.tsx', {
      'next/navigation': { usePathname: () => pathname },
      './CompanySidebarNav': { CompanySidebarNav: () => null },
      './CompanyHeader': { CompanyHeader: () => null },
      '../context/LanguageContext': { useLanguage: () => ({ t: value => value, isArabic: false }) },
      '@repo/shared': hooks,
    });
    const markup = renderToStaticMarkup(React.createElement(CompanyLayout, null, 'page content'));
    assert.ok(markup.includes('page content'));
    assert.equal(requests, pathname === '/login' ? 0 : 1);
  }
});
