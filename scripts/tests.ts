import asyncUnit = require('tests/asyncunit');

import Peer = require('tests/peer');

var test = new asyncUnit.Test();
test.addTestClass(new Peer.TestClass, 'Peer');

test.run(results => test.showResults(document.getElementById('test-results'), results));