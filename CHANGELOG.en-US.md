## Changelog

### 0.5.0

_2026-07-16_

#### Breaking changes

- Refactor the project template, removing example business code to a leaner generic admin scaffold
- Refactor the router and axios request layer, unifying error handling and fixing duplicate-request/field-mismatch issues
- Remove `utils`/`hooks`/`stores` barrel exports in favor of deep-path imports throughout
- Rename the table container class from `table-main` to `app-table`, and unify global spacing to a 4px grid scale
- Remove the legacy imperative popup `addPopup`, replaced by the `openPopup` API provided by [ AppPopup ]
- Remove the [ AppDropdown ] component
- Upgrade required `pnpm` version to `11`, and continuously bump project dependencies to the latest

#### New feature

- Added user management, role management, and menu management pages
- Added a dashboard to the home page
- Added [ AppDrawer ] component, used to refactor system settings and the user/role/menu forms
- [ AppPopup ] added an imperative `openPopup` API and the `AppPopupHost` component
- Added the `v-auth` button-level permission directive, wired into the [ AppTable ] operation column
- [ AppTable ] added an operation button column `type: operation`
- [ LayHeader ] added a message notification feature; breadcrumb parents now support switching sibling menus via dropdown
- Added 403/500 error pages and refactored the 404 page
- Added a View Transition circular-reveal animation to light/dark theme switching
- [ LaySettings ] added a download configuration export, ready to replace the system's default config
- [ SearchMenu ] added search history and pinyin search
- Added an about page, showing project info and a list of production/development dependencies
- Added Grid, Popup, Text, Editor, and Upload component demo pages

#### Bug fixes

- Fixed dynamic routes not being removed and menu state not resetting on logout
- Fixed dark-theme adaptation and upload-related issues in [ AppEditor ] / [ AppUpload ]
- Fixed the focus-highlight border being clipped on [ AppTable ] operation column buttons
- Fixed `el-dropdown` misalignment when there isn't enough space for the menu
- Fixed a dark-blue background appearing in `echarts` under dark theme, and a chart container observation issue
- Fixed data-isolation and reactivity-loss issues in `useTable`, `useReset`, and other hooks
- Fixed a white flash on first paint and a config-resolution issue with the UnoCSS ESLint plugin on Windows
- Replaced the project logo

#### Refactors

- Refactor [ AppTable ], merging `useTable` and `useTableSpan` into the component itself
- Refactor [ AppText ], reusing `el-text`'s `TextProps` type and adding a `tag` prop
- Refactor [ AppIcon ], with props now extending `element-plus`'s `IconProps`
- Refactor the watermark content to show the user identifier and date
- Refactor settings/language/theme state into a single source of truth, driven uniformly by `watch`
- Added the `versionFilePlugin` build plugin, replacing the previous command-line version file generator

### 0.4.1

_2024-10-25_

#### Bug fixes

- Fixed error messages in log files
- Fixed wrong api address in role management

### 0.4.0

_2024-10-24_

#### Breaking changes

- Modify the file path of [ SearchMenu ]
- Modify wildcard route `name` to `not-found`
- Upgrade project dependencies
- Split and optimize the `vite.config.ts` file

#### New feature

- [ SearchMenu ] component adds i18n internationalization
- Added [ AppText ] component for displaying text content, supporting text overflow and hiding display prompts
- Added [ AppTable ] component example
- Added version detection function to detect whether the current version is the latest version
- Added `gzip` and `brotli` compression
- Added [ LayFooter ] footer component
- Add button prompt control in settings
- `dayjs` added internationalization
- [ LayHeader ] Added the ability to automatically hide the right button when the width is less than `405px`

#### Bug fixes

- Fixed `i18n` data storage path error problem
- Fixed the problem that the back to top button does not display
- Fixed the problem that `Layouts` cannot adapt to the layout

#### Refactors

- Refactor `404` page
- Refactor the text of the [ AppTreeFilter ] component to display text prompts beyond hiding
- Reconstruct [ LayMenu ] and add [ AppText ] component internally to display text prompts after the directory or menu is hidden.

### 0.3.0

_2024-10-11_

#### Breaking changes

- Refactor project to support `English` and `Chinese` languages
- `useReset` adds different processing logic for basic data types and reference data types

#### New feature

- Add `@intlify/vue-i18n-loader` to support internationalization of `vue-i18n`
- Breadcrumbs are now dynamically displayed and will be automatically hidden when the screen width is less than `768px`
- Added `useEventBus` event bus based on `mitt` for communication between components
- [ AppDropdown ] Added default slot for customizing drop-down content
- Added `setDocumentTitle` method for setting document title

#### Bug fixes

- Fixed [ AppSelectIcon ] style disorder problem
- Fixed the problem of personal data not being cleared when logging out

### 0.2.0

_2024-10-01_

#### Breaking changes

- Remove the [ app-wrapper ] switch to CSS
- Update dependencies used by the project

#### New feature

- Support vue-i18n

#### Bug fixes

- Fixed `LayHeader` component type error issue
- Fixed typos and component paths

#### Refactors

- Reconstructing [ LayHeader ] component
- Reconstructing [ LayMenu ] component
- Reconstructing `i18n` Related code
