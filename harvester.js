/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
 
'use strict';

/**
 * Returns body parts required to build the ant
 *
 * Spawn: null or spawn
 */
function build(spawn) {
	return [WORK, CARRY, MOVE, MOVE];
}

/**
 * Executed after ant being spawned
 */
function spawning(creep) 
{
	switch(creep.memory.task)
	{
		case harvest:
			if (typeof creep.memory.target === "undefined" || creep.memory.target === "undefined") 
			{
				if (creep.carry.energy < creep.carryCapacity) 
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
			break;
		default:
			creep.memory.task = "harvest";
			creep.memory.action = "move";
	}        
}

/**
 * Executed each turn
 */
function turn(creep) {
    switch (creep.memory.task) {
        case 'harvest':
            //if (typeof creep.memory.target === "undefined" || creep.memory.target === "undefined") {
            //    if (creep.carry.energy < creep.carryCapacity) {
            //        var sources = creep.room.find(FIND_SOURCES);
            //        creep.memory.target = sources[0].id;
            //    }
            //    else {
            //        creep.memory.target = Game.spawns[0].id;
            //    }
            //    creep.memory.action = "move";
            //}
            /*else
        	{
        	    console.log(creep.name+", target:"+(typeof creep.memory.target));
        	    console.log(creep.name+", pos:"+creep.pos+", range to target: "+creep.pos.getRangeTo(creep.memory.target.pos.x,creep.memory.target.pos.y) );
        	    console.log(creep.name+", action: "+creep.memory.action);
        	    
        	}*/
            switch (creep.memory.action) {
                case 'move':
                    if (creep.pos.getRangeTo(Game.getObjectById(creep.memory.target)) === 1) {
                        if (creep.carry.energy < creep.carryCapacity) {
                            creep.memory.action = "collect";
                        }
                        else {
                            creep.memory.action = "unload";
                        }
                    }
                    break;
                case 'collect':
                    if (creep.carry.energy < creep.carryCapacity) {
                        creep.harvest(Game.getObjectById(creep.memory.target));
                    }
                    else {
                        creep.memory.action = "move";
                        creep.memory.target = creep.room.find(FIND_MY_SPAWNS)[0].id;
                    }
                    break;
                case 'unload':
                    if (creep.carry.energy > 0) {
                        var target = Game.getObjectById(creep.memory.target);
                        var deficit = target.energyCapacity - target.energy;
                        creep.transferEnergy(target, (deficit > creep.carry.energy) ? creep.carry.energy : deficit);
                    }
                    else {
                        creep.memory.action = "move";
                        creep.memory.target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE).id;
                    }
                    break;
                case 'idle':
                    switch (Game.getObjectById(creep.memory.target).structureType) {
                        case 'source':
                            creep.memory.action = "collect";
                            break;
                        case 'spawn':
                            creep.transferEnergy(Game.getObjectById(creep.memory.target));
                            creep.memory.target = creep.room.find(FIND_SOURCES)[0].id;
                            creep.memory.action = "move";
                            break;
                        default:
                            console.log("error 1:" + creep.name + " idle, but can't determine next action");
                            break;
                    }
                    break;
                default:
                    creep.memory.action = "move";
                    break;
            }
            break;
        case 'feedRCL':
            if (typeof creep.memory.target === "undefined" && typeof creep.memory.action === "undefined") {
                creep.memory.target = creep.room.controller.id;
                creep.memory.action = "move";
            }
            break;
        default:
            break;
    }
}

/**
 * Triggered after all creeps are processed
 *
 * Usefull with a file scoped variable to store creeps and then do something
 * with all of them at once, like picking the closest creep to a certain position
 */
function endTurn() {

}

module.exports = {
    role: 'FOO',
    build: build,
    spawning: spawning,
    turn: turn,
    endTurn: endTurn,
};

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
	
}