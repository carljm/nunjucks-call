(function () {
  "use strict";

  var root = this;

  function CallBlockExtension() {
    this.tags = ['call'];

    this.parse = function(parser, nodes, lexer) {
      var myName = parser.nextToken().value; // should be 'call'
      var tok = parser.nextToken();
      var macroName = new nodes.Literal(tok.lineno, tok.colno, tok.value);
      var args = parser.parseSignature();
      args.addChild(macroName); // arbitrarily add macro name as last arg
      parser.advanceAfterBlockEnd(myName);
      var body = parser.parseUntilBlocks('endcall');
      parser.advanceAfterBlockEnd();
      return new nodes.CallExtension(this, 'run', args, [body]);
    };

    this.run = function(context) {
      var args = Array.prototype.slice.call(arguments, 0);
      var body = args.pop();
      var macroName = args.pop();
      var macro = context.ctx[macroName];
      var macroArgs = args.slice(1); // skip the 'context' arg
      context.ctx.caller = body;
      return macro.apply(this, macroArgs);
    };
  }

  if (typeof module !== 'undefined') {
    module.exports = {
      CallBlockExtension: CallBlockExtension,
    };
  } else {
    root.CallBlockExtension = CallBlockExtension;
  }
}).call(this);
