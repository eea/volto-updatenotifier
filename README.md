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

## Secret Scanning

This repository uses the Betterleaks GitHub Action to scan the current
repository content on every push and pull request. The scan uses the rules in
`.gitleaks.toml` and uploads a `betterleaks-report` artifact when a finding is
detected.

If the optional SMTP secrets are configured, failed scans also send an email to
the last commit committer. The workflow expects these repository or
organization secrets:

- `SMTP_URL`
- `SMTP_PORT` (optional, defaults to `25`)
- `SMTP_EMAIL`
- `SMTP_PASSWORD` (optional if the SMTP server does not require authentication)

Port `465` is sent with direct TLS; other ports use the default SMTP handshake.
The email includes a short finding summary from the redacted Betterleaks report,
including the redacted matched line from each finding.

There are three common outcomes:

1. **Everything is OK.** The `Betterleaks / Scan for secrets` check is green and
   no action is needed. Regular references to runtime values are OK, for example:

   ```js
   const tokenFromCookie = req.universalCookies.get('auth_token');
   ```

2. **A real secret was found.** The check is red and the workflow log asks you to
   download the `betterleaks-report` artifact. Open the artifact from the GitHub
   Actions run and check the reported file, line and rule. Remove the committed
   value, move it to the proper secret store, and rotate it if it was exposed.
   A report entry looks like this:

   ```json
   {
     "RuleID": "secret-literal-assignment",
     "File": "src/config.js",
     "StartLine": 12,
     "Secret": "[REDACTED]"
   }
   ```

3. **The finding is a false positive.** Keep the value only if it is clearly not
   sensitive, such as a test fixture, placeholder, or public example. Add
   `betterleaks:allow` on the same line and include a short explanation in the
   pull request.

   ```js
   const testPassword = 'admin'; //betterleaks:allow
   ```

   ```yaml
   password: "admin" #betterleaks:allow
   ```

Do not add `betterleaks:allow` to real credentials.

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-updatenotifier/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
