define(["require", "exports", 'event'], function(require, exports, Events) {
    var ObservableArrayExtender = (function () {
        function ObservableArrayExtender(innerObservable) {
            this.pushed = new Events.EventImpl();
            this.removed = new Events.EventImpl();
            this.changed = new Events.EventImpl();
            this.innerObservable = innerObservable;
        }
        ObservableArrayExtender.prototype.get = function (index) {
            if (arguments.length >= 1)
                return this.getSingle(index);
            else
                return this.getAll();
        };

        ObservableArrayExtender.prototype.getAll = function () {
            return this.innerObservable();
        };

        ObservableArrayExtender.prototype.getSingle = function (index) {
            console.log('getSingle');
            if (index >= 0)
                return this.innerObservable()[index];
            else
                return this.innerObservable()[this.innerObservable().length + index];
        };

        ObservableArrayExtender.prototype.set = function (value) {
            var old = this.innerObservable();
            this.innerObservable(value);
            this.changed.raise(old);
        };

        ObservableArrayExtender.prototype.push = function (item) {
            this.innerObservable.push(item);
            this.pushed.raise(item);
        };

        ObservableArrayExtender.prototype.remove = function (item) {
            this.innerObservable.remove(item);
            this.removed.raise(item);
        };

        ObservableArrayExtender.prototype.removeMany = function (from, count) {
            var _this = this;
            var spliced;
            if (count != null)
                spliced = this.innerObservable.splice(from, count);
            else
                spliced = this.innerObservable.splice(from, this.innerObservable().length);
            spliced.forEach(function (removed) {
                return _this.removed.raise(removed);
            });
        };

        ObservableArrayExtender.prototype.removeByPredicate = function (predicate) {
            var _this = this;
            var filtered = this.innerObservable().filter(predicate).reverse();
            filtered.forEach(function (item) {
                return _this.remove(item);
            });
        };

        ObservableArrayExtender.prototype.subscribe = function (handler) {
            return this.innerObservable.subscribe(handler);
        };

        ObservableArrayExtender.prototype.dispose = function () {
            this.innerObservable.dispose();
        };
        return ObservableArrayExtender;
    })();
    exports.ObservableArrayExtender = ObservableArrayExtender;
});
