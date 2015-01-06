///<reference path="array.ts" />

export interface Event<Args> {
	subscribe(cb: (args: Args) => void): Subscription;
	///unsubscribe as soon as cb returns true
	subscribeUntil(cb: (args: Args) => boolean, timeout?: number): Subscription;
	unsubscribe(cb: (Args) => void);
	raise(args?: Args);
	raiseThis(args?: Args);
}

export interface Listener<Args> {
	(Args): void;
}

export class Subscription {
	undo: () => void;
	
	public static fromDisposable(disposable: { dispose: () => void }): Subscription {
		var s = new Subscription();
		s.undo = () => disposable.dispose();
		return s;
	}
}

export class EventImpl<Args> implements Event<Args> {
	constructor() {
		this.raiseThis = this.raise.bind(this);
	}

	public subscribe(cb: (args: Args) => void): Subscription {
		if(!this.isListener(cb))
			this.listeners.push(cb);
		
		return { undo: () => this.unsubscribe(cb) };
	}
	
	public subscribeUntil(cb: (args: Args) => boolean, timeout?: number): Subscription {
		var subscription: Subscription;
		var handler = (args: Args) => { if(cb(args)) subscription.undo() };
		subscription = this.subscribe(handler);
		if(typeof timeout === 'number') setTimeout(() => subscription.undo(), timeout);
		return subscription;
	}

	public unsubscribe(cb: (Args) => void) {
		if(this.isListener(cb))
			this.listeners.removeOne(cb);
	}

	public raise(args?: Args) {
		this.listeners.forEach(function(l: (Args) => void) {
			l(args);
		});
	}
	
	public raiseThis: (args?: Args) => void;

	private isListener(cb: (Args) => void) {
		return this.listeners.indexOf(cb) != -1;
	}

	private listeners: Array<(Args) => void> = [];
}

export class Void {}