const fs = require('fs');
const path = require('path');
const vueClassRenamingLoader = require('./vue-class-renaming-loader');

const input = fs.readFileSync(path.join(__dirname, '../src/components/TheMenu.vue'), 'utf8');

const output = vueClassRenamingLoader(input);

console.log(output);
