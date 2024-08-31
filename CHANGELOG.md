# Changelog

## Version 0.1.0 - August 28th 2024

- Created first version of the library.
- Added `parseEu4TextFileToJson` which takes a text file in the general format that EU4 text files are formatted and converts it to JSON for easier use.

## Version 0.1.1 - August 30th 2024

- Supported lines in the form `property_name = { ... }`. For example, `tree = { 3 4 7 10 }` parses to `"tree": ["3","4","7","10"]`
