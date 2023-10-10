const { excelToGeoJson } = require('../excel2geojson');
const fs = require('fs');
const expectedExcel = fs.readFileSync('./tests/fixtures/expected/excel-example.json', 'utf-8');
const expectedCSV = fs.readFileSync('./tests/fixtures/expected/example.json', 'utf-8');


describe('excelToGeoJson function', () => {

  afterEach(() => {
    if (fs.existsSync('./tests/fixtures/excel-example.json')) {
      fs.unlinkSync('./tests/fixtures/excel-example.json');
    }

    if (fs.existsSync('./tests/fixtures/example.json')) {
      fs.unlinkSync('./tests/fixtures/example.json');
    }
  });

  it('convert excel to geojson', async () => {

    await excelToGeoJson('./tests/fixtures');

    const actualExcel = fs.readFileSync('./tests/fixtures/excel-example.json', 'utf-8');
    expect(expectedExcel).toEqual(actualExcel);

    const actualCSV = fs.readFileSync('./tests/fixtures/example.json', 'utf-8');
    expect(expectedCSV).toEqual(actualCSV);

  });
});

