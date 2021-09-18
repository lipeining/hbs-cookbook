({
  1: function (container, depth0, helpers, partials, data) {
    var helper,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return container.escapeExpression(
      ((helper =
        (helper =
          lookupProperty(helpers, "index") ||
          (data && lookupProperty(data, "index"))) != null
          ? helper
          : container.hooks.helperMissing),
      typeof helper === "function"
        ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, {
            name: "index",
            hash: {},
            data: data,
            loc: {
              start: { line: 1, column: 13 },
              end: { line: 1, column: 25 },
            },
          })
        : helper)
    );
  },
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var stack1,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (stack1 = lookupProperty(helpers, "each").call(
      depth0 != null ? depth0 : container.nullContext || {},
      depth0 != null ? lookupProperty(depth0, "arr") : depth0,
      {
        name: "each",
        hash: {},
        fn: container.program(1, data, 0),
        inverse: container.noop,
        data: data,
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 34 } },
      }
    )) != null
      ? stack1
      : "";
  },
  useData: true,
});
