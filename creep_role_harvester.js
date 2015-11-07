/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 * 
 * morphing based off of https://github.com/Snipey/Screeps/tree/master/dist
 */
 
 /* Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], null, {role: 'harvester',task: 'harvest'}); */
 module.exports = function (creep) 
 {
	 var harvester = {
			 parts: [[WORK, CARRY, MOVE, MOVE],
			         [WORK, WORK, CARRY, MOVE, MOVE]],
			 costs: [250,
			 		 350],
			 memories:{role:'harvester', task:'harvest'}
	 };
	 
	 harvester.getPartsForExtensionCount = function(count) 
	 {
	    console.log("Parts By Extension: "+this.parts[count])
	    return this.parts[count]
	 },
	
	harvester.getParts = function() 
	{
	    return this.getPartsForExtensionCount(0)
	},
	
	harvester.getMemories = function()
	{
		return this.memories;
	},
	
	harvester.getCostForExtensionCount = function(count) 
	{
	    return this.costs[count]
	},
	
	harvester.getCost = function() 
	{
	    return this.getCostForExtensionCount(0)
	},
	 
	 harvester.performRole = function(CreepRole, creep)
	 {
		switch(creep.memory.task)
		{
		    case 'harvest':
		        if(typeof creep.memory.target === "undefined" || creep.memory.target === "undefined" )
		        {
	            	if(creep.carry.energy < creep.carryCapacity)
					{
	            	    var sources = creep.room.find(FIND_SOURCES);
	            	    creep.memory.target = sources[0].id;
	            	}
	            	else
	            	{
	            	    creep.memory.target = Game.spawns[0].id;
	            	}
	            	creep.memory.action = "move";
	            	creep.say("Moving to: "+creep.memory.target);
	        	}
	        	/*else
	        	{
	        	    console.log(creep.name+", target:"+(typeof creep.memory.target));
	        	    console.log(creep.name+", pos:"+creep.pos+", range to target: "+creep.pos.getRangeTo(creep.memory.target.pos.x,creep.memory.target.pos.y) );
	        	    console.log(creep.name+", action: "+creep.memory.action);
	        	    
	        	}*/
		        switch(creep.memory.action)
		        {
		            case 'move':
		                if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.target)) === 1)
		                {
		                    if(creep.carry.energy < creep.carryCapacity)
		                    {
		                        creep.memory.action = "collect";
		                        creep.say("collecting");
		                    }
		                    else
		                    {
		                        creep.memory.action = "unload";
		                        creep.say("unloading");
		                    }
		                }
		                break;
		            case 'collect':
		                if(creep.carry.energy < creep.carryCapacity)
		                {
		                    //console.log("harvesting from "+creep.memory.target.id);
		                    //console.log("harvest result: "+
		                    creep.harvest(Game.getObjectById(creep.memory.target));
		                    //);
		                }
		                else
		                {
		                    creep.memory.action = "move";
		                    creep.memory.target = creep.room.find(FIND_MY_SPAWNS)[0].id;
		                }
		                break;
		            case 'unload':
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
		                    creep.say("beep beep! Moving out!");
						}
		                break;
		            case 'idle':
		                //console.log("case idle");
		                //console.log("target typeof:"+ creep.memory.target.id);
		                switch(Game.getObjectById(creep.memory.target).structureType)
						{
	            	        case 'source':
	            	            creep.memory.action = "collect";
	            	            break;
	            	        case 'spawn':
	        	                creep.transferEnergy(Game.getObjectById(creep.memory.target));
	        	                creep.memory.target = creep.room.find(FIND_SOURCES)[0].id;
	        	                creep.memory.action = "move";
	            	            break;
	            	        default:
	            	            console.log("error 1:"+creep.name+" idle, but can't determine next action");
	            	            break;
	            	    }
		                break;
		            default:
		                creep.memory.action = "move";
		                break;
		        }
	            break;
	        default:
	            break;
		}
	 }
	 return harvester;
}