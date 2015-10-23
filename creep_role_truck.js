/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('truck'); // -> 'a thing'
 */
 
 /* Game.spawns.Spawn1.createCreep([CARRY, CARRY, MOVE, MOVE], null, {role: 'truck',task: 'harvest'}); */
 module.exports = function (creep) 
 {
	 var truck = {
			 part: [[CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
			        [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
			        [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
			        [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]],
			 costs: [300,
			         600,
			         900,
			         1200]
	 };
	 
	 truck.getPartsForExtensionCount = function(count)
	 {
		 console.log("Parts By Extension: "+this.parts[count]);
		 return this.parts[count];
	 },
	 
	 truck.getParts = function()
	 {
		 return this.getPartsForExtensionCount(0);
	 },
	 
	 truck.getCostForExtensionCount = function(count)
	 {
		 return this.costs[count];
	 },
	 
	 truck.getCost = function()
	 {
		 return this.getCostForExtensionCount(0);
	 },
	 
	 truck.performRole = function(creep)
	 {
		 switch(creep.memory.task)
		 {
			 case 'harvest':
			 	if(typeof creep.memory.target === "undefined" || creep.memory.target === "undefined")
				 {
					 creep.memory.target = creep.pos.findClosestByRange(creep.room.find(FIND_MY_CREEPS, {
	                       memory: {role: 'tractor'}})).id;
				 }
				 creep.memory.action = "move";
				 switch(creep.memory.action)
				 {
					 case 'move':
					 	if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.target))=== 1)
						 {
							 if(creep.carry.energy < creep.carryCapacity)
							 {
								 creep.memory.action = "collect";
							 }
							 else
							 {
								 creep.memory.action = "unload";
							 }
						 }
						 break;
					 case 'collect':
						if(creep.carry.energy === creep.carryCapacity)
						{
							creep.pos.findClosestByRange(creep.room.find(FIND_MY_SPAWNS)).id;
							creep.memory.action = "move";
						}
						break;
					 case 'unload':
					 	var target = Game.getObjectById(creep.memory.target);
						var deficit = target.energyCapacity - target.energy;
						creep.transferEnergy(target, (deficit > creep.carry.energy) ? creep.carry.energy: deficit);
						break;
					default:
						creep.memory.action = "move";
						break;
				 }
			 	break;
			 
			 default:
			 	console.log(creep.name+" error: no known task assigned");
			 	break;
		 }
	 }
 }