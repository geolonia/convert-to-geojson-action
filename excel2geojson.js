
const core = require('@actions/core');
const { excel2csv } = require('./excel2csv');
const { writeFile, readFile } = require('fs/promises');
const klaw = require('klaw');
const csv2geojson = require('csv2geojson');
const ConversionError = require('./error');

const excelToGeoJson = async (inputDir) => {
  const promises = [];

  for await (const file of klaw(inputDir, { depthLimit: -1 })) {
    let csvData;

    if (file.path.endsWith(".xlsx")) {
      const excelPath = file.path;
      try {
        csvData = await excel2csv(excelPath);
      } catch (err) {

        if (err.message === "FILE_ENDED") {
          throw new ConversionError("fileEnded", excelPath);
        }
        throw new ConversionError("excelToGeoJson", excelPath);
      }
    } else if (file.path.endsWith(".csv")) {
      csvData = await readFile(file.path, 'utf-8');
    }

    if (csvData) {
      const geoJsonPath = file.path.replace(/.csv$|.xlsx$/, '.json');

      try {

        csv2geojson.csv2geojson(
          csvData,
          {
            latfield: 'lat',
            lonfield: 'lng',
            delimiter: ','
          },
          async (err, geojson) => {
            await writeFile(geoJsonPath, JSON.stringify(geojson));
          });

      } catch (err) {
        throw new ConversionError("csvToGeoJson", file.path);
      }
    }
  }

  await Promise.all(promises);
}

module.exports = { excelToGeoJson };


