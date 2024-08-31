export type ValueOrNestedValue<T> = string | string[] | { [key: string]: ValueOrNestedValue<T> };

export const valueOrNestedValueIsString = <T>(
  input: ValueOrNestedValue<T>
): input is string => typeof input === 'string';
export const valueOrNestedValueIsStringArray = <T>(
  input: ValueOrNestedValue<T>
): input is string[] => Array.isArray(input);
export const valueOrNestedValueIsNestedValue = <T>(
  input: ValueOrNestedValue<T>
): input is { [key: string]: ValueOrNestedValue<T> } => !valueOrNestedValueIsString(input) && !valueOrNestedValueIsStringArray(input);