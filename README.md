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
    var nunjucksCall = require('nunjucks-call');

    var env = nunjucks.configure();
    nunjucksCall.init(env);

Or in the browser, include nunjucks and `call.js` and then:

    var env = nunjucks.configure();
    nunjucksCall.init(env);


Advanced
---------

This extension also supports passing arguments from the macro back to the
caller, so you can do things like this:

    {% macro list(items) %}
      <ul>
        {% for i in items %}
          <li>{{ caller(i) }}</li>
        {% endfor %}
      </ul>
    {% endmacro %}

    {% call(item) list(['a', 'b', 'c']) %}
      {{ item }}
    {% endcall %}


Todo
----

- Proper tests.
- Merge into nunjucks core.
