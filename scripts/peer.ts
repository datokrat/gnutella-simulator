import common = require('common');
import obs = require('observable');
import File = require('file');

var nullFunc = () => {}
var stdHandlers = { then: nullFunc, fail: nullFunc };

export interface Base {
	start(initialPeer: Base, handlers: Handlers<void>);
	ping(sender: Base, args: { ttl: number }, handlers: Handlers<Base[]>);
	requestNeighborhood(sender: Base, handlers: Handlers<void>);
	query(sender: Base, args: { ttl: number; query: string }, handlers: Handlers<File.Main[]>);
	
	name: obs.Observable<string>;
	neighbors: obs.ObservableArray<Base>;
	files: File.Main[];
}

export class Impl implements Base {
	constructor(name?: string) {
		this.name(name);
	}
	
	public start(initialPeer: Base, handlers: Handlers<void> = stdHandlers) {
		var maxNeighbors = 3;
		initialPeer.ping(this, { ttl: 2 }, {
			then: peers => {
				var selectedNeighbors = common.Coll.randomChoice(peers, maxNeighbors);
				var newNeighbors = [];
				common.Callbacks.atOnce(selectedNeighbors.map(n => r => n.requestNeighborhood(this, {
					then: () => {
						newNeighbors.push(n);
						r();
					},
					fail: err => {
						handlers.fail(new Error('not implemented'));
					}
				})), () => {
					this.neighbors(newNeighbors);
					handlers.then();
				});
			},
			fail: err => {
				handlers.fail(err);
			}
		});
	}
	
	public ping(sender: Base, args: { ttl: number }, handlers: Handlers<Base[]>) {
		if(args.ttl == 0) {
			handlers.then([this]);
			return;
		}
		
		var ret: Base[] = [this];
		common.Callbacks.batch(
			this.neighbors().map(n => r => {
				n.ping(this, { ttl: args.ttl-1 }, {
					then: peers => {
						ret.appendOnce(peers);
						r();
					},
					fail: err => r()
				});
			}),
			err => {
				if(err == null) handlers.then(ret);
				else handlers.fail(err);
			}
		);
		//handlers.then([this]);
	}
	
	requestNeighborhood(sender: Base, handlers: Handlers<void>) {
		this.neighbors.valueWillMutate();
		this.neighbors().pushOnce(sender);
		this.neighbors.valueHasMutated();
		handlers.then();
	}
	
	query(sender: Base, args: { ttl: number; query: string }, handlers: Handlers<File.Main[]>) {
		var ret = this.files.filter((f: File.Main) => f.name.contains(args.query));
		if(args.ttl <= 0) {
			handlers.then(ret);
			return;
		}
		
		common.Callbacks.batch(
			this.neighbors().map(n => r => {
				n.query(this, { ttl: args.ttl-1, query: args.query }, {
					then: (files) => {
						ret = ret.concat(files);
						r();
					},
					fail: err => {
						handlers.fail(err);
					}
				});
			}),
		err => {
			if(err == null) setTimeout(() => handlers.then(ret));
			else handlers.fail(err);
		}
	);
	}
	
	public name = ko.observable<string>();
	public neighbors = ko.observableArray<Base>([]);
	public files: File.Main[] = [];
}

export class Stub implements Base {
	public start(initialPeer: Base, handlers: Handlers<void> = stdHandlers) {}
	public ping(sender: Base, args: { ttl: number }, handlers: Handlers<Base[]>) {}
	requestNeighborhood(sender: Base, handlers: Handlers<void>) { handlers.then() }
	query(sender: Base, args: { ttl: number }, handlers: Handlers<File.Main[]>) {}
	
	public name: obs.Observable<string>;
	public neighbors: obs.ObservableArray<Base>;
	public files: File.Main[];
}

export interface Handlers<T> {
	then: (args?: T) => void;
	fail: (err) => void;
}