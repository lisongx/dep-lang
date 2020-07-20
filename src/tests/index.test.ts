import { lex } from '..';

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
    expect(tokens[1].tokenType.name).toEqual('TextType');
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
