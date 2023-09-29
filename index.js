const core = require('@actions/core');
const { excel2csv } = require('./excel2csv');
const { writeFile } = require('fs/promises');
const klaw = require('klaw');
const { basename, dirname, join } = require('path');
const csv2geojson = require('csv2geojson');
const inputDir = core.getInput('input_dir');

const main = async () => {
  const promises = [];

  const workspace = process.env.GITHUB_WORKSPACE;

  for await (const file of klaw(join(workspace, inputDir), { depthLimit: -1 })) {

    if (file.path.endsWith(".xlsx")) {
      const excelPath = file.path;
      const csvPath = join(dirname(excelPath), `${basename(excelPath, ".xlsx")}.csv`);

      promises.push((async () => {
        try {
          const csv = await excel2csv(excelPath);
          await writeFile(csvPath, csv);
        } catch (err) {

          core.setFailed(`Error: Excel ファイル ${excelPath} を CSV に変換できませんでした。`);

          if (err.message === "FILE_ENDED") {
            core.setFailed("データが空になっているか、Excel ファイルが破損している可能性があります。");
          }

          throw err;
        }
      })());
    }
  }

  await Promise.all(promises);


  // inputDir ディレクトリにある 全ての csv ファイルを、geojson に変換する
  const geojsons = [];

  for await (const file of klaw(join(workspace, inputDir), { depthLimit: -1 })) {

    if (file.path.endsWith(".csv")) {
      const csvPath = file.path;
      const geojsonPath = join(dirname(csvPath), `${basename(csvPath, ".csv")}.geojson`);

      promises.push((async () => {
        try {
          const geojson = await csv2geojson.csv2geojson(csvPath);
          await writeFile(geojsonPath, JSON.stringify(geojson));
          geojsons.push(geojson);
        } catch (err) {
          core.setFailed(`Error: CSV ファイル ${csvPath} を GeoJSON に変換できませんでした。`);
          throw err;
        }
      })());
    }
  }
}

main();
