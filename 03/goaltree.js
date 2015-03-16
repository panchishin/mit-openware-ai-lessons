
/*
        PUT-ON  <------------------------------
          |                                    |
          |--> FIND-SPACE -----------O----v    |
          |--> GRASP --> CLEAR-TOP --O--> GET-RID-OF
          |--> MOVE
           --> UNGRASP

Example
        BX    BY
        B1 __ B2
*/

var table = [ [ 'B1' , 'BX' ] , [] , [ 'B2' , 'BY' ] ];

var PUT_ON = "PUT_ON", 
	FIND_SPACE = "FIND_SPACE",
	GRASP = "GRASP" ,
	CLEAR_TOP = "CLEAR_TOP",
	GET_RID_OF = "GET_RID_OF",
	MOVE = "MOVE",
	UNGRASP = "UNGRASP";

var rules = {
	TABLE : table ,
	FIND_LOCATION : function( object ) {
		for( var position in this.table ) {
			for( height in this.table[position] ) {
				if ( object == this.table[position][height] ) {
					return {
						POSITION : position,
						HEIGHT : height,
						IS_ON_TOP : height + 1 == this.table[position].length
					};
				}
			}
		}
		throw "ERROR";
	},
	PUT_ON : function( object , target ) {
		return [
		[ FIND_SPACE , target ],
		[ GRASP , object ],
		[ MOVE , object ],
		[ UNGRASP , object ]
		];
	},
	FIND_SPACE : function( target ) {
		var location = this.FIND_LOCATION(target);
		if ( location.IS_ON_TOP ) {
			return [];
		} else {
			return [
			[ GET_RID_OF , this.table[location.POSITION][ this.table[location.POSITION].length ] ] ,
			[ FIND_SPACE , target ]
			];
		}
	}
};

var test = function() {

	var assert = require("assert");

	assert.equal( 2 , 3 );

	console.log("Success");

}

test();




