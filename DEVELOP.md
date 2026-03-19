# Development - @eeacms/volto-updatenotifier

## Unit Tests

Unit tests are located in the `src` folder with the `.test.tsx` or `.test.js` extension.

### Running Tests from the Project Root

The preferred way to run tests is from the root of the Volto project using the project's `yarn test`.
To run tests once and exit (recommended), use the `CI=true` environment variable.

To run all tests for this addon:

```bash
RAZZLE_JEST_CONFIG=src/addons/volto-updatenotifier/jest-addon.config.js CI=true yarn test src/addons/volto-updatenotifier
```

To run a specific test file:

```bash
RAZZLE_JEST_CONFIG=src/addons/volto-updatenotifier/jest-addon.config.js CI=true yarn test src/addons/volto-updatenotifier/src/UpdateNotifier.test.tsx
```

### Running Tests inside the Addon folder (Docker)

If you are using the Docker-based development environment inside the addon folder, you can run:

```bash
make test
```

This will run the tests inside the `frontend` container with `CI=1` automatically.

## Linting and Code Style

This project uses ESLint for linting, Prettier for code formatting, and Stylelint for CSS/LESS files.
The following commands should be run from within the `src/addons/volto-updatenotifier` folder:

- **Linting (ESLint):**
  - Check: `make lint`
  - Fix: `make lint-fix`
- **Formatting (Prettier):**
  - Check: `make prettier`
  - Fix: `make prettier-fix`
- **Styling (Stylelint):**
  - Check: `make stylelint`
  - Fix: `make stylelint-fix`

## Internationalization (i18n)

Generate or update translation files (run within the addon folder):

```bash
make i18n
```

## Cypress End-to-End Tests

Cypress tests are located in `cypress/e2e`. These are typically run from within the addon folder:

- **Run tests in headless mode:**
  ```bash
  make cypress-run
  ```
- **Open Cypress test runner:**
  ```bash
  make cypress-open
  ```

Note: Ensure the development environment is running before starting Cypress tests.
