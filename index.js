
const core = require('@actions/core');
const { excel2csv } = require('./excel2csv');
const { writeFile, readFile } = require('fs/promises');
const klaw = require('klaw');
const { join } = require('path');
const csv2geojson = require('csv2geojson');
const inputDir = core.getInput('input_dir');

const main = async () => {
  const promises = [];

  const workspace = process.env.GITHUB_WORKSPACE;

  for await (const file of klaw(join(workspace, inputDir), { depthLimit: -1 })) {
    let csvData;

    if (file.path.endsWith(".xlsx")) {
      const excelPath = file.path;
      try {
        csvData = await excel2csv(excelPath);
      } catch (err) {
        core.setFailed(`Error: Excel ファイル ${excelPath} を GeoJSON に変換できませんでした。`);
        if (err.message === "FILE_ENDED") {
          core.setFailed("データが空になっているか、Excel ファイルが破損している可能性があります。");
        }
        throw err;
      }
    } else if (file.path.endsWith(".csv")) {
      csvData = await readFile(file.path, 'utf-8');
    }

    if (csvData) {
      const geoJsonPath = file.path.replace(/.csv$|.xlsx$/, '.geojson');
      try {
        const geojson = csv2geojson.csv2geojson(csvData, {
          latfield: 'lat',
          lonfield: 'lng',
          delimiter: ','
        });
        await writeFile(geoJsonPath, JSON.stringify(geojson));
      } catch (err) {
        core.setFailed(`Error: CSV データ ${file.path} を GeoJSON に変換できませんでした。`);
        throw err;
      }
    }
  }

  await Promise.all(promises);
}

main();
