Ember.TEMPLATES["application"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.2+a7f49eab",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 10
        }
      }
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createComment("");
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
      var morphs = new Array(1);
      morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
      dom.insertBoundary(fragment, 0);
      dom.insertBoundary(fragment, null);
      return morphs;
    },
    statements: [
      ["content","outlet",["loc",[null,[1,0],[1,10]]]]
    ],
    locals: [],
    templates: []
  };
}()));

Ember.TEMPLATES["book"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.2+a7f49eab",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 9,
          "column": 6
        }
      }
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createComment("");
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"id","toolbox");
      dom.setAttribute(el1,"class","container toolbox");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","row");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"id","content");
      dom.setAttribute(el1,"class","container");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
      var morphs = new Array(3);
      morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
      morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2, 1]),1,1);
      morphs[2] = dom.createMorphAt(dom.childAt(fragment, [4]),1,1);
      dom.insertBoundary(fragment, 0);
      return morphs;
    },
    statements: [
      ["inline","outlet",["root"],[],["loc",[null,[1,0],[1,17]]]],
      ["inline","outlet",["toolbox"],[],["loc",[null,[4,2],[4,22]]]],
      ["inline","outlet",["content"],[],["loc",[null,[8,1],[8,21]]]]
    ],
    locals: [],
    templates: []
  };
}()));

Ember.TEMPLATES["book/index"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.2+a7f49eab",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 14,
          "column": 6
        }
      }
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","row full-height");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","words-col  col-xs-3 full-height");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","words-col  col-xs-3 full-height");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","words-col  col-xs-3 full-height");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","words-col  col-xs-3 full-height");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
      var element0 = dom.childAt(fragment, [0]);
      var morphs = new Array(4);
      morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
      morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
      morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
      morphs[3] = dom.createMorphAt(dom.childAt(element0, [7]),1,1);
      return morphs;
    },
    statements: [
      ["inline","speachpart-block",[],["title","Nouns","words",["subexpr","@mut",[["get","nouns",["loc",[null,[3,41],[3,46]]]]],[],[]]],["loc",[null,[3,2],[3,49]]]],
      ["inline","speachpart-block",[],["title","Verbs","words",["subexpr","@mut",[["get","verbs",["loc",[null,[6,41],[6,46]]]]],[],[]]],["loc",[null,[6,2],[6,49]]]],
      ["inline","speachpart-block",[],["title","Adjectives","words",["subexpr","@mut",[["get","adjectives",["loc",[null,[9,46],[9,56]]]]],[],[]]],["loc",[null,[9,2],[9,59]]]],
      ["inline","speachpart-block",[],["title","Adverbs","words",["subexpr","@mut",[["get","adverbs",["loc",[null,[12,43],[12,50]]]]],[],[]]],["loc",[null,[12,2],[12,53]]]]
    ],
    locals: [],
    templates: []
  };
}()));

Ember.TEMPLATES["book/indexRoot"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.2+a7f49eab",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 8,
          "column": 0
        }
      }
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"id","install_ct_alert");
      dom.setAttribute(el1,"class","popover");
      var el2 = dom.createTextNode("\n   	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","arrow");
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("h3");
      dom.setAttribute(el2,"class","popover-title");
      var el3 = dom.createTextNode("Install Cool Translator");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n   	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","popover-content");
      var el3 = dom.createTextNode("\n          You should install ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("a");
      dom.setAttribute(el3,"href","localhost:13189/cooltranslator");
      var el4 = dom.createTextNode("Cool Translator");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode(" if you wanna add new words to your vocabulary. Currently it is available for Chrome browser.\n   	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes() { return []; },
    statements: [

    ],
    locals: [],
    templates: []
  };
}()));

