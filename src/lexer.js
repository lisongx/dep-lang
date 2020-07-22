const moo = require('moo');

let lexer = moo.states({
    main: {
      left_curly: {match: "{{", push: 'includes'},
      blob: {match:/[^{]+/, lineBreaks: true},
    },
    includes: {
      right_curly: {match: "}}", pop: 1},
      WS: { match: /[\s]+/, lineBreaks: true },
      text: { match: /[^|=}]+/, lineBreaks: true },
      pipe: "|",
      equal: "=",
    }
});

lexer.reset("tes||t}}=\n===test{{wikidata|param1=2ss|test=2}}")

console.log(lexer.next())
console.log(lexer.next())
console.log(lexer.next())
console.log(lexer.next())
console.log(lexer.next())
console.log(lexer.next())
console.log(lexer.next())
console.log(lexer.next())
