# Harvest Billables for Stream Deck

![](docs/icons.png)

This [Stream Deck][stream-deck] plugin fetches data from [Harvest][harvest] and [Forecast][forecast]
to let you know how much more billable time you have left for the day.

## Getting Started

This plugin is not yet in the Stream Deck app.

**[:arrow_down: Download Latest Release](https://github.com/reiniiriarios/stream-deck-billables-harvest/releases/latest)**

To install, copy the `me.reinii.harvest-billables.sdPlugin` directory to
`~/Library/Application Support/com.elgato.StreamDeck/Plugins/` on macOS or
`%appdata%\Elgato\StreamDeck\Plugins\` on Windows.

### Generate API Credentials

You'll need to generate an API token in [Harvest][harvest-api] as well
as finding your Harvest Account ID and Forecast Account ID. Both your Harvest and Forecast IDs
can be found under the API token details after [creating it][harvest-api]. These two additional
ids are necessary as they refer to your organization and not your user account.

You only need one API token for all buttons, but you must enter the credentials in every button.

[stream-deck]: https://www.elgato.com/en/welcome-to-stream-deck
[harvest]: https://www.getharvest.com/
[forecast]: https://www.getharvest.com/forecast
[harvest-api]: https://id.getharvest.com/developers

## Error Messages

Error|Details
---|---
`EAUTH`|Missing harvest token or account ids. [Generate these][harvest-api] and paste them in the settings window.
`ETASK`|No task selected. Make sure tasks are available for your user account, then select a task in the Timer button settings.
`NOPRJ`|No projects found in Forecast. In order for billable hours to display, there must be projects in Forecast that you are assigned to.
`ETIM1`|Error creating time entry.
`ETIM2`|Error restarting time entry.
`ETIM3`|Error stopping time entry.
`H0001`|Error response when fetching data from Harvest.
`H1001`|Error response when posting data to Harvest.
`H2001`|Error response when patching data on Harvest.
`H0403`|GET: Invalid authentication for Harvest. Check token and account id.
`H0404`|GET: Harvest endpoint not found (or invalid authentication). Check token and account id.*
`H0422`|GET: Error processing Harvest request.
`H0429`|GET: Harvest requests throttled.
`H0500`|GET: Harvest server error.
`H0###`|GET: Other Harvest error.
`H1403`|POST: Invalid authentication for Harvest. Check token and account id.
`H1404`|POST: Harvest endpoint not found (or invalid authentication). Check token and account id.*
`H1422`|POST: Error processing Harvest request.
`H1429`|POST: Harvest requests throttled.
`H1500`|POST: Harvest server error.
`H1###`|POST: Other Harvest error.
`H2403`|PATCH: Invalid authentication for Harvest. Check token and account id.
`H2404`|PATCH: Harvest endpoint not found (or invalid authentication). Check token and account id.*
`H2422`|PATCH: Error processing Harvest request.
`H2429`|PATCH: Harvest requests throttled.
`H2500`|PATCH: Harvest server error.
`H2###`|PATCH: Other Harvest error.
`F0002`|Error response from Forecast.
`F0403`|GET: Invalid authentication for Forecast. Check token and account id.
`F0404`|GET: Forecast endpoint not found (or invalid authentication). Check token and account id.*
`F0422`|GET: Error processing Forecast request.
`F0429`|GET: Forecast requests throttled.
`F0500`|GET: Forecast server error.
`F0###`|GET: Other Forecast error.
`ERROR`|Unhandled error. Details available in DevTools.

\* The API has a bug where if authentication fails, it will sometimes respond
with a `404` instead of a `401`/`403`.

### Development Debugging

You can debug error messages further by enabling DevTools.

On macOS, you will first need to run the following command line in the Terminal:

```sh
defaults write com.elgato.StreamDeck html_remote_debugging_enabled -bool YESCopy
```

On Windows, you will need to add a `DWORD` `html_remote_debugging_enabled` with value `1` in the registry at `HKEY_CURRENT_USER\Software\Elgato Systems GmbH\StreamDeckCopy`.

After you relaunch the Stream Deck app, you can open http://localhost:23654/ in Chrome, where you will find a list of ‘Inspectable pages‘ (plugins). Click `me.reinii.harvest-billables`. Error message details may be available in the console.
