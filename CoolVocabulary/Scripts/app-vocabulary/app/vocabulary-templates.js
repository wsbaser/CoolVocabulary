Ember.TEMPLATES["application"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.0+535f74cc",
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
  var child0 = (function() {
    return {
      meta: {
        "revision": "Ember@2.0.0+535f74cc",
        "loc": {
          "source": null,
          "start": {
            "line": 15,
            "column": 8
          },
          "end": {
            "line": 23,
            "column": 8
          }
        }
      },
      arity: 1,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("		      ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("li");
        var el2 = dom.createElement("a");
        dom.setAttribute(el2,"class","bookLink");
        dom.setAttribute(el2,"href","#");
        var el3 = dom.createTextNode("\n		        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","manageIcons");
        var el4 = dom.createTextNode("\n		          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","glyphicon glyphicon-remove pull-right");
        dom.setAttribute(el4,"title","Remove book");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","glyphicon glyphicon-pencil pull-right");
        dom.setAttribute(el4,"style","margin-right: 10px");
        dom.setAttribute(el4,"title","Rename book");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n		        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		      ");
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
        ["content","book.name",["loc",[null,[17,10],[17,23]]]]
      ],
      locals: ["book"],
      templates: []
    };
  }());
  return {
    meta: {
      "revision": "Ember@2.0.0+535f74cc",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 40,
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
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"id","bookContainer");
      dom.setAttribute(el3,"class","col-xs-4");
      var el4 = dom.createTextNode("\n		  ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"id","currentBookDropdown");
      dom.setAttribute(el4,"class","dropdown");
      var el5 = dom.createTextNode("\n		    ");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("input");
      dom.setAttribute(el5,"id","newBookName");
      dom.setAttribute(el5,"type","text");
      dom.setAttribute(el5,"value","New words - 1");
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n		    ");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("a");
      dom.setAttribute(el5,"id","currentBook");
      dom.setAttribute(el5,"href","#");
      dom.setAttribute(el5,"data-toggle","dropdown");
      dom.setAttribute(el5,"role","button");
      dom.setAttribute(el5,"aria-haspopup","true");
      dom.setAttribute(el5,"aria-expanded","false");
      var el6 = dom.createTextNode("\n		      ");
      dom.appendChild(el5, el6);
      var el6 = dom.createComment("");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("		      ");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("span");
      dom.setAttribute(el6,"class","caret");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n		    ");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n		    ");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("ul");
      dom.setAttribute(el5,"class","dropdown-menu");
      dom.setAttribute(el5,"aria-labelledby","currentBook");
      var el6 = dom.createTextNode("\n		      ");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("li");
      dom.setAttribute(el6,"class","dropdown-header");
      var el7 = dom.createTextNode("Your books: ");
      dom.appendChild(el6, el7);
      var el7 = dom.createComment("");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n\n");
      dom.appendChild(el5, el6);
      var el6 = dom.createComment("");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n		      ");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("li");
      dom.setAttribute(el6,"role","separator");
      dom.setAttribute(el6,"class","divider");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n		      ");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("li");
      var el7 = dom.createElement("a");
      dom.setAttribute(el7,"class","addBookLink");
      dom.setAttribute(el7,"href","#");
      var el8 = dom.createTextNode("\n		        ");
      dom.appendChild(el7, el8);
      var el8 = dom.createElement("span");
      dom.setAttribute(el8,"class","glyphicon glyphicon-plus");
      dom.setAttribute(el8,"style","margin-right:10px;");
      dom.setAttribute(el8,"aria-hidden","true");
      dom.appendChild(el7, el8);
      var el8 = dom.createTextNode("Add Empty Book");
      dom.appendChild(el7, el8);
      dom.appendChild(el6, el7);
      var el7 = dom.createTextNode("\n		      ");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n		      ");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("li");
      var el7 = dom.createElement("a");
      dom.setAttribute(el7,"class","findBookLink");
      dom.setAttribute(el7,"href","#");
      var el8 = dom.createTextNode("\n		        ");
      dom.appendChild(el7, el8);
      var el8 = dom.createElement("span");
      dom.setAttribute(el8,"class","glyphicon glyphicon-search");
      dom.setAttribute(el8,"style","margin-right:10px;");
      dom.setAttribute(el8,"aria-hidden","true");
      dom.appendChild(el7, el8);
      var el8 = dom.createTextNode("Find Book");
      dom.appendChild(el7, el8);
      dom.appendChild(el6, el7);
      var el7 = dom.createTextNode("\n		      ");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n		    ");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n		  ");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n		");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
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
      var element0 = dom.childAt(fragment, [2, 1]);
      var element1 = dom.childAt(element0, [1, 1]);
      var element2 = dom.childAt(element1, [5]);
      var morphs = new Array(6);
      morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
      morphs[1] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
      morphs[2] = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
      morphs[3] = dom.createMorphAt(element2,3,3);
      morphs[4] = dom.createMorphAt(element0,3,3);
      morphs[5] = dom.createMorphAt(dom.childAt(fragment, [4]),1,1);
      dom.insertBoundary(fragment, 0);
      return morphs;
    },
    statements: [
      ["inline","outlet",["root"],[],["loc",[null,[1,0],[1,17]]]],
      ["content","model.name",["loc",[null,[8,8],[8,22]]]],
      ["content","books.length",["loc",[null,[13,48],[13,64]]]],
      ["block","each",[["get","books",["loc",[null,[15,16],[15,21]]]]],[],0,null,["loc",[null,[15,8],[23,17]]]],
      ["inline","outlet",["toolbox"],[],["loc",[null,[35,2],[35,22]]]],
      ["inline","outlet",["content"],[],["loc",[null,[39,1],[39,21]]]]
    ],
    locals: [],
    templates: [child0]
  };
}()));

