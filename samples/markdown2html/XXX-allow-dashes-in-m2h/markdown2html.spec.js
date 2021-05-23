import {
  escapedP,
  separatorP,
  textStringP,
  strongPatternP,
  emPatternP,
  urlP,
  anchorPatternP,
  richTextStringP,
  listItemP,
  ulP,
  markdown2html,
} from './markdown2html';
import { Position } from './lib/tuples';

describe('inside the family of markdown2html components', () => {

  describe('separatorP', () => {
    const separatorPrun = separatorP.run;
    it('detects a strongSeparator or an emSeparator', () => {
      expect(separatorPrun('**').isSuccess).toBe(true);
      expect(separatorPrun('__').isSuccess).toBe(true);
      expect(separatorPrun('_').isSuccess).toBe(true);
      expect(separatorPrun('_qwe').isSuccess).toBe(true);
    });

  });

  describe('escapedP', () => {
    const escapedPrun = escapedP.run;
    it('detects escaped */_ chars', () => {
      expect(escapedPrun('\\*').isSuccess).toBe(true, 'because of stuff1');
      expect(escapedPrun('\\_').isSuccess).toBe(true, 'because of stuff2');
      expect(escapedPrun('_').isSuccess).toBe(false, 'because of stuff3');
      expect(escapedPrun('\\\\*').isSuccess).toBe(false, 'because of stuff4');
    });
  });

  describe('textStringP converts a char string', () => {
    const textStringPrun = textStringP.run;

    it('with interpunction', () => {
      const text = 'test, string:.';
      expect(textStringPrun(text).value[0]).toEqual(text, 'test string is fully parseable');
    });

    it('accepting dashes inbetween', () => {
      const text = 'te-st, -string:.';
      expect(textStringPrun(text).value[0]).toEqual('te-st, -string:.', 'dashes inbetween are fully parseable');
    });

    it('refusing dashes+spaces at the start of the string (they mean <li>)', () => {
      const text = Position.fromText('- test string:.');
      expect(textStringPrun(text).isFailure).toBe(true);
    });

    it('refusing dashes at the start of the string or of a new line', () => {
      const text2 = 'te\\n-st, -string:.';
      expect(textStringPrun(text2).value[0]).toEqual('te', 'dashes at start of line will not match');
    });

    it('stopping in front of * and _', () => {
      expect(textStringPrun('test *string').value[0]).toEqual('test ', '"test *string" parses to "test "');
      expect(textStringPrun('test _string').value[0]).toEqual('test ', '"test _string" parses to "test "');
      expect(textStringPrun('test *string').value[1].rest()).toEqual('*string', '"test *string" rests "*string"');
      expect(textStringPrun('test _string').value[1].rest()).toEqual('_string', '"test _string" rests "_string"');
    });

    it('stopping in front of ** and __', () => {
      expect(textStringPrun('test **string').value[0]).toEqual('test ', '"test **string" parses to "test "');
      expect(textStringPrun('test __string').value[0]).toEqual('test ', '"test __string" parses to "test "');
      expect(textStringPrun('test **string').value[1].rest()).toEqual('**string', '"test **string" rests "**string"');
      expect(textStringPrun('test __string').value[1].rest()).toEqual('__string', '"test __string" rests "__string"');
    });

    it('accepting escaped * and _', () => {
      expect(textStringPrun('test \\* string').value[0]).toEqual('test * string', '"test \\* string" parses to "test * test"');
      expect(textStringPrun('test \\_ string').value[0]).toEqual('test _ string', '"test \\_ string" parses to "test _ test"');
      expect(textStringPrun('test \\* string').value[1].rest()).toEqual('', '"test \\* string" parses completely');
      expect(textStringPrun('test \\_ string').value[1].rest()).toEqual('', '"test \\_ string" parses completely');
    });

    it('escaping chars that HTML would misunderstand', () => {
      expect(textStringPrun('&<>"').value[0]).toEqual('&amp&lt&gt&quot', 'html-sensible chars are escaped');
      expect(textStringPrun('ciao <a href="www.google.com">mamma</a>').value[0]).toEqual('ciao &lta href=&quotwww.google.com&quot&gtmamma&lt/a&gt', 'html tags are escaped');
    });
  });

  describe('strongPatternP', () => {
    const strongPatternPrun = strongPatternP.run;
    it('converts a plain strong', () => {
      expect(strongPatternPrun('**strong thing**').value[0]).toEqual('<strong>strong thing</strong>', '"**strong thing**" parses to "<strong>strong thing</strong>"');
      expect(strongPatternPrun('__strong thing__').value[0]).toEqual('<strong>strong thing</strong>', '"__strong thing__" parses to "<strong>strong thing</strong>"');
      expect(strongPatternPrun('**strong thing**').value[1].rest()).toEqual('', '"**strong thing**" parses completely');
      expect(strongPatternPrun('__strong thing__').value[1].rest()).toEqual('', '"__strong thing__" parses completely');
    });
    it('discards CRs', () => {
      expect(strongPatternPrun('**strong thing**\\n').value[0]).toEqual('<strong>strong thing</strong>', 'strong pattern discards trailing CRs');
    });
    it('detects escaped stuff and strange chars', () => {
      expect(strongPatternPrun('**strong \\_ thing**').value[0]).toEqual('<strong>strong _ thing</strong>', '"**strong \\_ thing**" parses to "<strong>strong _ thing</strong>"');
      expect(strongPatternPrun('__strong \\* thing__').value[0]).toEqual('<strong>strong * thing</strong>', '"__strong \\* thing__" parses to "<strong>strong * thing</strong>"');
      expect(strongPatternPrun('**La somma spendibile è di 258,25 €**').value[0])
        .toEqual('<strong>La somma spendibile è di 258,25 €</strong>', 'strong pattern may include strange chars and numbers');
    });
    it('rejects incomplete stuff', () => {
      expect(strongPatternPrun('**strong \\_ thing*').isSuccess).toBe(false, 'incomplete ** pattern');
      expect(strongPatternPrun('__strong \\* thing_').isSuccess).toBe(false, 'incomplete __ pattern');
    });
    it('accepts mixed patterns', () => {
      expect(strongPatternPrun('**strong thing__').value[0]).toEqual('<strong>strong thing</strong>', '"**strong thing__" parses to "<strong>strong thing</strong>"');
      expect(strongPatternPrun('__strong thing**').value[0]).toEqual('<strong>strong thing</strong>', '"__strong thing**" parses to "<strong>strong thing</strong>"');
    });
  });

  describe('emPatternP', () => {
    const emPatternPrun = emPatternP.run;
    it('converts a plain em', () => {
      expect(emPatternPrun('*em t-hing*').value[0]).toEqual('<em>em t-hing</em>', '"*em thing*" parses to "<em>em thing</em>"');
      expect(emPatternPrun('_em thing_').value[0]).toEqual('<em>em thing</em>', '"_em thing_" parses to "<em>em thing</em>"');
      expect(emPatternPrun('*em thing*').value[1].rest()).toEqual('', '"*em thing*" parses completely');
      expect(emPatternPrun('_em thing_').value[1].rest()).toEqual('', '"_em thing_" parses completely');
    });
    it('discards CRs', () => {
      expect(emPatternPrun('*italic thing*\\n').value[0]).toEqual('<em>italic thing</em>', 'em pattern discards trailing CRs');
    });
    it('detects escaped stuff', () => {
      expect(emPatternPrun('*em \\_ thing*').value[0]).toEqual('<em>em _ thing</em>', '"*em \\_ thing*" parses to "<em>em _ thing</em>"');
      expect(emPatternPrun('_em \\* thing_').value[0]).toEqual('<em>em * thing</em>', '"_em \\* thing_" parses to "<em>em * thing</em>"');
    });
    it('rejects incomplete stuff', () => {
      expect(emPatternPrun('*em \\_ thing').isSuccess).toBe(false, 'incomplete * pattern');
      expect(emPatternPrun('_em \\* thing').isSuccess).toBe(false, 'incomplete _ pattern');
    });
    it('accepts mixed patterns', () => {
      expect(emPatternPrun('*em thing_').value[0]).toEqual('<em>em thing</em>', '"*em thing_" parses to "<em>em thing</em>"');
      expect(emPatternPrun('_em thing*').value[0]).toEqual('<em>em thing</em>', '"_em thing*" parses to "<em>em thing</em>"');
    });
  });

  describe('richTextStringP', () => {
    const richTextStringPrun = richTextStringP.run;
    it('converts a plain string/strong/em', () => {
      expect(richTextStringPrun('plain text str-ing').value[0]).toEqual('plain text str-ing', 'richTextStringP parses plain strings');
      expect(richTextStringPrun('**strong**').value[0]).toEqual('<strong>strong</strong>', 'richTextStringP parses strongs');
      expect(richTextStringPrun('*em*').value[0]).toEqual('<em>em</em>', 'richTextStringP parses ems');
    });
    it('converts a string containing bolds and ems', () => {
      expect(richTextStringPrun('plain **te-xt** string').value[0]).toEqual('plain <strong>te-xt</strong> string', 'richTextStringP parses plain strings');
      expect(richTextStringPrun('plain **text** string with _ems_ all **over** the place').value[0]).toEqual('plain <strong>text</strong> string with <em>ems</em> all <strong>over</strong> the place', 'richTextStringP parses messy strings');
    });
    it('discards CRs', () => {
      expect(richTextStringPrun('plain **text** string\\n').value[0]).toEqual('plain <strong>text</strong> string', 'richTextStringP discards trailing CRs');
    });
    it('accepts many different special chars', () => {
      const testString = '&<>"€$èéìàòù§!?-';
      const parsedString = '&amp&lt&gt&quot€$èéìàòù§!?-';
      expect(richTextStringPrun(testString).value[0]).toEqual(parsedString, 'richTextStringP accepts special chars');
      const testString2 = 'Si può dimostrare che l\'insieme degli assiomi dell\'aritmetica è consistente?';
      expect(richTextStringPrun(testString2).value[0]).toEqual(testString2, 'richTextStringP accepts special chars');
    });
  });

  describe('urlP', () => {
    const urlPrun = urlP.run;
    it('converts well-formed http/https urls', () => {
      expect(urlPrun('http://www.google.com').value[0]).toEqual('http://www.google.com', 'urlP parses http urls');
      expect(urlPrun('http://www.goo-gle.com').value[0]).toEqual('http://www.goo-gle.com', 'urlP parses http urls');
      expect(urlPrun('https://www.goo_gle.com').value[0]).toEqual('https://www.goo_gle.com', 'urlP parses https urls');
      expect(urlPrun('https://www2.google.com/page1.html').value[0]).toEqual('https://www2.google.com/page1.html', 'urlP parses domains with digits');

      expect(urlPrun('https://www2.google.com/page1.html?qwe=12&wer[]=false').value[0]).toEqual('https://www2.google.com/page1.html?qwe=12&wer[]=false', 'urlP parses very complex urls');

    });
    it('rejects poorly-formed urls', () => {
      expect(urlPrun('htps://www.google.com').isSuccess).toBe(false, 'urlP refuses htps://www.google.com');
      expect(urlPrun('https//www.google.com').isSuccess).toBe(false, 'urlP refuses https//www.google.com');
      expect(urlPrun('http://').isSuccess).toBe(false, 'urlP refuses http://');
    });
    it('converts very long and windy urls', () => {
      const xxx = 'http://storelocator.amilon.eu/?p=JhV65WeL61OB3ccJwVbwoEDBUrjEMKI88Vy1mwMTmb%2bgOVR9jlJmPeEhbOt1uDOfICrLHCMwx%2b%2f6hINO7pUFj1aN4jXiJV2x&r=f9895a79-ea5a-4bba-9096-6871abb945fe';
      expect(urlPrun(xxx).value[0]).toEqual(xxx, 'urlP parses complex urls');
    });
  });

  describe('anchorPatternP', () => {
    const anchorPatternPrun = anchorPatternP.run;
    it('converts a plain anchor', () => {
      expect(anchorPatternPrun('[text](http://a.b.c)').value[0]).toEqual('<a target="_blank" href="http://a.b.c">text</a>', 'anchorP accepts simple anchors');
    });
    it('converts strongs/ems inside an anchor text - 1', () => {
      expect(anchorPatternPrun('[**The Carpet Crawlers**](http://bit.ly/2SPMQsZ))').value[0])
        .toEqual('<a target="_blank" href="http://bit.ly/2SPMQsZ"><strong>The Carpet Crawlers</strong></a>', 'anchor parser accepts messy texts - 1');
    });
    it('converts strongs/ems inside an anchor text - 2', () => {
      expect(anchorPatternPrun('[text **strong** with _em em em_ here **we** go](https://www.google.com/page1.html?qwe[]=12)').value[0])
        .toEqual('<a target="_blank" href="https://www.google.com/page1.html?qwe[]=12">text <strong>strong</strong> with <em>em em em</em> here <strong>we</strong> go</a>', 'anchor parser accepts messy texts - 2');
    });
  });

  describe('listItemP', () => {
    const listItemPrun = listItemP.run;
    it('converts a rich-text bulletpoint item', () => {
      const conv = listItemPrun('- ciao, **mamma**; ero *ita-lico*\\n');
      expect(conv.value[0]).toEqual('<li>ciao, <strong>mamma</strong>; ero <em>ita-lico</em></li>', 'listItemP parses <li>s');
    });
  });

  describe('ulP', () => {
    const ulPrun = ulP.run;
    it('converts several rich-text bulletpoint item', () => {
      const conv = ulPrun('- ciao, **mamma**; ero *italico*\\n- ciao, **babbo**; ero *italico*\\n- ciao, **luigi**; ero **forte**');
      expect(conv.value[0])
        .toEqual('<ul><li>ciao, <strong>mamma</strong>; ero <em>italico</em></li><li>ciao, <strong>babbo</strong>; ero <em>italico</em></li><li>ciao, <strong>luigi</strong>; ero <strong>forte</strong></li></ul>', 'ulP parses <ul>s');
    });
  });

  describe('markdown2html, the real thing,', () => {
    it('is here for custom testing (just fill text param)', () => {
      const text = '';
      expect(markdown2html(text).value[0]).toEqual('');
    });
    it('bounces empty strings', () => {
      expect(markdown2html('').value[0]).toEqual('', 'empty strings must be bounced');
    });
    describe('while wrapping its result inside a <span>', () => {
      it('converts a messy string without lists - 1', () => {
        const input = 'Here: _italic people_ [and __here, bold__ I am](https://a.d.foo) *sense is the* past ten**se** for you.';
        const output = '<span class="m2k">Here: <em>italic people</em> <a target="_blank" href="https://a.d.foo">and <strong>here, bold</strong> I am</a> <em>sense is the</em> past ten<strong>se</strong> for you.</span>';
        expect(markdown2html(input).value[0]).toEqual(output, 'messy string without lists 1 must succeed');
      });
      it('converts a messy string without lists - 2', () => {
        const input = 'Prodotto _proposto_ da [asd **The Carpet Crawlers**](http://bit.ly/2SPMQsZ)';
        const output = '<span class="m2k">Prodotto <em>proposto</em> da <a target="_blank" href="http://bit.ly/2SPMQsZ">asd <strong>The Carpet Crawlers</strong></a></span>';
        expect(markdown2html(input).value[0]).toEqual(output, 'messy string without lists 2 must succeed');
      });
      it('converts a messy string with lists', () => {
        const input = 'Here: _italic people_ [and __here, bold__ I am](https://a.d.foo)\\n- *sense is the* past\\n- ten**se** for\\n- you.';
        const output = '<span class="m2k">Here: <em>italic people</em> <a target="_blank" href="https://a.d.foo">and <strong>here, bold</strong> I am</a><ul><li><em>sense is the</em> past</li><li>ten<strong>se</strong> for</li><li>you.</li></ul></span>';
        expect(markdown2html(input).value[0]).toEqual(output, 'messy string with lists must succeed');
      });
      it('leaves alone non-markdown input (but removes CR\'s)', () => {
        const input = 'Nel mezzo del cammin di nostra vita\\nmi ritrovai per una selva oscura\\nchè la diritta via era smarrita.';
        const output = '<span class="m2k">Nel mezzo del cammin di nostra vitami ritrovai per una selva oscurachè la diritta via era smarrita.</span>';
        expect(markdown2html(input).value[0]).toEqual(output, 'non-markdown string must succeed');
        expect(markdown2html(input).value[1].rest()).toEqual('');
      });

      it('converts texts containing very long and windy urls', () => {
        const xxx = 'Puoi spen---dere i buoni acquisto nei [punti vendita](http://storelocator.amilon.eu/?p=JhV65WeL61OB3ccJwVbwoEDBUrjEMKI88Vy1mwMTmb%2bgOVR9jlJmPeEhbOt1uDOfICrLHCMwx%2b%2f6hINO7pUFj1aN4jXiJV2x&r=f9895a79-ea5a-4bba-9096-6871abb945fe) aderenti all\'iniziativa.';
        expect(markdown2html(xxx).value[0]).toEqual('<span class="m2k">Puoi spen---dere i buoni acquisto nei <a target="_blank" href="http://storelocator.amilon.eu/?p=JhV65WeL61OB3ccJwVbwoEDBUrjEMKI88Vy1mwMTmb%2bgOVR9jlJmPeEhbOt1uDOfICrLHCMwx%2b%2f6hINO7pUFj1aN4jXiJV2x&r=f9895a79-ea5a-4bba-9096-6871abb945fe">punti vendita</a> aderenti all\'iniziativa.</span>', 'markdown2html parses strings containing complex urls');
      });
    });
    describe('checks first of all for trailing <span>s', () => {
      it('and fails when they are found', () => {
        const trailingSpan = '<span class="m2k">whatever _is_ wrong</span>';
        expect(markdown2html(trailingSpan).isSuccess).toBe(false, 'trailing <span>s cause m2k translator to fail');
      });
      it('and converts when they are not found', () => {
        const input = 'whatever _is_ wrong';
        const output = '<span class="m2k">whatever <em>is</em> wrong</span>';
        expect(markdown2html(input).value[0]).toEqual(output, 'no trailing <span>s means convert');
      });
    });
    it('does not mix up parentheses', () => {
      expect(markdown2html('([ciao](http://we.er))').value[0]).toEqual('<span class="m2k">(<a target="_blank" href="http://we.er">ciao</a>)</span>');
    });
  });
});
