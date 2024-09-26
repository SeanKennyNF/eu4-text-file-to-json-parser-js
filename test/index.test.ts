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
}, {
  inputFilename: 'climate.txt',
  artifactFilename: 'climate-output.json',
  expectedOutputFilename: 'climate-expected-output.json'
}, {
  inputFilename: 'default-map.txt',
  artifactFilename: 'default-map-output.json',
  expectedOutputFilename: 'default-map-expected-output.json'
}, {
  inputFilename: 'ovdal-lodhum.txt',
  artifactFilename: 'ovdal-lodhum-output.json',
  expectedOutputFilename: 'ovdal-lodhum-expected-output.json'
}, {
  inputFilename: 'anb-countries.txt',
  artifactFilename: 'anb-countries-output.json',
  expectedOutputFilename: 'anb-countries-expected-output.json'
}, {
  inputFilename: '7024-ghulapriah.txt',
  artifactFilename: '7024-ghulapriah-output.json',
  expectedOutputFilename: '7024-ghulapriah-expected-output.json'
}, {
  inputFilename: '4465-khadisrapur.txt',
  artifactFilename: '4465-khadisrapur-output.json',
  expectedOutputFilename: '4465-khadisrapur-expected-output.json'
}, {
  inputFilename: '4570-prukakhin.txt',
  artifactFilename: '4570-prukakhin-output.json',
  expectedOutputFilename: '4570-prukakhin-expected-output.json'
}, {
  inputFilename: '170-haighpeck.txt',
  artifactFilename: '170-haighpeck-output.json',
  expectedOutputFilename: '170-haighpeck-expected-output.json'
}, {
  inputFilename: 'obrtrol-ideas.txt',
  artifactFilename: 'obrtrol-ideas-output.json',
  expectedOutputFilename: 'obrtrol-ideas-expected-output.json'
}, {
  inputFilename: 'boek-ideas.txt',
  artifactFilename: 'boek-ideas-output.json',
  expectedOutputFilename: 'boek-ideas-expected-output.json'
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