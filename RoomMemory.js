/* This module allows you to store memory in energy sources,
    similarly to other objects like spawns and creeps.
   It can even by accessed by the source.memory alias!
   To use this in your code, add this line to the top of main:
   var SourceMemory = require("SourceMemory");
*/

//Creating source memory...
console.log("Creating room memory...");
    
//Create memory for energy sources.
if(typeof Memory.rooms === 'undefined')
	Memory.rooms = { };
    

Room.prototype.memory = Memory.rooms[this.id];