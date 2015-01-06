define(["require", "exports", 'tests/asyncunit', 'tests/peer'], function(require, exports, asyncUnit, Peer) {
    var test = new asyncUnit.Test();
    test.addTestClass(new Peer.TestClass, 'Peer');

    test.run(function (results) {
        return test.showResults(document.getElementById('test-results'), results);
    });
});
