
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

var updateConnectionWeights = function( layer , previousLayer , learningRate ) {
	learningRate = learningRate ? learningRate : 1;
	var errorLayer = previousLayer.error;
	var nodeLayer = layer.nodes;
	var connectionLayer = previousLayer.connections;

	for( var n in nodeLayer ) {
		for( var e in errorLayer ) {
			connectionLayer[e][n] = connectionLayer[e][n] + ( learningRate * errorLayer[e] * nodeLayer[n] );
		}
	}
}

var createRandomConnections = function( X , Y ) {
	var connections = [];
	for( var x = 0 ; x < X ; x++ ) {
		connections[x] = [];
		for( var y = 0 ; y < Y ; y++ ) {
			connections[x][y] = Math.random() * 2 - 1
		}
	}
	
	return connections;
}

var fail = function( message ) {
	throw message;
}

var predict = function( input , layers ) {
	(layers[1].connections[0].length >= input.length) || fail("The input is larger than the connections");
	layers[0].nodes = clone(input);
	while ( layers[1].connections[0].length > layers[0].nodes ) {
		layers[0].nodes.push(-1);
	}
	updateNodeValues(layers);
}

var train = function( input , layers , expectedOutput , learningRate ) {
	predict( input , layers );
	updateOneLayersError( layers[ layers.length - 1 ] , expectedOutput );
	updateConnectionWeights( layers[ layers.length - 2 ] , layers[ layers.length - 1 ] , learningRate);

	for( var i = layers.length - 3 ; i >= 0 ; i-- ) {
		updateOneLayersError( layers[ i + 1 ] , layers[ i + 2 ] );
		updateConnectionWeights( layers[ i ] , layers[ i + 1 ] , learningRate);
	}

}

var create = function( request ) { //inputs , hiddenLayers , hiddenNodesPerLayer , outputs ) {

	var inputs = request.inputs;
	var hiddenLayers = request.hiddenLayers || 1;
	var hiddenNodesPerLayer = request.hiddenNodesPerLayer || inputs * 5;
	var outputs = request.outputs || inputs;
	var learningRate = request.learningRate || 1;

	( hiddenLayers > 0 ) || fail("Must have at least 1 hidden layer");
	
	var layers = [];
	
	var nodes = [];
	for( var i = 0 ; i <= inputs ; i++ ) {
		nodes.push( -1 );
	}
	layers.push( { nodes : nodes } );
	
	layers.push( { connections : createRandomConnections( hiddenNodesPerLayer , inputs + 1 ) } );

	for( var h = 1 ; h < hiddenLayers ; h++ ) {
		layers.push( { connections : createRandomConnections( hiddenNodesPerLayer , hiddenNodesPerLayer ) } );
	}
	layers.push( { connections : createRandomConnections( outputs , hiddenNodesPerLayer ) } );

	return { 
		layers : layers,
		learningRate : learningRate,
		predict : function( input ) {
			predict( input , this.layers );
		},
		train : function( input , output , learningRate ) {
			train( input , this.layers , output , learningRate || this.learningRate );
		},
		clone : function() {
			var item = create( { inputs : 1 } );
			item.layers = JSON.parse(JSON.stringify( this.layers ));
			item.learningRate = this.learningRate;
			return item;
		}
	}
		
}

var clone = function( data ) {
	return JSON.parse(JSON.stringify(data));
}



var test = function() {

	var assert = require("assert");

	assert.equal( sigmoid(0) , 0.5 );

	var layers = [
		{ nodes : [] },
		{ connections : [[ 0.1 , 0.8 ],[ 0.4 , 0.6 ]] },
		{ connections : [[ 0.3 , 0.9 ]] }
	];
	
	predict( [0.35 , 0.9] , layers);
	assert.equal( Math.round(100*layers[1].nodes[0]) , 68 );
	assert.equal( Math.round(10000*layers[1].nodes[1]) , 6637 );
	assert.equal( Math.round(100*layers[2].nodes[0]) , 69 );
	
	train( [0.35 , 0.9] , layers , [0.5] );
	predict( [0.35 , 0.9] , layers);
	assert.equal( Math.round( 100000 * ( 0.5 - layers[2].nodes[0] )) , -18203 );
	
	layers = [
		{ nodes : [ 0.35 , 0.9 ] },
		{ connections : [[ 0.1 , 0.8 ],[ 0.4 , 0.6 ]] },
		{ connections : [[ 0.3 , 0.9 ]] }
	];

	layers = create( { inputs : 1 } ); // 1 , 1 , 2 , 1 );
	var obj = layers = create( { inputs : 1 , hiddenLayers : 1 , hiddenNodesPerLayer : 2 , outputs : 1 } );

	for( var i = 0 ; i < 10 ; i++ ) {	
		obj.predict( [0.35] );
		var preTrain = Math.pow( 0.5 - obj.layers[2].nodes[0] , 2 );
		obj.train( [0.35] , [.5] );
		obj.predict( [0.35] );
		assert( Math.pow( 0.5 - obj.layers[2].nodes[0] , 2 ) < preTrain );
	}
	
	layers = create( { inputs : 2 , hiddenLayers : 4 , hiddenNodesPerLayer : 5 , outputs : 6 } ).clone().layers;
	assert.equal( layers.length , 4 + 2 );
	assert.equal( layers[0].nodes.length , 2 + 1 );
	assert.equal( layers[1].connections.length , 5 );
	assert.equal( layers[1].connections[0].length , 2 + 1 );


	
	layers = [
		{ nodes : [ 0.35 , 0.9 ] },
		{ connections : [[ 0.1 , 0.8 ],[ 0.4 , 0.6 ]] },
		{ connections : [[ 0.3 , 0.9 ]] }
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

	var randomConnections = createRandomConnections(2 , 3);
	assert.equal( randomConnections.length , 2 );
	assert.equal( randomConnections[0].length , 3 );
	

	console.log("Success");

}

test();




