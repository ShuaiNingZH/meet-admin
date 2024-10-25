## Changelog

### 0.4.1

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
- `day.js` added internationalization
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
