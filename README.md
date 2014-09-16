# PayPal Classic Auth Example

NodeJS API Client Example for PayPal Classic API's Account Authentication Service.

## Table of Contents

* [Requirements](#requirements)
* [How to Run](#how-to-run)
* [API Credentials](#api-credentials)
* [How It Works](#how-it-works)
* [Links and References](#links-and-references)
* [Copyright](#copyright)

## Requirements

* Node.js with npm
* GeddyJS, installed globally via `npm install -g geddy`
* A PayPal Sandbox account with Account Authentication Service privileges. (Refer to [API Credentials](#api-credentials))

## How to Run

1. Clone this repository
2. Run `npm install` in the project's main folder
3. Still in the project's main folder, generate `config/secrets.json` via the following command: `geddy gen secret`
4. Open `config/secrets.json` and `config/secrets-example.json`. Follow the format and fill in `secrets.json` accordingly.
5. Go back to the project's main folder and run the app via the following command: `geddy`

### Environments

There are two environments, namely `development` and `live`. These environments represent the sandbox and live environments, respectively.

This app by default runs on the `development` environment, in which it uses the config found at `config/development.js`. The `live` environment's config, on the other hand, can be found at `config/live.js`.

The endpoint and redirect URLs are dependent on the config values found in `config/development.js` and `config/live.js` and which environment the app in currently running on.

To run in a specific environment (i.e. live), run `geddy -e [ENVIRONMENT]`

## API Credentials

To run this app, you need a Business PayPal Account with the proper API credentials, permissions, and settings.

### How to create a Sandbox Business Account

1. Log in with an existing PayPal account to access the PayPal Developer website at [developer.paypal.com](https://developer.paypal.com/).
2. Create a new Business Sandbox account `Dashboard > Sandbox Accounts > Create Account`. Tick the checkbox for **Log In with PayPal** and fill out the required information. You can use dummy URLs for the Privacy Policy and User Agreement URLs.
3. Back at the Sandbox Accounts page, expand the new account and click `Profile`. Take note of the **Classic API credentials** (username, password, and signature).
4. Enable the **Account Authentication Service** privilege for your newly created Business Sandbox Account. The Account Authentication Service privilege can be requested from the PayPal Merchant Technical Support at [ppmts.custhelp.com](https://ppmts.custhelp.com).

While your account has not been enabled for the Account Authentication Service, you will get an error when trying to obtain an access token.

### Return URL

By default, the callback URL for this sample application is `http://localhost/auth/paypal/callback`

## How It Works

Key files to check out would be

```
app/controllers/main.js
config/secrets.json
config/secrets-example.json
```

Other files of interest would be

```
config/development.js
config/live.js
app/views/main/index.html.ejs
config/router.js
```

### API Call Sequence (3-legged OAuth)

1. An API call is sent to retrieve the access token.
2. The user is redirected to PayPal for log in. The redirection URL contains the retrieved access token from #1.
3. After a successful login, the user is sent to the Return URL including the authorized token parameter.
4. Using the authorized token parameter sent to the return URL, an API call is sent to retrieve the user information.

## Links and References

* [Account Authentication Service Getting Started Guide]( https://developer.paypal.com/docs/classic/account-auth-service/gs_account_auth_service/)
* [GeddyJS Framework](http://geddyjs.org)
* [PayPal Developer Website](https://developer.paypal.com/)
* [PayPal Merchant Technical Support Portal](https://ppmts.custhelp.com/)

## Copyright

PayPal Classic Auth Example is released under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).
