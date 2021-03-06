({
  1: function (
    container,
    depth0,
    helpers,
    partials,
    data,
    blockParams,
    depths
  ) {
    var lookupProperty =
      container.lookupProperty ||
      function (parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined;
      };

    return (
      "    My Content " +
      container.escapeExpression(
        container.lambda(
          depths[1] != null ? lookupProperty(depths[1], "a") : depths[1],
          depth0
        )
      ) +
      "\n"
    );
  },
  3: function (
    container,
    depth0,
    helpers,
    partials,
    data,
    blockParams,
    depths
  ) {
    var stack1,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (stack1 = container.invokePartial(
      lookupProperty(partials, "myPartial"),
      depths[1] != null ? lookupProperty(depths[1], "a") : depths[1],
      {
        name: "myPartial",
        data: data,
        indent: "    ",
        helpers: helpers,
        partials: partials,
        decorators: container.decorators,
      }
    )) != null
      ? stack1
      : "";
  },
  5: function (container, depth0, helpers, partials, data) {
    var stack1,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      " " +
      ((stack1 = container.invokePartial(
        lookupProperty(partials, "myPartial"),
        depth0,
        {
          name: "myPartial",
          data: data,
          helpers: helpers,
          partials: partials,
          decorators: container.decorators,
        }
      )) != null
        ? stack1
        : "")
    );
  },
  compiler: [8, ">= 4.3.0"],
  main: function (
    container,
    depth0,
    helpers,
    partials,
    data,
    blockParams,
    depths
  ) {
    var stack1,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      ((stack1 = lookupProperty(helpers, "each").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "people") : depth0,
        {
          name: "each",
          hash: {},
          fn: container.program(3, data, 0, blockParams, depths),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 4, column: 2 }, end: { line: 6, column: 11 } },
        }
      )) != null
        ? stack1
        : "") +
      "  outer: " +
      ((stack1 = lookupProperty(helpers, "with").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "a") : depth0,
        {
          name: "with",
          hash: {},
          fn: container.program(5, data, 0, blockParams, depths),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 7, column: 9 }, end: { line: 7, column: 46 } },
        }
      )) != null
        ? stack1
        : "") +
      "\n  "
    );
  },
  main_d: function (fn, props, container, depth0, data, blockParams, depths) {
    var decorators = container.decorators,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    fn =
      lookupProperty(decorators, "inline")(fn, props, container, {
        name: "inline",
        hash: {},
        fn: container.program(1, data, 0, blockParams, depths),
        inverse: container.noop,
        args: ["myPartial"],
        data: data,
        loc: { start: { line: 1, column: 0 }, end: { line: 3, column: 13 } },
      }) || fn;
    return fn;
  },

  useDecorators: true,
  usePartial: true,
  useData: true,
  useDepths: true,
});
