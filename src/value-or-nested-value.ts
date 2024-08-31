export type ValueOrNestedValue<T> = string | string[] | { [key: string]: ValueOrNestedValue<T> } | ValueOrNestedValue<T>[];

export const valueOrNestedValueIsString = <T>(
  input: ValueOrNestedValue<T>
): input is string => typeof input === 'string';
export const valueOrNestedValueIsStringArray = <T>(
  input: ValueOrNestedValue<T>
): input is string[] => Array.isArray(input) && input.every((element) => typeof element === 'string');
export const valueOrNestedValueIsNestedValueArray = <T>(
  input: ValueOrNestedValue<T>
): input is ValueOrNestedValue<T>[] => Array.isArray(input) && input.every((element) => typeof element !== 'string');
export const valueOrNestedValueIsNestedValue = <T>(
  input: ValueOrNestedValue<T>
): input is { [key: string]: ValueOrNestedValue<T> } => {
  return (
    !valueOrNestedValueIsString(input)
    && !valueOrNestedValueIsStringArray(input)
    && !valueOrNestedValueIsNestedValueArray(input)
  );
}