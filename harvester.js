/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
 
 /* Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], null, {role: 'harvester',task: 'harvest'}); */
 module.exports = function (creep) 
 {
    //console.log(creep.name + " in run function")
	/*if(creep.carry.energy < creep.carryCapacity) {
		var sources = creep.room.find(FIND_SOURCES);
		if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[0]);
		}			
	}
	else {
		if(creep.transferEnergy(Game.spawns.Spawn1) === ERR_NOT_IN_RANGE) {
			creep.moveTo(Game.spawns.Spawn1);
		}			
	}*/
	//console.log(creep.memory.task);
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
	                    }
	                    else
	                    {
	                        creep.memory.action = "unload";
	                    }
	                }
	                break;
	            case 'collect':
	                if(creep.carry.energy < creep.carryCapacity)
	                {
	                    //console.log("harvesting from "+creep.memory.target.id);
	                    //console.log("harvest result: "+
	                    creep.harvest(Game.getObjectById(creep.memory.target.id));
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
	                    var deficit = Game.getObjectById(creep.memory.target).energyCapacity - Game.getObjectById(creep.memory.target).energy;
	                    //console.log(
	                    creep.transferEnergy(Game.getObjectById(creep.memory.target.id), (deficit > creep.carry.energy) ? creep.carry.energy: deficit);
	                    //);
	                }
	                else
	                {
	                    creep.memory.action = "move";
	                    creep.memory.target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE).id;
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
        case 'feedRCL':
            if(typeof creep.memory.target === "undefined" && typeof creep.memory.action === "undefined")
            {
                creep.memory.target = creep.room.controller.id;
                creep.memory.action = "move";
            }
            break;
        default:
            break;
	}
}