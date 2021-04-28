const _ = require('lodash');
const translate = require('@vitalets/google-translate-api');

const translateValue = async ({ value, lang }) => {
  const { text } = await translate(value, { to: lang });

  return text;
};

const getObjMapPromises = ({ nestedMap, lang }) => {
  const nodes = [{ node: nestedMap, path: [] }];
  let promises = [];
  while (nodes.length) {
    const currentNode = nodes.pop();
    Object.entries(currentNode.node).forEach(([k, v]) => {
      if (v && typeof v === 'object') {
        nodes.push({
          node: v,
          path: currentNode.path.concat(k),
        });
      } else {
        promises.push(
          new Promise(async (resolve) => {
            resolve({
              originText: v,
              translate: await translateValue({ value: v, lang }),
              path: currentNode.path.concat(k).join('.'),
            });
          }),
        );
      }
    });
  }

  return promises;
};

const getPropAndTranslateValue = async ({ obj, lang }) => {
  const objMap = getObjMapPromises({ nestedMap: obj, lang });

  const resolvingObjMaps = await Promise.all(objMap);

  const reducedResult = resolvingObjMaps.reduce((acc, obj) => {
    _.set(acc, obj.path, obj.translate);

    return acc;
  }, {});

  return reducedResult;
};

module.exports = { getPropAndTranslateValue };
