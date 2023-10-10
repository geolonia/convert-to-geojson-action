
const core = require('@actions/core');
const { ConversionError } = require('./error');
const { excelToGeoJson } = require('./excel2geojson');
const { join } = require('path');
const workspace = process.env.GITHUB_WORKSPACE;
const inputDir = join(workspace, core.getInput('input_dir'))

try {
  excelToGeoJson(inputDir);
} catch (err) {
  if (err instanceof ConversionError) {
    switch (err.conversionType) {
      case "excelToGeoJson":
        core.setFailed(`Error: Excel ファイル ${err.filePath} を GeoJSON に変換できませんでした。`);
        break;
      case "fileEnded":
        core.setFailed("データが空になっているか、Excel ファイルが破損している可能性があります。");
        break;
      case "csvToGeoJson":
        core.setFailed(`Error: CSV データ ${err.filePath} を GeoJSON に変換できませんでした。`);
        break;
      default:
        core.setFailed(err.message);
    }
  } else {
    core.setFailed(err.message);
  }
}
