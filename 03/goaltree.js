var put_on = "put_on" , find_space = "find_space" , get_rid_of = "get_rid_of" , grasp = "grasp" , clear_top = "clear_top" , move = "move" , ungrasp = "ungrasp"

var goal_tree = {
	put_on : function( state , object , target ) {

		if ( object.position == target.position && 
			object.depth == target.depth - 1 ) {
			return [state]
		}

		state.actions.push( { command : ungrasp ,	args : [ object.name ] } )
		state.actions.push( { command : move ,		args : [ object.name , target.name ] } )
		state.actions.push( { command : grasp ,		args : [ object.name , target.name ] } )
		state.actions.push( { command : find_space, args : [ target.name , object.name ] } )
		
		return [state]
	},
	find_space : function( state , object , target ) {
		
		for ( var depth = object.depth - 1 ; depth >= 0 ; depth -- ) {
			state.actions.push( { command : get_rid_of , args : [ state.table[object.position][depth] , target.name ] } )
		}

		return [state]
	},
	get_rid_of : function( start_state , object , target ) {

		var result = []
		
		for( var position = 0 ; position < start_state.table.length ; position++ ) {
			if ( position != object.position && position != target.position ) {
				var state = copy( start_state )
				state.actions.push( { command : put_on , args : [ object.name , state.table[position][0] ] } )
				result.push(state)
			}
		}
		return result
	},
	grasp : function( state , object , target ) {
		
		if ( ! object.is_on_top ) {
			state.actions.push( { command : clear_top , args : [ object.name , target.name ] } )
		}
		
		return [state]
	},
	clear_top : function( state , object , target ) {

		for ( var depth = object.depth - 1 ; depth >= 0 ; depth -- ) {
			state.actions.push( { command : get_rid_of , args : [ state.table[object.position][depth] , target.name ] } )
		}

		return [state]
	},
	move : function( state , object , target ) {
		var item = state.table[object.position].shift()
		state.table[target.position].unshift(item)
		return [state]
	},
	ungrasp : function( state , object ) {
		return [state]
	}
}

var copy = function( object ) {
	return JSON.parse(JSON.stringify(object))
}

var location = function( name , table ) {
	if ( ! name ) { return {} }
	for( var position in table ) {
		for( depth in table[position] ) {
			if ( name == table[position][depth] ) {
				return {
					name : name,
					position : position,
					depth : depth,
					is_on_top : depth == 0
				}
			}
		}
	}
	throw "ERROR"
}




var state = { 
	actions : [ 
		{ 
			command : put_on , 
			args : [ "BX" , "BY" ] 
		},
		{ 
			command : put_on , 
			args : [ "B1" , "B2" ] 
		} 
	] , 
	table : [ [ 'BX' , 'B1' , "T1" ] , [ "T2" ] , [ 'BY' , 'B2' , "T3" ] , [ "T4" ] ],
	action_history : []
}

/* when there are no more actions to be completed then it is complete */


var process = function( state ) {
	state = copy(state)
	var action = state.actions.pop()
	state.action_history.push(action)
	
	return goal_tree[action.command](
		copy(state) ,
		location( action.args[0] , state.table ) ,
		location( action.args[1] , state.table )
	)
}

var possibilities = [state]

var count_moves = function( state ) {
	var count = 0;
	for( var index in state.actions ) {
		if ( state.actions[index].command == move ) { count++ }
	}
	for( var index in state.action_history ) {
		if ( state.action_history[index].command == move ) { count++ }
	}
	return count
}

while( possibilities[ 0 ].actions.length > 0 ) {

	var states = process( possibilities.shift() )
	while ( states.length > 0 ) {
		possibilities.push( copy(states.pop()) )
	}

	possibilities.sort( function( state_a , state_b ) { return count_moves(state_a) > count_moves(state_b) } )

}

console.log( "possibilities = " + possibilities.length )
for( var index in possibilities ) {
	console.log( "	actions left : " + possibilities[index].actions.length + "	moves : " + count_moves(possibilities[index]) )
}
console.log( "solution === " )
for( var index in possibilities[0].action_history ) {
	console.log( JSON.stringify( possibilities[0].action_history[index] ) )
}
