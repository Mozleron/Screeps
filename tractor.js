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
	switch(creep.memory.task)
	{
	    case 'harvest':
	        if(typeof creep.memory.target === "undefined" || creep.memory.target === "undefined" )
	        {
                var sources = creep.room.find(FIND_SOURCES);
                creep.memory.target = sources[0].id;
                creep.memory.action = "move";
            }
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
                        var hr = creep.harvest(Game.getObjectById(creep.memory.target))
	                    if(hr !== 0)
                        {
                            console.log("Error trying to harvest: "+ hr);
                        }
	                    //);
	                }
	                else
	                {
                        if(Memory.creepCount[Room.name]["truck"] === 0)
                        {
                            
                            creep.memory.action = "move";
                            creep.memory.target = creep.pos.findClosestByRange(creep.room.find(FIND_MY_SPAWNS)).id;
                            //creep.memory.target = creep.room.find(FIND_MY_SPAWNS)[0].id;
                        }
                        else
                        {
                            creep.memory.action = "unload";
                            var c = creep.room.find(FIND_MY_CREEPS, {filter: function(e) {console.log("e.role: "+e.role)}});
                            console.log("c: "+c);
                            var cc = creep.pos.findClosestByRange(c);
                            console.log("cc: "+cc);
                            /*creep.memory.target = creep.pos.findClosestByRange(creep.room.find(FIND_MY_CREEPS, {
                                filter: {role: 'truck'}
                                })).id;*/
                        }
	                }
	                break;
	            case 'unload':
                    if(Memory.creepCount[Room.name]["truck"] === 0)
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
                        if(creep.carry.energy > 0)
                        {
                            var target = Game.getObjectById(creep.memory.target);
                            var deficit = target.energyCapacity - target.energy;
                            if(creep.pos.getRangeTo(Game.getObjectById(creep.memory.target) === 1))
                            {
                                creep.transferEnergy(target, (deficit > creep.carry.energy) ? creep.carry.energy: deficit);
                            }
                            creep.memory.action = "collect";
                        }
                    }
	                /*else
	                {
	                    creep.memory.action = "move";
	                    creep.memory.target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE).id;
					}*/
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
            console.log(creep.name+" error: no known task assigned");
            break;
	}
}