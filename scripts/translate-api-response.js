/**
 * Author: Kevin Borrill
 * This node script takes the response from a WRI api public endpoint and parses it
 * as a JSON object which can be used in an i18next translation json file
 *
 * Usage: node translation-api-response.js url modelKey valueKey
 * Example: node translate-api-response.js https://test.wrirestorationmarketplace.cubeapis.com/api/countries name code
 *
 * A JSON string is returned to do with as you please.
 */

const https = require("https");
const url = process.argv[2];
const nameKey = process.argv[3];
const valueKey = process.argv[4];

process.on('uncaughtException', function (err) {
    console.log(err);
});

if (!url) {
  throw new Error('Please provide a valid URL');
}

if (!nameKey) {
  throw new Error('Please provide a key for the english translation');
}

if (!valueKey) {
  throw new Error('Please provide a key for the value');
}

const getPayload = async (url) => {
  return await doRequest(url)
}

const doRequest = (url) => {
  return new Promise((resolve) => {
    https.get(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        resolve(JSON.parse(body));
      });
    });
  })
};

const logTranslations = (translations) => {
  console.log(JSON.stringify(translations, null, 2));
};

(async () => {
  const resposne = await getPayload(url);

  let translationObject = {}

  resposne.data.forEach((item) => {
    translationObject[item[valueKey]] = item[nameKey]
  });

  logTranslations(translationObject);
})();
