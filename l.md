
%x mu emu com par
<!-- 定义启动条件符号组 -->

%% 
<!-- 通过 {{  begin("mu") 或者 begine("emu") 标记 handlebars 语句的开始 -->

[^\x00]*?/("{{")                 {
                                   if(yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yytext.slice(-1) === "\\") yytext = yytext.substr(0,yyleng-1), this.begin("emu");
                                   if(yytext) return 'CONTENT';
                                 }

<!-- 定义普通的 content token -->
[^\x00]+                         { return 'CONTENT'; }

<!-- 符合 emu 的条件下，再次得到 {{ 或者 文档结尾 -->
<emu>[^\x00]{2,}?/("{{"|<<EOF>>) {
                                   if(yytext.slice(-1) !== "\\") this.popState();
                                   if(yytext.slice(-1) === "\\") yytext = yytext.substr(0,yyleng-1);
                                   return 'CONTENT';
                                 }
<!-- 符合 comment 的条件下，匹配了 --}} 字符串，结束 comment state -->
<com>[\s\S]*?"--}}"              { yytext = yytext.substr(0, yyleng-4); this.popState(); return 'COMMENT'; }

<!-- 通过 {{> 标记 partial 开始 -->
<mu>"{{>"                        { this.begin("par"); return 'OPEN_PARTIAL'; }
<mu>"{{#"                        { return 'OPEN_BLOCK'; }
<mu>"{{/"                        { return 'OPEN_ENDBLOCK'; }
<mu>"{{^"                        { return 'OPEN_INVERSE'; }
<mu>"{{"\s*"else"                { return 'OPEN_INVERSE'; }
<mu>"{{{"                        { return 'OPEN_UNESCAPED'; }
<mu>"{{&"                        { return 'OPEN_UNESCAPED'; }

<!-- 通过 {{!--  标记 comment 的开始 -->
<mu>"{{!--"                      { this.popState(); this.begin('com'); }

<!-- 通过 {{!-- }} 标记 comment 的结束 -->
<mu>"{{!"[\s\S]*?"}}"            { yytext = yytext.substr(3,yyleng-5); this.popState(); return 'COMMENT'; }
<mu>"{{"                         { return 'OPEN'; }




<mu>"="                          { return 'EQUALS'; }
<!-- ./ .. 是 ID -->
<mu>"."/[} ]                     { return 'ID'; }
<mu>".."                         { return 'ID'; }
<mu>[\/.]                        { return 'SEP'; }
<mu>\s+                          { /*ignore whitespace*/ }
<!-- 通过 }}} 标记 mu 的结束 -->
<mu>"}}}"                        { this.popState(); return 'CLOSE'; }
<!-- 通过 }}} 标记 mu 的结束 -->
<mu>"}}"                         { this.popState(); return 'CLOSE'; }
<mu>'"'("\\"["]|[^"])*'"'        { yytext = yytext.substr(1,yyleng-2).replace(/\\"/g,'"'); return 'STRING'; }
<mu>"'"("\\"[']|[^'])*"'"        { yytext = yytext.substr(1,yyleng-2).replace(/\\'/g,"'"); return 'STRING'; }

<!-- @ 开头的是 data -->
<mu>"@"[a-zA-Z]+                 { yytext = yytext.substr(1); return 'DATA'; }
<mu>"true"/[}\s]                 { return 'BOOLEAN'; }
<mu>"false"/[}\s]                { return 'BOOLEAN'; }
<mu>[0-9]+/[}\s]                 { return 'INTEGER'; }
<mu>[a-zA-Z0-9_$-]+/[=}\s\/.]    { return 'ID'; }
<!-- [] 类型的 id -->
<mu>'['[^\]]*']'                 { yytext = yytext.substr(1, yyleng-2); return 'ID'; }
<mu>.                            { return 'INVALID'; }
<par>\s+                         { /*ignore whitespace*/ }
<!-- 匹配到 partial name 之后，结束 partial 状态 -->
<par>[a-zA-Z0-9_$-/]+            { this.popState(); return 'PARTIAL_NAME'; }

<!-- 在初始状态，或者 mu 状态下 匹配到了 EOF -->
<INITIAL,mu><<EOF>>              { return 'EOF'; }

