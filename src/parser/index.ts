import { createToken, Lexer, CstParser } from 'chevrotain';

// ----------------- Lexer -----------------
const LCurly = createToken({ name: 'LCurly', pattern: /{{/ });
const RCurly = createToken({ name: 'RCurly', pattern: /}}/ });
const Equal = createToken({ name: 'Equal', pattern: /=/ });
const Pipe = createToken({ name: 'Pipe', pattern: /\|/ });
const Text = createToken({
  name: 'Text',
  pattern: /[^|={}]+/,
});
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const AllTokens = [WhiteSpace, Equal, RCurly, LCurly, Pipe, Text];

const DepLexer = new Lexer(AllTokens, {
  // Less position info tracked, reduces verbosity of the playground output.
  positionTracking: 'onlyStart',
});

// Labels only affect error messages and Diagrams.
LCurly.LABEL = "'{{'";
RCurly.LABEL = "'}}'";
Equal.LABEL = "'='";
Pipe.LABEL = "'|'";
Text.LABEL = 'Text';

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
    this.CONSUME(Text);
  });

  private title = this.RULE('title', () => {
    this.CONSUME(Text);
  });

  private name = this.RULE('name', () => {
    this.CONSUME(Text);
  });
}

const parser = new DepParser();

const BaseTemplateVisitorWithDefaults = parser.getBaseCstVisitorConstructorWithDefaults();

class TemplateVisitor extends BaseTemplateVisitorWithDefaults {
  constructor() {
    super();
    this.validateVisitor();
  }

  template(ctx) {
    const parameter = ctx.parameter && ctx.parameter.map((p) => this.visit(p));

    return {
      name: this.visit(ctx.title).name,
      parameter: parameter || [],
    };
  }

  title(ctx) {
    return { name: ctx.Text[0].image.trim() };
  }

  parameter(ctx) {
    return {
      type: 'PARAMETER',
      name: ctx.name && ctx.name[0].children.Text[0].image.trim(),
      value: ctx.value[0].children.Text[0].image.trim(),
    };
  }
}

const templateVisitor = new TemplateVisitor();

const parseTemplateString = function (text) {
  const lexResult = DepLexer.tokenize(text);
  parser.input = lexResult.tokens;
  const cst = parser.template();

  if (parser.errors.length > 0) {
    throw new Error('sad sad panda, Parsing errors detected');
  }

  // return {
  //   cst: cst,
  //   ast: templateVisitor.visit(cst),
  //   lexErrors: lexResult.errors,
  //   parseErrors: parser.errors,
  // };

  return templateVisitor.visit(cst);
};

export const lex = function (inputText) {
  const lexingResult = DepLexer.tokenize(inputText);

  if (lexingResult.errors.length > 0) {
    throw Error('Lexing errors detected');
  }

  return lexingResult;
};

export default parseTemplateString;
