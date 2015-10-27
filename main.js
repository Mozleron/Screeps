/*
 * borrowing heavily from https://github.com/Snipey/Screeps/tree/master/dist
 */

var CreepSpawner = require('creep_spawner');
var CreepRole = require('creep_role')();
module.exports.loop = function () 
{
    if(!Memory.init)
    {
        initialize();
    }
    if(Memory.creepCount[Room.name]['truck'] === 0)
    {
        //var localSpawn = Game.getObjectById(Memory.buildingList[Room.name]['spawns'][0]);
        //console.log("localSpawn.energy: "+localSpawn.energy);
        /*if(localSpawn.energy > 200)
        {
            localSpawn.createCreep([CARRY, CARRY, MOVE, MOVE], null, {role: 'truck',task: 'harvest'});
            Memory.creepCount[Room.name]["truck"]++;
        }*/
    }
    if(Memory.creepCount[Room.name]['harvester'] === 0)
    {
    	Memory.spawnQueue.push("harvester");
    }
	for(var name in Game.creeps) 
    {
		var creep = Game.creeps[name];
		if(creep.spawning || creep.memory.role === undefined || creep.memory.role === null)
			{continue;}
		creep.performRole(CreepRole);
		console.log("routing creep");
	    routeCreep(creep,creep.memory.target);
	    creep.memory.testFullPath = creep.pos.findPathTo(Game.getObjectById(creep.memory.target).pos);
	    creep.memory.testSerialPath = Room.serializePath(creep.memory.testFullPath);
	    console.log(creep.memory.testSerialPath);
		


	    //console.log(creep.pos.findPathTo(Game.getObjectById(creep.memory.target).pos));
	    //console.log(Room.serializePath(creep.room.findPath(creep.pos, Game.getObjectById(creep.memory.target))));

	}
	/*for(var i in Game.rooms)
	{
		var room = Room.name;// Game.rooms[i];
		console.log("Examining room: "+room);
		
	}*/
	for(var i in Game.spawns)
	{
		var spawn = Game.spawns[i];
		
		if(spawn.spawning === null)
		{
			if(Memory.spawnQueue.length > 0)
			{
				console.log("    - Spawn has "+spawn.energy+"/"+CreepRole.getRoleCost(Memory.spawnQueue[0])+" needed energy");
				if(spawn.energy >= CreepRole.getRoleCost(Memory.spawnQueue[0]))
				{
					if(Number.isInteger(spawn.createRole(CreepRole, Memory.spawnQueue[0])))
					{
						console.log("Creating creep: failed");
					}
					else
					{
						console.log("Creating creep: Success");
						Memory.spawnQueue.shift();
					}
				}
			}
			else
			{
				console.log("    - Spawn has "+spawn.energy+"/"+spawn.energyCapacity+" and nothing in queue");
			}
		}
	}
}

function selfRouteCreep(creep,destId)
{
	if(creep.fatigue>0)
		return -1;
	if(typeof destId=== "undefined")
		return -1;
	else
		var dest = Game.getObjectById(destId);
	
	if(creep.memory.pathCache === "undefined" || creep.memory.pathCache === null)
	{
		creep.memory.pathCache = creep.findPathTo(dest,{ignoreCreeps:true,maxOps:500,heuristicWeight:2,serialize:true});
	}
	creep.moveByPath(creep.memory.pathCache);
}

