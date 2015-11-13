/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tractor'); // -> 'a thing'
 */
 
 /* Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], null, {role: 'harvester',task: 'harvest'}); */
 module.exports = function (creep) 
 {
	 var tractor = {
			 parts: [[WORK,WORK,CARRY,MOVE],
			         [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
			         [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
			         [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
			 costs: [300,
			         600,
			         800,
			         1100],
			 memories:{role:'tractor', task:'harvest', trucksRequested:0, haulSquad:[]}
	 };
	 
	 tractor.getPartsForExtensionCount = function(count)
	 {
		 console.log("Parts By Extension: "+this.parts[count]);
		 return this.parts[count];
	 },
	 
	 tractor.getParts = function()
	 {
		 return this.getPartsForExtensionCount(0);
	 },
	 tractor.getMemories = function()
	 {
		 return this.memories;
	 },
	 tractor.getCostForExtensionCount = function(count)
	 {
		 return this.costs[count];
	 },
	 
	 tractor.getCost = function()
	 {
		 return this.getCostForExtensionCount(0);
	 },
	 
	 tractor.getNearestTruckId = function(creep, list)
	 {
		 var nearest = Game.getObjectById(list[0]);
		 for(var i = 0, len = list.length; i < len; i++)
		 {
			 if(creep.pos.getRangeTo(nearest) > creep.pos.getRangeTo(Game.getObjectById(list[i])))
			 {
				 nearest = Game.getObjectById(list[i]);
			 }
		 }
		 return nearest.id;
	 },
	 
	 tractor.performRole = function(CreepRole, creep)
	 {
		if(creep.memory.haulSquad.length === 0)
		{
			Memory.spawnQueue.push("truck");
		}
		
		switch(creep.memory.task)
		{
		    case 'harvest':
		        if(typeof creep.memory.target === "undefined" || creep.memory.target === "undefined" )
		        {
	                var sources = creep.room.find(FIND_SOURCES, {
	                	filter: {squadLeader:'undefined',lair:false}
	                });
	                if(sources.length > 0)
	                {
	                	var target = creep.pos.findClosestByRange(sources)
	                	creep.target = target.id;		                
	                	target.squadLeader = creep.id;
		                creep.memory.action = "move";
	                }
	                else
	                {
	                	console.log(creep.name +" thinks all sources are accounted for!");
	                	console.log(creep.name +" switching to upgrade gcl!");
	                	var sources = creep.room.find(FIND_MY_STRUCTURES, {
	                		filter: {structureType:STRUCTURE_CONTROLLER}
	                	});
	                	if(sources.length>0)
	                	{
	                		console.log(creep.name + " going to update controller id "+sources[0].id);
	                		creep.memory.task = "upgrade";
	                		creep.memory.action = "collect";
	                		creep.memory.target = sources[0].id;
	                	}
	                }
	            }
		        if(creep.memory.action === 'move')
		        {
		        	if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.target)) === 1)
	                {
	                    if(creep.carry.energy < creep.carryCapacity)
	                    {
	                        creep.memory.action = "collect";
	                        creep.memory.pathCache = 'undefined';
	                    }
	                    else
	                    {
	                        creep.memory.action = "unload";
	                        creep.memory.pathCache = 'undefined';
	                    }
	                }
		        }
		        if(creep.memory.action === 'collect')
		        {
		        	if(creep.carry.energy < creep.carryCapacity)
	                {
                        var hr = creep.harvest(Game.getObjectById(creep.memory.target))
	                    if(hr !== 0)
                        {
                            console.log("Error trying to harvest: "+ hr);
                            creep.say("ERROR:"+hr);
                        }
	                }
	                
                	if(creep.memory.haulSquad.length === 0)
                	{
                		if(creep.carry.energy >= creep.carryCapacity)
                		{
                            creep.memory.action = "move";
                            creep.memory.target = creep.pos.findClosestByRange(creep.room.find(FIND_MY_SPAWNS)).id;
                		}
                	}
                	else
                	{
                		var nearCreeps = creep.room.lookForAtArea('creep',creep.pos.y+1,creep.pos.x+1,creep.pos.y-1,creep.pos.x-1)
                		if(nearCreeps)
                		{
                			var nearest = creep.pos.findClosestByRange(nearCreeps, {
                				filter: {role:"truck",squadLeader:creep.id}
                				});
                			//if(nearest.pos.getRangeTo(creep) === 1){
    		                    var deficit = nearest.energyCapacity - nearest.energy;
                				creep.transferEnergy(nearest, (deficit > creep.carry.energy) ? creep.carry.energy: deficit);
                			//}
                		}
                	}
		        }
		        if(creep.memory.action === 'unload')
		        {
		        	if(creep.memory.haulSquad.length === 0)
                    {
                        if(creep.carry.energy > 0)
                        {
                            var target = Game.getObjectById(creep.memory.target);
                            var deficit = target.energyCapacity - target.energy;
                            //console.log(
                            creep.transferEnergy(target, (deficit > creep.carry.energy) ? creep.carry.energy: deficit);
                            //);
                        }
                        else
                        {
                            creep.memory.action = "move";
                            creep.memory.target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE).id;
                        }
                    }
                    else
                    {

                        var Utarget = Game.getObjectbyId(this.getNearestTruckId(creep, creep.haulSquad)); //Unload Target
                        
                        if(creep.pos.getRangeTo(Utarget === 1))
                        {
                        	var deficit = Utarget.energyCapacity - Utarget.carry.energy;
                            creep.transferEnergy(Utarget, (deficit > creep.carry.energy) ? creep.carry.energy: deficit);
                        }
                        if(creep.carry.energy < creep.energyCapacity)
                        	creep.memory.action = "collect";
                    }
		        }
	            break;
		    case 'upgrade':
		    	if(typeof memory.target === "undefined" || creep.memory.target === "undefined")
		    	{
		    		var targets = creep.room.find(FIND_MY_STRUCTURES, {
                		filter: {structureType:STRUCTURE_CONTROLLER}
                	});
		    		if(targets.length > 0)
	                {
	                	var target = creep.pos.findClosestByRange(targets)
	                	creep.target = target.id;		                
	                	//target.squadLeader = creep.target;
		                creep.memory.action = "move";
	                }
		    	}
		    	if(creep.memory.action === 'move')
		        {
		        	if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.target)) === 1)
	                {
	                    if(creep.carry.energy < creep.carryCapacity)
	                    {
	                        creep.memory.action = "collect";
	                        creep.memory.pathCache = 'undefined';
	                    }
	                    else
	                    {
	                        creep.memory.action = "work";
	                        creep.memory.pathCache = 'undefined';
	                    }
	                }
		        }
		    	if(creep.memory.action === 'work')
		    	{
		    		if(creep.carry.energy > 0)
		    		{
		    			creep.upgradeController(creep.target);
		    		}
		    		else
		    		{
		    			creep.say("out of energy!");
		    			if(creep.memory.haulSquad.length === 0)
		    			{
		    				creep.target = CreepRole.getNearestNonEmptyEnergyStoreId(creep);

		    				creep.memory.action = "move";
		    			}
		    			else
		    			{
		    				var nearestTruck = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
		    					filter: {squadLeader: creep.id}
		    				});
		    				if(creep.pos.inRangeTo(nearestTruck, 1))
		    				{
		    					var deficit = creep.carryCapacity - creep.carry.energy;
		    					nearestTruck.transferEnergy(creep, deficit > nearestTruck.carry.energy?nearestTruck.carry.energy:deficit);
		    				}
		    			}
		    		}
		    	}
		    	if(creep.memory.action === 'collect')
		    	{
		    		if(creep.carry.energy < creep.carryCapacity)
		    		{
		    			var deficit = creep.carryCapacity - creep.carry.energy;
		    			var structure = getObjectById(creep.memory.target);
		    			if(structure.store > deficit)
		    			{
		    				structure.transferEnergy(creep, deficit);
		    				creep.memory.target = creep.room.find(FIND_MY_STRUCTURES, {
		                		filter: {structureType:STRUCTURE_CONTROLLER}
		                	});
		    			}
		    			else
		    			{
		    				structure.transferEnergy(creep);
		    				creep.memory.target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
		    					filter: function(o){
		    						return o.energy > 0;
		    					}
		    				});
		    			}

	    				creep.memory.action = "move";
		    			structure.transferEnergy(creep, structure.store > deficit?deficit:structure.store );
		    		}
		    	}
		    	break;
	        default:
	            console.log(creep.name+" error: no known task assigned");
	            break;
		}
	 }
	 return tractor;
}