Ember.TEMPLATES["book/indexToolbox"] = Ember.HTMLBars.template((function() {
  var child0 = (function() {
    return {
      meta: {
        "revision": "Ember@2.0.2+a7f49eab",
        "loc": {
          "source": null,
          "start": {
            "line": 12,
            "column": 6
          },
          "end": {
            "line": 20,
            "column": 6
          }
        }
      },
      arity: 1,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("      ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("li");
        var el2 = dom.createElement("a");
        dom.setAttribute(el2,"class","bookLink");
        dom.setAttribute(el2,"href","#");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","manageIcons");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","glyphicon glyphicon-cog pull-right");
        dom.setAttribute(el4,"style","margin-right: 10px");
        dom.setAttribute(el4,"title","Rename book");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 0]),1,1);
        return morphs;
      },
      statements: [
        ["content","book.name",["loc",[null,[14,8],[14,21]]]]
      ],
      locals: ["book"],
      templates: []
    };
  }());
  var child1 = (function() {
    return {
      meta: {
        "revision": "Ember@2.0.2+a7f49eab",
        "loc": {
          "source": null,
          "start": {
            "line": 46,
            "column": 1
          },
          "end": {
            "line": 49,
            "column": 2
          }
        }
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("button");
        dom.setAttribute(el1,"class","btn btn-sm btn-success");
        dom.setAttribute(el1,"type","button");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","glyphicon glyphicon-book");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    LEARN");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }());
  var child2 = (function() {
    return {
      meta: {
        "revision": "Ember@2.0.2+a7f49eab",
        "loc": {
          "source": null,
          "start": {
            "line": 50,
            "column": 1
          },
          "end": {
            "line": 52,
            "column": 18
          }
        }
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("button");
        dom.setAttribute(el1,"class","btn btn-sm btn-warning");
        dom.setAttribute(el1,"type","button");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2,"class","glyphicon glyphicon-check");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    CHECK");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }());
  return {
    meta: {
      "revision": "Ember@2.0.2+a7f49eab",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 53,
          "column": 6
        }
      }
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"id","bookContainer");
      dom.setAttribute(el1,"class","col-xs-4");
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"id","currentBookDropdown");
      dom.setAttribute(el2,"class","dropdown");
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("input");
      dom.setAttribute(el3,"id","newBookName");
      dom.setAttribute(el3,"type","text");
      dom.setAttribute(el3,"value","New words - 1");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("a");
      dom.setAttribute(el3,"id","currentBook");
      dom.setAttribute(el3,"href","#");
      dom.setAttribute(el3,"data-toggle","dropdown");
      dom.setAttribute(el3,"role","button");
      dom.setAttribute(el3,"aria-haspopup","true");
      dom.setAttribute(el3,"aria-expanded","false");
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createComment("");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("span");
      dom.setAttribute(el4,"class","caret");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n    ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("ul");
      dom.setAttribute(el3,"class","dropdown-menu");
      dom.setAttribute(el3,"aria-labelledby","currentBook");
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("li");
      dom.setAttribute(el4,"class","dropdown-header");
      var el5 = dom.createTextNode("Your books: ");
      dom.appendChild(el4, el5);
      var el5 = dom.createComment("");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n\n");
      dom.appendChild(el3, el4);
      var el4 = dom.createComment("");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("li");
      dom.setAttribute(el4,"role","separator");
      dom.setAttribute(el4,"class","divider");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("li");
      var el5 = dom.createElement("a");
      dom.setAttribute(el5,"class","addBookLink");
      dom.setAttribute(el5,"href","#");
      var el6 = dom.createTextNode("\n        ");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("span");
      dom.setAttribute(el6,"class","glyphicon glyphicon-plus");
      dom.setAttribute(el6,"style","margin-right:10px;");
      dom.setAttribute(el6,"aria-hidden","true");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("Add Empty Book");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n      ");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("li");
      var el5 = dom.createElement("a");
      dom.setAttribute(el5,"class","findBookLink");
      dom.setAttribute(el5,"href","#");
      var el6 = dom.createTextNode("\n        ");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("span");
      dom.setAttribute(el6,"class","glyphicon glyphicon-search");
      dom.setAttribute(el6,"style","margin-right:10px;");
      dom.setAttribute(el6,"aria-hidden","true");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("Find Book");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n      ");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n    ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","col-xs-6");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("form");
      dom.setAttribute(el2,"id","word_input_form");
      dom.setAttribute(el2,"class","input-group");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  	");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("span");
      dom.setAttribute(el3,"class","input-group-btn");
      var el4 = dom.createTextNode("\n    	");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("button");
      dom.setAttribute(el4,"class","btn btn-sm btn-info");
      dom.setAttribute(el4,"type","submit");
      var el5 = dom.createTextNode("\n    		");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("span");
      dom.setAttribute(el5,"class","glyphicon glyphicon-plus");
      dom.setAttribute(el5,"aria-hidden","true");
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n    		ADD\n    	");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n  	");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","col-xs-2");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("	");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
      var element0 = dom.childAt(fragment, [0, 1]);
      var element1 = dom.childAt(element0, [5]);
      var element2 = dom.childAt(fragment, [4]);
      var morphs = new Array(6);
      morphs[0] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
      morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
      morphs[2] = dom.createMorphAt(element1,3,3);
      morphs[3] = dom.createMorphAt(dom.childAt(fragment, [2, 1]),1,1);
      morphs[4] = dom.createMorphAt(element2,1,1);
      morphs[5] = dom.createMorphAt(element2,3,3);
      return morphs;
    },
    statements: [
      ["content","model.name",["loc",[null,[5,6],[5,20]]]],
      ["content","books.length",["loc",[null,[10,46],[10,62]]]],
      ["block","each",[["get","books",["loc",[null,[12,14],[12,19]]]]],[],0,null,["loc",[null,[12,6],[20,15]]]],
      ["inline","input",[],["value",["subexpr","@mut",[["get","inputWord",["loc",[null,[35,16],[35,25]]]]],[],[]],"class","form-control input-sm","placeholder","Enter word here..."],["loc",[null,[35,2],[35,91]]]],
      ["block","link-to",["book.learn"],[],1,null,["loc",[null,[46,1],[49,14]]]],
      ["block","link-to",["book.exam"],[],2,null,["loc",[null,[50,1],[52,30]]]]
    ],
    locals: [],
    templates: [child0, child1, child2]
  };
}()));

