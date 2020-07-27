import { lex } from '../parser';
import parse from '../parser';

describe('Lexer', () => {
  it('Can Lex a barre template call', () => {
    const inputText = '{{myTemplate}}';
    const lexingResult = lex(inputText);

    expect(lexingResult.errors).toStrictEqual([]);

    const tokens = lexingResult.tokens;
    expect(tokens).toHaveLength(3);
    expect(tokens[0].image).toEqual('{{');
    expect(tokens[0].tokenType.name).toEqual('LCurly');
    expect(tokens[1].image).toEqual('myTemplate');
    expect(tokens[1].tokenType.name).toEqual('Text');
    expect(tokens[2].image).toEqual('}}');
    expect(tokens[2].tokenType.name).toEqual('RCurly');
  });

  it('Can Lex a template call with mul args', () => {
    const inputText = '{{wd|q1=id1|unnamed}}';
    const lexingResult = lex(inputText);

    expect(lexingResult.errors).toStrictEqual([]);

    const tokens = lexingResult.tokens;
    expect(tokens).toHaveLength(9);
    const images = tokens.map((_) => _.image);

    expect(images).toEqual([
      '{{',
      'wd',
      '|',
      'q1',
      '=',
      'id1',
      '|',
      'unnamed',
      '}}',
    ]);
  });
});

describe('Parsing', () => {
  it('Can parse a simple template call', () => {
    const inputText = '{{myTemplate }}';
    const result = parse(inputText);
    expect(result.name).toBe('myTemplate');
  });

  it('Can parse a template call with 1 unnamed argument', () => {
    const inputText = '{{wikidata|Q42}}';
    const result = parse(inputText);
    expect(result.name).toBe('wikidata');
    expect(result.parameter).toHaveLength(1);
    expect(result.parameter[0].name).toBeUndefined();
    expect(result.parameter[0]).toHaveProperty('value', 'Q42');
  });

  it('Can parse a template call with 1 named argument and extra spaces', () => {
    const inputText = '{{wikidata | property =  P21  }}';
    const result = parse(inputText);
    expect(result.name).toBe('wikidata');
    expect(result.parameter).toHaveLength(1);
    expect(result.parameter[0]).toHaveProperty('name', 'property');
    expect(result.parameter[0]).toHaveProperty('value', 'P21');
  });

  it('Can parse a template call with many arguments', () => {
    const inputText = '{{wikidata | Q44 | property =  P21 | date= 1700-05-06}}';
    const result = parse(inputText);
    expect(result.name).toBe('wikidata');
    expect(result.parameter).toHaveLength(3);
    expect(result.parameter[0]).toHaveProperty('name', undefined);
    expect(result.parameter[0]).toHaveProperty('value', 'Q44');
    expect(result.parameter[1]).toHaveProperty('name', "property");
    expect(result.parameter[1]).toHaveProperty('value', 'P21');
    expect(result.parameter[2]).toHaveProperty('name', "date");
    expect(result.parameter[2]).toHaveProperty('value', '1700-05-06');

  });
});
