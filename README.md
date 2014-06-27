nunjucks-call
=============

An implementation of the [call](http://jinja.pocoo.org/docs/templates/#call)
tag for [nunjucks](http://mozilla.github.io/nunjucks/).

Allows macros to use `caller()`:

    {% macro wrap(el) %}
      <{{ el }}>{{ caller() }}</{{ el }}>
    {% endmacro %}

    {% call wrap('div') %}
      Foo!
    {% endcall %}

This will render as:

    <div>
      Foo!
    </div>


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

- Implement passing args to `caller()`.
- Proper tests.
- Merge into nunjucks core, hopefully.
