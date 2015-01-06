Array.prototype.removeOne = function (el) {
    var index = this.indexOf(el);
    if (index != -1) {
        this.splice(index, 1);
        return true;
    }
};

Array.prototype.removeOneByPredicate = function (pr) {
    var index = this.indexOf(this.first(pr));
    if (index != -1) {
        this.splice(index, 1);
        return true;
    }
};

Array.prototype.pushOnce = function (it) {
    if (this.indexOf(it) == -1)
        this.push(it);
    else
        return false;

    return true;
};

Array.prototype.appendOnce = function (elems) {
    var _this = this;
    elems.forEach(function (e) {
        return _this.pushOnce(e);
    });
};

Array.prototype.where = function (predicate) {
    var ret = [];
    for (var i = 0; i < this.length; ++i) {
        if (predicate(this[i], i))
            ret.push(this[i]);
    }
    return ret;
};

Array.prototype.first = function (predicate) {
    for (var i = 0; i < this.length; ++i) {
        if (predicate(this[i]))
            return this[i];
    }
};

Array.prototype.get = function (index) {
    if (index >= 0)
        return this[index];
    else
        return this[this.length + index];
};
