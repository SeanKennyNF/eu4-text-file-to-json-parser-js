import { readFile } from "fs/promises";
import { writeValueToOutputJSONData } from "./write-value-to-output-json-data.js";
import { ValueOrNestedValue } from "./value-or-nested-value.js";

interface ParseEu4TextFileToJsonInput {
  inputFilePath: string;
}

interface ParseEu4TextFileToJsonOutput {
  outputJSONData: OutputJSONData;
}

export type OutputJSONData = Record<string, ValueOrNestedValue<string>>;

export const parseEu4TextFileToJson = async(
  input: ParseEu4TextFileToJsonInput
): Promise<ParseEu4TextFileToJsonOutput> => {
  const rawFileData = await readFile(input.inputFilePath, { encoding: 'utf-8' });
  const rawFileRows = rawFileData.split('\n');

  let outputJSONData: OutputJSONData = {};
  let currentKeyToPushTo = '';
  let currentIndexInRawFileRows = 0;

  for(const rawFileRow of rawFileRows) {
    const cleanedRow = rawFileRow
      .trim()
      .replaceAll(/#.*$/g, '')
      .trim();

    if(!cleanedRow) {
      //Do nothing, this is either an empty line or was a comment before our cleaning.
    } else if(/^([a-zA-Z0-9_])+(\ )*=(\ )*{$/.test(cleanedRow)) {
      // This is in the format "property_name = {"
      const splitCleanedRow = cleanedRow.split('=').map((element) => element.trim());
      const propertyName = splitCleanedRow[0];
      currentKeyToPushTo = `${currentKeyToPushTo}${currentKeyToPushTo.length > 0 ? '.' : ''}${propertyName}`;

      outputJSONData = writeValueToOutputJSONData({
        outputJSONData,
        currentKeyToPushTo,
        valueToPush: {}
      })
    } else if(/^}$/.test(cleanedRow)) {
      // This is a closing brace
      if(currentKeyToPushTo === '') {
        throw new Error('Error parsing EU4 text file to JSON. ')
      }
      currentKeyToPushTo = currentKeyToPushTo
        .split('.')
        .slice(0, -1)
        .join('.');
    } else if(/^([a-zA-Z0-9_])+(\ )*=(\ )*([a-zA-Z0-9_."])+$/.test(cleanedRow)) {
      // This is in the format "property_name = value"
      const splitCleanedRow = cleanedRow.split('=').map((element) => element.trim());
      const propertyName = splitCleanedRow[0];
      const value = splitCleanedRow[1];
      
      outputJSONData = writeValueToOutputJSONData({
        outputJSONData,
        currentKeyToPushTo: propertyName,
        valueToPush: value
      })
    } else {
      // If we reached this point, it means that we should be inside an array and this value represents a value inside that array.
      const arrayValues = cleanedRow
        .split(' ')
        .map((element) => element.trim());

      outputJSONData = writeValueToOutputJSONData({
        outputJSONData,
        currentKeyToPushTo,
        valueToPush: arrayValues
      });
    }

    currentIndexInRawFileRows++;
  }

  return {
    outputJSONData
  }
}