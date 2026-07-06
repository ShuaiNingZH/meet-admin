# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Meet-Admin is a Vue 3.5 + TypeScript + Vite 8 admin framework using Element Plus, Pinia, UnoCSS, and Vue I18n. Package manager is **pnpm** (`>= 11`), Node `>= 24`. There is no test suite — verification is type-check + lint.

## Commands

```bash
pnpm dev            # dev server (loads .env + .env.dev)
pnpm dev:test       # dev against test env (.env.test)
pnpm dev:prod       # dev against prod env (.env.prod)
pnpm type-check     # vue-tsc --build (run this to validate types)
pnpm lint           # eslint .
pnpm lint:fix       # eslint . --fix
pnpm build          # type-check + vite build --mode prod (parallel via run-p)
pnpm build:test     # type-check + vite build --mode test (parallel via run-p)
pnpm commit         # interactive Conventional Commits prompt (czg); required commit format
```

Builds emit `version.json` into the output dir via the custom `versionFilePlugin` in `build/plugins.ts`; version-rocket (`src/config/versionRocket.ts`) polls it to detect new releases.

Commits are validated by commitlint (Conventional Commits) and lint-staged auto-fixes staged files via a husky pre-commit hook. Follow the existing commit style, e.g. `fix(components): [lay-tabs] ...`.

## Environment modes

`.env` holds shared defaults (`VITE_APP_NAME`, `VITE_HOME_PATH`, `VITE_APP_PREFIX`, `VITE_COMPRESSION`, ...). `VITE_BASE_URL` (the API host, used by the axios wrapper) is set per-mode in `.env.dev` / `.env.test` / `.env.prod`. Compression (gzip/brotli) is off by default; toggle via `VITE_COMPRESSION`.

## Architecture

### Auto-imports — do not add manual imports for these
Configured in `build/plugins.ts`:
- APIs from `vue`, `vue-router`, `pinia`, `@vueuse/core`, `vue-i18n` are auto-imported (`ref`, `computed`, `useRoute`, `defineStore`, `useStorage`, `$t`, etc.). Types are generated into `src/typings/auto-imports.d.ts`.
- Element Plus components/APIs (`ElMessage`, `ElLoading`, `<ElButton>`, ...) resolve on-demand.
- Any component named `App*` (e.g. `<AppTable>`, `<AppForm>`) is auto-imported from `src/components/index.ts` — new global components must be re-exported from that barrel file to be usable without import. Types are in `src/typings/components.d.ts`.

Alias `@` → `src`. Routing uses **hash history**.

### Routing — static modules + dynamic (menu-driven) routes
Two sources of routes, both mounted under a single `Layout` container (`src/router/index.ts`):
1. **Static business modules**: every `src/router/modules/*.ts` (except `index.ts` and `remainingRouter.ts`) is eagerly globbed and merged into `Layout.children`. Add a page by dropping a new module file that `export default satisfies RouteRecordRaw`. `remainingRouter.ts` holds top-level routes outside the layout (login, error pages).
2. **Dynamic routes**: on first authenticated navigation, `initRouter()` (`src/router/utils.ts`) fetches user info + menu from the backend, converts the nested menu (`menuToRoutes`) into routes, resolves each menu's `componentPath` against `import.meta.glob('@/views/**/*.vue')`, and registers them under the layout via `router.addRoute(LAYOUT_NAME, ...)`. Unresolved components fall back to `404.vue`.

`route.meta` drives menu/tab behavior: `title`, `icon`, `sort` (menu ordering), `keepAlive`, `activeMenu`, `hideInMenu`, `hideInTag`, `hideParent` (single-child collapsing). `src/router/utils.ts` also builds the menu tree (`processMenus`), breadcrumbs, and search list from these.

The global `beforeEach` guard enforces auth: no `accessToken` → redirect to `/login`; empty `userInfo` → run `initRouter()` then replay the target route.

### HTTP layer — `src/utils/axios.ts`
All API calls go through the `request<T>(axiosConfig, options?)` wrapper (default export). API modules live in `src/api/**` and are re-exported from `src/api/index.ts`; each function returns `request<ResponseDataType>({ url, method, params/data }, options)`. Pattern for a call:

```ts
export function createUser(data: UserCreateForm) {
  return request({ url: '/api/users', method: 'post', data }, { loading: true, message: true });
}
```

The wrapper handles, per `options`: `cancelDuplicateRequest` (AbortController keyed by url+method+params+data; on by default), `loading` (Element Plus overlay, refcounted; pass a string for custom text), `message` (success toast; string overrides backend message), `showErrorMessage` (i18n'd HTTP-status error toasts). It injects `Bearer` token from the user store, sets `Accept-Language`, strips empty values (`null`/`undefined`/`''`) from params/body via `filterEmptyValues`, and on `status === 401` logs out + redirects to `/login`. Backend success is `data.status === 200`.

### State — Pinia (`src/stores/`)
Setup-store style (`defineStore('...', () => { ... })`), persisted via `pinia-plugin-persistedstate`. Stores: `user` (auth token via `useStorage('access-token')`, user info), `route`, `tab`, `app`. Import stores by deep path (`@/stores/user`, ...); `src/stores/index.ts` only exposes `installPinia`. Note `accessToken` is persisted through VueUse `useStorage`, not the pinia plugin.

### Library setup — `src/config/`
Each third-party lib has an init/config module (`elementPlus.ts`, `i18n.ts`, `dayjs.ts`, `echarts.ts`, `wangEditor.ts`, `versionRocket.ts`, `weiXin.ts` for WeCom login, `nprogress.ts`, `settings.ts`). App bootstrap wiring is in `src/main.ts` (`installPinia` → `installRouter` → `setupGlobalDirectives` → `installI18n`).

### i18n
Locales are precompiled YAML under `src/locales/` (via `@intlify/unplugin-vue-i18n`). Use the auto-imported `$t()` in TS/utils and `$t`/`t` in templates. New user-facing strings should be added to the locale files, not hardcoded — see how `src/utils/axios.ts` keys error messages (`axios.errorStatus.*`).

## Conventions
- Vue SFCs use `<script setup lang="ts">`.
- ESLint config is `@antfu/eslint-config` (flat config in `eslint.config.ts`) with **semicolons required**, plus UnoCSS linting and prettier-based CSS/HTML formatting. Run `pnpm lint:fix` before committing.
- Styling is UnoCSS (Wind3 preset + attributify + rem-to-px), configured in `uno.config.ts`; global styles/overrides in `src/styles/`.
- Spacing (padding/margin/gap) follows a 4px-grid scale defined as CSS custom properties in `src/styles/variables.scss`: `--spacing-xs` (4px), `--spacing-sm` (8px), `--spacing-md` (12px), `--spacing-base` (16px), `--spacing-lg` (24px), `--spacing-xl` (32px), `--spacing-xxl` (48px). Use `var(--spacing-*)` in SCSS/inline styles, or the equivalent UnoCSS utility (e.g. `p-16`, `gap-8` — the number is literally the pixel value under this project's rem-to-px config) instead of hardcoding arbitrary px values.
- Ambient/global TS types (e.g. `AppAxios.*`, `Menu.*`, `User.*`, `AnyObj`) live in `src/typings/`.
- Before writing a helper, check `src/utils/` for an existing one — e.g. number/money formatting already exists: `numberFormat` (千分位, no decimals) in `common.ts` vs `moneyThousand` (千分位 + 2 decimals, for amounts) in `money.ts`. Don't reimplement these.
