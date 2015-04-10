
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
	UNGRASP = "UNGRASP",
	DONE = "DONE";

var FIND_LOCATION = function( object ) {
	for( var position in table ) {
		for( height in table[position] ) {
			if ( object == table[position][height] ) {
				return {
					POSITION : position,
					HEIGHT : height,
					IS_ON_TOP : height + 1 == table[position].length
				};
			}
		}
	}
	throw "ERROR";
}


var rules = {
	PUT_ON : function( object , target ) {
		
		var object_location = FIND_LOCATION(object);
		var target_location = FIND_LOCATION(target);
		
		if ( object_location.POSITION == target_location.POSITION && 
			object_location.HEIGHT = target_location.HEIGHT + 1 ) {
			return { NODE_NAME : DONE }
		}

		return {
			NODE_NAME : PUT_ON ,
			NODE_TYPE : "and" ,
			ACTIONS : [
				{ ACTION : FIND_SPACE , PARAMETERS : [ target ] },
				{ ACTION : GRASP , 		PARAMETERS : [ object ] },
				{ ACTION : MOVE , 		PARAMETERS : [ object ] },
				{ ACTION : UNGRASP , 	PARAMETERS : [ object ] }
			]
		}
	},
	MOVE : function( object , target ) {
	
		var object_location = FIND_LOCATION(object);
		var target_location = FIND_LOCATION(target);
		
		if ( object_location.IS_ON_TOP && target_location.IS_ON_TOP ) {
			table[object_location.POSITION].pop;
			table[target_location.POSITION].push(object);
			return { NODE_NAME : DONE }
		} else {
			throw "This can't be done";
		}
	
	}
};

var test = function() {

	var assert = require("assert");

	assert.equal( 2 , 3 );

	console.log("Success");

}

test();




