define(["require", "exports"], function(require, exports) {
    var ChildSynchronizer = (function () {
        function ChildSynchronizer() {
        }
        ChildSynchronizer.prototype.setViewModelFactory = function (fty) {
            this.viewModelFactory = fty;
            return this;
        };

        ChildSynchronizer.prototype.setControllerFactory = function (fty) {
            this.controllerFactory = fty;
            return this;
        };

        ChildSynchronizer.prototype.setViewModelChangedHandler = function (handler) {
            this.viewModelChangedHandler = handler;
            return this;
        };

        ChildSynchronizer.prototype.setModelObservable = function (m) {
            this.model = m;
            this.model.subscribe(this.modelChanged.bind(this));
            this.modelChanged();
            return this;
        };

        ChildSynchronizer.prototype.setViewModelObservable = function (v) {
            this.setViewModelChangedHandler(function (newViewModel) {
                return v(newViewModel);
            });
            return this;
        };

        ChildSynchronizer.prototype.modelChanged = function () {
            if (this.controller)
                this.controller.dispose();
            this.viewModel = this.viewModelFactory.create();
            this.viewModelChangedHandler && this.viewModelChangedHandler(this.viewModel);
            this.controller = this.controllerFactory.create(this.model(), this.viewModel);
        };

        ChildSynchronizer.prototype.dispose = function () {
            if (this.controller)
                this.controller.dispose();
        };
        return ChildSynchronizer;
    })();
    exports.ChildSynchronizer = ChildSynchronizer;
});
