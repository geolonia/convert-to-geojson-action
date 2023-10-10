
const { excelToGeoJson } = require('../excel2geojson');
const fs = require('fs');


describe('excelToGeoJson function', () => {

  it('convert excel to geojson', async () => {

    await excelToGeoJson('./tests/fixtures');

    const expectedExcel = fs.readFileSync('./tests/fixtures/expected/excel-example.json', 'utf-8');
    const expectedCSV = fs.readFileSync('./tests/fixtures/expected/example.json', 'utf-8');

    const actualExcel = fs.readFileSync('./tests/fixtures/excel-example.json', 'utf-8');
    const actualCSV = fs.readFileSync('./tests/fixtures/example.json', 'utf-8');

    expect(actualExcel).toEqual(expectedExcel);
    expect(actualCSV).toEqual(expectedCSV);
  });

});

