import asyncUnit = require('tests/asyncunit');
import test = require('tests/test');
import common = require('../common');

import Peer = require('../peer');
import File = require('../file');

var chain = <T>(value: T, command: (value: T) => void) => {
	command(value);
	return value;
}

export class TestClass extends asyncUnit.TestClass {
	pingLonelyPeer(async, r, cb) {
		async();
		var counter = new test.Counter();
		var stub: Peer.Base = new Peer.Stub();
		//stub.ping = (sender, args, handlers) => handlers.then([stub]);
		
		var peer: Peer.Base = new Peer.Impl();
		peer.ping(stub, { ttl: 3 }, {
			then: cb((peers: Peer.Base[]) => {
				test.assert(() => peers.length == 1);
				test.assert(() => peers[0] == peer);
				r();
			}),
			fail: cb(err => {
				throw chain(new Error(err), e => e['innerError'] = err);
			})
		});
	}
	
	pingPeerWithNeighbor(async, r, cb) {
		async();
		var counter = new test.Counter();
		var stub0: Peer.Base = new Peer.Stub();
		var stub1: Peer.Base = new Peer.Stub();
		var stub2: Peer.Base = new Peer.Stub();
		var peer: Peer.Base = new Peer.Impl();
		
		stub1.ping = (sender, args, handlers) => {
			test.assert(v => sender == peer);
			handlers.then([stub1, stub2]);
		};
		
		peer.neighbors([stub1]);
		peer.ping(stub0, { ttl: 3 }, {
			then: cb((peers: Peer.Base[]) => {
				test.assert(() => counter.get('peerPing') == 0);
				counter.inc('peerPing');
				test.assert(() => peers.indexOf(peer) != -1);
				test.assert(() => peers.indexOf(stub1) != -1);
				test.assert(() => peers.indexOf(stub2) != -1);
				test.assert(() => peers.length == 3);
				r();
			}),
			fail: cb(err => { throw chain(new Error(err), e => e['innerError'] = err) })
		});
	}
	
	pingWithTTL3(async, r, cb) {
		async();
		var counter = new test.Counter();
		var sender: Peer.Base = new Peer.Stub();
		var stub: Peer.Base = new Peer.Stub();
		var peer: Peer.Base = new Peer.Impl();
		var ready = false;
		
		stub.ping = cb((sender, args, handlers) => {
			test.assert(() => args.ttl == 2);
			ready = true;
			r();
		});
		
		peer.neighbors([stub]);
		peer.ping(sender, { ttl: 3 }, {
			then: () => {},
			fail: () => {}
		});
		
		setTimeout(cb(() => ready || test.throwError('stub.ping not called')), 10000);
	}
	
	pingWithTTL0(async, r, cb) {
		async();
		var counter = new test.Counter();
		var sender: Peer.Base = new Peer.Stub();
		var stub: Peer.Base = new Peer.Stub();
		var peer: Peer.Base = new Peer.Impl();
		
		stub.ping = cb((sender, args, handlers) => {
			throw new Error('stub.ping should not be called because TTL was 0');
		});
		
		peer.neighbors([stub]);
		peer.ping(sender, { ttl: 0 }, {
			then: cb((peers: Peer.Base[]) => {
				test.assert(() => peers.length == 1);
				test.assert(() => peers[0] == peer);
				r();
			}),
			fail: cb(err => {
				throw chain(new Error(err), e => e['innerError'] = err);
			})
		});
	}
	
	duplicatePeerFromPing(async, r, cb) {
		async();
		var counter = new test.Counter();
		var sender: Peer.Base = new Peer.Stub();
		var stub1: Peer.Base = new Peer.Stub();
		var stub2: Peer.Base = new Peer.Stub();
		var stub3: Peer.Base = new Peer.Stub();
		var peer: Peer.Base = new Peer.Impl();
		
		stub1.ping = (sender, args, handlers) => handlers.then([stub1, stub3]);
		stub2.ping = (sender, args, handlers) => handlers.then([stub2, stub3]);
		
		peer.neighbors([stub1, stub2]);
		peer.ping(sender, { ttl: 3 }, {
			then: cb((peers: Peer.Base[]) => {
				test.assert(() => peers.indexOf(peer) != -1);
				test.assert(() => peers.indexOf(stub1) != -1);
				test.assert(() => peers.indexOf(stub2) != -1);
				test.assert(() => peers.indexOf(stub3) != -1);
				test.assert(() => peers.length == 4);
				r();
			}),
			fail: cb(err => {
				throw chain(new Error(err), e => e['innerError'] = err);
			})
		});
	}
	
