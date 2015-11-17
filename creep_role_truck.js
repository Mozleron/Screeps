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
			 parts: [[CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
			         [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
			         [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
			         [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]],
			 costs: [300,
			         600,
			         900,
			         1200],
			 memories:{role:'truck', task:'harvest', squadLeader:''}
	 };
	 
	 truck.getPartsForExtensionCount = function(count)
	 {
		 console.log("Parts By Extension: "+this.parts[count]);
		 return this.parts[count];
	 },
	 truck.getParts = function(eCap)
	 {
		for(var i in this.costs)
		{
			if(eCap > this.costs[i])
				continue;
			return this.getPartsForExtensionCount(i);
		}
	 },
	 /*truck.getParts = function()
	 {
		 return this.getPartsForExtensionCount(0);
	 },*/
	 truck.getMemories = function()
	 {
		 return this.memories;
	 },
	 truck.getCostForExtensionCount = function(count)
	 {
		 return this.costs[count];
	 },
	 truck.getCost = function()
	 {
		 return this.getCost(300);
	 },
	 truck.getCost = function(eCap)
	 {
		//console.log("harvester.getCost("+eCap+")");
			//console.log("this.costs: "+JSON.stringify(this.costs));
			 for(var i in this.costs)
			 {
				 //console.log("this.costs[i]: "+this.costs[i]);
				 if(eCap >= this.costs[i])
					 continue;
				 if(i === 0)
				 {	 //console.log("returning 0");
					 return 0;}
				 else
				 {	 //console.log("returning this.costs[i-1]: "+this.costs[i-1]+"; i="+i);
					 return this.costs[i-1];}
			 }
			 //console.log("made it to the end, returning this.costs[this.costs.length-1]: "+this.costs[this.costs.length-1]);
			 return this.costs[this.costs.length-1];
			 //return this.getCostForExtensionCount(0);
	 },
	 
	 truck.performRole = function(CreepRole, creep)
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
	 return truck;
 }