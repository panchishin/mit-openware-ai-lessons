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

var transform = function( name , action , safe ) {
	return {
		name : name,
		action : action,
		safe : ( save ? true : false )
	}
}

var action = function( data ) {
	return node();
}

var transformCall = function( transform , data ) {
	return {
		transform : transform,
		data : data
	}
}

var node = function( transformCalls , isAnd ) {
	return {
		transformCalls : ( transformCalls ? ( transformCalls.length ? transformCalls : [transformCalls] ) : [] ),
		isAnd : ( isAnd ? true : false )
	}
}






var test = function() {

	var assert = require("assert");

	assert.equal( 2 , 3 );

	console.log("Success");

}

test();
