define(['chai', 'git_log_parser', 'parsers'], function (_chai, _git_log_parser, _parsers) {
    'use strict';

    describe('among git log parsers', function () {

        describe('lineP', function () {
            it('runs a parser and then expects a CR immediately after', function () {
                var line = (0, _git_log_parser.lineP)((0, _parsers.pchar)('a'));
                (0, _chai.expect)(line.run('a').isSuccess).to.be.false;
                (0, _chai.expect)(line.run('a\n').isSuccess).to.be.true;
            });
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2pzLXNwZWMvZ2l0X2xvZ19wYXJzZXIuc3BlYy5qcyJdLCJuYW1lcyI6WyJkZXNjcmliZSIsIml0IiwibGluZSIsInJ1biIsImlzU3VjY2VzcyIsInRvIiwiYmUiLCJmYWxzZSIsInRydWUiXSwibWFwcGluZ3MiOiI7OztBQVFBQSxhQUFTLHVCQUFULEVBQWtDLFlBQU07O0FBRXBDQSxpQkFBUyxPQUFULEVBQWtCLFlBQU07QUFDcEJDLGVBQUcsdURBQUgsRUFBNEQsWUFBTTtBQUM5RCxvQkFBTUMsT0FBTywyQkFBTSxvQkFBTSxHQUFOLENBQU4sQ0FBYjtBQUNBLGtDQUFPQSxLQUFLQyxHQUFMLENBQVMsR0FBVCxFQUFjQyxTQUFyQixFQUFnQ0MsRUFBaEMsQ0FBbUNDLEVBQW5DLENBQXNDQyxLQUF0QztBQUNBLGtDQUFPTCxLQUFLQyxHQUFMLENBQVMsS0FBVCxFQUFnQkMsU0FBdkIsRUFBa0NDLEVBQWxDLENBQXFDQyxFQUFyQyxDQUF3Q0UsSUFBeEM7QUFDSCxhQUpEO0FBS0gsU0FORDtBQU9ILEtBVEQiLCJmaWxlIjoiZ2l0X2xvZ19wYXJzZXIuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4cGVjdCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtcbiAgbGluZVAsXG59IGZyb20gJ2dpdF9sb2dfcGFyc2VyJztcbmltcG9ydCB7XG4gIHBjaGFyLFxufSBmcm9tICdwYXJzZXJzJztcblxuZGVzY3JpYmUoJ2Ftb25nIGdpdCBsb2cgcGFyc2VycycsICgpID0+IHtcblxuICAgIGRlc2NyaWJlKCdsaW5lUCcsICgpID0+IHtcbiAgICAgICAgaXQoJ3J1bnMgYSBwYXJzZXIgYW5kIHRoZW4gZXhwZWN0cyBhIENSIGltbWVkaWF0ZWx5IGFmdGVyJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IGxpbmVQKHBjaGFyKCdhJykpO1xuICAgICAgICAgICAgZXhwZWN0KGxpbmUucnVuKCdhJykuaXNTdWNjZXNzKS50by5iZS5mYWxzZTtcbiAgICAgICAgICAgIGV4cGVjdChsaW5lLnJ1bignYVxcbicpLmlzU3VjY2VzcykudG8uYmUudHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==