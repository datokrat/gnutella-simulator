define(["require", "exports", 'common'], function(require, exports, common) {
    var nullFunc = function () {
    };
    var stdHandlers = { then: nullFunc, fail: nullFunc };

    var Impl = (function () {
        function Impl(name) {
            this.name = ko.observable();
            this.neighbors = ko.observableArray([]);
            this.files = [];
            this.name(name);
        }
        Impl.prototype.start = function (initialPeer, handlers) {
            var _this = this;
            if (typeof handlers === "undefined") { handlers = stdHandlers; }
            var maxNeighbors = 3;
            initialPeer.ping(this, { ttl: 2 }, {
                then: function (peers) {
                    var selectedNeighbors = common.Coll.randomChoice(peers, maxNeighbors);
                    var newNeighbors = [];
                    common.Callbacks.atOnce(selectedNeighbors.map(function (n) {
                        return function (r) {
                            return n.requestNeighborhood(_this, {
                                then: function () {
                                    newNeighbors.push(n);
                                    r();
                                },
                                fail: function (err) {
                                    handlers.fail(new Error('not implemented'));
                                }
                            });
                        };
                    }), function () {
                        _this.neighbors(newNeighbors);
                        handlers.then();
                    });
                },
                fail: function (err) {
                    handlers.fail(err);
                }
            });
        };

        Impl.prototype.ping = function (sender, args, handlers) {
            var _this = this;
            if (args.ttl == 0) {
                handlers.then([this]);
                return;
            }

            var ret = [this];
            common.Callbacks.batch(this.neighbors().map(function (n) {
                return function (r) {
                    n.ping(_this, { ttl: args.ttl - 1 }, {
                        then: function (peers) {
                            ret.appendOnce(peers);
                            r();
                        },
                        fail: function (err) {
                            return r();
                        }
                    });
                };
            }), function (err) {
                if (err == null)
                    handlers.then(ret);
                else
                    handlers.fail(err);
            });
            //handlers.then([this]);
        };

        Impl.prototype.requestNeighborhood = function (sender, handlers) {
            this.neighbors.valueWillMutate();
            this.neighbors().pushOnce(sender);
            this.neighbors.valueHasMutated();
            handlers.then();
        };

        Impl.prototype.query = function (sender, args, handlers) {
            var _this = this;
            var ret = this.files.filter(function (f) {
                return f.name.contains(args.query);
            });
            if (args.ttl <= 0) {
                handlers.then(ret);
                return;
            }

            common.Callbacks.batch(this.neighbors().map(function (n) {
                return function (r) {
                    n.query(_this, { ttl: args.ttl - 1, query: args.query }, {
                        then: function (files) {
                            ret = ret.concat(files);
                            r();
                        },
                        fail: function (err) {
                            handlers.fail(err);
                        }
                    });
                };
            }), function (err) {
                if (err == null)
                    setTimeout(function () {
                        return handlers.then(ret);
                    });
                else
                    handlers.fail(err);
            });
        };
        return Impl;
    })();
    exports.Impl = Impl;

    var Stub = (function () {
        function Stub() {
        }
        Stub.prototype.start = function (initialPeer, handlers) {
            if (typeof handlers === "undefined") { handlers = stdHandlers; }
        };
        Stub.prototype.ping = function (sender, args, handlers) {
        };
        Stub.prototype.requestNeighborhood = function (sender, handlers) {
            handlers.then();
        };
        Stub.prototype.query = function (sender, args, handlers) {
        };
        return Stub;
    })();
    exports.Stub = Stub;
});
