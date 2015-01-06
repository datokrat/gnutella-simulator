var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var Counter = (function () {
        function Counter() {
            this.data = {};
        }
        Counter.prototype.inc = function (key) {
            this.data[key] ? ++this.data[key] : this.data[key] = 1;
        };

        Counter.prototype.get = function (key) {
            return this.data[key] || 0;
        };
        return Counter;
    })();
    exports.Counter = Counter;

    var TestErrorBase = (function () {
        function TestErrorBase() {
        }
        TestErrorBase.prototype.toString = function () {
            return JSON.stringify(this);
        };
        return TestErrorBase;
    })();
    exports.TestErrorBase = TestErrorBase;

    var TestError = (function (_super) {
        __extends(TestError, _super);
        function TestError(message) {
            _super.call(this);
            this.message = message;
        }
        TestError.prototype.toString = function () {
            return "TestError: " + this.message;
        };
        return TestError;
    })(TestErrorBase);
    exports.TestError = TestError;

    function assert(condition) {
        var valueCollector = new ValueCollector();
        if (!condition(valueCollector)) {
            throw new TestError("assert[" + valueCollector.values.toString() + "]: " + getFnBody(condition).replace("v.val", ""));
        }
    }
    exports.assert = assert;

    var ValueCollector = (function () {
        function ValueCollector() {
            this.values = [];
        }
        ValueCollector.prototype.val = function (value) {
            this.values.push(value);
            return value;
        };

        ValueCollector.prototype.str = function (value) {
            this.values.push(JSON.stringify(value));
            return value;
        };
        return ValueCollector;
    })();
    exports.ValueCollector = ValueCollector;

    function assertThrows(action) {
        var throwed = false;
        try  {
            action();
        } catch (e) {
            throwed = true;
        }
        if (!throwed)
            throw new TestError("assertThrows");
    }
    exports.assertThrows = assertThrows;

    function throwError(err) {
        throw err;
    }
    exports.throwError = throwError;

    function getFnBody(fn) {
        var entire = fn.toString();
        return entire.slice(entire.indexOf(" return ") + 8, entire.lastIndexOf("}"));
    }
});
