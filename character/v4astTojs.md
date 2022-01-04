## template
```js
    // depths 其实是父对象的引用数组。所以可以通过 lookupProperty 查找
    lookup: function(depths, name) {
      const len = depths.length;
      for (let i = 0; i < len; i++) {
        let result = depths[i] && container.lookupProperty(depths[i], name);
        if (result != null) {
          return depths[i][name];
        }
      }
    },
    // 预编译代码里面的函数组，以数字为名字的
    fn: function(i) {
      let ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },
    // 存储编译好的 program ，配合 program 函数使用
    programs: [],
    program: function(i, data, declaredBlockParams, blockParams, depths) {
      let programWrapper = this.programs[i],
        fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(
          this,
          i,
          fn,
          data,
          declaredBlockParams,
          blockParams,
          depths
        );
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },
    // 递归查找父节点
    data: function(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },


    // 可以参考 partial 的例子
    function ret() {
        if (templateSpec.useDepths) {
            if (options.depths) {
                depths =
                context != options.depths[0]
                    ? [context].concat(options.depths)
                    : options.depths;
            } else {
                depths = [context];
            }
        }
    }
```
```js
    //  depths 和 child 相关的测试。
    it('should expose child template', function() {
      var template = Handlebars.compile('{{#foo}}bar{{/foo}}');
      // Calling twice to hit the non-compiled case.
      equal(template._child(1)(), 'bar');
      equal(template._child(1)(), 'bar');
    });
    it('should render depthed content', function() {
      var template = Handlebars.compile('{{#foo}}{{../bar}}{{/foo}}');
      // Calling twice to hit the non-compiled case.
      equal(template._child(1, undefined, [], [{ bar: 'baz' }])(), 'baz');
    });

```

```java
interface PathExpression <: Expression {
    type: "PathExpression";
    data: boolean;
    depth: uint >= 0;
    parts: [ string ];
    original: string;
}
```

- `data` is true when the given expression is a `@data` reference.
- `depth` is an integer representation of which context the expression references. `0` represents the current context, `1` would be `../`, etc.
- `parts` is an array of the names in the path. `foo.bar` would be `['foo', 'bar']`. Scope references, `.`, `..`, and `this` should be omitted from this array.
- `original` is the path as entered by the user. Separator and scope references are left untouched.


## compiler
```ts
interface compiler {
    guid: number;// guid++
    sourceNode: any[];
    opcodes: any[];
    children: any[];
    options: any;
    stringParams: boolean;
    trackIds: boolean;
}
```


## js compiler

```ts
interface JScompiler {
  environment: environment;
  options: options;
  stringParams: boolean;
  trackIds: boolean;
  precompile: boolean;
  name: string;
  // 是否有上下文, 每一个
  context: {
    programs: any[];
    environments: any[];
    aliases: {};
  };
  // 是否是子 program
  isChild: boolean;
  // stack1, stack2 的计数器
  stackSlot: number;
  // 记录 stack1, stack2, hash 的实例，数据来自 registers.list
  stackVars: any[];
  // 用于定义变量，之后可以统一在代码开头定义。包括 stack1, hash, hashContext, options 等
  registers: {
    list: any[];
  };
  hashes:  { values: {}, types: [], contexts: [], ids: [] }[];
  blockParams: any[];
  // 保存 stack1, stack2 的名字，或者已经处理好的字符串代码
  compileStack: any[];
  // 逻辑上，保存当前【代码块】的栈，指一行的 {{}} hbs 代码的相关对象。
  // 可能是 Literal 对象，也可能是纯字符串
  inlineStack: any[];
  // opcodes 执行的位置
  i: number;

  // 当前上下文的的名字，有层级关系时，会不断 ++
  // {{ ../../../a }}
  lastContext: number;
  // 可以随时连接的 js 代码， source[1] 需要注册定义的变量名
  source: string[];
}
```