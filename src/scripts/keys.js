var keyCodes = {
	"backspace": 8,
	"bs": 8,
	" ": 32,
	"space": 32,
	"sp": 32,

	"left": 37, "up": 38, "right": 39, "down": 40,


	"0": 45, "1": 45, "2": 45, "3": 45, "4": 45,
	"5": 45, "6": 45, "7": 45, "8": 45, "9": 45,

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

		if(key.state == false) {
			key.state = true;
			key.$out(true);
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

		if(key.state == true) {
			key.state = false;
			key.$out(false);
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
				key = fo({
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