Ember.TEMPLATES["book/learn"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.2+a7f49eab",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 31,
          "column": 6
        }
      }
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","flex-centered fill-absolute");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"id","learning-col");
      dom.setAttribute(el2,"class","full-height");
      var el3 = dom.createTextNode("\n	    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"id","stencil");
      dom.setAttribute(el3,"class","fill-absolute");
      var el4 = dom.createTextNode("\n	    	");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"id","top-block");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n	    	");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"id","magnifier-block");
      var el5 = dom.createTextNode("\n	    		");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"id","learning-cards");
      dom.setAttribute(el5,"class","fill-absolute");
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("div");
      dom.setAttribute(el6,"class","learning-card");
      var el7 = dom.createComment("");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("div");
      dom.setAttribute(el6,"class","learning-card");
      var el7 = dom.createTextNode("Voluptates ut totam doloribus, voluptas, beatae dolor possimus rem, quae numquam ipsum recusandae, exercitationem eaque? Porro numquam eius velit! Natus, veniam architecto, vero fugit accusantium ipsum laborum quis cumque minima error reprehenderit quae deleniti nisi veritatis tempore. Ut, nisi eveniet eaque iste beatae facilis, ab libero. Voluptas nobis aliquam repellat placeat impedit quis, et eum sequi temporibus perspiciatis nostrum nulla expedita odio rerum. Assumenda esse nemo, odio reiciendis, nisi a in quo fugit dicta dolorem? Consequatur iusto voluptatum id error, et, eaque eveniet iste nemo fugit, voluptatem dignissimos voluptatibus eligendi repudiandae atque expedita sunt delectus explicabo. Modi beatae eum dolorem.");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("div");
      dom.setAttribute(el6,"class","learning-card");
      var el7 = dom.createTextNode("Corporis ullam corrupti, earum aliquid similique sapiente beatae, id inventore amet, architecto ducimus esse repellat magnam, quia quaerat neque. Nihil cumque nesciunt at odio totam, dignissimos velit atque, iure voluptate, architecto aliquid quasi voluptas quisquam dolore dolores, ipsum laborum sed iusto. Pariatur officia nulla tenetur cumque modi maxime ducimus odit obcaecati, vero harum maiores quisquam placeat est minima molestiae temporibus nostrum! Consectetur tenetur illo accusamus officiis quos, doloremque ut sit deserunt, ducimus enim nobis minus tempore qui. Architecto dolore eaque aspernatur, reiciendis sed officia magnam at, necessitatibus, voluptatibus delectus consectetur quidem voluptas repudiandae. Repudiandae, officiis fugit quia distinctio, sequi totam.");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("div");
      dom.setAttribute(el6,"class","learning-card");
      var el7 = dom.createTextNode("Consectetur obcaecati laboriosam ut, sit aliquam, praesentium. Rem neque, cumque quibusdam fugiat praesentium fugit quidem, iure corrupti aperiam eum accusamus, expedita quis nam maiores, aliquid eos aut. Iure praesentium ratione quaerat, dolores officia voluptate. Dolore delectus eos molestiae et repellat, pariatur velit error inventore nam praesentium nostrum, iusto mollitia ducimus itaque natus ea recusandae dolorem, corporis illo. Repudiandae ex dolor dolores laudantium sit modi praesentium earum non, omnis nemo nihil aperiam blanditiis, in iure veritatis. Nulla perspiciatis dolor minima incidunt tempore earum iusto repudiandae laudantium quas ullam, illum sunt non vero sint possimus repellendus illo exercitationem voluptas quo, autem recusandae.");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n				");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n				");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","fill-absolute");
      var el6 = dom.createTextNode("\n					");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("div");
      dom.setAttribute(el6,"class","learn-toolbox absolute-full-width pull-bottom");
      var el7 = dom.createTextNode("\n						");
      dom.appendChild(el6, el7);
      var el7 = dom.createElement("button");
      dom.setAttribute(el7,"class","btn btn-info btn-xs");
      var el8 = dom.createTextNode("More");
      dom.appendChild(el7, el8);
      dom.appendChild(el6, el7);
      var el7 = dom.createTextNode("\n						");
      dom.appendChild(el6, el7);
      var el7 = dom.createElement("button");
      dom.setAttribute(el7,"class","btn btn-success btn-xs");
      var el8 = dom.createTextNode("I got it, next...");
      dom.appendChild(el7, el8);
      dom.appendChild(el6, el7);
      var el7 = dom.createTextNode("\n					");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n				");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n			");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"id","bottom-block");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n	    ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"id","learning-cards-shadow");
      dom.setAttribute(el3,"class","fill-absolute");
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","learning-card");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","learning-card");
      var el5 = dom.createComment("");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","learning-card");
      var el5 = dom.createTextNode("Voluptates ut totam doloribus, voluptas, beatae dolor possimus rem, quae numquam ipsum recusandae, exercitationem eaque? Porro numquam eius velit! Natus, veniam architecto, vero fugit accusantium ipsum laborum quis cumque minima error reprehenderit quae deleniti nisi veritatis tempore. Ut, nisi eveniet eaque iste beatae facilis, ab libero. Voluptas nobis aliquam repellat placeat impedit quis, et eum sequi temporibus perspiciatis nostrum nulla expedita odio rerum. Assumenda esse nemo, odio reiciendis, nisi a in quo fugit dicta dolorem? Consequatur iusto voluptatum id error, et, eaque eveniet iste nemo fugit, voluptatem dignissimos voluptatibus eligendi repudiandae atque expedita sunt delectus explicabo. Modi beatae eum dolorem.");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","learning-card");
      var el5 = dom.createTextNode("Corporis ullam corrupti, earum aliquid similique sapiente beatae, id inventore amet, architecto ducimus esse repellat magnam, quia quaerat neque. Nihil cumque nesciunt at odio totam, dignissimos velit atque, iure voluptate, architecto aliquid quasi voluptas quisquam dolore dolores, ipsum laborum sed iusto. Pariatur officia nulla tenetur cumque modi maxime ducimus odit obcaecati, vero harum maiores quisquam placeat est minima molestiae temporibus nostrum! Consectetur tenetur illo accusamus officiis quos, doloremque ut sit deserunt, ducimus enim nobis minus tempore qui. Architecto dolore eaque aspernatur, reiciendis sed officia magnam at, necessitatibus, voluptatibus delectus consectetur quidem voluptas repudiandae. Repudiandae, officiis fugit quia distinctio, sequi totam.");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","learning-card");
      var el5 = dom.createTextNode("Consectetur obcaecati laboriosam ut, sit aliquam, praesentium. Rem neque, cumque quibusdam fugiat praesentium fugit quidem, iure corrupti aperiam eum accusamus, expedita quis nam maiores, aliquid eos aut. Iure praesentium ratione quaerat, dolores officia voluptate. Dolore delectus eos molestiae et repellat, pariatur velit error inventore nam praesentium nostrum, iusto mollitia ducimus itaque natus ea recusandae dolorem, corporis illo. Repudiandae ex dolor dolores laudantium sit modi praesentium earum non, omnis nemo nihil aperiam blanditiis, in iure veritatis. Nulla perspiciatis dolor minima incidunt tempore earum iusto repudiandae laudantium quas ullam, illum sunt non vero sint possimus repellendus illo exercitationem voluptas quo, autem recusandae.");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n			");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","learning-card");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n		");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
      var element0 = dom.childAt(fragment, [0, 1]);
      var morphs = new Array(2);
      morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 3, 1, 1]),0,0);
      morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 3]),0,0);
      return morphs;
    },
    statements: [
      ["content","word-description",["loc",[null,[7,32],[7,52]]]],
      ["content","word-description",["loc",[null,[24,30],[24,50]]]]
    ],
    locals: [],
    templates: []
  };
}()));

