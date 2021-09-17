({
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
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
          lookupProperty(helpers, "someVar") ||
          (depth0 != null ? lookupProperty(depth0, "someVar") : depth0)) != null
          ? helper
          : container.hooks.helperMissing),
      typeof helper === "function"
        ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, {
            name: "someVar",
            hash: {},
            data: data,
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 13 },
            },
          })
        : helper)
    );
  },
  useData: true,
});
