import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssNested from 'postcss-nested';
import cssnano from 'cssnano';

const fileName = 'styles.css';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class {
  async data() {
    const rawFilepath = path.join(__dirname, `../_includes/postcss/${fileName}`);
    const rawCss = await fs.readFile(rawFilepath, 'utf-8');
    return {
      permalink: `css/${fileName}`,
      rawFilepath,
      rawCss,
    };
  }

  async render({ rawCss, rawFilepath }) {
    const result = await postcss([postcssImport, postcssMixins, postcssNested, cssnano]).process(
      rawCss,
      { from: rawFilepath }
    );
    return result.css;
  }
}
