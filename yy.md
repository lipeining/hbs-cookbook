%start root

%%

<!-- 匹配到 program 模式和  eoc 就返回 program -->
root
  : program EOF { return $1; }
  ;

program
   <!-- {{ else }} 只 program statements -->
  : simpleInverse statements { $$ = new yy.ProgramNode([], $2); } 
  <!-- statements {{ else }} statementss 传入 左右 -->
  | statements simpleInverse statements { $$ = new yy.ProgramNode($1, $3); }
  <!-- statements {{ else }} 传入 左 -->
  | statements simpleInverse { $$ = new yy.ProgramNode($1, []); }
  <!-- 单纯的 statements -->
  | statements { $$ = new yy.ProgramNode($1); }
  <!-- {{ else }} -->
  | simpleInverse { $$ = new yy.ProgramNode([], []); }
  <!-- 空字符串 -->
  | "" { $$ = new yy.ProgramNode([]); }
  ;

statements
  <!-- 单纯的 statement 设置为 数组 -->
  : statement { $$ = [$1]; }
   <!-- statement 要组成数组 -->
  | statements statement { $1.push($2); $$ = $1; }
  ;

statement
  <!-- {{ else  program }} -->
  : openInverse program closeBlock { $$ = new yy.BlockNode($1, $2.inverse, $2, $3); }
  | openBlock program closeBlock { $$ = new yy.BlockNode($1, $2, $2.inverse, $3); }
  | mustache { $$ = $1; }
  | partial { $$ = $1; }
  | CONTENT { $$ = new yy.ContentNode($1); }
  | COMMENT { $$ = new yy.CommentNode($1); }
  ;

openBlock
  <!-- {{# 语句 }} -->
  : OPEN_BLOCK inMustache CLOSE { $$ = new yy.MustacheNode($2[0], $2[1]); }
  ;

openInverse
   <!-- {{ else  mustache 语句 }} -->
  : OPEN_INVERSE inMustache CLOSE { $$ = new yy.MustacheNode($2[0], $2[1]); }
  ;

closeBlock
   <!-- {{/ path }} -->
  : OPEN_ENDBLOCK path CLOSE { $$ = $2; }
  ;

mustache
   <!-- {{ a }} {{{ b }}} -->
  : OPEN inMustache CLOSE { $$ = new yy.MustacheNode($2[0], $2[1]); }
  | OPEN_UNESCAPED inMustache CLOSE { $$ = new yy.MustacheNode($2[0], $2[1], true); }
  ;


partial
  <!-- {{>  partialName }} -->
  : OPEN_PARTIAL partialName CLOSE { $$ = new yy.PartialNode($2); }
  <!-- {{>  partialName path 参数 }} -->
  | OPEN_PARTIAL partialName path CLOSE { $$ = new yy.PartialNode($2, $3); }
  ;

simpleInverse
<!-- 匹配到 {{else}} {{^}} 的情况 -->
  : OPEN_INVERSE CLOSE { }
  ;

inMustache
  : path params hash { $$ = [[$1].concat($2), $3]; }
  | path params { $$ = [[$1].concat($2), null]; }
  | path hash { $$ = [[$1], $2]; }
  | path { $$ = [[$1], null]; }
  | DATA { $$ = [[new yy.DataNode($1)], null]; }
  ;

params
  : params param { $1.push($2); $$ = $1; }
  | param { $$ = [$1]; }
  ;

param
  : path { $$ = $1; }
  | STRING { $$ = new yy.StringNode($1); }
  | INTEGER { $$ = new yy.IntegerNode($1); }
  | BOOLEAN { $$ = new yy.BooleanNode($1); }
  | DATA { $$ = new yy.DataNode($1); }
  ;

hash
  : hashSegments { $$ = new yy.HashNode($1); }
  ;

hashSegments
  : hashSegments hashSegment { $1.push($2); $$ = $1; }
  | hashSegment { $$ = [$1]; }
  ;

hashSegment
  : ID EQUALS path { $$ = [$1, $3]; }
  | ID EQUALS STRING { $$ = [$1, new yy.StringNode($3)]; }
  | ID EQUALS INTEGER { $$ = [$1, new yy.IntegerNode($3)]; }
  | ID EQUALS BOOLEAN { $$ = [$1, new yy.BooleanNode($3)]; }
  | ID EQUALS DATA { $$ = [$1, new yy.DataNode($3)]; }
  ;

partialName
  : PARTIAL_NAME { $$ = new yy.PartialNameNode($1); }
  ;

path
  : pathSegments { $$ = new yy.IdNode($1); }
  ;

pathSegments
   <!-- /a/b  a.b 通过 / 或者 . 分割时 -->
  : pathSegments SEP ID { $1.push($3); $$ = $1; }
  | ID { $$ = [$1]; }
  ;

