import common = require('common')

 export interface ITestClass {

 }

 export class Test {
     private tests: TestDefintion[] = [];
     private testClass: TestClass = new TestClass();

     addTestClass(testClass: ITestClass, name: string = 'Tests'): void {
         this.tests.push(new TestDefintion(testClass, name));
     }

     isReservedFunctionName(functionName: string): boolean {
         for (var prop in this.testClass) {
             if (prop === functionName) {
                 return true;
             }
         }
         return false;
     }

     run(then: (result: TestResult) => void) {
         var testContext = new TestContext();
         var testResult = new TestResult();
         
         var unitBatch = this.tests.map(test => r => {
         	var testClass = test.testClass;
         	var testName = test.name;
         	
         	var functionBatch = common.Obj.props(testClass).map(prop => r => {
         		if(!this.isReservedFunctionName(prop) && typeof testClass[prop] === 'function') {
         			common.Callbacks.batch([
         				r => {
         					if(typeof testClass['setUp'] === 'function') testClass['setUp'](r);
         					else r();
         				},
         				r => {
							var async = false;
							var ready = false;
							var then = err => {
								if(!ready) {
									ready = true;
	         						if(!err) testResult.passes.push( new TestDescription(testName, prop, 'OK') );
	         						else {
	         							testResult.errors.push( new TestDescription(testName, prop, err.toString()) );
	         							console.log('asyncunit', err);
	         						}
	         						r();
								}
         					};
							var cb = <T extends { apply: (subject, ...args) => void }>(cb: T): T => {
								return <any>function(...args) {
									try { return cb.apply(this, arguments) }
									catch(e) {
										then(e);
									}
								}
							}
							try { testClass[prop](() => async = true, then, cb, testContext); }
							catch(e) { then(e); }
							
							if(!async) then(null);
         				},
         				r => {
         					if(typeof testClass['tearDown'] === 'function') testClass['tearDown'](r);
         					else r();
         				}
         			], err => {
         				if(err) {
         					testResult.errors.push( new TestDescription(testName, prop, err.toString()) );
         					console.log('asyncunit', err);
         				}
         				r();
         			});
         		}
         		else r();
         	});
         	common.Callbacks.batch(functionBatch, r);
         });
         common.Callbacks.atOnce( unitBatch, () => then(testResult) );

         /*for (var i = 0; i < this.tests.length; ++i) {
             var testClass = this.tests[i].testClass;
             var testName = this.tests[i].name;
             for (var prop in testClass) {
                 if (!this.isReservedFunctionName(prop)) {
                     if (typeof testClass[prop] === 'function') {
                         if (typeof testClass['setUp'] === 'function') {
                             testClass['setUp']();
                         }
                         try {
                             testClass[prop](testContext);
                             testResult.passes.push(new TestDescription(testName, prop, 'OK'));
                         } catch (err) {
                             testResult.errors.push(new TestDescription(testName, prop, err.toString()));
                         }
                         if (typeof testClass['tearDown'] === 'function') {
                             testClass['tearDown']();
                         }
                     }
                 }
             }
         }

         return testResult;*/
     }

     showResults(target: HTMLElement, result: TestResult) {
         var template = '<article>' +
             '<h1>' + this.getTestResult(result) + '</h1>' +
             '<p>' + this.getTestSummary(result) + '</p>' +
             '<section id="tsFail">' +
             '<h2>Errors</h2>' +
             '<ul class="bad">' + this.getTestResultList(result.errors) + '</ul>' +
             '</section>' +
             '<section id="tsOkay">' +
             '<h2>Passing Tests</h2>' +
             '<ul class="good">' + this.getTestResultList(result.passes) + '</ul>' +
             '</section>' +
             '</article>';

         target.innerHTML = template;
     }

     private getTestResult(result: TestResult) {
         return result.errors.length === 0 ? 'Test Passed' : 'Test Failed';
     }

     private getTestSummary(result: TestResult) {
         return 'Total tests: <span id="tsUnitTotalCout">' + (result.passes.length + result.errors.length).toString() + '</span>. ' +
             'Passed tests: <span id="tsUnitPassCount" class="good">' + result.passes.length + '</span>. ' +
             'Failed tests: <span id="tsUnitFailCount" class="bad">' + result.errors.length + '</span>.';
     }

     private getTestResultList(testResults: TestDescription[]) {
         var list = '';
         var group = '';
         var isFirst = true;
         for (var i = 0; i < testResults.length; ++i) {
             var result = testResults[i];
             if (result.testName !== group) {
                 group = result.testName;
                 if (isFirst) {
                     isFirst = false;
                 } else {
                     list += '</li></ul>';
                 }
                 list += '<li>' + result.testName + '<ul>';
             }
             list += '<li>' + result.funcName + '(): ' + this.encodeHtmlEntities(result.message) + '</li>';
         }
         return list + '</ul>';
     }

     private encodeHtmlEntities(input: string) {
         var entitiesToReplace = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
         input.replace(/[&<>]/g, function (entity) { return entitiesToReplace[entity] || entity; } );
         return input;
     }
 }

 export class TestContext {
     setUp(r) {
         r();
     }

     tearDown(r) {
         r();
     }

     areIdentical(a: any, b: any): void {
         if (a !== b) {
             throw 'areIdentical failed when given ' +
                 '{' + (typeof a) + '} "' + a + '" and ' +
                 '{' + (typeof b) + '} "' + b + '"';
         }
     }

     areNotIdentical(a: any, b: any): void {
         if (a === b) {
             throw 'areNotIdentical failed when given ' +
                 '{' + (typeof a) + '} "' + a + '" and ' +
                 '{' + (typeof b) + '} "' + b + '"';
         }
     }

     isTrue(a: boolean) {
         if (!a) {
             throw 'isTrue failed when given ' +
                 '{' + (typeof a) + '} "' + a + '"';
         }
     }

     isFalse(a: boolean) {
         if (a) {
             throw 'isFalse failed when given ' +
                 '{' + (typeof a) + '} "' + a + '"';
         }
     }

     isTruthy(a: any) {
         if (!a) {
             throw 'isTrue failed when given ' +
                 '{' + (typeof a) + '} "' + a + '"';
         }
     }

     isFalsey(a: any) {
         if (a) {
             throw 'isFalse failed when given ' +
                 '{' + (typeof a) + '} "' + a + '"';
         }
     }

     throws(a: { (): void; }) {
         var isThrown = false;
         try {
             a();
         } catch (ex) {
             isThrown = true;
         }
         if (!isThrown) {
             throw 'did not throw an error';
         }
     }

     fail() {
         throw 'fail';
     }
 }

 export class TestClass extends TestContext {

 }

 export class FakeFunction {
     constructor(public name: string, public delgate: { (...args: any[]): any; }) {
     }
 }

 export class Fake<T> {
     constructor(obj: T) {
         for (var prop in obj) {
             if (typeof obj[prop] === 'function') {
                 this[prop] = function () { };
             } else {
                 this[prop] = null;
             }
         }
     }

     create(): T {
         return <T> <any> this;
     }

     addFunction(name: string, delegate: { (...args: any[]): any; }) {
         this[name] = delegate;
     }

     addProperty(name: string, value: any) {
         this[name] = value;
     }
 }

 class TestDefintion {
     constructor(public testClass: ITestClass, public name: string) {
     }
 }

 class TestError implements Error {
     constructor(public name: string, public message: string) {
     }
 }

 export class TestDescription {
     constructor(public testName: string, public funcName: string, public message: string) {
     }
 }

 export class TestResult {
     public passes: TestDescription[] = [];
     public errors: TestDescription[] = [];
 }