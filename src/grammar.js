// Generated automatically by nearley, version 2.19.5
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const moo = require('moo')
    let lexer = moo.states({
      main: {
        blob: /.*?/,
        left_curly: {match: "{{", push: 'includes'},
      },
      includes: {
        right_curly: {match: "{{", pop: 1},
        WS: { match: /[\s]+/, lineBreaks: true },
        left_curly: "{{",
        right_curly: "}}",
        text: /[^|=}\n]+/,
        pipe: "|",
        equal: "=",
      }
    });
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "body", "symbols": []},
    {"name": "body", "symbols": ["body", "_", "block"]},
    {"name": "block", "symbols": ["template"]},
    {"name": "block", "symbols": ["blob"]},
    {"name": "template", "symbols": [(lexer.has("left_curly") ? {type: "left_curly"} : left_curly), (lexer.has("text") ? {type: "text"} : text), "parameter", (lexer.has("right_curly") ? {type: "right_curly"} : right_curly)]},
    {"name": "blob", "symbols": [(lexer.has("text") ? {type: "text"} : text)]},
    {"name": "_", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "_", "symbols": []},
    {"name": "name", "symbols": [(lexer.has("text") ? {type: "text"} : text)]},
    {"name": "value", "symbols": [(lexer.has("text") ? {type: "text"} : text)]},
    {"name": "parameter", "symbols": []},
    {"name": "parameter", "symbols": ["parameter", "_", (lexer.has("pipe") ? {type: "pipe"} : pipe), "_", "name", "_", (lexer.has("equal") ? {type: "equal"} : equal), "_", "value"]}
]
  , ParserStart: "body"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
