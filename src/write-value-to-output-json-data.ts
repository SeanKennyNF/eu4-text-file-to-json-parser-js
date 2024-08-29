import { OutputJSONData } from "./parse-eu4-text-file-to-json.js";
import { valueOrNestedValueIsNestedValue, valueOrNestedValueIsStringArray } from "./value-or-nested-value.js";

interface WriteValueToOutputJSONDataInput {
  currentKeyToPushTo: string;
  valueToPush: string | string[] | {}
  outputJSONData: OutputJSONData;
}

export const writeValueToOutputJSONData = (
  input: WriteValueToOutputJSONDataInput
): OutputJSONData => {
  const { valueToPush } = input;

  const splitKey = input.currentKeyToPushTo.split('.');

  if(splitKey.length === 1) {
    const key = splitKey[0];
    const currentArrayValueForKey = input.outputJSONData?.[key];

    if(
      valueOrNestedValueIsNestedValue(valueToPush)
      && Object.keys(valueToPush).length === 0
      && currentArrayValueForKey !== undefined
    ) {
      return input.outputJSONData;
    }

    if( currentArrayValueForKey === undefined || (
      valueOrNestedValueIsNestedValue(currentArrayValueForKey)
      && Object.keys(currentArrayValueForKey).length === 0
    )) {
      return {
        ...input.outputJSONData,
        [key]: valueToPush
      };
    }

    if(valueOrNestedValueIsStringArray(currentArrayValueForKey)) {
      if(!valueOrNestedValueIsStringArray(valueToPush)) {
        throw new Error(`Attempted to concatenate non-array value to array. key=${key}`);
      }

      return {
        ...input.outputJSONData,
        [key]: [ ...currentArrayValueForKey, ...valueToPush ]
      };
    }

    throw new Error('');
  }

  const lowestValueKey = splitKey[0];
  const otherKeys = splitKey.slice(1);

  const valueForLowestValueKey = input.outputJSONData?.[lowestValueKey]

  if(!valueOrNestedValueIsNestedValue(valueForLowestValueKey)) {
    throw new Error(`Cannot mix JSON values with string and string array values on the same key. Key: ${input.currentKeyToPushTo}`);
  }

  return {
    ...input.outputJSONData,
    [lowestValueKey]: writeValueToOutputJSONData({
      outputJSONData: valueForLowestValueKey,
      currentKeyToPushTo: otherKeys.join('.'),
      valueToPush
    })
  }
}