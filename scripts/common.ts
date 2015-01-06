///reference path='./typings/knockout.d.ts' />
declare var $;

export class Counter {
	public inc(key: string) {
		this.data[key] ? ++this.data[key] : this.data[key] = 1;
	}
	
	public get(key: string) {
		return this.data[key] || 0;
	}
	
	private data = {};
}

export class NumberCounter {
	public inc(key: number) {
		this.data[key] ? ++this.data[key] : this.data[key] = 1;
	}
	
	public get(key: number) {
		return this.data[key] || 0;
	}
	
	public getAll() {
		return this.data;
	}
	
	private data: number[] = [];
}

export class Coll {
	public static single(collection: any[], predicate: (item: any, index: number) => boolean ): any  {
		for(var i = 0; i < collection.length; ++i) {
			if(predicate(collection[i], i))
				return collection[i];
		}
		return undefined;
	}
	
	public static has<T>(collection: T[], predicate: (item: T, index: number) => boolean ): boolean {
		return Coll.single(collection, predicate);
	}
	
	public static where(collection: any[], predicate: (item: any, index: number) => boolean ): any[]  {
		var ret = [];
		for(var i = 0; i < collection.length; ++i) {
			if(predicate(collection[i], i))
				ret.push(collection[i]);
		}
		return ret;
	}
	
	public static count(collection: any[], predicate: (item: any, index: number) => boolean ): number {
		return Coll.where(collection, predicate).length;
	}
	
	public static removeOneByPredicate<T>(collection: T[], predicate: (item: T) => boolean): boolean {
		var first = collection.filter(predicate)[0];
		if(first) {
			collection.splice(collection.indexOf(first), 1);
			return true;
		}
		else {
			return false;
		}
	}
	
	public static removeByPredicate<T>(collection: T[], predicate: (item: T) => boolean) {
		var filtered = collection.filter(predicate).reverse();
		filtered.forEach((value, index) => collection.splice(index, 1));
	}
	
	public static koRemoveWhere(collection: any, predicate: (item: any, index: number) => boolean ): any[] {
		var where = Coll.where(collection(), predicate);
		if(where.length > 0)
			collection.removeAll(where);
		return where;
	}
	
	public static randomChoice<T>(collection: T[], amount: number): T[] {
		var coll = collection.slice(0);
		var ret = [];
		for(var i = 0; i < amount; ++i) {
			if(coll.length == 0) break;
			var index = Math.floor(Math.random() * coll.length);
			ret.push(coll[index]);
			coll.splice(index, 1);
		}
		return ret;
	}
}

export class Comp {
	public static jsonEq(x: any, y: any): boolean {
		return JSON.stringify(x) == JSON.stringify(y);
	}
	
	public static genericEq(x: any, y: any): boolean {
		return x.eq(y);
	}
}

export class Callbacks {
	public static atOnce(callbacks: any[], onSuccess?: () => void) {
		var ctr = callbacks.length;
		
		var onReady = () => {
			--ctr;
			if(ctr <= 0) onSuccess && onSuccess();
		};
		for(var i = 0; i < callbacks.length; ++i) callbacks[i](onReady);
	}
	
	public static batch(callbacks: any[], then: (err?: any) => void) {
		var createHandler = (handler: () => void) => (err?: any) => {
			if(!err) handler();
			else then(err);
		};
		var func = (i: number) => {
			if(i >= callbacks.length) then();
			else {
				try {
					if(i >= callbacks.length-1) callbacks[i]( createHandler(then) );
					else callbacks[i]( createHandler(func.bind(null, i+1)) );
				}
				catch(e) {
					then(e);
				}
			}
		};
		func(0);
	}
}

export class Obj {
	public static props(obj: any): string[] {
		var ret: string[] = [];
		for(var prop in obj) { ret.push(prop) }
		return ret;
	}
}

ko.observable.fn.mapValue = function(map: (any) => any) { this(map(this())) };