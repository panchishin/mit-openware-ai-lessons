Lecture 3 - Reasoning : Goal Trees and Rule-Based Expert Systems

The Blocks Program.
Create a program which is able to deduce the correct order of moving blocks given the following constraints:
one block can be held at a time,
only the top block on a pile can be picked up,
a block can only be placed on an empty place or on top of other blocks (not below),
all blocks are the same size and have to be placed in quantum spaces (no sliding, leaning, etc).


Here is the goal tree

	PUT-ON  <------------------------------
	  |                                    |
	  |--> FIND-SPACE -----------O----v    |
	  |--> GRASP --> CLEAR-TOP --O--> GET-RID-OF
	  |--> MOVE
	   --> UNGRASP

-----> = can call
--O--> = can call itteratively


Example
	BX    BY
	B1 __ B2

__ = TABLE

PUT_ON B1 B2
FIND_SPACE	GRASP B1	MOVE	UNGRASP
		CLEAR_TOP B1
		GET_RID_OF BX
		PIT_ON BX TABLE

Etc...


Can answer WHY and HOW questions.  Answer WHY looking back.  Answer HOW by looking forward.

PUT_ON B1 B2
FIND_SPACE	GRASP B1	MOVE	UNGRASP
	 ^	CLEAR_TOP B1
	 ^	GET_RID_OF BX		HOW?
	WHY?	PIT_ON BX TABLE		 V


This is an AND / OR Goal tree.
PUT_ON B1 B2 leads to an AND of : FIND_SPACE, GRASP B1, MOVE, and UNGRASP


