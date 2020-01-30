/*
 * rename classes across a single standalone .vue file for compression purpose
 * still experimental stuff !
 * for the moment we need to provide an array of classes (options.skip) that we want to keep,
 * because we use them in the <script> tag and their replacement is not straighforward,
 * so has the current status of 'not supported' :-)
 */

const increment = require('incremental');
const getOptions = require('loader-utils').getOptions;
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    classStack: {
      type: 'array'
    },
    skip: {
      type: 'array'
    },
    golbalSafe: {
      type: 'array'
    },
  },
  required: ['classStack']
};

// these options are passed to the loader in the webpack config
// const options = {
//   classStack: [],
//   skip: ['active', 'twitter', 'github', 'hide', 'show', 'inline-svg', 'scroll-invite'],
//   golbalSafe: ['isolated-particle-view', 'project-particle-view', 'burger'],
// };

module.exports = function(source) {

  this.cacheable();

  const options = getOptions(this);
  validateOptions(schema, options, 'Example Loader');

  const skip = options.skip ? options.skip : [];
  const golbalSafe = options.golbalSafe ? options.golbalSafe : [];

  function shortName(className) {

    const entryArrayLength = options.classStack.length;
    const classStackArray = entryArrayLength ? options.classStack[entryArrayLength-1].short.split('') : ['a'];
    const l = classStackArray.length;

    var incNext = true;

    var j = l;
    while (j--) {

      if (incNext) {

        incNext = false;

        if (classStackArray[j] === '9') {

          classStackArray[j] = '_';

        } else if (classStackArray[j] === '_') {

          classStackArray[j] = 'a';

        } else if (classStackArray[j] === 'z') {

          classStackArray[j] = 'A';

        } else if (classStackArray[j] === 'Z') {

          if (j === 0) {

            classStackArray[j] = 'a';
            classStackArray.push('0');

          } else {

            classStackArray[j] = '0';
            incNext = true;

          }

        } else {

          classStackArray[j] = increment(classStackArray[j]);

        }

      }

    }

    return classStackArray.join('');

  }

  // find regions

  // select the <template> region

  const templateTagRegExp = /<template\s*[\w="']*>(\n.*)+<\/template>/g;
  const templateTagMatch = source.match(templateTagRegExp);
  var templateTagSource;

  if (templateTagMatch) {

    templateTagSource = templateTagMatch[0];

  } else {

    throw new Error('Error in vue-class-renaming-loader: no <template> tag');

  }

  // select the <style> region

  const styleTagRegExp = /<style\s*[\w="']*>(\n.*)+<\/style>/g;
  const styleTagMatch = source.match(styleTagRegExp);
  var styleTagSource;

  if (styleTagMatch) {

    styleTagSource = styleTagMatch[0];

  } else {

    throw new Error('Error in vue-class-renaming-loader: no <style> tag');

  }

  // select the <script> region

  // const scriptTagRegExp = /<script\s*[\w="']*>(\n.*)+<\/script>/g;
  // const scriptTagMatch = source.match(scriptTagRegExp);
  // var scriptTagSource;

  // if (styleTagMatch) {

  //   scriptTagSource = scriptTagMatch[0];

  // } else {

  //   throw new Error('Error in vue-class-renaming-loader: no <script> tag');

  // }

  // find classnames in <template> and associate a new shorter classname, derived from stack

  // dont forget to exclude template strings between {{ }}

  // currently supports only pug-style .classes

  const classRegExp = /[.]([a-zA-Z0-9-_]+)/g;
  const excludeRegExp = /(}}[^{}]*{{|[^{}]*{{|}}[^}{]*)/g;

  var templateFragments = templateTagSource.match(excludeRegExp);
  if (!templateFragments) templateFragments = [templateTagSource];

  templateFragments.forEach(function(fragment) {

    var classMatch = classRegExp.exec(fragment);

    while (classMatch) {

      const name = classMatch[1];

      const notClassRegExp = new RegExp(`['"][ :\/~@a-zA-Z0-9_.-]*[.]${name}[ :\/~@a-zA-Z0-9_.-]*['"]`); // eslint-disable-line

      if (!fragment.match(notClassRegExp)) {

        if (skip.indexOf(name) === -1 && options.classStack.filter(function(c) { return c.name === name; }).length === 0) {

          options.classStack.push({
            name: name,
            short: shortName(),
          });

        }

      }

      classMatch = classRegExp.exec(fragment);

    }

  });

  // globals that can be safely changed everywhere

  golbalSafe.forEach(function(name) {

    if (skip.indexOf(name) === -1 && options.classStack.filter(function(c) { return c.name === name; }).length === 0) {

      options.classStack.push({
        name: name,
        short: shortName(),
      });

    }

  });

  // change the source accordingly

  var newTemplateTagSource = templateTagSource;
  var newStyleTagSource = styleTagSource;
  // var newScriptTagSource = scriptTagSource;

  var newTemplateFragments = templateFragments.slice();

  options.classStack.forEach((className) => {

    const templateClassRegExp = new RegExp(`[.]${className.name}([^a-zA-Z0-9_-])`, 'g');

    newTemplateFragments = newTemplateFragments.map(function(fragment) {

      const notClassRegExp = new RegExp(`['"][ :\/~@a-zA-Z0-9_.-]*[.]${className.name}[ :\/~@a-zA-Z0-9_.-]*['"]`); // eslint-disable-line

      if (!fragment.match(notClassRegExp)) {

        return fragment.replace(templateClassRegExp, `.${className.short}$1`);

      } else {

        return fragment;

      }

    });

    // newTemplateTagSource = newTemplateTagSource.replace(templateClassRegExp, `$1$3${className.short}$2$4`);

    const styleClassRegExp = new RegExp(`[.]${className.name}([^a-zA-Z0-9_-])`, 'g');
    newStyleTagSource = newStyleTagSource.replace(styleClassRegExp, `.${className.short}$1`);

    // changing classNames in script tag not supported yet...todo
    // (a little more work than consize RegExp is needed here)

    // in <script> tag, classname must be inside a string, either 'className' or '.className' with querySelectorAll or jQuery
    // const scriptClassRegExp = new RegExp(`(["'\`])(.*)${className.name}([^a-zA-Z0-9_-]{0,1})([):"'\`]+)`, 'g');
    // newScriptTagSource = newScriptTagSource.replace(scriptClassRegExp, `$1$2${className.short}$3$4`);

  });

  for (var i = 0; i<templateFragments.length; i++) {

    newTemplateTagSource = newTemplateTagSource.replace(templateFragments[i], newTemplateFragments[i]);

  }

  // prevent $ "bugg" ( ffs ! )

  newTemplateTagSource = newTemplateTagSource.replace("$'", "$$$$'");
  newStyleTagSource = newStyleTagSource.replace("$'", "$$$$'");
  // newScriptTagSource = newScriptTagSource.replace("$'", "$$$$'");

  // replace source

  source = source.replace(templateTagSource, newTemplateTagSource);
  source = source.replace(styleTagSource, newStyleTagSource);
  // source = source.replace(scriptTagSource, newScriptTagSource);

  // replace safe globals also in <script>

  golbalSafe.forEach(function(name) {

    const c = options.classStack.find(function(c) { return c.name === name; });

    if (c) {

      const globalRegExp = new RegExp(`${c.name}`, 'g');
      source = source.replace(globalRegExp, c.short);

    }

  });

  return source;

};
