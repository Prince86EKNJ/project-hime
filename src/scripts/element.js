var element = {};

var getCssPoint = function(elem, cssName) {
	var result = function(value) {
		if(arguments.length == 0)
			return elem.css(cssName);

		elem.css(cssName, value);
	};
	return result;
};
element.getCssPoint = getCssPoint;

var getCssPixelPoint = function(elem, cssName) {
	var result = function(value) {
		if(arguments.length == 0) {
			var rawValue = elem.css(cssName);
			var valueStr = rawValue.substring(0, rawValue.length-2);
			return parseFloat(valueStr);
		}

		elem.css(cssName, value+"px");
	};
	return result;
};
element.getCssPixelPoint = getCssPixelPoint;

var getPosPoint = function(elem) {
	var result = {
		x: getCssPixelPoint(elem, "left"),
		y: getCssPixelPoint(elem, "top")
	}
	return result;
};
element.getPosPoint = getPosPoint;

module.exports = element;
