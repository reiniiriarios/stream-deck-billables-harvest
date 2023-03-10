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
`H0001`|Error response when fetching data from Harvest.
`H0###`|Error fetching data from Harvest.
`H1001`|Error response when posting data to Harvest.
`H1###`|Error posting data to Harvest.
`H2001`|Error response when patching data on Harvest.
`H2###`|Error patching data on Harvest.
`H5001`|Error creating time entry.
`H5002`|Error restarting time entry.
`H5003`|Error stopping time entry.
`F0###`|Error fetching data from Forecast.
`F0002`|Error response from Forecast.
`F0003`|No projects found in Forecast. In order for billable hours to display, there must be projects in Forecast that you are assigned to.
`ERROR`|Unhandled error. Details available in DevTools.

In all of the above messages, `###` refers to an HTTP response code.
The API has a bug where if authentication fails, it will sometimes respond
with a `404` instead of a `401`/`403`.

### Development

You can access DevTools by visiting [chrome://inspect](chrome://inspect) in Chrome, and clicking on `me.reinii.harvest-billables`. Further error message details may be available in the console.
