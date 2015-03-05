/*
 * OpenSeadragon.GigapanTileSource -  to display Gigapan tiles with OpenSeadragon
 *  
 * Works with quadkey-based filestructure created by Gigapan Stitch.
 *
 * May also work for images hosted at Gigapan.com if the appropriate base URL is used.
 *
 * This plugin is based on TmsTileSource:
 *     https://github.com/openseadragon/openseadragon/blob/master/src/tmstilesource.js
 */



(function( $ ){

/**
 * @class GigapanTileSource
 * @classdesc A tilesource implementation for tiles created by Gigapan Stitch, also used on the gigapan.com website.
 *
 * @memberof OpenSeadragon
 * @extends OpenSeadragon.TileSource
 * @param {Number|Object} width - the pixel width of the image or the idiomatic
 *      options object which is used instead of positional arguments.
 * @param {Number} height
 * @param {Number} tileSize -- default value is 256.
 * @param {Number} tileOverlap
 * @param {String} tilesUrl
 */
$.GigapanTileSource = function( width, height, tileSize, tileOverlap, tilesUrl ) {
    var options;

    if( $.isPlainObject( width ) ){
        options = width;
    }else{
        options = {
            width: arguments[0],
            height: arguments[1],
            tileSize: arguments[2],
            tileOverlap: arguments[3],
            tilesUrl: arguments[4]
        };
    }

	// assume tile size of 256 for gigapan, but honor user-supplied value
    if (!options.tileSize || options.tileSize == '' || parseInt(options.tileSize) <= 0) {
    	options.tileSize = 256;
    }

    $.TileSource.apply( this, [ options ] );

};

$.extend( $.GigapanTileSource.prototype, $.TileSource.prototype, /** @lends OpenSeadragon.GigapanTileSource.prototype */{


    /**
     * Determine if the data and/or url imply the image service is supported by
     * this tile source.
     * @function
     * @param {Object|Array} data
     * @param {String} optional - url
     */
    supports: function( data, url ){
        return ( data.type && "gigapan" == data.type );
    },

    /**
     *
     * @function
     * @param {Object} data - the raw configuration
     * @param {String} url - the url the data was retreived from if any.
     * @return {Object} options - A dictionary of keyword arguments sufficient
     *      to configure this tile sources constructor.
     */
    configure: function( data, url ){
        return data;
    },


    /**
     * @function
     * @param {Number} level
     * @param {Number} x
     * @param {Number} y
     */
    getTileUrl: function( level, x, y ) {
    	// not sure why level-8, but it works that way.
		var quadKey = this._toQuad(x, y, Math.max(0,level-8));
		// For Gigapan, level 0 has 0 digits in filename, level 1 has 1 digit, etc.
		// _toQuad function's result has a leading zero, so must trim
		var baseFileName = quadKey.substring(1,quadKey.length);
		return this.tilesUrl + this._getEnclosingFolders(baseFileName) + 'r' + baseFileName + '.jpg';
    },


	// folders are named based on filename
	// rABCDEFG.jpg will be found at rAB/CDE/rABCDEFG.jpg
	_getEnclosingFolders: function (baseFileName) {
		var enclosingFolders = '';
		for (var i = 0; i < Math.floor(baseFileName.length / 3); i++) {
			if (i === 0) {
				// first has 2 digits and starts with an 'r'
				enclosingFolders = 'r' + baseFileName.substring(0,2) + '/';
			} else {
				// others have 3 digits
				enclosingFolders += baseFileName.substring(i*3-1,i*3+2) + '/';
			}
		}
		return enclosingFolders;
	},
				
			
	
	//From https://code.google.com/p/toolsdotnet/wiki/iosOfflineMaps
	_toQuad: function (x, y, z) {
		var quadkey = '';
		for ( var i = z; i >= 0; --i) {
			var bitmask = 1 << i;
			var digit = 0;
			if ((x & bitmask) !== 0) {
				digit |= 1;}
			if ((y & bitmask) !== 0) {
				digit |= 2;}
			quadkey += digit;
		}
		return quadkey;
	}
});


}( OpenSeadragon ));
