export class Counter {
	public inc(key: string) {
		this.data[key] ? ++this.data[key] : this.data[key] = 1;
	}
	
	public get(key: string) {
		return this.data[key] || 0;
	}
	
	private data = {};
}

export class TestErrorBase {
	public toString(): string {
		return JSON.stringify(this);
	}
}

export class TestError extends TestErrorBase {
	constructor(message: string) {
		super();
		this.message = message;
	}
	
	public toString() {
		return "TestError: " + this.message;
	}
	
	public message: string;
}

export function assert(condition: (valueCollector: ValueCollector) => boolean) {
	var valueCollector = new ValueCollector();
	if(!condition(valueCollector)) {
		throw new TestError("assert[" + valueCollector.values.toString() + "]: " + getFnBody(condition).replace("v.val", ""));
	}
}
	
export class ValueCollector {
	public val<T>(value: T): T {
		this.values.push(value);
		return value;
	}
	
	public str<T>(value: T): T {
		this.values.push(JSON.stringify(value));
		return value;
	}
	
	public values: any[] = [];
}

export function assertThrows(action: () => void) {
	var throwed = false;
	try {
		action();
	}
	catch(e) {
		throwed = true;
	}
	if(!throwed)
		throw new TestError("assertThrows");
}

export function throwError(err) {
	throw err;
}

function getFnBody(fn: (...args) => boolean) {
	var entire = fn.toString(); 
	return entire.slice(entire.indexOf(" return ") + 8, entire.lastIndexOf("}"));
}