Ember.TEMPLATES["book/learnToolbox"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.2+a7f49eab",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 10,
          "column": 6
        }
      }
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","col-xs-4");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("span");
      dom.setAttribute(el2,"id","currentBook");
      dom.setAttribute(el2,"style","margin-top: 6px;");
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","col-xs-8 text-right");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("nav");
      dom.setAttribute(el2,"class","words-nav");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("button");
      dom.setAttribute(el3,"class","btn btn-primary btn-sm");
      dom.setAttribute(el3,"type","button");
      var el4 = dom.createTextNode("Previous word");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("span");
      dom.setAttribute(el3,"class","words-progress");
      var el4 = dom.createElement("b");
      var el5 = dom.createTextNode("8");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode(" of ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("b");
      var el5 = dom.createTextNode("20");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("button");
      dom.setAttribute(el3,"class","btn btn-primary btn-sm");
      dom.setAttribute(el3,"type","button");
      var el4 = dom.createTextNode("Next word");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
      var morphs = new Array(1);
      morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1]),0,0);
      return morphs;
    },
    statements: [
      ["content","model.name",["loc",[null,[2,49],[2,63]]]]
    ],
    locals: [],
    templates: []
  };
}()));

Ember.TEMPLATES["components/speachpart-block"] = Ember.HTMLBars.template((function() {
  var child0 = (function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.2+a7f49eab",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 5
            },
            "end": {
              "line": 12,
              "column": 5
            }
          }
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("						");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(" \n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["content","translation.value",["loc",[null,[11,6],[11,27]]]]
        ],
        locals: ["translation"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.2+a7f49eab",
        "loc": {
          "source": null,
          "start": {
            "line": 5,
            "column": 2
          },
          "end": {
            "line": 15,
            "column": 2
          }
        }
      },
      arity: 1,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("			");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("tr");
        dom.setAttribute(el1,"class","word-translation");
        var el2 = dom.createTextNode("\n				");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("td");
        dom.setAttribute(el2,"class","word");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n				");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("td");
        dom.setAttribute(el2,"class","show-details text-center");
        var el3 = dom.createTextNode("...");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n				");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("td");
        dom.setAttribute(el2,"class","translation text-right");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("				");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n			");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [1]);
        var element1 = dom.childAt(element0, [1]);
        var morphs = new Array(3);
        morphs[0] = dom.createAttrMorph(element1, 'title');
        morphs[1] = dom.createMorphAt(element1,0,0);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        return morphs;
      },
      statements: [
        ["attribute","title",["concat",[["get","data.bookword.word.value",["loc",[null,[7,30],[7,54]]]]]]],
        ["content","data.bookword.word.value",["loc",[null,[7,58],[7,86]]]],
        ["block","each",[["get","data.translations",["loc",[null,[10,13],[10,30]]]]],[],0,null,["loc",[null,[10,5],[12,14]]]]
      ],
      locals: ["data"],
      templates: [child0]
    };
  }());
  return {
    meta: {
      "revision": "Ember@2.0.2+a7f49eab",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 18,
          "column": 6
        }
      }
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","sp-block");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","sp-header");
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("table");
      dom.setAttribute(el2,"class","sp-words table");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("tbody");
      var el4 = dom.createTextNode("\n");
      dom.appendChild(el3, el4);
      var el4 = dom.createComment("");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("		");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
      var element2 = dom.childAt(fragment, [0]);
      var morphs = new Array(2);
      morphs[0] = dom.createMorphAt(dom.childAt(element2, [1]),0,0);
      morphs[1] = dom.createMorphAt(dom.childAt(element2, [3, 1]),1,1);
      return morphs;
    },
    statements: [
      ["content","title",["loc",[null,[2,24],[2,33]]]],
      ["block","each",[["get","words",["loc",[null,[5,10],[5,15]]]]],[],0,null,["loc",[null,[5,2],[15,11]]]]
    ],
    locals: [],
    templates: [child0]
  };
}()));

Ember.TEMPLATES["components/word-description"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.2+a7f49eab",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 14,
          "column": 0
        }
      }
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","word-picture text-center");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("img");
      dom.setAttribute(el2,"src","http://d144fqpiyasmrr.cloudfront.net/uploads/picture/128539.png");
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","word-description");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","word-original-wrap");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("span");
      dom.setAttribute(el3,"class","word-original");
      var el4 = dom.createTextNode("vigil");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("span");
      dom.setAttribute(el3,"class","word-transctiption");
      var el4 = dom.createTextNode("[vˈɪdʒɪl]");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("span");
      dom.setAttribute(el3,"class","word-audio");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("ul");
      dom.setAttribute(el2,"class","word-translations list-unstyled");
      var el3 = dom.createTextNode("\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("li");
      var el4 = dom.createElement("span");
      dom.setAttribute(el4,"class","speach-part");
      var el5 = dom.createTextNode("cущ.");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("дежурство");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n	");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      return el0;
    },
    buildRenderNodes: function buildRenderNodes() { return []; },
    statements: [

    ],
    locals: [],
    templates: []
  };
}()));