function routeCreep(creep,destId) 
{
    if(creep.fatigue>0)
    {return -1;}
    if(typeof destId === "undefined")
    {return -1;}
    else
    {var dest = Game.getObjectById(destId);}
    var locStr = creep.room.name+"."+creep.pos.x+"."+creep.pos.y

    var path = false;

    if(typeof Memory.routeCache !== "object")
    {
         Memory.routeCache = {};
    }

    if(typeof Memory.routeCache[locStr] === "undefined")
    {
        Memory.routeCache[locStr] = {'dests':{},'established':Game.time}
    }
    if(typeof Memory.routeCache[locStr]['dests'][''+dest.id] === "undefined")
    {    
        Memory.routeCache[locStr]['dests'][dest.id] = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
        if(Memory.findPathCalled === "undefined" || Memory.findPathCalled === null)
        {
        	Memory.findPathCalled = 1;
        }
        else
        {
        	Memory.findPathCalled++;
        }
        path = creep.room.findPath(creep.pos,dest.pos,{maxOps:500,heuristicWeight:2})
        
        if(typeof path[0] !== "undefined")
        {
            Memory.routeCache[locStr]['dests'][''+dest.id][path[0].direction]+=1;
    
            for(var i =0;i<path.length-1;i++)
            {
                var step = path[i];
                var stepStr = creep.room.name+"."+step.x+"."+step.y//creep.room.name+"."+step.x+"."+step.y
                if(typeof Memory.routeCache[stepStr] === "undefined")
                {
                    Memory.routeCache[stepStr] = {'dests':{},'established':Game.time,'usefreq':0.0};
                }
                if(typeof Memory.routeCache[stepStr]['dests'][''+dest.id] === "undefined")
                {
                   Memory.routeCache[stepStr]['dests'][''+dest.id] = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
                }
                //console.log(path[i+1].direction);
                Memory.routeCache[stepStr]['dests'][''+dest.id][path[i+1].direction]+=1;
            }
        }
        else
        {
            dir = Math.floor(Math.random()*8);
            var error = creep.move(dir);
            return error;
        }
    }

    for(var k in Memory.routeCache[locStr]['dests'])
    {
        if(Game.getObjectById(k)==null)
        {//clean out invalid routes
            delete  Memory.routeCache[locStr]['dests'][k];
            //console.log("Pruned",k)
        }
    }

    var total = 0.0//pick from the weighted list of steps
    for(var d in Memory.routeCache[locStr]['dests'][''+dest.id])
    {
        total+=Memory.routeCache[locStr]['dests'][''+dest.id][d];
    }

    var total=total*Math.random();
    var dir = 0;
    for(var d in Memory.routeCache[locStr]['dests'][''+dest.id])
    {
        total-=Memory.routeCache[locStr]['dests'][''+dest.id][d];
        if(total<0)
        {
            dir = d;
            break;
        }
    }

    /*if(creep.pos.getRangeTo(dest)>1)
    { //you will need your own "pathisBlocked" function!   && pathisBlocked(creep.pos,dir)
        dir = Math.floor(Math.random()*8);
    }*/

    var error = creep.move(dir);
    return error;
}

function initialize()
{	
	for(var i in Game.rooms)
	{
		Game.rooms[i].typename="home";
	}
    //check for creepCount
    if(typeof Memory.creepCount === 'undefined')
    {
    	Memory.creepCount = {};
        Memory.creepCount[Room.name] = {};
        Memory.creepCount[Room.name]['assault'] = 0;
        Memory.creepCount[Room.name]['harvester'] = 0;
        Memory.creepCount[Room.name]['tractor'] = 0;
        Memory.creepCount[Room.name]['truck'] = 0;
    }
    if(typeof Memory.spawnQueue === 'undefined')
    {
    	Memory.spawnQueue = [];
    }
    //Memory.spawnQueue.push('harvester');
    //create a harvester
    //59 Game.spawns.Spawn1.createCreep([WORK, CARRY, CARRY, MOVE], null, {role: 'harvester',task: 'harvest'});
    //74 Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], null, {role: 'harvester',task: 'harvest'});
    //Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], null, {role: 'harvester',task: 'harvest'});
    //Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], null, {role: 'tractor',task: 'harvest'});
    //Memory.creepCount[Room.name]['tractor'] = 1;
    //Memory.creepCount[Room.name]['truck'] = 0;
    Memory.init = true;
    return;
}
