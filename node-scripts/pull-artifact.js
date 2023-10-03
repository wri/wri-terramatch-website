//For reference https://developer.atlassian.com/cloud/bitbucket/rest/api-group-downloads/#api-group-downloads

const https = require("https");
const fs = require("fs");
const admZip = require("adm-zip");
require("dotenv").config();

const baseUrl = "https://api.bitbucket.org/2.0/repositories";
const authHeaders = {
  Authorization: `Basic ${process.env.BITBUCKET_ACCESS_TOKEN}`
};
const wriOneEnvironment = process.env.WRI_ONE_ENVIRONMENT;
const workspace = "3sidedcube";
const repo_slug = "wri-restoration-marketplace-website";
const outputDir = "public/v1";

const getDownloadLink = async environment => {
  const url = `${baseUrl}/${workspace}/${repo_slug}/downloads/artifact_${environment}.zip`;

  return new Promise((r, e) => {
    https.get(url, { headers: authHeaders }, res => {
      if (res.statusCode === 302) r(res.headers.location);
      else e(`Artifact not found status: ${res.statusCode}, ${res.statusMessage}`);
    });
  });
};

const downloadFile = (url, fileName) => {
  return new Promise(r => {
    const file = fs.createWriteStream(fileName);
    https.get(url, function (response) {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        r();
      });
    });
  });
};

const unzip = (filepath, target) => {
  try {
    const zip = new admZip(filepath);
    zip.extractAllTo(target);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
};

(async () => {
  const index = process.argv.findIndex(e => e === "-e" || e === "--environment");

  if (index !== -1 || wriOneEnvironment) {
    const env = index !== -1 ? process.argv[index + 1] : wriOneEnvironment;

    if (env) {
      try {
        console.log(`Downloading ${env} artifact`);
        //Fetch download link from bitbucket rest-api
        const downloadLink = await getDownloadLink(env);
        //Download artifact
        await downloadFile(downloadLink, "artifact.zip");
        //Pre clean up
        if (fs.existsSync(outputDir)) fs.rmSync(outputDir, { recursive: true, force: true });
        //Extract zip into public folder
        console.log(`Extracting ${env} artifact`);
        unzip("artifact.zip", "public");
        //Post clean up
        fs.rmSync("artifact.zip");
        //Rename build to v1
        fs.renameSync("public/build", outputDir);
      } catch (e) {
        console.log("error", e);
      }
      return;
    }
  }
  console.log(
    "Please provide environment using `-e` or `--environment`\nPossible options are:\n- development\n- test\n- staging\n- production"
  );
})();