	queryWithTTL3(async, r, cb) {
		async();
		var counter = new test.Counter();
		var sender: Peer.Base = new Peer.Stub();
		var stub: Peer.Base = new Peer.Stub();
		var peer: Peer.Base = new Peer.Impl();
		var ready = false;
		
		stub.query = cb((sender, args, handlers) => {
			test.assert(() => args.ttl == 2);
			test.assert(() => args.query == 'somefile');
			ready = true;
			r();
		});
		
		peer.neighbors([stub]);
		peer.query(sender, { ttl: 3, query: 'somefile' }, {
			then: () => {},
			fail: () => {}
		});
		
		setTimeout(cb(() => ready || test.throwError('stub.query not called')), 10000);
	}
	
	queryWithTTL0(async, r, cb) {
		async();
		var counter = new test.Counter();
		var sender: Peer.Base = new Peer.Stub();
		var stub: Peer.Base = new Peer.Stub();
		var peer: Peer.Base = new Peer.Impl();
		
		stub.query = cb((sender, args, handlers) => {
			throw new Error('stub.query should not be called because TTL was 0');
		});
		
		peer.neighbors([stub]);
		peer.query(sender, { ttl: 0, query: 'somefile' }, {
			then: cb((files: File.Main[]) => {
				test.assert(() => files.length == 0);
				r();
			}),
			fail: cb(err => {
				throw chain(new Error(err), e => e['innerError'] = err);
			})
		});
	}
	
