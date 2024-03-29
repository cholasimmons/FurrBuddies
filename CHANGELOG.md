[Furr Buddies](https://buddies.simmons.studio)
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [`0.8.1`] - 2023-06-25

### Added

- Included [@carbon/charts-svelte [1.8.0]]() & `D3 [7.8.3]` to manage chart data.

- Included [@vincjo/datatables [1.10.4]](https://github.com/vincjo/datatables) for more customizable tables.
- "Date of Birth", "Color", and "Special Remarks" to Buddy profile
- Buddy's age now shows in years and months.
- Smoother loading animation for Buddy's profile.
- "Sort" button for data tables, to filter their data.
- Added working hours to Vet business page
- Clinic details page now shows only the available working hours, "from" and "to" in 24hrs format.

### Fixed

- "Report a Bug" link in avatar menu (#1).

- User Profile edit details form. Now allows a wider clickable area to upload an image.

- Fixed Vet Application form, now needs integration with payment platform.

### Changed

- Upgraded to Svelte 4.0

- Switched to separate database for all things Veterinarian.

- Buddy attributes changed in case (uppercase to titlecase)

- Upgrade dependencies: SkeletonUI 1.8.0 (from 1.7.1).
- Submitting new User Details auto-refreshes the displayed data.
- Minor UI tweaks to `/mail`.
- `/pets` has a new magnifying glass effect on hover of the buddies.
- Buddies' default avatar when no image is available is the app's "FurrPrints" icon.
- Using `@vincjo/datatables` for buddy grooming table.
- Clinic Business Page tweaked to show more data

### Security

- Verification page ensure's User is logged in before accessing page and verification data is available before proceeding.