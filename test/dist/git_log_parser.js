define(['exports', './lib/parsers'], function (exports, _parsers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.lineP = undefined;

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var array2String = function array2String(arr) {
    return arr.join('');
  };

  var lineP = exports.lineP = function lineP(parser) {
    return parser.discardSecond((0, _parsers.pchar)('\n')).setLabel('On one line: ' + parser.label);
  };
  var symbolicCharP = (0, _parsers.anyOf)(symbolicChars());
  var numberP = (0, _parsers.many1)(_parsers.digitP).fmap(function (res) {
    return parseInt(res.join(''), 10);
  });
  var whateverP = (0, _parsers.many)((0, _parsers.choice)([_parsers.letterP, _parsers.digitP, _parsers.whiteP, symbolicCharP])).fmap(array2String).setLabel('Parsing whatever...');

  var weekdayP = (0, _parsers.choice)(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(_parsers.stringP));
  var monthP = (0, _parsers.choice)(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(_parsers.stringP));
  var yearP = (0, _parsers.many)(_parsers.digitP, 4).fmap(array2String);
  var timezoneP = (0, _parsers.pchar)('+').andThen(yearP).fmap(array2String);
  var daytimeP = (0, _parsers.sequenceP)([numberP, (0, _parsers.pchar)(':'), numberP, (0, _parsers.pchar)(':'), numberP]).fmap(array2String);

  var dateP = (0, _parsers.sequenceP)([weekdayP, _parsers.whiteP, monthP, _parsers.whiteP, numberP, _parsers.whiteP, daytimeP, _parsers.whiteP, yearP, _parsers.whiteP, timezoneP]).fmap(array2String); // ready for new Date(res)

  var firstLineP = lineP(dateP);

  var filenameP = (0, _parsers.many1)((0, _parsers.choice)([_parsers.letterP, _parsers.digitP, (0, _parsers.pchar)('/')])).fmap(array2String);

  var secondLineP = lineP(_parsers.whiteP.discardFirst(filenameP).discardSecond(whateverP));

  var insertionsP = numberP.discardSecond((0, _parsers.sequenceP)([_parsers.whiteP, (0, _parsers.pstring)('insertion'), (0, _parsers.opt)((0, _parsers.pchar)('s')), (0, _parsers.stringP)('(+)')]));
  var deletionsP = numberP.discardSecond((0, _parsers.sequenceP)([_parsers.whiteP, (0, _parsers.pstring)('deletion'), (0, _parsers.opt)((0, _parsers.pchar)('s')), (0, _parsers.stringP)('(-)')]));

  var thirdLineP = lineP((0, _parsers.sequenceP)([whateverP, (0, _parsers.pchar)(','), _parsers.whiteP]).discardFirst((0, _parsers.sequenceP)([(0, _parsers.opt)(insertionsP), (0, _parsers.opt)((0, _parsers.sequenceP)([(0, _parsers.pchar)(','), _parsers.whiteP])), (0, _parsers.opt)(deletionsP)]))).fmap(function (_ref) {/* TODO operations here */

    var _ref2 = _slicedToArray(_ref, 3),
        maybeInsertions = _ref2[0],
        maybeSeparator = _ref2[1],
        maybeDeletions = _ref2[2];
  }); // deltaRows

  //const commitP = ... // res = Tuple.Couple(filename, Tuple.Couple(date, deltaRows))

  //const fileHistorySeparatorP = ...

  //const fileHistoryP = ... // Tuple.Couple(filename, Tuple.Couple[](data, filesize))

  //const gitLogFileP = ... // Tuple.Couple(filename, Tuple.Couple[](data, filesize))[]

  function symbolicChars() {
    return ['/', '+', '-', '|', '\'', '¢', '©', '÷', 'µ', '·', '¶', '±', '€', '$', '£', '®', '§', '™', '¥', '(', ')', 'á', 'Á', 'à', 'À', 'â', 'Â', 'å', 'Å', 'ã', 'Ã', 'ä', 'Ä', 'æ', 'Æ', 'ç', 'Ç', 'é', 'É', 'è', 'È', 'ê', 'Ê', 'ë', 'Ë', 'í', 'Í', 'ì', 'Ì', 'î', 'Î', 'ï', 'Ï', 'ñ', 'Ñ', 'ó', 'Ó', 'ò', 'Ò', 'ô', 'Ô', 'ø', 'Ø', 'õ', 'Õ', 'ö', 'Ö', 'ú', 'Ú', 'ù', 'Ù', 'û', 'Û', 'ü', 'Ü', 'ß', 'ÿ', '!', '?', '/', '='];
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzL2dpdF9sb2dfcGFyc2VyLmpzIl0sIm5hbWVzIjpbImFycmF5MlN0cmluZyIsImFyciIsImpvaW4iLCJsaW5lUCIsInBhcnNlciIsImRpc2NhcmRTZWNvbmQiLCJzZXRMYWJlbCIsImxhYmVsIiwic3ltYm9saWNDaGFyUCIsInN5bWJvbGljQ2hhcnMiLCJudW1iZXJQIiwiZGlnaXRQIiwiZm1hcCIsInBhcnNlSW50IiwicmVzIiwid2hhdGV2ZXJQIiwibGV0dGVyUCIsIndoaXRlUCIsIndlZWtkYXlQIiwibWFwIiwic3RyaW5nUCIsIm1vbnRoUCIsInllYXJQIiwidGltZXpvbmVQIiwiYW5kVGhlbiIsImRheXRpbWVQIiwiZGF0ZVAiLCJmaXJzdExpbmVQIiwiZmlsZW5hbWVQIiwic2Vjb25kTGluZVAiLCJkaXNjYXJkRmlyc3QiLCJpbnNlcnRpb25zUCIsImRlbGV0aW9uc1AiLCJ0aGlyZExpbmVQIiwibWF5YmVJbnNlcnRpb25zIiwibWF5YmVTZXBhcmF0b3IiLCJtYXliZURlbGV0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVBLE1BQU1BLGVBQWUsU0FBZkEsWUFBZTtBQUFBLFdBQU9DLElBQUlDLElBQUosQ0FBUyxFQUFULENBQVA7QUFBQSxHQUFyQjs7QUFFTyxNQUFNQyx3QkFBUSxTQUFSQSxLQUFRO0FBQUEsV0FBVUMsT0FBT0MsYUFBUCxDQUFxQixvQkFBTSxJQUFOLENBQXJCLEVBQWtDQyxRQUFsQyxDQUEyQyxrQkFBa0JGLE9BQU9HLEtBQXBFLENBQVY7QUFBQSxHQUFkO0FBQ1AsTUFBTUMsZ0JBQWdCLG9CQUFNQyxlQUFOLENBQXRCO0FBQ0EsTUFBTUMsVUFBVSxvQkFBTUMsZUFBTixFQUFjQyxJQUFkLENBQW1CO0FBQUEsV0FBT0MsU0FBU0MsSUFBSVosSUFBSixDQUFTLEVBQVQsQ0FBVCxFQUF1QixFQUF2QixDQUFQO0FBQUEsR0FBbkIsQ0FBaEI7QUFD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LEVBNENMLEdBNUNLLEVBNENBLEdBNUNBLEVBNkNMLEdBN0NLLEVBNkNBLEdBN0NBLEVBOENMLEdBOUNLLEVBOENBLEdBOUNBLEVBK0NMLEdBL0NLLEVBK0NBLEdBL0NBLEVBZ0RMLEdBaERLLEVBZ0RBLEdBaERBLEVBaURMLEdBakRLLEVBa0RMLEdBbERLLEVBbURMLEdBbkRLLEVBb0RMLEdBcERLLENBQVA7QUFzREQiLCJmaWxlIjoiZ2l0X2xvZ19wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBsZXR0ZXJQLFxuICBkaWdpdFAsXG4gIHdoaXRlUCxcbiAgY2hvaWNlLFxuICBzdHJpbmdQLFxuICBhbnlPZixcbiAgb3B0LCAvLyByZXR1cm5zIGEgU3VjY2VzcyhNYXliZSlcbiAgc2VxdWVuY2VQLCAvLyByZXR1cm5zIGFuIGFycmF5XG4gIG1hbnkxLCAvLyByZXR1cm5zIGEgU3VjY2VzcyhfKVxuICBtYW55LFxuICBwY2hhcixcbiAgcHN0cmluZyxcbn0gZnJvbSAnLi9saWIvcGFyc2Vycyc7XG5cbmNvbnN0IGFycmF5MlN0cmluZyA9IGFyciA9PiBhcnIuam9pbignJyk7XG5cbmV4cG9ydCBjb25zdCBsaW5lUCA9IHBhcnNlciA9PiBwYXJzZXIuZGlzY2FyZFNlY29uZChwY2hhcignXFxuJykpLnNldExhYmVsKCdPbiBvbmUgbGluZTogJyArIHBhcnNlci5sYWJlbCk7XG5jb25zdCBzeW1ib2xpY0NoYXJQID0gYW55T2Yoc3ltYm9saWNDaGFycygpKTtcbmNvbnN0IG51bWJlclAgPSBtYW55MShkaWdpdFApLmZtYXAocmVzID0+IHBhcnNlSW50KHJlcy5qb2luKCcnKSwgMTApKTtcbmNvbnN0IHdoYXRldmVyUCA9IG1hbnkoY2hvaWNlKFtsZXR0ZXJQLCBkaWdpdFAsIHdoaXRlUCwgc3ltYm9saWNDaGFyUF0pKVxuICAuZm1hcChhcnJheTJTdHJpbmcpLnNldExhYmVsKCdQYXJzaW5nIHdoYXRldmVyLi4uJyk7XG5cbmNvbnN0IHdlZWtkYXlQID0gY2hvaWNlKFsnTW9uJywnVHVlJywnV2VkJywnVGh1JywnRnJpJywnU2F0JywnU3VuJ10ubWFwKHN0cmluZ1ApKTtcbmNvbnN0IG1vbnRoUCA9IGNob2ljZShbJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heScsJ0p1bicsJ0p1bCcsJ0F1ZycsJ1NlcCcsJ09jdCcsJ05vdicsJ0RlYyddLm1hcChzdHJpbmdQKSk7XG5jb25zdCB5ZWFyUCA9IG1hbnkoZGlnaXRQLCA0KS5mbWFwKGFycmF5MlN0cmluZyk7XG5jb25zdCB0aW1lem9uZVAgPSAocGNoYXIoJysnKS5hbmRUaGVuKHllYXJQKSkuZm1hcChhcnJheTJTdHJpbmcpO1xuY29uc3QgZGF5dGltZVAgPSBzZXF1ZW5jZVAoW1xuICBudW1iZXJQLFxuICBwY2hhcignOicpLFxuICBudW1iZXJQLFxuICBwY2hhcignOicpLFxuICBudW1iZXJQLFxuXSkuZm1hcChhcnJheTJTdHJpbmcpO1xuXG5jb25zdCBkYXRlUCA9IHNlcXVlbmNlUChbXG4gIHdlZWtkYXlQLFxuICB3aGl0ZVAsXG4gIG1vbnRoUCxcbiAgd2hpdGVQLFxuICBudW1iZXJQLFxuICB3aGl0ZVAsXG4gIGRheXRpbWVQLFxuICB3aGl0ZVAsXG4gIHllYXJQLFxuICB3aGl0ZVAsXG4gIHRpbWV6b25lUCxcbl0pLmZtYXAoYXJyYXkyU3RyaW5nKTsgLy8gcmVhZHkgZm9yIG5ldyBEYXRlKHJlcylcblxuY29uc3QgZmlyc3RMaW5lUCA9IGxpbmVQKGRhdGVQKTtcblxuY29uc3QgZmlsZW5hbWVQID0gbWFueTEoY2hvaWNlKFtsZXR0ZXJQLCBkaWdpdFAsIHBjaGFyKCcvJyldKSkuZm1hcChhcnJheTJTdHJpbmcpO1xuXG5jb25zdCBzZWNvbmRMaW5lUCA9IGxpbmVQKHdoaXRlUC5kaXNjYXJkRmlyc3QoZmlsZW5hbWVQKS5kaXNjYXJkU2Vjb25kKHdoYXRldmVyUCkpO1xuXG5jb25zdCBpbnNlcnRpb25zUCA9IG51bWJlclAuZGlzY2FyZFNlY29uZChzZXF1ZW5jZVAoW3doaXRlUCwgcHN0cmluZygnaW5zZXJ0aW9uJyksIG9wdChwY2hhcigncycpKSwgc3RyaW5nUCgnKCspJyldKSk7XG5jb25zdCBkZWxldGlvbnNQID0gbnVtYmVyUC5kaXNjYXJkU2Vjb25kKHNlcXVlbmNlUChbd2hpdGVQLCBwc3RyaW5nKCdkZWxldGlvbicpLCBvcHQocGNoYXIoJ3MnKSksIHN0cmluZ1AoJygtKScpXSkpO1xuXG5jb25zdCB0aGlyZExpbmVQID0gbGluZVAoc2VxdWVuY2VQKFt3aGF0ZXZlclAsIHBjaGFyKCcsJyksIHdoaXRlUF0pXG4gIC5kaXNjYXJkRmlyc3Qoc2VxdWVuY2VQKFtvcHQoaW5zZXJ0aW9uc1ApLCBvcHQoc2VxdWVuY2VQKFtwY2hhcignLCcpLCB3aGl0ZVBdKSksIG9wdChkZWxldGlvbnNQKV0pKSlcbiAgLmZtYXAoKFttYXliZUluc2VydGlvbnMsIG1heWJlU2VwYXJhdG9yLCBtYXliZURlbGV0aW9uc10pID0+IHsvKiBUT0RPIG9wZXJhdGlvbnMgaGVyZSAqL30pOyAvLyBkZWx0YVJvd3NcblxuLy9jb25zdCBjb21taXRQID0gLi4uIC8vIHJlcyA9IFR1cGxlLkNvdXBsZShmaWxlbmFtZSwgVHVwbGUuQ291cGxlKGRhdGUsIGRlbHRhUm93cykpXG5cbi8vY29uc3QgZmlsZUhpc3RvcnlTZXBhcmF0b3JQID0gLi4uXG5cbi8vY29uc3QgZmlsZUhpc3RvcnlQID0gLi4uIC8vIFR1cGxlLkNvdXBsZShmaWxlbmFtZSwgVHVwbGUuQ291cGxlW10oZGF0YSwgZmlsZXNpemUpKVxuXG4vL2NvbnN0IGdpdExvZ0ZpbGVQID0gLi4uIC8vIFR1cGxlLkNvdXBsZShmaWxlbmFtZSwgVHVwbGUuQ291cGxlW10oZGF0YSwgZmlsZXNpemUpKVtdXG5cbmZ1bmN0aW9uIHN5bWJvbGljQ2hhcnMoKSB7XG4gIHJldHVybiBbXG4gICAgJy8nLFxuICAgICcrJyxcbiAgICAnLScsXG4gICAgJ3wnLFxuICAgICdcXCcnLFxuICAgICfCoicsXG4gICAgJ8KpJyxcbiAgICAnw7cnLFxuICAgICfCtScsXG4gICAgJ8K3JyxcbiAgICAnwrYnLFxuICAgICfCsScsXG4gICAgJ+KCrCcsXG4gICAgJyQnLFxuICAgICfCoycsXG4gICAgJ8KuJyxcbiAgICAnwqcnLFxuICAgICfihKInLFxuICAgICfCpScsXG4gICAgJygnLCAnKScsXG4gICAgJ8OhJywgJ8OBJyxcbiAgICAnw6AnLCAnw4AnLFxuICAgICfDoicsICfDgicsXG4gICAgJ8OlJywgJ8OFJyxcbiAgICAnw6MnLCAnw4MnLFxuICAgICfDpCcsICfDhCcsXG4gICAgJ8OmJywgJ8OGJyxcbiAgICAnw6cnLCAnw4cnLFxuICAgICfDqScsICfDiScsXG4gICAgJ8OoJywgJ8OIJyxcbiAgICAnw6onLCAnw4onLFxuICAgICfDqycsICfDiycsXG4gICAgJ8OtJywgJ8ONJyxcbiAgICAnw6wnLCAnw4wnLFxuICAgICfDricsICfDjicsXG4gICAgJ8OvJywgJ8OPJyxcbiAgICAnw7EnLCAnw5EnLFxuICAgICfDsycsICfDkycsXG4gICAgJ8OyJywgJ8OSJyxcbiAgICAnw7QnLCAnw5QnLFxuICAgICfDuCcsICfDmCcsXG4gICAgJ8O1JywgJ8OVJyxcbiAgICAnw7YnLCAnw5YnLFxuICAgICfDuicsICfDmicsXG4gICAgJ8O5JywgJ8OZJyxcbiAgICAnw7snLCAnw5snLFxuICAgICfDvCcsICfDnCcsXG4gICAgJ8OfJywgJ8O/JyxcbiAgICAnIScsXG4gICAgJz8nLFxuICAgICcvJyxcbiAgICAnPScsXG4gIF07XG59XG4iXX0=