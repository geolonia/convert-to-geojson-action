const core = require('@actions/core');
const { excel2csv } = require('./excel2csv');
const { writeFile } = require('fs/promises');
const klaw = require('klaw');
const { basename, dirname, join } = require('path');
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
}

main();
