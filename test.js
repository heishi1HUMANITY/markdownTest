const markdown = require('markdown');
const fs = require('fs');

const contents = fs.readFileSync('./public/markdown/20201013.md', {encoding: 'utf-8'});
const outputMarkdown = markdown.markdown.toHTML(contents);
console.log(outputMarkdown.split('\n'));
