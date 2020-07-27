@{%
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
%}

@lexer lexer

template -> %START _ template_name _ parameter _ %END {%
    function(d) {
        return d.flat();
    }
%}

template_name -> %text

parameter ->  null | parameter _ part {%
    function(d) {
        return d.flat();
    }
%}

part -> unamed_argument | named_argument {%
    function(d) {
        return d[0];
    }
%}

named_argument -> %pipe _ %text _ %equal _ %text{%
    function(d) {
        return {
          type: "parameter",
          name: d[2].value,
          value: d[d.length - 1].value
        };
    }
%}

unamed_argument -> %pipe _ %text{%
    function(d) {
        return {
          type: "parameter",
          name: null,
          value: d[d.length - 1].value
        };
    }
%}

_ -> %WS | null
