export interface Readonly<T> {
	get(id: number): T;
}

export interface Base<T> extends Readonly<T> {
	set(id: number, value: T): T;
}

export class Main<T> implements Base<T> {
	public get(id: number): T {
		var ret = this.items[id];
		if(ret) return ret;
		else throw new Error('item does not exist: id = ' + id);
	}
	
	public set(id: number, value: T): T {
		return this.items[id] = value;
	}
	
	private items = {};
}

export class Many<T> implements Readonly<T> {
	public get(id: number): T {
		var ret: T;
		var err: Error = new Error('ItemContainer.Many.get: id[' + id + '] not available');
		this.containers.forEach(c => {
			try { ret = c.get(id); return }
			catch(e) {}
		});
		if(ret) return ret;
		throw err;
	}
	
	public insertContainer(container: Readonly<T>) {
		this.containers.push(container);
	}
	
	public removeContainer(container: Readonly<T>) {
		var index = this.containers.indexOf(container);
		if(index != -1) this.containers.splice(index, 1);
	}
	
	private containers: Readonly<T>[] = [];
}