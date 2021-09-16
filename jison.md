./node_modules/.bin/jison -m js src/handlebars.yy src/handlebars.l

启动条件
http://dinosaur.compilertools.net/flex/flex_11.html

http://dinosaur.compilertools.net/flex/index.html

https://github.com/zaach/jison
http://dinosaur.compilertools.net/bison/bison_4.html
Usage: jison [file] [lexfile] [options]

file        file containing a grammar
lexfile     file containing a lexical grammar

Options:
   -j, --json                    force jison to expect a grammar in JSON format
   -o FILE, --outfile FILE       Filename and base module name of the generated parser
   -t, --debug                   Debug mode
   -m TYPE, --module-type TYPE   The type of module to generate (commonjs, amd, js)
   -p TYPE, --parser-type TYPE   The type of algorithm to use for the parser (lr0, slr, lalr, lr)
   -V, --version                 print version and exit

https://blog.csdn.net/hu_zhenghui/article/details/107051975?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-1.no_search_link&spm=1001.2101.3001.4242

