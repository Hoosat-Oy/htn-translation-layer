import fs from 'fs';
import path from 'path';

/**
 * Removes specified file extensions from a directory.
 *
 * @param {string} directoryPath - The path of the directory to remove files from.
 * @param {string[]} extensionsToRemove - Array of file extensions to be removed.
 * @returns {void}
 */
const removeFilesByExtension = (directoryPath: string, extensionsToRemove: string[]): void => {
  const directoryContents = fs.readdirSync(directoryPath);

  for (const item of directoryContents) {
    const itemPath = path.join(directoryPath, item);
    const itemStat = fs.statSync(itemPath);

    if (itemStat.isFile() && extensionsToRemove.some(extension => path.extname(item).toLowerCase() === extension.toLowerCase())) {
      fs.unlinkSync(itemPath); // Remove files with specified extensions
    }
  }
};


const [, , directoryPath, ...fileExtensions] = process.argv;

if (!directoryPath || fileExtensions.length === 0) {
  console.error('Usage: node remove-files.js <directoryPath> <extension1> [<extension2> ...]');
  process.exit(1);
}

if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
  console.error(`Error: The specified directory "${directoryPath}" does not exist.`);
  process.exit(1);
}

removeFilesByExtension(directoryPath, fileExtensions);
console.log(`Removed ${fileExtensions.join(', ')} files from ${directoryPath}`);
