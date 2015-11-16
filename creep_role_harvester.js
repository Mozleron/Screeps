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
	
	harvester.getParts = function(eCap) 
	{
		for(var i in this.costs)
		{
			if(eCap > this.costs[i])
				continue;
			return this.getPartsForExtensionCount(i);
		}
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
		//console.log("harvester.getCost()");
	    return this.getCost(300);
	},
	 harvester.getCost = function(eCap)
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