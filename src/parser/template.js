// Generated automatically by nearley, version 2.19.5
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  // https://www.mediawiki.org/wiki/Markup_spec/EBNF#Includes
  // Maybe not the ideal syntax yet
  // Do we even need the lexer??
  const moo = require('moo');

  const lexer = moo.compile({
    START:  "{{",
    END:   "}}",
    WS: { match: /[\s]+/, lineBreaks: true },
    text: { match: /[^|={}]+/, lineBreaks: true },
    pipe: "|",
    equal: "="
  });
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "template", "symbols": [(lexer.has("START") ? {type: "START"} : START), "_", "template_name", "_", "parameter", "_", (lexer.has("END") ? {type: "END"} : END)], "postprocess": 
        function(d) {
            return d.flat();
        }
        },
    {"name": "template_name", "symbols": [(lexer.has("text") ? {type: "text"} : text)]},
    {"name": "parameter", "symbols": []},
    {"name": "parameter", "symbols": ["parameter", "_", "part"], "postprocess": 
        function(d) {
            return d.flat();
        }
        },
    {"name": "part", "symbols": ["unamed_argument"]},
    {"name": "part", "symbols": ["named_argument"], "postprocess": 
        function(d) {
            return d[0];
        }
        },
    {"name": "named_argument", "symbols": [(lexer.has("pipe") ? {type: "pipe"} : pipe), "_", (lexer.has("text") ? {type: "text"} : text), "_", (lexer.has("equal") ? {type: "equal"} : equal), "_", (lexer.has("text") ? {type: "text"} : text)], "postprocess": 
        function(d) {
            return {
              type: "parameter",
              name: d[2].value,
              value: d[d.length - 1].value
            };
        }
        },
    {"name": "unamed_argument", "symbols": [(lexer.has("pipe") ? {type: "pipe"} : pipe), "_", (lexer.has("text") ? {type: "text"} : text)], "postprocess": 
        function(d) {
            return {
              type: "parameter",
              name: null,
              value: d[d.length - 1].value
            };
        }
        },
    {"name": "_", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "_", "symbols": []}
]
  , ParserStart: "template"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
