define(["require", "exports"], function(require, exports) {
    var Main = (function () {
        function Main() {
            this.items = {};
        }
        Main.prototype.get = function (id) {
            var ret = this.items[id];
            if (ret)
                return ret;
            else
                throw new Error('item does not exist: id = ' + id);
        };

        Main.prototype.set = function (id, value) {
            return this.items[id] = value;
        };
        return Main;
    })();
    exports.Main = Main;

    var Many = (function () {
        function Many() {
            this.containers = [];
        }
        Many.prototype.get = function (id) {
            var ret;
            var err = new Error('ItemContainer.Many.get: id[' + id + '] not available');
            this.containers.forEach(function (c) {
                try  {
                    ret = c.get(id);
                    return;
                } catch (e) {
                }
            });
            if (ret)
                return ret;
            throw err;
        };

        Many.prototype.insertContainer = function (container) {
            this.containers.push(container);
        };

        Many.prototype.removeContainer = function (container) {
            var index = this.containers.indexOf(container);
            if (index != -1)
                this.containers.splice(index, 1);
        };
        return Many;
    })();
    exports.Many = Many;
});
