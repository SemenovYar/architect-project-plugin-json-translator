const { getPropAndTranslateValue } = require('./utils/getPropAndTranslateValue');
const { resolve } = require('path');
const path = require('path');
const fs = require('file-system');

const pathFile = resolve(__dirname, 'ru.json');

const basename = path.basename(pathFile);

const translatedPathFile = pathFile.replace(basename, `translated-${basename}`);

const mainObj = require(pathFile);

const awaitDataAndWriteFile = async () => {
  const content = await getPropAndTranslateValue({ obj: mainObj, lang: 'en' });

  if (!content) {
    return;
  }

  fs.writeFileSync(translatedPathFile, JSON.stringify(content, null, '  '));

  console.log(`File ${path.basename(translatedPathFile)} was created!`);
};

awaitDataAndWriteFile();
