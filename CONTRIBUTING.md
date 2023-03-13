# Contributing

## Getting Started

This project requires Node.js. Get started with:

```sh
npm i
```

## Building

To build the project (the build will be in `build/me.reinii.harvest-billables.sdPlugin`):

```sh
npm run build
```

To copy the build to the plugin directory:

```sh
npm run copy
```

Or, to run both:

```sh
npm run build-copy
```

## DevTools

You can debug error messages by enabling DevTools.

On macOS, you will first need to run the following command line in the Terminal:

```sh
defaults write com.elgato.StreamDeck html_remote_debugging_enabled -bool YESCopy
```

On Windows, you will need to add a `DWORD` `html_remote_debugging_enabled` with value `1` in the
registry at `HKEY_CURRENT_USER\Software\Elgato Systems GmbH\StreamDeckCopy`.

After you relaunch the Stream Deck app, you can open http://localhost:23654/ in Chrome, where you
will find a list of ‘Inspectable pages‘ (plugins). Click `me.reinii.harvest-billables`.
Error message details may be available in the console.

## Tests

This project uses jest. You can run tests with:

```sh
npm run test
```

Before running, copy `.env-sample` to `.env` and fill with your keys. This file takes the place
of Stream Deck settings for the purposes of testing.
