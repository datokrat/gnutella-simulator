///<reference path="array.ts" />
define(["require", "exports"], function(require, exports) {
    

    var Subscription = (function () {
        function Subscription() {
        }
        Subscription.fromDisposable = function (disposable) {
            var s = new Subscription();
            s.undo = function () {
                return disposable.dispose();
            };
            return s;
        };
        return Subscription;
    })();
    exports.Subscription = Subscription;

    var EventImpl = (function () {
        function EventImpl() {
            this.listeners = [];
            this.raiseThis = this.raise.bind(this);
        }
        EventImpl.prototype.subscribe = function (cb) {
            var _this = this;
            if (!this.isListener(cb))
                this.listeners.push(cb);

            return { undo: function () {
                    return _this.unsubscribe(cb);
                } };
        };

        EventImpl.prototype.subscribeUntil = function (cb, timeout) {
            var subscription;
            var handler = function (args) {
                if (cb(args))
                    subscription.undo();
            };
            subscription = this.subscribe(handler);
            if (typeof timeout === 'number')
                setTimeout(function () {
                    return subscription.undo();
                }, timeout);
            return subscription;
        };

        EventImpl.prototype.unsubscribe = function (cb) {
            if (this.isListener(cb))
                this.listeners.removeOne(cb);
        };

        EventImpl.prototype.raise = function (args) {
            this.listeners.forEach(function (l) {
                l(args);
            });
        };

        EventImpl.prototype.isListener = function (cb) {
            return this.listeners.indexOf(cb) != -1;
        };
        return EventImpl;
    })();
    exports.EventImpl = EventImpl;

    var Void = (function () {
        function Void() {
        }
        return Void;
    })();
    exports.Void = Void;
});
