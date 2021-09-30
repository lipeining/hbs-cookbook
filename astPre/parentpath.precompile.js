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
      container.escapeExpression(
        container.lambda(
          (stack1 =
            (stack1 =
              depths[1] != null ? lookupProperty(depths[1], "a") : depths[1]) !=
            null
              ? lookupProperty(stack1, "b")
              : stack1) != null
            ? lookupProperty(stack1, "c")
            : stack1,
          depth0
        )
      ) + " "
    );
  },
  3: function (container, depth0, helpers, partials, data) {
    var lookupProperty =
      container.lookupProperty ||
      function (parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined;
      };

    return container.escapeExpression(
      container.lambda(
        depth0 != null ? lookupProperty(depth0, "a") : depth0,
        depth0
      )
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
        depth0 != null ? lookupProperty(depth0, "d") : depth0,
        {
          name: "each",
          hash: {},
          fn: container.program(1, data, 0, blockParams, depths),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 36 } },
        }
      )) != null
        ? stack1
        : "") +
      " " +
      ((stack1 = lookupProperty(helpers, "if").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "a") : depth0,
        {
          name: "if",
          hash: {},
          fn: container.program(3, data, 0, blockParams, depths),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 1, column: 37 }, end: { line: 1, column: 65 } },
        }
      )) != null
        ? stack1
        : "")
    );
  },
  useData: true,
  useDepths: true,
});
