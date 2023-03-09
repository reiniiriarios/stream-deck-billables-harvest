# Harvest Billables for Stream Deck

![](docs/icons.png)

This [Stream Deck][stream-deck] plugin fetches data from [Harvest][harvest] and [Forecast][forecast]
to let you know how much more billable time you have left for the day.

## Getting Started

This plugin is not yet in the Stream Deck app.

**[:arrow_down: Download Latest Release](https://github.com/reiniiriarios/stream-deck-billables-harvest/releases/download/v0.1/release-v0.1.zip)**

To install, copy the `me.reinii.harvest-billables.sdPlugin` directory to
`~/Library/Application Support/com.elgato.StreamDeck/Plugins/` on macOS or
`%appdata%\Elgato\StreamDeck\Plugins\` on Windows.

### Generate API Credentials

You'll need to generate an API token in [Harvest][harvest-api] as well
as finding your Harvest Account ID and Forecast Account ID. Both your Harvest and Forecast IDs
can be found under the API token details after [creating it][harvest-api]. These two additional
ids are necessary as they refer to your organization and not your user account.

[stream-deck]: https://www.elgato.com/en/welcome-to-stream-deck
[harvest]: https://www.getharvest.com/
[forecast]: https://www.getharvest.com/forecast
[harvest-api]: https://id.getharvest.com/developers
