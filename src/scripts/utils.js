var loadGlobally = function(module) {
	for(i in module) {
		global[i] = module[i];
	}
}

module.exports = { loadGlobally: loadGlobally }
