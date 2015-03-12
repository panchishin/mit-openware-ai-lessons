


var sigmoid = function( t ) {
	return 1 / ( 1 + Math.pow( Math.E , -t ) );
}



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


var updateConnectionWeights = function( layer , previousLayer ) {
	var errorLayer = previousLayer.error;
	var nodeLayer = layer.nodes;
	var connectionLayer = previousLayer.connections;

	for( var n in nodeLayer ) {
		for( var e in errorLayer ) {
			connectionLayer[e][n] = connectionLayer[e][n] + ( errorLayer[e] * nodeLayer[n] );
		}
	}
}


var test = function() {

	var assert = require("assert");
	assert.equal( sigmoid(0) , 0.5 );

	var layers = [
		{ nodes : [ 0.35 , 0.9 ] },
		{ nodes : [ 0 , 0 ] , connections : [[ 0.1 , 0.8 ],[ 0.4 , 0.6 ]] },
		{ nodes : [ 0 ] , connections : [[ 0.3 , 0.9 ]] }
	];

	updateWeights(layers);

	assert.equal( Math.round(100*layers[2].nodes[0]) , 69 );

	updateOneLayersError( layers[2] , [0.5] );

	assert.equal( Math.round(100000 * layers[2].error[0] ) , -4068 );

	layers[2].error = [ -0.0406 ];
	updateConnectionWeights( layers[1] , layers[2] );
	assert.equal( Math.round( 100000 * layers[2].connections[0][0] ) , 27238 );
	assert.equal( Math.round( 100000 * layers[2].connections[0][1] ) , 87305 );

	console.log("Success");

}

test();




