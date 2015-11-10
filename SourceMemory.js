/* This module allows you to store memory in energy sources,
    similarly to other objects like spawns and creeps.
   It can even by accessed by the source.memory alias!
   To use this in your code, add this line to the top of main:
   var SourceMemory = require("SourceMemory");
*/

//Creating source memory...
console.log("Creating source memory...");
    
//Create memory for energy sources.
//if(typeof Memory.sources === 'undefined')
//	Memory.sources = { };
    

//Source.prototype.memory = Memory.sources[this.id];

//http://stackoverflow.com/questions/30147800/extend-source-prototype-to-have-a-memory-object
Object.defineProperty(Source.prototype, 'memory', {
    get: function() {
        if(_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }
        if(!_.isObject(Memory.sources)) {
            return undefined;
        }
        return Memory.sources[this.id] = Memory.sources[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }
        if(!_.isObject(Memory.sources)) {
            throw new Error('Could not set source memory');
        }
        Memory.sources[this.id] = value;
    }
});