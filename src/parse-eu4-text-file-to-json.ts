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

// All that really matters is that this value isn't used anywhere in the text file, we're treating it as a special character
export const seperator = 'ЖЖЖЖЖЖЖЖЖЖ'

export const parseEu4TextFileToJson = async(
  input: ParseEu4TextFileToJsonInput
): Promise<ParseEu4TextFileToJsonOutput> => {
  const rawFileData = await readFile(input.inputFilePath, { encoding: 'utf-8' });
  const rawFileRows = rawFileData.split('\n');

  let stringsForJson: string[] = [];

  for(const rawFileRow of rawFileRows) {
    const cleanedRow = rawFileRow
      .replaceAll(/\t/g, ' ')
      .trim()
      .replaceAll(/#.*$/g, '')
      .trim();
    
    const newDataPoints = cleanedRow.split(' ')

    stringsForJson = [
      ...stringsForJson,
      ...newDataPoints
    ];
  }

  const cleanedStringsForJson = stringsForJson
    .filter((dataPoint) => !!dataPoint)
    .flatMap((dataPoint) => {
      if(dataPoint === '={')
        return ['=', '{'];

      return [ dataPoint ];
    })
    .map((dataPoint) => ['{', '}', '='].includes(dataPoint) ? dataPoint : `"${dataPoint}"`)
    .map((dataPoint) => dataPoint !== '=' ? dataPoint : ':')
    .map((dataPoint, index, array) => {
      if(dataPoint === '{') {
        if(index >= array.length - 2) {
          return dataPoint
        }

        const nextElement = array[index + 1];
        const elementAfterNext = array[index + 2];

        if(/^"(.)*"$/.test(nextElement) && (/^"(.)*"$/.test(elementAfterNext))) {
          return '['
        }

        if(/^"(.)*"$/.test(nextElement) && elementAfterNext === '}') {
          return '['
        }

        return dataPoint;
      }

      if(dataPoint === '}') {
        if(index <= 2) {
          return dataPoint
        }

        const previousElement = array[index - 1];
        const elementBeforePrevious = array[index - 2];

        if(/^"(.)*"$/.test(previousElement) && (/^"(.)*"$/.test(elementBeforePrevious))) {
          return ']'
        }

        if(/^"(.)*"$/.test(previousElement) && elementBeforePrevious === '{') {
          return ']'
        }

        return dataPoint;
      }

      return dataPoint;
    })
    .filter((dataPoint) => !!dataPoint)
    .map((dataPoint, index, array) => {
      if(index === array.length - 1) {
        return dataPoint
      }

      const nextElement = array[index + 1];

      if(/^"(.)*"$/.test(dataPoint) && /^"(.)*"$/.test(nextElement)) {
        return `${dataPoint},`
      }

      if(dataPoint === '}' && /^"(.)*"$/.test(nextElement)) {
        return '},'
      }

      if(dataPoint === ']' && /^"(.)*"$/.test(nextElement)) {
        return '],'
      }

      return dataPoint;
    });

  const jsonString = `{${cleanedStringsForJson.join('')}}`;

  return {
    outputJSONData: JSON.parse(jsonString)
  }
}