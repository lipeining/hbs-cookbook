({
  1: function (container, depth0, helpers, partials, data) {
    return " four";
  },
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var stack1,
      helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = "function",
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName];
          }
          return undefined;
        };

    return (
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "first") ||
            (depth0 != null ? lookupProperty(depth0, "first") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "first",
              hash: {},
              data: data,
              loc: {
                start: { line: 1, column: 0 },
                end: { line: 1, column: 11 },
              },
            })
          : helper)
      ) +
      "  " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "second") ||
            (depth0 != null ? lookupProperty(depth0, "second") : depth0)) !=
          null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "second",
              hash: {},
              data: data,
              loc: {
                start: { line: 1, column: 13 },
                end: { line: 1, column: 25 },
              },
            })
          : helper)
      ) +
      " " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, "third") ||
            (depth0 != null ? lookupProperty(depth0, "third") : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: "third",
              hash: {},
              data: data,
              loc: {
                start: { line: 1, column: 26 },
                end: { line: 1, column: 37 },
              },
            })
          : helper)
      ) +
      " " +
      ((stack1 = lookupProperty(helpers, "if").call(
        alias1,
        depth0 != null ? lookupProperty(depth0, "four") : depth0,
        {
          name: "if",
          hash: {},
          fn: container.program(1, data, 0),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 1, column: 38 }, end: { line: 1, column: 62 } },
        }
      )) != null
        ? stack1
        : "")
    );
  },
  useData: true,
});
