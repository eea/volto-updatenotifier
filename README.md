# @eeacms/volto-updatenotifier

A Volto add-on that notifies users to reload the browser window if a new version of the frontend has been deployed.

## Features

- Adds an Express middleware to serve the frontend version at `/__frontend-version`.
- Includes a React component (`UpdateNotifier`) that polls the version endpoint.
- Displays a "Reload window" button when a version change is detected.

## Installation

1.  Install the package:
    ```bash
    yarn add @eeacms/volto-updatenotifier
    ```

2.  Add the add-on to your `volto.config.js`:
    ```javascript
    const addons = ['@eeacms/volto-updatenotifier'];
    ```

## How it works

### Express Middleware
The add-on registers an Express middleware that serves the `version` from the project's `package.json` at the `/__frontend-version` endpoint.

### UpdateNotifier Component
The `UpdateNotifier` component is automatically added to `appExtras`. It polls the `/__frontend-version` endpoint at a regular interval to determine if a new version has been deployed.

When the component detects a version change compared to the initial version loaded at startup, it renders a "Reload window" button, prompting the user to refresh the page to get the latest updates.

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-updatenotifier/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
