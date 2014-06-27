(function () {
  "use strict";

  var root = this;

  function CallBlockExtension() {
    this.tags = ['call'];

    this.parse = function(parser, nodes, lexer) {
      var myName = parser.nextToken().value; // should be 'call'
      var callerArgs = parser.parseSignature(true);
      var macro = parser.nextToken();
      // We can only pass one flat list of arguments to our run() function, so
      // we construct the list like so: first all the arguments to the called
      // macro, then all the caller argument names, then the number of caller
      // argument names, then the called macro name. This allows run() to pop
      // things off from the end of this flat list and know what they all are.
      var args = parser.parseSignature();
      var numCallerArgs = 0;
      if (callerArgs) {
        for (var i=0; i<callerArgs.children.length; i++) {
          // for an arg-list like (a, b, c), parseSignature returns Symbol
          // tokens, but we don't want the compiler to try to dereference those
          // symbols, we just want the argument names as literal strings
          var sym = callerArgs.children[i];
          args.addChild(new nodes.Literal(sym.lineno, sym.colno, sym.value));
        }
        numCallerArgs = callerArgs.children.length;
      }
      // Push the number of callerArgs so we know how many to expect
      args.addChild(new nodes.Literal(macro.lineno, macro.colno, numCallerArgs));
      // add macro name as last arg
      args.addChild(new nodes.Literal(macro.lineno, macro.colno, macro.value));

      parser.advanceAfterBlockEnd(myName);
      var body = parser.parseUntilBlocks('endcall');
      parser.advanceAfterBlockEnd();

      return new nodes.CallExtension(this, 'run', args, [body]);
    };

    this.run = function(context) {
      var args = Array.prototype.slice.call(arguments, 0);
      // nunjucks sends our "body" as the last argument
      var body = args.pop();
      // then in our args list, the last one is the macro name
      var macroName = args.pop();
      // prior to the macro name is the number of caller arg names to expect
      var numCallerArgs = args.pop();
      var callerArgNames = [];
      for (var i=0; i<numCallerArgs; i++) {
        callerArgNames.unshift(args.pop());
      }
      // look up the macro to call in the context
      var macro = context.lookup(macroName);
      // all remaining unpopped args (except for the initial 'context' arg) are
      // arguments to the macro
      var macroArgs = args.slice(1);
      var caller = function () {
        var callerArgs = Array.prototype.slice.call(arguments, 0);
        // set all the caller args in the context before rendering the body
        for (var i=0; i<numCallerArgs; i++) {
          context.setVariable(callerArgNames[i], callerArgs[i]);
        }
        return body();
      };
      context.setVariable('caller', caller);
      return macro.apply(this, macroArgs);
    };
  }

  // convenience function to add this extension to a nunjucks environment
  function init(nunjucksEnv) {
    nunjucksEnv.addExtension('call', new CallBlockExtension());
  }

  var exports = {
    CallBlockExtension: CallBlockExtension,
    init: init,
  };

  if (typeof module !== 'undefined') {
    module.exports = exports;
  } else {
    root.nunjucksCall = exports;
  }
}).call(this);
