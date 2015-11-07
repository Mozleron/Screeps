/* This module allows you to store memory in energy sources,
    similarly to other objects like spawns and creeps.
   It can even by accessed by the source.memory alias!
   To use this in your code, add this line to the top of main:
   var SourceMemory = require("SourceMemory");
*/

//Creating source memory...
console.log("Creating source memory...");
    
//Create memory for energy sources.
if(typeof Memory.sources === 'undefined')
	Memory.sources = { };
    

Source.prototype.memory = Memory.sources[this.id];