import { OutputJSONData, seperator } from "./parse-eu4-text-file-to-json.js";
import { valueOrNestedValueIsNestedValue, valueOrNestedValueIsNestedValueArray, valueOrNestedValueIsString, valueOrNestedValueIsStringArray } from "./value-or-nested-value.js";

interface WriteValueToOutputJSONDataInput {
  currentKeyToPushTo: string;
  valueToPush: string | string[] | {}
  outputJSONData: OutputJSONData;
}

export const writeValueToOutputJSONData = (
  input: WriteValueToOutputJSONDataInput
): OutputJSONData => {
  const { valueToPush } = input;

  const splitKey = input.currentKeyToPushTo.split(seperator);

  if(splitKey.length === 1) {
    const key = splitKey[0];
    const currentArrayValueForKey = input.outputJSONData?.[key];

    if(
      valueOrNestedValueIsString(valueToPush) &&
      valueOrNestedValueIsString(currentArrayValueForKey)
    ) {
      return {
        ...input.outputJSONData,
        [key]: [
          currentArrayValueForKey,
          valueToPush
        ]
      };
    }

    if(
      valueOrNestedValueIsString(valueToPush) &&
      valueOrNestedValueIsStringArray(currentArrayValueForKey)
    ) {
      return {
        ...input.outputJSONData,
        [key]: [
          ...currentArrayValueForKey,
          valueToPush
        ]
      };
    }

    if(
      valueOrNestedValueIsNestedValue(valueToPush)
      && Object.keys(valueToPush).length === 0
      && currentArrayValueForKey !== undefined
      && valueOrNestedValueIsNestedValue(currentArrayValueForKey)
    ) {
      return {
        ...input.outputJSONData,
        [key]: [
          currentArrayValueForKey,
          valueToPush
        ]
      }
    }

    if(
      valueOrNestedValueIsNestedValue(valueToPush)
      && Object.keys(valueToPush).length === 0
      && currentArrayValueForKey !== undefined
      && valueOrNestedValueIsNestedValueArray(currentArrayValueForKey)
    ) {
      return {
        ...input.outputJSONData,
        [key]: [
          ...currentArrayValueForKey,
          valueToPush
        ]
      }
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

    if(
      valueOrNestedValueIsStringArray(currentArrayValueForKey) && 
      valueOrNestedValueIsNestedValue(valueToPush) &&
      Object.keys(valueToPush).length === 0
    ) {
      return input.outputJSONData;
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

    throw new Error(`Error writing key value pair. Key:"${key}", value:"${valueToPush.toString().slice(0,50)}"`);
  }

  const lowestValueKey = splitKey[0];
  const otherKeys = splitKey.slice(1);

  const valueForLowestValueKey = input.outputJSONData?.[lowestValueKey]

  if(valueOrNestedValueIsNestedValueArray(valueForLowestValueKey)) {
    return {
      ...input.outputJSONData,
      [lowestValueKey]: [
        ...valueForLowestValueKey.slice(0, -1),
        writeValueToOutputJSONData({
          outputJSONData: valueForLowestValueKey.at(-1) ?? {},
          currentKeyToPushTo: otherKeys.join('.'),
          valueToPush
        })
      ]
    }
  }

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