Ember.TEMPLATES["book/index"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.0+535f74cc",
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
      ["inline","speachpart-block",[],["title","Verbs","words",["subexpr","@mut",[["get","model.verbs",["loc",[null,[6,41],[6,52]]]]],[],[]]],["loc",[null,[6,2],[6,55]]]],
      ["inline","speachpart-block",[],["title","Adjectives","words",["subexpr","@mut",[["get","model.adjectives",["loc",[null,[9,46],[9,62]]]]],[],[]]],["loc",[null,[9,2],[9,65]]]],
      ["inline","speachpart-block",[],["title","Adverbs","words",["subexpr","@mut",[["get","model.adverbs",["loc",[null,[12,43],[12,56]]]]],[],[]]],["loc",[null,[12,2],[12,59]]]]
    ],
    locals: [],
    templates: []
  };
}()));

Ember.TEMPLATES["book/indexRoot"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.0+535f74cc",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 9,
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
      var el2 = dom.createTextNode("\n		");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("h3");
      dom.setAttribute(el2,"class","popover-title");
      var el3 = dom.createTextNode("JavaScript Access");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n\n   	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","popover-content");
      var el3 = dom.createTextNode("\n          You should install ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("a");
      dom.setAttribute(el3,"href","localhost:3000/cooltranslator");
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
        "revision": "Ember@2.0.0+535f74cc",
        "loc": {
          "source": null,
          "start": {
            "line": 14,
            "column": 1
          },
          "end": {
            "line": 14,
            "column": 93
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
        var el2 = dom.createTextNode("Learn");
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
  var child1 = (function() {
    return {
      meta: {
        "revision": "Ember@2.0.0+535f74cc",
        "loc": {
          "source": null,
          "start": {
            "line": 15,
            "column": 1
          },
          "end": {
            "line": 15,
            "column": 96
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
        var el2 = dom.createTextNode("Examenate");
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
      "revision": "Ember@2.0.0+535f74cc",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 16,
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
      dom.setAttribute(el5,"class","glyphicon glyphicon-add");
      dom.setAttribute(el5,"aria-hidden","true");
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n    		Add\n    	");
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
      var element0 = dom.childAt(fragment, [2]);
      var morphs = new Array(3);
      morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0, 1]),1,1);
      morphs[1] = dom.createMorphAt(element0,1,1);
      morphs[2] = dom.createMorphAt(element0,3,3);
      return morphs;
    },
    statements: [
      ["inline","input",[],["value",["subexpr","@mut",[["get","inputWord",["loc",[null,[3,16],[3,25]]]]],[],[]],"class","form-control input-sm","placeholder","Word to search or to add..."],["loc",[null,[3,2],[3,100]]]],
      ["block","link-to",["book.learn"],[],0,null,["loc",[null,[14,1],[14,105]]]],
      ["block","link-to",["book.exam"],[],1,null,["loc",[null,[15,1],[15,108]]]]
    ],
    locals: [],
    templates: [child0, child1]
  };
}()));

Ember.TEMPLATES["book/learn"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.0+535f74cc",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 33,
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
      dom.setAttribute(el1,"class","flex-centered fill-absolute");
      var el2 = dom.createTextNode("\n	");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","learning-col full-height");
      var el3 = dom.createTextNode("\n	    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","stencil fill-absolute");
      var el4 = dom.createTextNode("\n	    	");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","top-block");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n	    	");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","magnifier-block");
      var el5 = dom.createTextNode("\n	    		");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","learning-cards fill-absolute");
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
      dom.setAttribute(el4,"class","bottom-block");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n	    ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n\n\n		");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","learning-cards-shadow fill-absolute");
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
      var el1 = dom.createTextNode("\n");
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
      ["content","word-description",["loc",[null,[25,30],[25,50]]]]
    ],
    locals: [],
    templates: []
  };
}()));

Ember.TEMPLATES["book/learnToolbox"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.0+535f74cc",
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

Ember.TEMPLATES["components/speachpart-block"] = Ember.HTMLBars.template((function() {
  var child0 = (function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@2.0.0+535f74cc",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 5
            },
            "end": {
              "line": 11,
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
          ["content","translation.value",["loc",[null,[10,6],[10,27]]]]
        ],
        locals: ["translation"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@2.0.0+535f74cc",
        "loc": {
          "source": null,
          "start": {
            "line": 4,
            "column": 2
          },
          "end": {
            "line": 14,
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
        ["attribute","title",["concat",[["get","data.bookword.word.value",["loc",[null,[6,30],[6,54]]]]]]],
        ["content","data.bookword.word.value",["loc",[null,[6,58],[6,86]]]],
        ["block","each",[["get","data.translations",["loc",[null,[9,13],[9,30]]]]],[],0,null,["loc",[null,[9,5],[11,14]]]]
      ],
      locals: ["data"],
      templates: [child0]
    };
  }());
  return {
    meta: {
      "revision": "Ember@2.0.0+535f74cc",
      "loc": {
        "source": null,
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 16,
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
      dom.setAttribute(el2,"class","table table-striped");
      var el3 = dom.createTextNode("\n");
      dom.appendChild(el2, el3);
      var el3 = dom.createComment("");
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("	");
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
      morphs[1] = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
      return morphs;
    },
    statements: [
      ["content","title",["loc",[null,[2,24],[2,33]]]],
      ["block","each",[["get","words",["loc",[null,[4,10],[4,15]]]]],[],0,null,["loc",[null,[4,2],[14,11]]]]
    ],
    locals: [],
    templates: [child0]
  };
}()));

Ember.TEMPLATES["components/word-description"] = Ember.HTMLBars.template((function() {
  return {
    meta: {
      "revision": "Ember@2.0.0+535f74cc",
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