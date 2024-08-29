import { expect, test } from 'vitest'
import path from 'path';
import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import { parseEu4TextFileToJson } from '../src';

const testCases = [{
  inputFilename: 'area.txt',
  artifactFilename: 'area-output.json',
  expectedOutputFilename: 'area-expected-output.json'
}, {
  inputFilename: 'region.txt',
  artifactFilename: 'region-output.json',
  expectedOutputFilename: 'region-expected-output.json'
}, {
  inputFilename: 'trade-winds.txt',
  artifactFilename: 'trade-winds-output.json',
  expectedOutputFilename: 'trade-winds-expected-output.json'
}];

test.each(testCases)('parseEu4TextFileToJson should produce the right input for $inputFilename', async({
  inputFilename,
  artifactFilename,
  expectedOutputFilename
}) => {
  const input = {
    inputFilePath: path.join(
      __dirname,
      'sample-inputs',
      inputFilename
    )
  }

  const output = await parseEu4TextFileToJson(input);

  const pathToExpectedOutputJSONFile = path.join(
    __dirname,
    'expected-outputs',
    expectedOutputFilename
  );
  const expectedOutput = {
    outputJSONData: JSON.parse(readFileSync(pathToExpectedOutputJSONFile).toString())
  }

  const pathToWriteArtifactTo = path.join(
    __dirname,
    'artifacts',
    artifactFilename
  );

  await writeFile(pathToWriteArtifactTo, JSON.stringify(output.outputJSONData), 'utf8');

  expect(output.outputJSONData).toStrictEqual(expectedOutput.outputJSONData);
})