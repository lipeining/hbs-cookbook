
AST 语法树，通过 handlebars.parse() 方法得到。
parser 如何得到
/lib/handlebars/base.js
import parser from './parser';
export { parser }; 
通过 grunt 任务，使用
/task/parser.js
生成一个使用 src 目录的 parser.js，语法树规则由 Jison 支持 https://gerhobbelt.github.io/jison/docs/
const OUTPUT_FILE = 'lib/handlebars/compiler/parser.js';

内容格式
```js
// File ignored in coverage tests via setting in .istanbul.yml
/* Jison generated parser */
"use strict";

exports.__esModule = true;
var handlebars = (function () {
    var parser = { trace: function trace() {},
        yy: {},
        symbols_: { "error": 2,...
```

/src/handlebars.l 是定义 token
/src/handlebars.yy 是处理语句，相关函数在 /lib/handlebars/compiler/helper.js 中

用于生成 AST Node，之后可以用于 comipler 进行编译，得到
执行的 js 代码。举例：
```
{{ abs negNumber }}

precompile {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression((lookupProperty(helpers,"abs")||(depth0 && lookupProperty(depth0,"abs"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"negNumber") : depth0),{"name":"abs","hash":{},"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":19}}}));
},"useData":true}

第一步，获取 helper:
p1：
lookupProperty(helpers,"abs")
p2：
(depth0 && lookupProperty(depth0,"abs"))
p3：
container.hooks.helperMissing

第二步，helper.call()
参数1：depth0 != null ? depth0 : (container.nullContext || {})
参数2：(depth0 != null ? lookupProperty(depth0,"negNumber") : depth0)
参数3：{"name":"abs","hash":{},"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":19}}}

```
暴露出来的 api 接口，比如
Handlebars.compile(text)(context);

是将 context 传入，在 lib/handlebars/runtime.js
中生成一个ret 函数，使用 container 存储常用方法, 
返回一个对应的执行函数（接收 context 对象）。
运行起来后，就是通过 
lookupProperty, lambda, program 等方法查找对应的 helper, 属性值，fn 
最后，得到字符串输出。

1.介入解析 AST 的语法，处理 parse 生成的 Node 这些方法，可以在特定的 helper 上添加 hash 字段
2.hack 源代码的某些地方的实现，看看是否可以加入一些额外信息。
3.


简单的 mustanceStatement 的 parse 结果 precompile 结果
简单的 if else 的 parse 结果 precompile 结果
简单的 for loop 的 parse 结果 precompile 结果
简单的 hash 的 parse 结果 precompile 结果
简单的 subExpression 的 parse 结果 precompile 结果
简单的 pathExpression 的 parse 结果 precompile 结果

然后怎么讲 Program Node 数组转为编译后的 js 代码，这部分还没有清楚。

第一个版本和当前使用版本的剖析
changlog 熟悉
编译出第一个版本的代码
了解 jison 工具
compiler （转为 opcodes） 是通过 opcodes 与 jsCompiler(生成 js 代码) 结合起来，里面是两个 
stack: inlineStack compileStack

depth0 是最开始的 context 之后如果有变化的话，会产生
depth+this.lastConext 名字。


https://zordius.github.io/HandlebarsCookbook/0027-advancedvariable.html


如果使用 asyncLocalStorage，要接管每一次渲染。
在开始渲染时，设置 store 为路径信息，
在 run 时，如果更新了 store，需要重新 run
那么，每一次切换后的 store 会不会因为没有引用而回收呢？














template 返回一个 
ret(context, options = {}) 
然后传入 (context, options) 就可以返回字符串
container.data 支持溯源 _parent 进行值的查询。
```text




compiler/helper.js 用于语法树格式检验，参数拼接

需要知道怎么生成文件。如何定义 AST 



得到语法树之后，通过 opcode 知道如何转化为
js 代码。需要生成可执行的 main function.

