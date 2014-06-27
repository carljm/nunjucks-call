var console = require('console');
var nunjucks = require('nunjucks');
var callExt = require('../index.js');
var env = nunjucks.configure('test/templates');

callExt.init(env);

console.log('test_simple.j2:');
console.log(env.render('test_simple.j2'));

console.log('test_simple2.j2:');
console.log(env.render('test_simple2.j2'));
