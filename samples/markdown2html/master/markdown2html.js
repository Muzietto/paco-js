import { pchar, choice, anyOf, sequenceP, pstring, stringP,
  discardFirst, between, betweenParens, letterP, digitP,
  manyChars, manyChars1, opt, many1, fail, succeed,
} from '@src/models/products/markdown2html/lib/parsers';

const escapedStarP = discardFirst(pchar('\\'), pchar('*'));
const escapedUnderscoreP = discardFirst(pchar('\\'), pchar('_'));
export const escapedP = escapedStarP.orElse(escapedUnderscoreP);

const escapedCrP = discardFirst(pchar('\\'), pchar('n'));

const spaceP = pchar(' ');
const interpunctionP = choice([
  pchar('.'),
  pchar(','),
  pchar(';'),
  pchar(':'),
]);
const symbolicChars = [
  '\'',
  '¢',
  '©',
  '÷',
  'µ',
  '·',
  '¶',
  '±',
  '€',
  '$',
  '£',
  '®',
  '§',
  '™',
  '¥',
  '(', ')',
  'á', 'Á',
  'à', 'À',
  'â', 'Â',
  'å', 'Å',
  'ã', 'Ã',
  'ä', 'Ä',
  'æ', 'Æ',
  'ç', 'Ç',
  'é', 'É',
  'è', 'È',
  'ê', 'Ê',
  'ë', 'Ë',
  'í', 'Í',
  'ì', 'Ì',
  'î', 'Î',
  'ï', 'Ï',
  'ñ', 'Ñ',
  'ó', 'Ó',
  'ò', 'Ò',
  'ô', 'Ô',
  'ø', 'Ø',
  'õ', 'Õ',
  'ö', 'Ö',
  'ú', 'Ú',
  'ù', 'Ù',
  'û', 'Û',
  'ü', 'Ü',
  'ß', 'ÿ',
  '!',
  '?',
  '/',
  '=',
];
const symbolicCharsP = anyOf(symbolicChars);

const htmlEscapes = [
  { char: '&', mapper: () => '&amp' },
  { char: '<', mapper: () => '&lt' },
  { char: '>', mapper: () => '&gt' },
  { char: '"', mapper: () => '&quot' },
];

const htmlEscapableCharsP = choice(htmlEscapes
  .map(({ char, mapper }) => pchar(char).fmap(mapper)));

const whateverP = choice([
  letterP,
  digitP,
  spaceP,
  escapedP,
  interpunctionP,
  symbolicCharsP,
  pchar('’').fmap(() => '\''),
]);

const validCharP = choice([
  whateverP,
  htmlEscapableCharsP,
]);

export const textStringP = manyChars1(validCharP);

const strongSeparatorP = pstring('**').orElse(pstring('__')).setLabel('strong');
const emSeparatorP = pstring('*').orElse(pstring('_')).setLabel('em');
export const separatorP = strongSeparatorP.orElse(emSeparatorP);

export const strongPatternP = strongSeparatorP
  .discardFirst(textStringP)
  .discardSecond(strongSeparatorP.andThen(opt(escapedCrP)))
  .fmap(str => `<strong>${str}</strong>`);

export const emPatternP = emSeparatorP
  .discardFirst(textStringP)
  .discardSecond(emSeparatorP.andThen(opt(escapedCrP)))
  .fmap(str => `<em>${str}</em>`);

export const richTextStringP = many1(choice([
  textStringP,
  strongPatternP,
  emPatternP,
]))
  .discardSecond(opt(escapedCrP))
  .fmap(res => res.join(''));

const betweenSquaresP = between(pchar('['), richTextStringP, pchar(']'));

export const urlP = sequenceP([
  stringP('http'),
  opt(pchar('s')).fmap(res => (res.isNothing ? '' : res.get())),
  stringP('://'),
  many1(choice([
    letterP,
    digitP,
    pchar('%'),
    pchar('.'),
    pchar('/'),
    pchar('?'),
    pchar('&'),
    pchar('['),
    pchar(']'),
    pchar('='),
    pchar('-'),
    pchar('_'),
    pchar(','),
  ])).fmap(res => res.join('')),
]).fmap(res => res.join(''));

export const anchorPatternP =
  betweenSquaresP
    .andThen(betweenParens(urlP))
    .discardSecond(opt(escapedCrP))
    .fmap(([text, url]) => `<a target="_blank" href="${url}">${text}</a>`);

const dashP = pchar('-');
export const listItemP = sequenceP([dashP, spaceP])
  .discardFirst(richTextStringP)
  .fmap(res => `<li>${res}</li>`);

export const ulP = many1(listItemP)
  .fmap(items => `<ul>${items.join('')}</ul>`);

const _markdown2htmlP = many1(choice([
  ulP,
  richTextStringP,
  anchorPatternP,
])).fmap(res => `<span class="m2k">${res.join('')}</span>`);

export function markdown2html(inputText) {
  if (inputText === '') return succeed.fmap(() => '').run(inputText);
  const guard = choice([
    stringP('<span class="m2k">'),
    manyChars(whateverP).andThen(stringP('<strong>')),
    manyChars(whateverP).andThen(stringP('<em>')),
    manyChars(whateverP).andThen(stringP('<a ')),
    manyChars(whateverP).andThen(stringP('<ul>')),
  ]).run(inputText);
  if (guard.isSuccess) {
    return fail.run(inputText);
  }
  return _markdown2htmlP.run(inputText);
}

function m2h(inputText) {
  if (inputText === '') return '';
  const translated = markdown2html(inputText);
  const m2hOk = (translated.isSuccess && !translated.value[1].rest());
  return (m2hOk) ? `${translated.value[0]}` : `${inputText}`;
}

export default m2h;
