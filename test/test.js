var console = require('console');
var fs = require('fs');
var nunjucks = require('nunjucks');
var nunjucksCall = require('../index.js');
var env = nunjucks.configure('test/templates', {autoescape: true});

nunjucksCall.init(env);

function test(name) {
  var expected = fs.readFileSync(
    'test/templates/' + name + '.output', {encoding: 'utf8'});
  var actual = env.render(name + '.j2');
  console.log(name + ': ' + (expected === actual ? 'OK' : actual));
}

test('test_simple');
test('test_simple2');
test('test_call');
test('test_call2');
test('test_imported');
