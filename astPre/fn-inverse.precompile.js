({"1":function(container,depth0,helpers,partials,data) {
    return "left";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  stack1 = ((helper = (helper = lookupProperty(helpers,"right") || (depth0 != null ? lookupProperty(depth0,"right") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"right","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data,"loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":49}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!lookupProperty(helpers,"right")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { return stack1; }
  else { return ''; }
},"4":function(container,depth0,helpers,partials,data) {
    return "right";
},"6":function(container,depth0,helpers,partials,data) {
    return "middle";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"left") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":56}}})) != null ? stack1 : "");
},"useData":true})