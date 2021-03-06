const Handlebars = require("handlebars");
const Heplers = require("handlebars-helpers")({ handlebars: Handlebars });
const fs = require("fs");
const path = require("path");
const dir = "./astPre";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

function safeEval(templateSpec) {
  /* eslint-disable no-eval, no-console */
  try {
    return eval("(" + templateSpec + ")");
  } catch (err) {
    console.error(templateSpec);
    throw err;
  }
  /* eslint-enable no-eval, no-console */
}

const templates = [
  {
    name: "lines",
    input: "{{ first }}  {{ second }} {{ third }} {{#if four}} four{{/if}}",
    data: {},
  },
  {
    name: "parentpath",
    input: "{{#each d }}{{ ../a.b.c }} {{/each}} {{#if a}}{{ this.a }}{{/if}}",
    data: {},
  },
  {
    name: "someVar",
    input: "{{ someVar }}",
    data: { someVar: "hello world"},
  },
  {
    name: "objpath",
    input: "{{ a.b.c }}",
    data: {},
  },
  {
    name: "fn-inverse",
    input: "{{#if left}}left{{else right}}right{{else}}middle{{/if}}",
    // data: { }, // middle
    // data: {left: "here"}, // left
    data: {right: "here"}, // right
  },
  {
    name: "each",
    input: "{{#each arr}}{{ @index }}{{/each}}",
    data: { arr: [1, 2]},
  },
  {
    name: "hash",
    input: "{{ eq a compare='a' }}",
    data: { a: "b" },
  },
  {
    name: "partial",
    input: `{{#*inline "myPartial"}}
    My Content {{ ../a }}
  {{/inline}}
  {{#each people}}
    {{> myPartial ../a }}
  {{/each}}
  outer: {{#with a}} {{> myPartial }}{{/with}}
  `,
    data: { 
      a: 'hehehe',
      people: [
        { firstname: "Nils" },
        { firstname: "Yehuda" },
      ],
   },
   depths: [{a: 'nonono'}],
  },
];

// console.log("p-result", safeEval(p));
// console.log("p-result", Handlebars.template(safeEval(p))(template.data));
for (const template of templates) {
  const ast = Handlebars.parse(template.input);
  const p = Handlebars.precompile(template.input);
  // console.log(p, ast);
  fs.writeFileSync(path.join(dir, `${template.name}.precompile.js`), `(${p})`);
  fs.writeFileSync(
    path.join(dir, `${template.name}.ast.json`),
    JSON.stringify(ast, null, 2)
  );
  const c = Handlebars.compile(template.input);
  console.log(template.name, c(template.data, { depths: template.depths }));
  // console.log(Handlebars.print(ast));
}
// console.log(Handlebars);
