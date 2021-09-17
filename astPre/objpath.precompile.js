({
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

    return container.escapeExpression(
      container.lambda(
        (stack1 =
          (stack1 = depth0 != null ? lookupProperty(depth0, "a") : depth0) !=
          null
            ? lookupProperty(stack1, "b")
            : stack1) != null
          ? lookupProperty(stack1, "c")
          : stack1,
        depth0
      )
    );
  },
  useData: true,
});
