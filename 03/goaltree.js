
var put_on = "put_on" , find_space = "find_space" , get_rid_of = "get_rid_of" , grasp = "grasp" , clear_top = "clear_top" , move = "move" , ungrasp = "ungrasp"

var state = { 
	actions : [ 
		{ 
			command : put-on , 
			args : [ "B1" , "B2" ] 
		} 
	] , 
	table : [ [ 'BX' , 'B1' ] , [] , [ 'BY' , 'B2' ] ]
}

/* when there are no more actions to be completed then it is complete */

var possibilities = [ state ]

var goal_tree = {
	put_on : {
		calls : [ find_space , grasp , move , ungrasp ]
	},
	find_space : {
		calls : [ get_rid_of , find_space ]
	},
	get_rid_of : {
		calls : [ put_on ]
	},
	grasp : {
		calls : [ clear_top ]
	},
	clear_top : {
		calls : [ get_rid_of , clear_top ]
	},
	move : {
	},
	ungrasp : {
	}
}


var location = function( object , table ) {
	for( var position in table ) {
		for( height in table[position] ) {
			if ( object == table[position][height] ) {
				return {
					position : position,
					height : height,
					is_on_top : height == 0
				}
			}
		}
	}
	throw "ERROR"
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




