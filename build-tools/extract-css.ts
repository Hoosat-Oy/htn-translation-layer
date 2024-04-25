import fs from 'fs';
import path from 'path';

/**
 * Extracts CSS content from all CSS files within a given directory and its subdirectories.
 *
 * @param {string} directoryPath - The path of the directory to traverse for CSS files.
 * @returns {string} The combined CSS content from all CSS files found in the directory and its subdirectories.
 */
export const extractCssFrom = (directoryPath: string): string => {
  const cssContentArray: string[] = [];
  /**
   * Traverses a directory and its subdirectories to find and extract CSS content from CSS files.
   *
   * @param {string} currentPath - The current path being traversed.
   * @returns {void}
   */
  const traverseDirectory = (currentPath: string): void => {
    if (currentPath === undefined) {
      return;
    }
    const directoryContents = fs.readdirSync(currentPath).sort((a, b) => {
      const aContainsHoosatUI = a.includes("HoosatUI");
      const bContainsHoosatUI = b.includes("HoosatUI");
      if (aContainsHoosatUI && !bContainsHoosatUI) {
        return -1;
      } else if (!aContainsHoosatUI && bContainsHoosatUI) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });
    for (const item of directoryContents) {
      const itemPath = path.join(currentPath, item);
      const itemStat = fs.statSync(itemPath);
      if (itemStat.isDirectory()) {
        traverseDirectory(itemPath);
      } else if (itemStat.isFile() && path.extname(item) === '.css') {
        const cssContent = fs.readFileSync(itemPath, 'utf-8');
        const cleanedContent = cssContent.replace(/@import[^;]+;/g, '');
        cssContentArray.push(cleanedContent);
      }
    }
  };
  traverseDirectory(directoryPath);
  return cssContentArray.join('\n');
};

/**
 * Minifies CSS content.
 *
 * @param {string} cssContent - The CSS content to be minified.
 * @returns {string} The minified CSS content.
 */
const minifyCss = (cssContent: string): string => {
  return cssContent.replace(/\s+/g, ' ').replace(/\/\*.*?\*\//g, '').replace(/(\{|;)\s+/g, '$1').replace(/\s+(\}|;)/g, '$1');
};

/**
 * Extracts CSS content from all CSS files within a given directory and its subdirectories.
 *
 * @param {string} directoryPath - The path of the directory to traverse for CSS files.
 * @param {string} outputPath - The path of the file to write the combined CSS content to.
 * @returns {void}
 */
export const extractCssAndWriteToFile = (directoryPath: string, outputPath: string): void => {
  const combinedCSS = extractCssFrom(directoryPath);
  fs.writeFileSync(outputPath, combinedCSS, 'utf-8');
};

/**
 * Extracts CSS content from all CSS files within a given directory and its subdirectories,
 * and writes the minified content to a file.
 *
 * @param {string} directoryPath - The path of the directory to traverse for CSS files.
 * @param {string} outputPath - The path of the file to write the combined and minified CSS content to.
 * @returns {void}
 */
export const extractAndMinifyCssAndWriteToFile = (directoryPath: string, outputPath: string): void => {
  const minifiedCSS = minifyCss(extractCssFrom(directoryPath));
  fs.writeFileSync(outputPath, minifiedCSS, 'utf-8');
};

const inputDirectory = process.argv[2];
const outputFile = process.argv[3];

if (!inputDirectory || !outputFile) {
  console.error('Usage: node --loader ts-node/esm src/server/core/build/extract-css.ts <inputDirectory> <outputFile>');
  process.exit(1);
}

extractAndMinifyCssAndWriteToFile(inputDirectory, outputFile);
console.log(`css file created, ${outputFile}`);