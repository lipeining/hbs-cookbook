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