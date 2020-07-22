@{%
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
%}

@lexer lexer

body -> null | body _ block

block -> template | blob

template -> %left_curly %text parameter %right_curly

blob -> %text

_ -> %WS | null

name -> %text

value -> %text

parameter -> null | parameter _ %pipe _ name _ %equal _ value
