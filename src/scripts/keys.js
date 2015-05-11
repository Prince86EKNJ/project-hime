var func = require("./func");

var keyCodes = {
	"backspace": 8,
	"bs": 8,
	" ": 32,
	"space": 32,
	"sp": 32,

	"left": 37, "up": 38, "right": 39, "down": 40,

	"0": 48, "1": 49, "2": 50, "3": 51, "4": 52,
	"5": 53, "6": 54, "7": 55, "8": 56, "9": 57,

	"a": 65, "b": 66, "c": 67, "d": 68, "e": 69,
	"f": 70, "g": 71, "h": 72, "i": 73, "j": 74,
	"k": 75, "l": 76, "m": 77, "n": 78, "o": 79,
	"p": 80, "q": 81, "r": 82, "s": 83, "t": 84,
	"u": 85, "v": 86, "w": 87, "x": 88, "y": 89,
	"z": 90
};

module.exports = function(elem) {

	var keys = {};

	elem.addEventListener("keydown", function(e)
	{
		var keyCode = e.keyCode;
		var key = keys[keyCode];
		if(key == undefined)
			return;

		if(key.state == 0) {
			key.state = 1;
			key.$out(1);
		}

		if(key.preventDefault)
			e.preventDefault();
	});

	elem.addEventListener("keyup", function(e)
	{
		var keyCode = e.keyCode;
		var key = keys[keyCode];
		if(key == undefined)
			return;

		if(key.state == 1) {
			key.state = 0;
			key.$out(0);
		}

		if(key.preventDefault)
			e.preventDefault();
	});

	var result = {
		getKey: function(code) {
			if(typeof(code) == "string")
				code = keyCodes[code];

			var key = keys[code];
			if(key == undefined) {
				key = func.fo({
					state: false,
					code: code,
					preventDefault: false
				});
				keys[code] = key;
			}
			return key;
		}
	};
	return result;
};
