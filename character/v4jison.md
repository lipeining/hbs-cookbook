```js
lexer.rules = [
  /^(?:[^\x00]*?(?=(\{\{)))/,
  /^(?:[^\x00]+)/,
  /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,
  /^(?:\{\{\{\{(?=[^/]))/,
  /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,
  /^(?:[^\x00]+?(?=(\{\{\{\{)))/,
  /^(?:[\s\S]*?--(~)?\}\})/,
  /^(?:\()/,
  /^(?:\))/,
  /^(?:\{\{\{\{)/,
  /^(?:\}\}\}\})/,
  /^(?:\{\{(~)?>)/,
  /^(?:\{\{(~)?#>)/,
  /^(?:\{\{(~)?#\*?)/,
  /^(?:\{\{(~)?\/)/,
  /^(?:\{\{(~)?\^\s*(~)?\}\})/,
  /^(?:\{\{(~)?\s*else\s*(~)?\}\})/,
  /^(?:\{\{(~)?\^)/,
  /^(?:\{\{(~)?\s*else\b)/,
  /^(?:\{\{(~)?\{)/,
  /^(?:\{\{(~)?&)/,
  /^(?:\{\{(~)?!--)/,
  /^(?:\{\{(~)?![\s\S]*?\}\})/,
  /^(?:\{\{(~)?\*?)/,
  /^(?:=)/,
  /^(?:\.\.)/,
  /^(?:\.(?=([=~}\s\/.)|])))/,
  /^(?:[\/.])/,
  /^(?:\s+)/,
  /^(?:\}(~)?\}\})/,
  /^(?:(~)?\}\})/,
  /^(?:"(\\["]|[^"])*")/,
  /^(?:'(\\[']|[^'])*')/,
  /^(?:@)/,
  /^(?:true(?=([~}\s)])))/,
  /^(?:false(?=([~}\s)])))/,
  /^(?:undefined(?=([~}\s)])))/,
  /^(?:null(?=([~}\s)])))/,
  /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,
  /^(?:as\s+\|)/,
  /^(?:\|)/,
  /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,
  /^(?:\[(\\\]|[^\]])*\])/,
  /^(?:.)/,
  /^(?:$)/,
];
lexer.conditions = {
  mu: {
    rules: [
      7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
    ],
    inclusive: false,
  },
  emu: { rules: [2], inclusive: false },
  com: { rules: [6], inclusive: false },
  raw: { rules: [3, 4, 5], inclusive: false },
  INITIAL: { rules: [0, 1, 44], inclusive: true },
};
```
```js
        case 42:
            yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, '$1');return 72;
            break;
        case 43:
            return 'INVALID';
            break;
```