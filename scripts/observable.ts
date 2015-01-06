import Events = require('event');
import Common = require('common');

export interface Observable<T> {
	(): T;
	(T): void;
	subscribe( callback: (T) => void ): Subscription;
	
	dispose(): void;
}

export interface Subscription {
	dispose(): void;
}

export interface ObservableArray<T> extends Observable<T[]> {
	push(item: T): void;
	remove(item: T): void;
	splice(from: number, count: number, ...replacement: T[]): T[];
}

export interface ReadonlyObservableArrayEx<T> {
	get(): T[];
	get(index: number): T;

	pushed: Events.Event<T>;
	removed: Events.Event<T>;
	changed: Events.Event<T[]>;
	
	dispose(): void;
}

export interface ObservableArrayEx<T> extends ReadonlyObservableArrayEx<T> {
	set(value: T[]): void;
	
	push(item: T): void;
	remove(item: T): void;
	removeMany(from: number, count?: number): void;
	removeByPredicate(predicate: (item: T) => boolean): void;
	
	dispose(): void;
}

export class ObservableArrayExtender<T> implements ObservableArrayEx<T> {
	constructor(innerObservable: ObservableArray<T>) {
		this.innerObservable = innerObservable;
	}
	
	public get(index?: number): any {
		if(arguments.length >= 1) return this.getSingle(index);
		else return this.getAll();
	}
	
	private getAll(): T[] {
		return this.innerObservable();
	}
	
	private getSingle(index: number): T {
		console.log('getSingle');
		if(index >= 0) return this.innerObservable()[index];
		else return this.innerObservable()[this.innerObservable().length+index];
	}
	
	public set(value: T[]): void {
		var old = this.innerObservable();
		this.innerObservable(value);
		this.changed.raise(old);
	}
	
	public push(item: T): void {
		this.innerObservable.push(item);
		this.pushed.raise(item);
	}
	
	public remove(item: T): void {
		this.innerObservable.remove(item);
		this.removed.raise(item);
	}
	
	public removeMany(from: number, count?: number) {
		var spliced: T[];
		if(count != null)
			spliced = this.innerObservable.splice(from, count);
		else
			spliced = this.innerObservable.splice(from, this.innerObservable().length);
		spliced.forEach(removed => this.removed.raise(removed));
	}
	
	public removeByPredicate(predicate: (item: T) => boolean) {
		var filtered = this.innerObservable().filter(predicate).reverse();
		filtered.forEach(item => this.remove(item));
	}
	
	public subscribe( handler: (T) => void ): Subscription {
		return this.innerObservable.subscribe(handler);
	}
	
	public dispose() {
		this.innerObservable.dispose();
	}
	
	public pushed = new Events.EventImpl<T>();
	public removed = new Events.EventImpl<T>();
	public changed = new Events.EventImpl<T[]>();
	private innerObservable: ObservableArray<T>;
}