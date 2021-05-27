# paco-js
Parser combinators for the browser

File [parsers.js](https://github.com/Muzietto/paco-js/blob/master/src/parsers.js) contains an implementation of __chainable parser combinators__, featuring both __applicative__ and __monadic__ interfaces.

The complete parsers namespace is:

    {
      parser,
      charParser,
      digitParser,
      predicateBasedParser,
      pchar,
      pdigit,
      andThen,
      andThenBind,
      orElse,
      fail,
      succeed,
      choice,
      anyOf,
      lowercaseP,
      uppercaseP,
      letterP,
      digitP,
      whiteP,
      fmap,
      returnP,
      applyPx,
      applyP,
      lift2,
      sequenceP,
      sequenceP2,
      pstring,
      stringP,
      zeroOrMore,
      many,
      manyChars,
      many1,
      manyChars1,
      opt,
      optBook,
      discardSecond,
      discardFirst,
      sepBy1Book,
      sepBy1,
      between,
      betweenParens,
      bindP,
      tapP,
      logP,
      pword,
      trimP,
     }

## how to use

- import parsers from 'paco-js';

Test page for all the parsers (works also as progressive tutorial) is [here](https://muzietto.github.io/geiesmonads/parsers/Mocha_Parser_Combinators_Tests.html).

Live examples page is [here](https://muzietto.github.io/geiesmonads/parsers/Console_Parser_Examples.html). Open devtools to see how the code works.

More examples - a complete converter from Markdown to HTML - are provided [here](https://github.com/Muzietto/paco-js/tree/master/samples/markdown2html).

NB - with a big credit due to [Understanding Parser Combinators](https://fsharpforfunandprofit.com/posts/understanding-parser-combinators/) and to [Paco](https://github.com/gabrielelana/paco).

This project is being maintained during [![Open Source Saturday](https://img.shields.io/badge/%E2%9D%A4%EF%B8%8F-open%20source%20saturday-F64060.svg)](https://www.meetup.com/it-IT/Open-Source-Saturday-Milano/)
