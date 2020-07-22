import { createToken, Lexer, CstParser } from 'chevrotain';

// ----------------- Lexer -----------------
const LCurly = createToken({ name: 'LCurly', pattern: /{{/ });
const RCurly = createToken({ name: 'RCurly', pattern: /}}/ });
const Equal = createToken({ name: 'Equal', pattern: /=/ });
const Pipe = createToken({ name: 'Pipe', pattern: /\|/ });
const TextType = createToken({
  name: 'TextType',
  pattern: /[^|={}]+/,
});
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const AllTokens = [WhiteSpace, Equal, RCurly, LCurly, Pipe, TextType];

const DepLexer = new Lexer(AllTokens, {
  // Less position info tracked, reduces verbosity of the playground output.
  positionTracking: 'onlyStart',
});

// Labels only affect error messages and Diagrams.
LCurly.LABEL = "'{{'";
RCurly.LABEL = "'}}'";
Equal.LABEL = "'='";
Pipe.LABEL = "'|'";
TextType.LABEL = 'Text';

// Reference for the wikitext ENBF spec
// https://www.mediawiki.org/wiki/Markup_spec/EBNF#Includes
class DepParser extends CstParser {
  constructor() {
    super(AllTokens, {
      recoveryEnabled: false,
    });
    this.performSelfAnalysis();
  }

  public template = this.RULE('template', () => {
    this.CONSUME(LCurly);
    this.SUBRULE(this.title);
    this.MANY(() => {
      this.SUBRULE(this.parameter);
    });
    this.CONSUME(RCurly);
  });

  private parameter = this.RULE('parameter', () => {
    this.CONSUME(Pipe);
    this.OPTION(() => {
      this.SUBRULE(this.name);
      this.CONSUME(Equal);
    });
    this.SUBRULE(this.value);
  });

  private value = this.RULE('value', () => {
    this.CONSUME(TextType);
  });

  private title = this.RULE('title', () => {
    this.CONSUME(TextType);
  });

  private name = this.RULE('name', () => {
    this.CONSUME(TextType);
  });
}

const parser = new DepParser();

const parseText = function (text) {
    const lexResult = DepLexer.tokenize(text);
  parser.input = lexResult.tokens;
  const cst = parser.template();

  return {
    cst: cst,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors,
  };
};

export const lex = function (inputText) {
  const lexingResult = DepLexer.tokenize(inputText);

  if (lexingResult.errors.length > 0) {
    throw Error('Lexing errors detected');
  }

  return lexingResult;
};
