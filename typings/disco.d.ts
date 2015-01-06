/// <reference path="disco.ontology.d.ts" />

declare module "disco" {
	export class Context extends Default.Container {
	    constructor(serviceUri: string);
	}
	export var AuthData: () => {
	    user: string;
	    password: string;
	};
}