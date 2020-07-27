import * as nearley from 'nearley';
import * as grammar from './template';

const parseTempalteString = function (text) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(text);
  const results = parser.results;
  
  return results;
};

console.log(
  'parseTempalteString',
  parseTempalteString('{{wikidata | test=1}}')
);
