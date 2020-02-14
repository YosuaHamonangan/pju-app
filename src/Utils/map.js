var sectionLength = 1;

var utils = {
	getSection: function(longitude, latitude) {
		return `${Math.floor(longitude/sectionLength)}/${Math.floor(latitude/sectionLength)}`;
	},
	range2Sections: function(longitudeMin, longitudeMax, latitudeMin, latitudeMax) {
		var xMin = Math.floor(longitudeMin/sectionLength);
		var xMax = Math.floor(longitudeMax/sectionLength);
		var yMin = Math.floor(latitudeMin/sectionLength);
		var yMax = Math.floor(latitudeMax/sectionLength);

		var codes = [];
		for(var x = xMin; x <= xMax; x++) {
			for(var y = yMin; y <= yMax; y++) {
				codes.push(`${Math.floor(x)}/${Math.floor(y)}`)
			}
		}
		return codes;
	}
}

module.exports = utils;
