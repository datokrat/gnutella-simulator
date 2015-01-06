import cmn = require('common')

export class Win {
	constructor(viewTemplate: string, view) {
		this.viewTemplate = viewTemplate;
		this.view = view;
	}

	public view: any;
	public viewTemplate: any;
	public state = ko.observable<any>();
	
	public setState(newState: any) {}
	
	public onEnter = () => {}
	public onLeave = () => {}
}

export class WinContainer {
	constructor(win) {
		this.winStateCombi.subscribe(this.onChangeWinStateCombi);
		this.win.subscribe(this.onChangeWin);
		
		this.win(win);
	}
	
	public history = ko.observableArray<WinStateCombi>(); //Also contains this.win
	public win = ko.observable<Win>();
	public lastWin = ko.observable<Win>(null);
	
	public onChangeWinStateCombi=(newCombi: WinStateCombi):void => {
		this.pushHistory(newCombi);
	}
	
	public onChangeWin=(newWin: Win):void => {
		if(newWin) newWin.onEnter();
		if(this.lastWin()) this.lastWin().onLeave();
		this.lastWin(newWin);
	}
	
	//
	private pushHistory = (combi: WinStateCombi):void => {
		if(this.isCombinationPushable(combi)) {
			cmn.Coll.koRemoveWhere(this.history, (x: WinStateCombi) => cmn.Comp.genericEq(x, combi));
			this.history.push(combi);
		}
		else {
			//this.goBack();
			/*var upperCombi = this.history()[this.history().length-1];
			upperCombi.win.setState(upperCombi.state);
			this.win(upperCombi.win);*/
		}
	};
	
	//removes the current window and activates the previous
	public goBack = ():void => {
		if(this.canGoBack()) {
			var prevState = this.prevState();
			this.removeLast(1);
			this.setCombi(prevState);
		}
	};
	
	public setCombi = (combi):void => {
		combi.win.setState(combi.state);
		this.win(combi.win);
	};
	
	//replaces the most upper window of this.history with newWin and makes it active
	public replaceWin = (newWin: Win) => {
		this.removeLast(1);
		this.win(newWin);
	};
	
	public removeLast = (x: number) => {
		this.history(this.history.slice(0,-x));
	};
	
	public isCombinationPushable = (combi):boolean => {
		return combi != null && combi.state != null;
	};
	
	public canGoBack = ko.computed<boolean>(() => {
		var len = this.history().length;
		return len > 1;
	});
	
	public prevState = ko.computed<WinStateCombi>(() => {
		return <WinStateCombi>this.history()[this.history().length-2];
	});
	
	public winStateCombi = ko.computed<WinStateCombi>(() => {
		if(this.win() != null)
			return new WinStateCombi(this.win(), this.win().state());
		else
			return new WinStateCombi(null,null);
	});
}

export class WinStateCombi {
	public win: Win;
	public state: any;
	
	constructor(win: Win, state: any) {
		this.win = win;
		this.state = state;
	}
	
	public eq(other: WinStateCombi): boolean {
		return this.win == other.win && cmn.Comp.jsonEq(this.state, other.state);
	}
}