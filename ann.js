var assert = require("assert");


var sigmoid = function( t ) {
	return 1 / ( 1 + Math.pow( Math.E , -t ) );
}
assert.equal( sigmoid(0) , 0.5 );


var layers = [
	{ nodes : [ 0.35 , 0.9 ] },
	{ nodes : [ 0 , 0 ] , connections : [[ 0.1 , 0.8 ],[ 0.4 , 0.6 ]] },
	{ nodes : [ 0 ] , connections : [[ 0.3 , 0.9 ]] }
];


var updateOneLayersWeight = function( layer , previousLayer ) {
	layer.nodes = [];
	for( var n in layer.connections ) { 
		layer.nodes[n] = 0;
		for( var p in previousLayer.nodes ) {
			layer.nodes[n] += layer.connections[n][p] * previousLayer.nodes[p];
		}
		layer.nodes[n] = sigmoid(layer.nodes[n]);
	}
}
var updateWeights = function( layers ) {
	for( var i = 1 ; i < layers.length ; i++ ) {
		updateOneLayersWeight( layers[i] , layers[i-1] );
	}
};
updateWeights(layers);

assert.equal( Math.round(100*layers[2].nodes[0]) , 69 );

/*
var updateOneLayersError = function( layer , previousLayer ) {
	layer.error = [];
	for( var n in layer.nodes ) {
		if ( previousLayer.connections ) {
			layer.error[n] = 0;
			for( var c in previousLayer.connections[n] ) {
				layer.error[n] += previousLayer.error[c] * previousLayer.connections[n][c];
			}
		} else {
			layer.error[n] = previousLayer[n] - layer.nodes[n];
		}
		layer.error[n] = layer.error[n] * layer.nodes[n] * ( 1 - layer.nodes[n] );
	}
}

var updateErrors = function( layers , errors) {
	updateOneLayersError( layers[layers.length - 1] , errors );
	for( var i = layers.length - 2 ; i >= 0 ; i-- ) {
		updateOneLayersError( layers[i+1] , layers[i] );		
	}
}
*/
var outputError = function( expected , actual ) {
	return ( expected - actual ) * ( 1 - actual ) * actual;
}

assert.equal( Math.round(10000*outputError( 0.5 , 0.69 )) , -406 );


var newConnectionWeights = function( errorLayer , nodeLayer , connectionLayer ) {
	var newConnectionWeights = [ ];
	for( var n in nodeLayer ) {
		newConnectionWeights[n] = 0;
		for( var e in errorLayer ) {
			newConnectionWeights[n] += connectionLayer[e][n] + ( errorLayer[e] * nodeLayer[n] );
		}
	}
	return newConnectionWeights;
}

assert.equal( Math.round( 100000 * newConnectionWeights( [-0.0406] , layers[1].nodes , layers[2].connections )[0] ) , 27238 );





console.log("Success");
