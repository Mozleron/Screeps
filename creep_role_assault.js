/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('assault'); // -> 'a thing'
 */
 module.exports = function(creep){
	 var assault = {
			 parts: [[TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE]],
			 costs: [280]	 
	 };
	 
	 assault.getPartsForExtensionCount = function(count) 
	 {
		    console.log("Parts By Extension: "+this.parts[count])
		    return this.parts[count]
	 },
	 assault.getParts = function()
	 {
		 return this.getPartsForExtensionCount(0);
	 },
	 
	 assault.getCostForExtensionCount = function(count)
	 {
		 return this.costs[count];
	 },
	 
	 assault.getCost = function()
	 {
		 return this.getCostForExtensionCount(0);
	 },
	 
	 assault.performRole = function(creep)
	 {		 
	     var targets = creep.room.find(FIND_HOSTILE_CREEPS, {filter: function(i){
	         if(i.owner.username !== 'Source Keeper'){
	             return i;
	         }
	     }});
	     if(targets.length){
	         for(var i = 0; i < targets.length; i++)
	         {
	             if(targets[i].owner.username !== 'Source Keeper')
	             /* danger, don't engage if over 1k hp yet! */
	             {
	                 if(creep.attack(targets[0]) === ERR_NOT_IN_RANGE){
	                     creep.moveTo(targets[0]);
	                 }
	             }
	         }
	
	     }
	     else
	     {
	         creep.moveTo(Game.spawns.Spawn1);
	     }
	 }
	 return assault;
 }