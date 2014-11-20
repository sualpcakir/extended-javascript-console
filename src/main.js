define(['format', 'expectation'],
function (format, Expectation) {
    "use strict";
    function Xcon () {

        // skins a console.log message to display the primitive type as well
        // as the expected output of a vanilla .log() command
        // opts: {
        //     "color": "#f9f9f9", // specify a css color
        //     "background": "rgb(0, 0, 0)", // specify a css color
        //     "log": true // also calls native console.log, which is useful for large objects and arrays
        // }
        // sometimes this function is called from console.run() to output
        // function return values.  In that case,
        // opts: {
        //     "color": "darkgreen", // or red
        //     "fnName": "nameOfFunction",
        //     "fnArgs": "all passed arguments",
        //     "error": true // indicates a thrown error
        // }
        this.out = this.out || function (blob, opts) {
            opts = opts || {};
            var logPart = format(blob, opts);
            this.log(logPart[0], logPart[1]);
            if (opts.log) {
                this.log(blob);
            }
        };

        // given a function, calls that function, returns the output,
        // and calls .out() to skin the output in green (success)
        // or red (failure).  Arguments, function name, and any error
        // messages are logged.
        this.run = this.run || function (fn, args, context) {
            if (typeof fn !== 'function') {
                this.out(arguments[0], arguments[1]);
                return arguments[0];
            }
            context = context || this;
            args = args || [];
            var result,
                opts = {
                    "fnName": fn.name || 'anonymous function',
                    "fnArgs": args.toString()
                };
            try {
                result = fn.apply(context, args);
                opts.color = 'darkgreen';
                this.out(result, opts);
                return result;
            } catch (e) {
                opts.color = 'red';
                opts.error = true;
                this.out(e.message, opts);
            }
        };

        // borrows heavily from jasmine.js syntax
        // console.expect instantiates an expectation object
        // with methods to test equality, truthiness,
        // falsiness, and whether or not data is defined.
        // Adding .not works the same way as jasmine.
        this.expect = this.expect || function (thing) {
            var expect = new Expectation(this, thing);
            expect.not = new Expectation(this, thing, {"not": true});
            return expect;
        };

        return this;

    }

    return Xcon.call(window.console);
});
