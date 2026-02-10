# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added settings normalization helpers to guarantee stable defaults for Stream Deck action settings.
- Added a new optional `Forecast API Token` field in the `Billables Status` action.
- Added automated tests for:
  - settings normalization behavior
  - Harvest date query format for time-entry lookups
  - Harvest `H0400` fallback behavior in total time lookups

### Changed

- Reworked action update scheduling to:
  - avoid duplicate intervals
  - restart intervals when settings change
  - clean up intervals when actions disappear
- Updated Forecast integration to support modern and legacy API endpoints with header fallbacks.
- Updated Forecast web links to `app.forecast.it`.
- Improved `Timer` property inspector behavior so task options refresh reliably when credentials change.
- Improved error handling for Harvest API requests by including response body details in `H0xxx/H1xxx/H2xxx` errors.
- Standardized Harvest `User-Agent` format across GET/POST/PATCH requests.

### Fixed

- Fixed pie chart completion math in status rendering.
- Fixed accidental form submit behavior in property inspector `How To` buttons.
- Fixed `Timer Total` `H0400` failures by:
  - using `YYYY-MM-DD` date parameters for Harvest `time_entries` queries
  - applying compatibility fallback strategies when Harvest rejects range requests
  - filtering fallback results to the current user to avoid cross-user totals
