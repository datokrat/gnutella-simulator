var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'tests/asyncunit', 'tests/test', '../peer', '../file'], function(require, exports, asyncUnit, test, Peer, File) {
    var chain = function (value, command) {
        command(value);
        return value;
    };

    var TestClass = (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            _super.apply(this, arguments);
        }
        TestClass.prototype.pingLonelyPeer = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var stub = new Peer.Stub();

            //stub.ping = (sender, args, handlers) => handlers.then([stub]);
            var peer = new Peer.Impl();
            peer.ping(stub, { ttl: 3 }, {
                then: cb(function (peers) {
                    test.assert(function () {
                        return peers.length == 1;
                    });
                    test.assert(function () {
                        return peers[0] == peer;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error(err), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.pingPeerWithNeighbor = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var stub0 = new Peer.Stub();
            var stub1 = new Peer.Stub();
            var stub2 = new Peer.Stub();
            var peer = new Peer.Impl();

            stub1.ping = function (sender, args, handlers) {
                test.assert(function (v) {
                    return sender == peer;
                });
                handlers.then([stub1, stub2]);
            };

            peer.neighbors([stub1]);
            peer.ping(stub0, { ttl: 3 }, {
                then: cb(function (peers) {
                    test.assert(function () {
                        return counter.get('peerPing') == 0;
                    });
                    counter.inc('peerPing');
                    test.assert(function () {
                        return peers.indexOf(peer) != -1;
                    });
                    test.assert(function () {
                        return peers.indexOf(stub1) != -1;
                    });
                    test.assert(function () {
                        return peers.indexOf(stub2) != -1;
                    });
                    test.assert(function () {
                        return peers.length == 3;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error(err), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.pingWithTTL3 = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var sender = new Peer.Stub();
            var stub = new Peer.Stub();
            var peer = new Peer.Impl();
            var ready = false;

            stub.ping = cb(function (sender, args, handlers) {
                test.assert(function () {
                    return args.ttl == 2;
                });
                ready = true;
                r();
            });

            peer.neighbors([stub]);
            peer.ping(sender, { ttl: 3 }, {
                then: function () {
                },
                fail: function () {
                }
            });

            setTimeout(cb(function () {
                return ready || test.throwError('stub.ping not called');
            }), 10000);
        };

        TestClass.prototype.pingWithTTL0 = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var sender = new Peer.Stub();
            var stub = new Peer.Stub();
            var peer = new Peer.Impl();

            stub.ping = cb(function (sender, args, handlers) {
                throw new Error('stub.ping should not be called because TTL was 0');
            });

            peer.neighbors([stub]);
            peer.ping(sender, { ttl: 0 }, {
                then: cb(function (peers) {
                    test.assert(function () {
                        return peers.length == 1;
                    });
                    test.assert(function () {
                        return peers[0] == peer;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error(err), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.duplicatePeerFromPing = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var sender = new Peer.Stub();
            var stub1 = new Peer.Stub();
            var stub2 = new Peer.Stub();
            var stub3 = new Peer.Stub();
            var peer = new Peer.Impl();

            stub1.ping = function (sender, args, handlers) {
                return handlers.then([stub1, stub3]);
            };
            stub2.ping = function (sender, args, handlers) {
                return handlers.then([stub2, stub3]);
            };

            peer.neighbors([stub1, stub2]);
            peer.ping(sender, { ttl: 3 }, {
                then: cb(function (peers) {
                    test.assert(function () {
                        return peers.indexOf(peer) != -1;
                    });
                    test.assert(function () {
                        return peers.indexOf(stub1) != -1;
                    });
                    test.assert(function () {
                        return peers.indexOf(stub2) != -1;
                    });
                    test.assert(function () {
                        return peers.indexOf(stub3) != -1;
                    });
                    test.assert(function () {
                        return peers.length == 4;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error(err), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.queryWithTTL3 = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var sender = new Peer.Stub();
            var stub = new Peer.Stub();
            var peer = new Peer.Impl();
            var ready = false;

            stub.query = cb(function (sender, args, handlers) {
                test.assert(function () {
                    return args.ttl == 2;
                });
                test.assert(function () {
                    return args.query == 'somefile';
                });
                ready = true;
                r();
            });

            peer.neighbors([stub]);
            peer.query(sender, { ttl: 3, query: 'somefile' }, {
                then: function () {
                },
                fail: function () {
                }
            });

            setTimeout(cb(function () {
                return ready || test.throwError('stub.query not called');
            }), 10000);
        };

        TestClass.prototype.queryWithTTL0 = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var sender = new Peer.Stub();
            var stub = new Peer.Stub();
            var peer = new Peer.Impl();

            stub.query = cb(function (sender, args, handlers) {
                throw new Error('stub.query should not be called because TTL was 0');
            });

            peer.neighbors([stub]);
            peer.query(sender, { ttl: 0, query: 'somefile' }, {
                then: cb(function (files) {
                    test.assert(function () {
                        return files.length == 0;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error(err), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.duplicateFileFromQuery = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var peer1 = new Peer.Impl('1');
            var peer2 = new Peer.Impl('2');
            var peer3 = new Peer.Impl('3');
            var peer4 = new Peer.Impl('4');

            peer1.neighbors([peer2, peer3, peer4]);
            peer2.neighbors([peer1, peer3, peer4]);
            peer3.neighbors([peer1, peer2, peer4]);
            peer4.neighbors([peer1, peer2, peer3]);

            peer1.files = [new File.Main('somefile')];

            peer1.query(null, { ttl: 3, query: 'somefile' }, {
                then: cb(function () {
                    test.assert(function (v) {
                        return counter.get('then') == 0;
                    });
                    counter.inc('then');
                }),
                fail: function () {
                }
            });

            setTimeout(r, 1000);
        };

        TestClass.prototype.queryFilesContainingSth = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var sender = new Peer.Stub();
            var stub = new Peer.Stub();
            var peer = new Peer.Impl();

            stub.query = cb(function (sender, args, handlers) {
                counter.inc('stub.query');
                handlers.then([new File.Main('hifisch')]);
            });

            peer.neighbors([stub]);
            peer.files = [new File.Main('ahoi'), new File.Main('hihi')];
            peer.query(sender, { ttl: 3, query: 'hi' }, {
                then: cb(function (files) {
                    test.assert(function () {
                        return counter.get('stub.query') > 0;
                    });

                    var names = files.map(function (f) {
                        return f.name;
                    });
                    test.assert(function () {
                        return names.indexOf('hihi') != -1;
                    });
                    test.assert(function () {
                        return names.indexOf('hifisch') != -1;
                    });
                    test.assert(function () {
                        return names.length == 2;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error(err), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.start = function (async, r, cb) {
            async();
            var peer = new Peer.Impl();
            var stub = new Peer.Stub();

            stub.ping = function (sender, args, handlers) {
                return handlers.then([stub]);
            };

            peer.start(stub, {
                then: cb(function () {
                    test.assert(function () {
                        return peer.neighbors()[0] == stub;
                    });
                    test.assert(function () {
                        return peer.neighbors().length == 1;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error('unknown error'), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.startAndReceivePeersFromNeighbor = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var peer = new Peer.Impl();
            var stub1 = new Peer.Stub();
            var stub2 = new Peer.Stub();
            stub1.ping = cb(function (sender, args, handlers) {
                test.assert(function () {
                    return args.ttl > 0;
                });
                test.assert(function () {
                    return counter.get('stub.ping') == 0;
                });
                counter.inc('stub.ping');

                handlers.then([stub1, stub2]);
            });

            console.log(stub1);

            peer.neighbors([stub1]);
            peer.start(stub1, {
                then: cb(function () {
                    test.assert(function () {
                        return counter.get('stub.ping') == 1;
                    });
                    test.assert(function () {
                        return peer.neighbors().indexOf(stub1) != -1;
                    });
                    test.assert(function () {
                        return peer.neighbors().indexOf(stub2) != -1;
                    });
                    test.assert(function () {
                        return peer.neighbors().length == 2;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error('unknown error'), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.selectRandomPeersAsNeighbor = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var peer = new Peer.Impl();
            var stub1 = new Peer.Stub();
            var stub2 = new Peer.Stub();
            var stub3 = new Peer.Stub();
            var stub4 = new Peer.Stub();
            stub1.ping = cb(function (sender, args, handlers) {
                test.assert(function () {
                    return args.ttl > 0;
                });
                test.assert(function () {
                    return counter.get('stub.ping') == 0;
                });
                counter.inc('stub.ping');

                handlers.then([stub1, stub2, stub3, stub4]);
            });

            console.log(stub1);

            peer.neighbors([stub1]);
            peer.start(stub1, {
                then: cb(function () {
                    test.assert(function () {
                        return counter.get('stub.ping') == 1;
                    });
                    if (peer.neighbors().indexOf(stub1) != -1)
                        counter.inc('neighbor');
                    if (peer.neighbors().indexOf(stub2) != -1)
                        counter.inc('neighbor');
                    if (peer.neighbors().indexOf(stub3) != -1)
                        counter.inc('neighbor');
                    if (peer.neighbors().indexOf(stub4) != -1)
                        counter.inc('neighbor');
                    test.assert(function (v) {
                        return v.val(counter.get('neighbor')) == 3;
                    });
                    test.assert(function () {
                        return peer.neighbors().length == 3;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error('unknown error'), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.requestNeighborhood = function (async, r, cb) {
            async();
            var counter = new test.Counter();
            var peer = new Peer.Impl();
            var stub = new Peer.Stub();

            peer.requestNeighborhood(stub, {
                then: cb(function () {
                    test.assert(function () {
                        return peer.neighbors().indexOf(stub) != -1;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error(err), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.neighborhoodRequestDuringInitialization = function (async, r, cb) {
            async();

            var counter = new test.Counter();
            var peer = new Peer.Impl();
            var stub = new Peer.Stub();

            stub.requestNeighborhood = cb(function (sender, handlers) {
                test.assert(function () {
                    return sender == peer;
                });
                counter.inc('stub.requestNeighborhood');
                handlers.then();
            });

            stub.ping = function (sender, args, handlers) {
                handlers.then([stub]);
            };

            peer.start(stub, {
                then: cb(function () {
                    test.assert(function () {
                        return counter.get('stub.requestNeighborhood') == 1;
                    });
                    r();
                }),
                fail: cb(function (err) {
                    throw chain(new Error(err), function (e) {
                        return e['innerError'] = err;
                    });
                })
            });
        };

        TestClass.prototype.test = function (async, r, cb) {
            console.log('t');
            var counter = new test.Counter();
            var peer1 = new Peer.Impl();
            var peer2 = new Peer.Impl();
            var peer3 = new Peer.Impl();

            peer1.neighbors([]);
            peer2.neighbors([peer1]);

            peer1.ping(null, { ttl: 3 }, {
                then: cb(function () {
                    counter.inc('ping');
                }),
                fail: function () {
                }
            });

            test.assert(function (v) {
                return v.val(counter.get('ping')) == 1;
            });
        };
        return TestClass;
    })(asyncUnit.TestClass);
    exports.TestClass = TestClass;
});
