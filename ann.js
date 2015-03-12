
var sigmoid = function( t ) {
	return 1 / ( 1 + Math.pow( Math.E , -t ) );
}

var updateOneNodeLayer = function( layer , previousLayer ) {
	layer.nodes = [];
	for( var n in layer.connections ) { 
		layer.nodes[n] = 0;
		for( var p in previousLayer.nodes ) {
			layer.nodes[n] += layer.connections[n][p] * previousLayer.nodes[p];
		}
		layer.nodes[n] = sigmoid(layer.nodes[n]);
	}
}

var updateNodeValues = function( layers ) {
	for( var i = 1 ; i < layers.length ; i++ ) {
		updateOneNodeLayer( layers[i] , layers[i-1] );
	}
};

var updateOneLayersError = function( layer , previousLayer ) {
	layer.error = [];
	for( var n in layer.nodes ) {
		if ( previousLayer.connections ) {
			layer.error[n] = 0;
			for( var c in previousLayer.error ) {
				layer.error[n] += previousLayer.error[c] * previousLayer.connections[c][n];
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

	updateNodeValues(layers);
	assert.equal( Math.round(100*layers[1].nodes[0]) , 68 );
	assert.equal( Math.round(10000*layers[1].nodes[1]) , 6637 );
	assert.equal( Math.round(100*layers[2].nodes[0]) , 69 );
	// round off value to equal example
	layers[1].nodes[0] = 0.68;
	layers[1].nodes[1] = 0.6637;
	layers[2].nodes[0] = 0.69;
	
	updateOneLayersError( layers[2] , [0.5] );
	assert.equal( Math.round(100000 * layers[2].error[0] ) , -4064 );
	// round off value to equal example
	layers[2].error[0] = -0.0406;
	
	updateConnectionWeights( layers[1] , layers[2] );
	assert.equal( Math.round( 1000000 * layers[2].connections[0][0] ) , 272392 );
	assert.equal( Math.round( 100000 * layers[2].connections[0][1] ) , 87305 );
	// round off value to equal example
	layers[2].connections[0][0] = 0.272392;
	layers[2].connections[0][1] = 0.87305;
	layers[1].nodes[1] = 0.6633;

	updateOneLayersError( layers[1] , layers[2] );
	assert.equal( Math.round(1000000 * layers[1].error[0] ) , -2406 );
	assert.equal( Math.round(1000000 * layers[1].error[1] ) , -7916 );
	layers[1].error[0] = -0.002406;
	layers[1].error[1] = -0.007916;

	updateConnectionWeights( layers[0] , layers[1] );
	assert.equal( Math.round( 100000 * layers[1].connections[0][0] ) , 9916 );
	assert.equal( Math.round( 10000 * layers[1].connections[0][1] ) , 7978 );
	assert.equal( Math.round( 10000 * layers[1].connections[1][0] ) , 3972 );
	assert.equal( Math.round( 10000 * layers[1].connections[1][1] ) , 5929 );

	updateNodeValues(layers);
	assert.equal( Math.round( 100000 * ( 0.5 - layers[2].nodes[0] )) , -18205 );

	console.log("Success");

}

test();




