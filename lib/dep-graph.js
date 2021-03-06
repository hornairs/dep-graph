(function() {
  var DepGraph, _;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  _ = require('underscore');
  DepGraph = (function() {
    function DepGraph() {
      this.map = {};
    }
    DepGraph.prototype.add = function(id, depId) {
      var _base, _ref;
      if ((_ref = (_base = this.map)[id]) == null) {
        _base[id] = [];
      }
      if (__indexOf.call(this.map[id], depId) >= 0) {
        return false;
      }
      this.map[id].push(depId);
      return this.map[id];
    };
    DepGraph.prototype.getChain = function(id) {
      var chain, deps, leafNode, visit, visited, _i, _len, _ref;
      deps = this.descendantsOf(id);
      chain = [];
      visited = {};
      visit = __bind(function(node) {
        var parent, _i, _len, _ref;
        if (visited[node] || node === id) {
          return;
        }
        visited[node] = true;
        _ref = this.parentsOf(node);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          parent = _ref[_i];
          visit(parent);
        }
        return chain.unshift(node);
      }, this);
      _ref = _.intersection(deps, this.leafNodes()).reverse();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        leafNode = _ref[_i];
        visit(leafNode);
      }
      return chain;
    };
    DepGraph.prototype.leafNodes = function() {
      var allNodes, node, _i, _len, _ref, _results;
      allNodes = _.uniq(_.flatten(_.values(this.map)));
      _results = [];
      for (_i = 0, _len = allNodes.length; _i < _len; _i++) {
        node = allNodes[_i];
        if (!((_ref = this.map[node]) != null ? _ref.length : void 0)) {
          _results.push(node);
        }
      }
      return _results;
    };
    DepGraph.prototype.parentsOf = function(child) {
      var node, _i, _len, _ref, _results;
      _ref = _.keys(this.map);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (__indexOf.call(this.map[node], child) >= 0) {
          _results.push(node);
        }
      }
      return _results;
    };
    DepGraph.prototype.descendantsOf = function(parent, descendants, branch) {
      var child, _i, _len, _ref, _ref2;
      if (descendants == null) {
        descendants = [];
      }
      if (branch == null) {
        branch = [];
      }
      descendants.push(parent);
      branch.push(parent);
      _ref2 = (_ref = this.map[parent]) != null ? _ref : [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        child = _ref2[_i];
        if (__indexOf.call(branch, child) >= 0) {
          throw new Error("Cyclic dependency from " + parent + " to " + child);
        }
        if (__indexOf.call(descendants, child) >= 0) {
          continue;
        }
        this.descendantsOf(child, descendants, branch.slice(0));
      }
      return descendants.slice(1);
    };
    return DepGraph;
  })();
  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = DepGraph;
  } else {
    this.DepGraph = DepGraph;
  }
}).call(this);
