/*
 * reduce size of inline GLSL fragments starting with a `//glsl` comment
 * author: François Risoud
 *
 */

module.exports = function(source) {

  this.cacheable();

  source = source.replace(/[`'"]\/\/glsl[^`]+[`'"]/g, function(glsl) {
    /* eslint-disable */
    return glsl.replace(/([ \t]*\/\/[ \w.,;:+=(){}'"*\/<&?-]+\n|[ ]{2,}|\n)/gm, '');
    /* eslint-enable */
  });

  return source;

};
