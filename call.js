(function () {
  "use strict";

  var root = this;

  function CallBlockExtension() {
    this.tags = ['call'];

    this.parse = function(parser, nodes, lexer) {
      var myName = parser.nextToken().value; // should be 'call'
      var callerArgs = parser.parseSignature(true);
      var tok = parser.nextToken();
      var macroName = new nodes.Literal(tok.lineno, tok.colno, tok.value);
      var args = parser.parseSignature();
      var numCallerArgs = 0;
      if (callerArgs) {
        for (var i=0; i<callerArgs.children.length; i++) {
          // need to make literals, not symbols, so compiler doesn't deref
          var sym = callerArgs.children[i];
          args.addChild(new nodes.Literal(sym.lineno, sym.colno, sym.value));
        }
        numCallerArgs = callerArgs.children.length;
      }
      // Push the number of callerArgs so we know how many to expect
      args.addChild(new nodes.Literal(tok.lineno, tok.colno, numCallerArgs));
      args.addChild(macroName); // add macro name as last arg
      parser.advanceAfterBlockEnd(myName);
      var body = parser.parseUntilBlocks('endcall');
      parser.advanceAfterBlockEnd();
      return new nodes.CallExtension(this, 'run', args, [body]);
    };

    this.run = function(context) {
      var args = Array.prototype.slice.call(arguments, 0);
      var body = args.pop();
      var macroName = args.pop();
      var numCallerArgs = args.pop();
      var callerArgNames = [];
      for (var i=0; i<numCallerArgs; i++) {
        callerArgNames.unshift(args.pop());
      }
      var macro = context.lookup(macroName);
      var macroArgs = args.slice(1); // skip the 'context' arg
      var caller = function () {
        var callerArgs = Array.prototype.slice.call(arguments, 0);
        for (var i=0; i<numCallerArgs; i++) {
          context.setVariable(callerArgNames[i], callerArgs[i]);
        }
        return body();
      };
      context.setVariable('caller', caller);
      return macro.apply(this, macroArgs);
    };
  }

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
