var console = require('console');
var nunjucks = require('nunjucks');
var nunjucksCall = require('../index.js');
var env = nunjucks.configure('test/templates', {autoescape: true});

nunjucksCall.init(env);

console.log('test_simple.j2:');
console.log(env.render('test_simple.j2'));

console.log('test_simple2.j2:');
console.log(env.render('test_simple2.j2'));

console.log('test_call.j2:');
console.log(env.render('test_call.j2'));

console.log('test_call2.j2:');
console.log(env.render('test_call2.j2'));
