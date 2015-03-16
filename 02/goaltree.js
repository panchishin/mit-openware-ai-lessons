/*

Problem Reduction
	safe transforms
	'and' nodes and 'or' nodes
	heuristic transforms
	knowledge in lookup tables
	transformations are used to reduce the problem
	
	
apply save transforms
look up table
complete? then exit
look for problem
apply heuristic transforms

*/

var fail = function( message ) {
	throw message;
}

var transforms = {
	"goal" : function( string ) {
		string.match(/^[0-9]+$/) || fail( "Not goal" )
		return {
			data : string,
			log : "Reached goal"
		}
	},
	"add" : function( string ) {
		string.match(/^[0-9]+ *\+ *[0-9]+/) || fail( "Nothing to add" )
		var vals = string.match(/[0-9]+ *\+ *[0-9]+/)[0].split(/ *\+ */)
		return {
			data : string.replace(/[0-9]+ *\+ *[0-9]+/, parseInt(vals[0]) + parseInt(vals[1])),
			log : "Add " + vals[0] + " and " + vals[1]
		}
	},
	"subtract" : function( string ) {
		string.match(/^[0-9]+ *\- *[0-9]+/) || fail( "Nothing to subtract" )
		var vals = string.match(/[0-9]+ *\- *[0-9]+/)[0].split(/ *\- */)
		return {
			data : string.replace(/[0-9]+ *\- *[0-9]+/, parseInt(vals[0]) - parseInt(vals[1])),
			log : "Subtract " + vals[0] + " and " + vals[1]
		}	
	},
	"multiply" : function( string ) {
		string.match(/^[0-9]+ *\* *[0-9]+/) || fail( "Nothing to multiply" )
		var vals = string.match(/[0-9]+ *\* *[0-9]+/)[0].split(/ *\* */)
		return {
			data : string.replace(/[0-9]+ *\* *[0-9]+/, parseInt(vals[0]) * parseInt(vals[1])),
			log : "Multiply " + vals[0] + " and " + vals[1]
		}
	}
};

var tryTransforms = function( transforms , data ) {
	for( var transform in transforms ) {
		try {
			var result = transforms[transform]( data );
			result.previous = data;
			result.transform = transform;
			return result;
		} catch (e) {
			// don't apply transform
		}
	}
	fail( { message : "No progress made" } );
}

var findGoal = function( transforms , data ) {
	var procedure = [];
	while( data ) {
	
		var result = tryTransforms( transforms , data );
		procedure.push( result );
		data = result.data;
		if ( result.transform == "goal" ) {
			return { result : data , procedure : procedure };
		}

	}
}


var test = function() {

	var assert = require("assert");

	assert.equal( "2" , transforms.add( "1 + 1" ).data );
	assert.equal( "2 + 5" , transforms.add( "1 + 1 + 5" ).data );
	try {
		transforms.add( "1 - 1 + 5" );
		assert( false );
	} catch (e) { }
	assert.equal( "1" , transforms.subtract( "2 - 1" ).data );

	try {
		transforms.subtract( "5 + 2 - 1" );
		assert( false );
	} catch (e) { }
	
	assert.equal( 6 , transforms.goal("6").data );
	
	try {
		transforms.goal("7 + 6");
		assert( false );
	} catch (e) { }

	assert.equal( "6" , findGoal("1 + 2 + 3").result );
	assert.equal( 3 , findGoal("1 + 2 + 3").procedure.length );
	assert.equal( "6" , findGoal("5 - 2 + 3").result );
	assert.equal( 3 , findGoal("5 - 2 + 3").procedure.length );
	assert.equal( "6" , findGoal("2 * 3").result );
	assert.equal( "14" , findGoal("5 - 2 + 3 * 2 - 10 * 7").result );
	assert.equal( 6 , findGoal("5 - 2 + 3 * 2 - 10 * 7").procedure.length );

	try {
		findGoal("5 - 2 + 3 + 7 / 6");
		assert( false );
	} catch ( error ) {
		assert.equal( "No progress made" , error.message );
		//assert.equal( 3 , error.procedure.length );
	}

	console.log("Success");

}

test();