	duplicateFileFromQuery(async,r,cb) {
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
			then: cb(() => {
				test.assert(v => counter.get('then') == 0);
				counter.inc('then');
			}),
			fail: () => {}
		});
		
		setTimeout(r, 1000);
	}
	
	queryFilesContainingSth(async, r, cb) {
		async();
		var counter = new test.Counter();
		var sender: Peer.Base = new Peer.Stub();
		var stub: Peer.Base = new Peer.Stub();
		var peer: Peer.Base = new Peer.Impl();
		
		stub.query = cb((sender, args, handlers) => {
			counter.inc('stub.query');
			handlers.then([new File.Main('hifisch')]);
		});
		
		peer.neighbors([stub]);
		peer.files = [new File.Main('ahoi'), new File.Main('hihi')];
		peer.query(sender, { ttl: 3, query: 'hi' }, {
			then: cb((files: File.Main[]) => {
				test.assert(() => counter.get('stub.query') > 0);
				
				var names = files.map(f => f.name);
				test.assert(() => names.indexOf('hihi') != -1);
				test.assert(() => names.indexOf('hifisch') != -1);
				test.assert(() => names.length == 2);
				r();
			}),
			fail: cb(err => {
				throw chain(new Error(err), e => e['innerError'] = err);
			})
		});
	}
	
	start(async, r, cb) {
		async();
		var peer: Peer.Base = new Peer.Impl();
		var stub: Peer.Base = new Peer.Stub();
		
		stub.ping = (sender, args, handlers) => handlers.then([stub]);
		
		peer.start(stub, {
			then: cb(() => {
				test.assert(() => peer.neighbors()[0] == stub);
				test.assert(() => peer.neighbors().length == 1);
				r();
			}),
			fail: cb(err => {
				throw chain(new Error('unknown error'), e => e['innerError'] = err);
			})
		});
	}
	
	startAndReceivePeersFromNeighbor(async, r, cb) {
		async();
		var counter = new test.Counter();
		var peer: Peer.Base = new Peer.Impl();
		var stub1: Peer.Base = new Peer.Stub();
		var stub2: Peer.Base = new Peer.Stub();
		stub1.ping = cb((sender, args, handlers) => {
			test.assert(() => args.ttl > 0);
			test.assert(() => counter.get('stub.ping') == 0);
			counter.inc('stub.ping');
			
			handlers.then([stub1, stub2]);
		});
		
		console.log(stub1);
		
		peer.neighbors([stub1]);
		peer.start(stub1, {
			then: cb(() => {
				test.assert(() => counter.get('stub.ping') == 1);
				test.assert(() => peer.neighbors().indexOf(stub1) != -1);
				test.assert(() => peer.neighbors().indexOf(stub2) != -1);
				test.assert(() => peer.neighbors().length == 2);
				r();
			}),
			fail: cb(err => {
				throw chain(new Error('unknown error'), e => e['innerError'] = err);
			})
		});
	}
	
	selectRandomPeersAsNeighbor(async, r, cb) {
		async();
		var counter = new test.Counter();
		var peer: Peer.Base = new Peer.Impl();
		var stub1: Peer.Base = new Peer.Stub();
		var stub2: Peer.Base = new Peer.Stub();
		var stub3: Peer.Base = new Peer.Stub();
		var stub4: Peer.Base = new Peer.Stub();
		stub1.ping = cb((sender, args, handlers) => {
			test.assert(() => args.ttl > 0);
			test.assert(() => counter.get('stub.ping') == 0);
			counter.inc('stub.ping');
			
			handlers.then([stub1, stub2, stub3, stub4]);
		});
		
		console.log(stub1);
		
		peer.neighbors([stub1]);
		peer.start(stub1, {
			then: cb(() => {
				test.assert(() => counter.get('stub.ping') == 1);
				if(peer.neighbors().indexOf(stub1) != -1) counter.inc('neighbor');
				if(peer.neighbors().indexOf(stub2) != -1) counter.inc('neighbor');
				if(peer.neighbors().indexOf(stub3) != -1) counter.inc('neighbor');
				if(peer.neighbors().indexOf(stub4) != -1) counter.inc('neighbor');
				test.assert(v => v.val(counter.get('neighbor')) == 3);
				test.assert(() => peer.neighbors().length == 3);
				r();
			}),
			fail: cb(err => {
				throw chain(new Error('unknown error'), e => e['innerError'] = err);
			})
		});
	}
	
	requestNeighborhood(async, r, cb) {
		async();
		var counter = new test.Counter();
		var peer = new Peer.Impl();
		var stub = new Peer.Stub();
		
		peer.requestNeighborhood(stub, {
			then: cb(() => {
				test.assert(() => peer.neighbors().indexOf(stub) != -1);
				r();
			}),
			fail: cb(err => {
				throw chain(new Error(err), e => e['innerError'] = err);
			})
		});
	}
		
	neighborhoodRequestDuringInitialization(async, r, cb: <T>(cb: T) => T) {
		async();
		
		var counter = new test.Counter();
		var peer = new Peer.Impl();
		var stub = new Peer.Stub();
		
		stub.requestNeighborhood = cb((sender, handlers) => {
			test.assert(() => sender == peer);
			counter.inc('stub.requestNeighborhood');
			handlers.then();
		});
		
		stub.ping = (sender, args, handlers) => {
			handlers.then([stub]);
		};
		
		peer.start(stub, {
			then: cb(() => {
				test.assert(() => counter.get('stub.requestNeighborhood') == 1);
				r();
			}),
			fail: cb(err => {
				throw chain(new Error(err), e => e['innerError'] = err);
			})
		});
	}
	
	test(async, r, cb) {
		console.log('t');
		var counter = new test.Counter();
		var peer1 = new Peer.Impl();
		var peer2 = new Peer.Impl();
		var peer3 = new Peer.Impl();
		
		peer1.neighbors([]);
		peer2.neighbors([peer1]);
		
		peer1.ping(null, {ttl: 3}, {
			then: cb(() => {
				counter.inc('ping');
			}),
			fail: () => {
			}
		});
		
		test.assert(v => v.val(counter.get('ping')) == 1);
	}
}