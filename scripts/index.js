define(["require", "exports", 'common', 'peer', 'file'], function(require, exports, common, Peer, File) {
    var ViewModel = (function () {
        function ViewModel() {
            var _this = this;
            this.peers = ko.observableArray();
            this.selectedPeer = ko.observable();
            this.numberNGradedPeers = ko.computed(function () {
                var counter = new common.NumberCounter();
                _this.peers().forEach(function (p) {
                    counter.inc(p.neighbors().length);
                });
                return counter;
            });
            this.availabilityTests = ko.observableArray();
        }
        return ViewModel;
    })();

    var vm = new ViewModel();

    ko.applyBindings(vm);

    var root = appendPeer('Peer 1');
    appendFile('File 1$', root);
    for (var i = 2; i <= 50; ++i) {
        var p = appendPeer('Peer ' + i, root);
        appendFile('File ' + i + '$', p);
    }

    for (var i = 1; i <= 9; ++i) {
        testAvailability(50, i * 5);
    }

    console.log(vm);

    function testAvailability(from, to) {
        vm.peers()[from - 1].query(null, { ttl: 3, query: 'File ' + to + '$' }, {
            then: function (files) {
                console.log('then', from, to);
                var at = { from: vm.peers()[from - 1], to: vm.peers()[to - 1], available: files.length != 0 };
                console.log(at);
                vm.availabilityTests.push(at);
            },
            fail: function (err) {
                throw err;
            }
        });
    }

    function appendPeer(name, startPeer) {
        var p = new Peer.Impl(name);
        vm.peers.push(p);
        if (startPeer)
            p.start(startPeer, { then: function () {
                }, fail: function () {
                    throw new Error(name);
                } });
        return p;
    }

    function appendFile(name, peer) {
        var f = new File.Main(name);
        peer.files.push(f);
        return f;
    }
});
