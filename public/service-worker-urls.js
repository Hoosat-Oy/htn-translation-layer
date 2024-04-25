import { readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto'


const baseDirectory = process.argv[2] || 'build/public';
const outputFile = `${baseDirectory}/service-worker-urls.js`;

function walkSync(directory, filelist = []) {
  readdirSync(directory).forEach((file) => {
    const fullPath = join(directory, file);

    if (statSync(fullPath).isDirectory()) {
      walkSync(fullPath, filelist);
    } else {
      filelist.push(fullPath.replace(baseDirectory + '/', ''));
    }
  });

  return filelist;
}

const files = walkSync(baseDirectory);
files.push("/");

const generateNonce = () => {
  const randomValue = crypto.randomBytes(16);
  const nonce = crypto.createHash('sha256').update(randomValue).digest('base64');
  return nonce;
};

let nonce = "";
try {
  nonce = generateNonce().trim();
} catch (err) {
  console.error(`Error generating nonce on build: ${err.message}`);
  throw err;
}

const content = `
  const urlsToCache = ${JSON.stringify(files)};
  self.urlsToCache = urlsToCache;
  const nonce = "${nonce}";
  self.nonce = nonce;
`;

writeFileSync(outputFile, content);

console.log(`Generated ${outputFile} with ${files.length} URLs.`);
