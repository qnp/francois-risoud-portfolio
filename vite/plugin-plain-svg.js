import fs from 'fs';
import SVGO from 'svgo';
import { SourceMapGenerator } from 'source-map';

const defaults = {
  encoding: 'utf8',
  optimize: false,
  svgoConfig: {},
};

/**
 * Plugin factory function
 * @param {object} config - The plugin configuration object
 * @param {string} config.encoding - The file encoding (default `"utf8"`)
 * @param {boolean} config.optimize - Optimize svg using SVGO (default `false`)
 * @param {object} config.svgoConfig - The SVGO configuration (default `{}`)
 * @return {object} The plugin
 */
export default function (config = {}) {
  const root = process.cwd().replace(/\\/g, '/');
  const svgRegex = /\.svg$/;
  const options = Object.assign({}, defaults, config);
  const svgo = new SVGO(options.svgoConfig);
  return {
    name: 'plain-svg',
    async transform(code, id) {
      const isSvg = svgRegex.test(id);
      if (isSvg) {
        const filename = id.replace(/\\/g, '/');
        const map = new SourceMapGenerator({
          file: filename,
          sourceRoot: root,
        });
        map.setSourceContent(filename, code);
        map.addMapping({
          source: filename,
          original: { line: 1, column: 1 },
          generated: { line: 1, column: 1 },
        });
        let svgSource = fs.readFileSync(id, options.encoding);
        if (options.optimize) {
          const optimized = await svgo.optimize(svgSource, { path: id });
          svgSource = optimized.data;
        }
        return {
          code: 'export default ' + JSON.stringify(svgSource),
          map: JSON.parse(map.toString()),
        };
      }
    },
    async generateBundle(_, bundle) {
      for (const file in bundle) {
        const isSvg = svgRegex.test(file);
        if (isSvg) {
          const chunk = bundle[file];
          // optimize svg written as independent assets
          if (options.optimize && chunk.type === 'asset') {
            const svgSource = chunk.source.toString(options.encoding);
            const optimized = await svgo.optimize(svgSource, { path: file });
            chunk.source = Buffer.from(optimized.data, options.encoding);
          }
        }
      }
    },
  };
}
