define(["require", "exports", 'common'], function(require, exports, cmn) {
    var Win = (function () {
        function Win(viewTemplate, view) {
            this.state = ko.observable();
            this.onEnter = function () {
            };
            this.onLeave = function () {
            };
            this.viewTemplate = viewTemplate;
            this.view = view;
        }
        Win.prototype.setState = function (newState) {
        };
        return Win;
    })();
    exports.Win = Win;

    var WinContainer = (function () {
        function WinContainer(win) {
            var _this = this;
            this.history = ko.observableArray();
            this.win = ko.observable();
            this.lastWin = ko.observable(null);
            this.onChangeWinStateCombi = function (newCombi) {
                _this.pushHistory(newCombi);
            };
            this.onChangeWin = function (newWin) {
                if (newWin)
                    newWin.onEnter();
                if (_this.lastWin())
                    _this.lastWin().onLeave();
                _this.lastWin(newWin);
            };
            //
            this.pushHistory = function (combi) {
                if (_this.isCombinationPushable(combi)) {
                    cmn.Coll.koRemoveWhere(_this.history, function (x) {
                        return cmn.Comp.genericEq(x, combi);
                    });
                    _this.history.push(combi);
                } else {
                    //this.goBack();
                    /*var upperCombi = this.history()[this.history().length-1];
                    upperCombi.win.setState(upperCombi.state);
                    this.win(upperCombi.win);*/
                }
            };
            //removes the current window and activates the previous
            this.goBack = function () {
                if (_this.canGoBack()) {
                    var prevState = _this.prevState();
                    _this.removeLast(1);
                    _this.setCombi(prevState);
                }
            };
            this.setCombi = function (combi) {
                combi.win.setState(combi.state);
                _this.win(combi.win);
            };
            //replaces the most upper window of this.history with newWin and makes it active
            this.replaceWin = function (newWin) {
                _this.removeLast(1);
                _this.win(newWin);
            };
            this.removeLast = function (x) {
                _this.history(_this.history.slice(0, -x));
            };
            this.isCombinationPushable = function (combi) {
                return combi != null && combi.state != null;
            };
            this.canGoBack = ko.computed(function () {
                var len = _this.history().length;
                return len > 1;
            });
            this.prevState = ko.computed(function () {
                return _this.history()[_this.history().length - 2];
            });
            this.winStateCombi = ko.computed(function () {
                if (_this.win() != null)
                    return new WinStateCombi(_this.win(), _this.win().state());
                else
                    return new WinStateCombi(null, null);
            });
            this.winStateCombi.subscribe(this.onChangeWinStateCombi);
            this.win.subscribe(this.onChangeWin);

            this.win(win);
        }
        return WinContainer;
    })();
    exports.WinContainer = WinContainer;

    var WinStateCombi = (function () {
        function WinStateCombi(win, state) {
            this.win = win;
            this.state = state;
        }
        WinStateCombi.prototype.eq = function (other) {
            return this.win == other.win && cmn.Comp.jsonEq(this.state, other.state);
        };
        return WinStateCombi;
    })();
    exports.WinStateCombi = WinStateCombi;
});
