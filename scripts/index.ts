import common = require('common');
import Peer = require('peer');
import File = require('file');

class ViewModel {
	public peers = ko.observableArray<Peer.Base>();
	public selectedPeer = ko.observable<Peer.Base>();
	public numberNGradedPeers = ko.computed<common.NumberCounter>(() => {
		var counter = new common.NumberCounter();
		this.peers().forEach(p => {
			counter.inc(p.neighbors().length);
		});
		return counter;
	});
	public availabilityTests = ko.observableArray<{ from: Peer.Base; to: Peer.Base; available: boolean }>();
}

var vm = new ViewModel();

ko.applyBindings(vm);

var root = appendPeer('Peer 1');
appendFile('File 1$', root);
for(var i = 2; i <= 50; ++i) {
	var p = appendPeer('Peer ' + i, root);
	appendFile('File ' + i + '$', p);
}

for(var i = 1; i <= 9; ++i) {
	testAvailability(50, i*5);
}

console.log(vm);

function testAvailability(from: number, to: number) {
	vm.peers()[from-1].query(null, { ttl: 3, query: 'File ' + to + '$' }, {
		then: files => {
			console.log('then', from, to);
			var at = { from: vm.peers()[from-1], to: vm.peers()[to-1], available: files.length != 0 };
			console.log(at);
			vm.availabilityTests.push(at);
		},
		fail: err => { throw err }
	});
}

function appendPeer(name: string, startPeer?: Peer.Base): Peer.Base {
	var p = new Peer.Impl(name);
	vm.peers.push(p);
	if(startPeer) p.start(startPeer, { then: () => {}, fail: () => { throw new Error(name) } });
	return p;
}

function appendFile(name: string, peer: Peer.Base): File.Main {
	var f = new File.Main(name);
	peer.files.push(f);
	return f;
}