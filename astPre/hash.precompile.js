({
  compiler: [8, ">= 4.3.0"],
  main: function (container, depth0, helpers, partials, data) {
    var lookupProperty =
      container.lookupProperty ||
      function (parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined;
      };

    return container.escapeExpression(
      (
        lookupProperty(helpers, "eq") ||
        (depth0 && lookupProperty(depth0, "eq")) ||
        container.hooks.helperMissing
      ).call(
        depth0 != null ? depth0 : container.nullContext || {},
        depth0 != null ? lookupProperty(depth0, "a") : depth0,
        {
          name: "eq",
          hash: { compare: "a" },
          data: data,
          loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 22 } },
        }
      )
    );
  },
  useData: true,
});
