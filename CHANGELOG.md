# Changelog

## Version 0.1.0 - August 28th 2024

- Created first version of the library.
- Added `parseEu4TextFileToJson` which takes a text file in the general format that EU4 text files are formatted and converts it to JSON for easier use.

## Version 0.1.1 - August 30th 2024

- Supported lines in the form `property_name = { ... }`. For example, `tree = { 3 4 7 10 }` parses to `"tree": ["3","4","7","10"]`
- Small improvement to an error message.

## Version 0.1.2 - August 31st 2024

- Improved handling for values which are two words. For example, `ship_names = { Advantage "Golden Lion" }` now parses to `"ship_names": ["Advantage", "Golden Lion"]` instead of `"ship_names": ["Advantage", "\"Golden", "Lion\""]`
- Fixed bugs where double spaces would save `""` entries in arrays.

## Version 0.1.3 - August 31st 2024

- Supported `"`, `.`, `\`, ` `, and `'` as valid characters in field values.
- Fixed a bug which would cause some values such as `rivers = "rivers.bmp"` to parse to `"rivers": "\"rivers.bmp\""` instead of `"rivers": "rivers.bmp"`