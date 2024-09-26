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

## Version 0.1.4 - August 31st 2024

- Supported multiple assignments to the same string valued property. For example if a file contains a line which is `add_core = I43` and later has the line `add_core = I34`, in the final file, the property in the json file will be `"add_core": ["I43", "I34"]`.

## Version 0.1.5 - September 1st 2024

- Supported nested value array properties. The code below illustrates an example of what that means, the first block is the representation in the text file and the second is the json representation. This obviously impacts the types since values in format `[{"a": "b"}, {"a": "c"}]` were not previously a part of the valid return type but now are.
```
is_city = yes
add_permanent_province_modifier = {
	name = harimari_minority_coexisting_small
	duration = -1
}
add_permanent_province_modifier = {
	name = temple_complex
	duration = -1
}
```

```
{
  "is_city": "yes",
  "add_permanent_province_modifier": [
    { "name": "harimari_minority_coexisting_small", "duration": "-1" },
    { "name": "temple_complex", "duration": "-1" }
  ]
}
```

## Version 0.1.6 - September 1st 2024

- Fixed a bug which would cause nested value array properties to parse incorrectly if there were more than two elements.

## Version 0.1.7 - September 1st 2024

- Fixed a bug which would throw errors when a property name contained a `.` character.

## Version 0.1.8 - September 26th 2024

- Fixed a bug which would throw errors when a property name contained a `-` character.
- Fixed a bug which would cause properties to sometimes parse to `"fieldOne.fieldTwo": "ABC"` instead of `"fieldOne": { "fieldTwo": "ABC" }`.
- Some small, non-breaking dev dependency version bumps.

## Version 0.1.9 - September 26th 2024

- Add support for properties in the form `ABC = { DEF = GHI }`.

## Version 0.1.10 - September 26th 2024

- Fixed a bug which prevented rows containing a `\t` from being parsed properly. The `\t` character is now treated the same as a ` ` character.

## Version 0.1.11 - September 26th 2024

- Fixed accidental publish. Contains actual changes for version 0.1.10

## Version 0.1.12 - September 26th 2024

- Added `'` as a valid character in property names.