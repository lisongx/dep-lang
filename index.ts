import { createToken, Lexer, CstParser } from "chevrotain";

// ----------------- Lexer -----------------
const LCurly = createToken({ name: "LCurly", pattern: /{{/ });
const RCurly = createToken({ name: "RCurly", pattern: /}}/ });
const Equal = createToken({ name: "Equal", pattern: /=/ });
const Pipe = createToken({ name: "Pipe", pattern: /\|/ });
const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
});
const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /"123"/,
});
const TextType = createToken({
  name: "TextType",
  pattern: /[^|={}]+/,
});

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

const AllTokens = [
  WhiteSpace,
  NumberLiteral,
  StringLiteral,
  RCurly,
  LCurly,
  TextType,
  Equal,
  Pipe,
];

const DepLexer = new Lexer(AllTokens, {
  // Less position info tracked, reduces verbosity of the playground output.
  positionTracking: "onlyStart",
});

// Labels only affect error messages and Diagrams.
LCurly.LABEL = "'{{'";
RCurly.LABEL = "'}}'";
Equal.LABEL = "'='";
Pipe.LABEL = "'|'";
TextType.LABEL = "Text";

// ----------------- parser -----------------
class DepParser extends CstParser {
  constructor() {
    super(AllTokens, {
      recoveryEnabled: false,
    });
    this.performSelfAnalysis();
  }

  public template = this.RULE("template", () => {
    this.CONSUME(LCurly);
    this.SUBRULE(this.title);
    this.MANY(() => {
      this.SUBRULE(this.parameter);
    });
    this.CONSUME(RCurly);
  });

  private parameter = this.RULE("parameter", () => {
    this.CONSUME(Pipe);
    this.OPTION(() => {
      this.SUBRULE(this.name);
      this.CONSUME(Equal);
    });
    this.SUBRULE(this.value);
  });

  private value = this.RULE("value", () => {
    this.CONSUME(TextType);
  });

  private title = this.RULE("title", () => {
    this.CONSUME(TextType);
  });

  private name = this.RULE("name", () => {
    this.CONSUME(TextType);
  });
}

const parser = new DepParser();

const parseText = function (text) {
  console.log("Parsing", text);
  const lexResult = DepLexer.tokenize(text);
  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens;
  // any top level rule may be used as an entry point
  const cst = parser.template();

  // console.dir(cst, {depth: null, colors: true})
  console.log("lexErrors", lexResult.errors);
  console.log("parseErrors", parser.errors);
  console.log("cst", cst);
  console.dir(cst, { depth: null, colors: true });
  // console.log('cst.children.part', cst.children.parameter[0]['children'])

  return {
    cst: cst,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors,
  };
};

parseText("{{Template|val1=tes22|anotherval22=test222|anotherother}}");
