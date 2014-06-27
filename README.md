nunjucks-call
=============

An implementation of the `call` tag for
[nunjucks](http://mozilla.github.io/nunjucks/).

Allows macros to use `caller()`:

    {% macro wrap(el) %}
      <{{ el }}>{{ caller() }}</{{ el }}>
    {% endmacro %}

    {% call wrap('div') %}
      Foo!
    {% endcall %}


Usage
-----

In node:

    var nunjucks = require('nunjucks');
    var callExt = require('nunjucks-call');

    var env = nunjucks.configure();

    callExt.init(env);

Or in the browser, include nunjucks and `call.js` and then:

    var env = nunjucks.configure();
    env.addExtension('call', new CallBlockExtension());


Todo
----

- Proper tests.
- Implement passing args to `caller()`.
