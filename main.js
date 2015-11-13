/*
 * borrowing heavily from https://github.com/Snipey/Screeps/tree/master/dist
 */

var CreepSpawner = require('creep_spawner');
var CreepRole = require('creep_role')();
var SourceMemory = require("SourceMemory");
var RoomMemory = require("RoomMemory");

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
    	Memory.spawnQueue.push("tractor");
    	//Memory.spawnQueue.push("truck");
    }
	for(var name in Game.creeps) 
    {
		var creep = Game.creeps[name];
		if(creep.spawning || creep.memory.role === undefined || creep.memory.role === null)
			{continue;}
		creep.performRole(CreepRole);
		//console.log("routing creep");
	    //console.log(creep.name+": route result: " + routeCreep(creep,creep.memory.target));
		if(creep.memory.role === 'tractor')
		{
			selfRouteCreep(creep, creep.memory.target);
		}
		else
		{
			routeCreep(creep, creep.memory.target);
		}
	}

	for(var i in Game.rooms)
	{
		var room = Room.name;// Game.rooms[i];
		console.log("Examining room: "+room);
		
	}

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
		else
		{
			console.log("	- Spawn has "+i.remainingTime+" turns until complete")
		}
	}
}

function initRoom(room)
{
	if(typeof Memory.sources[room.name] === 'undefined')
	{
		Memory.sources[room.name] = {};
	}
	console.log("Finding Sources for room "+room.name+"!")
	var sources = room.find(FIND_SOURCES);
	for(var i in sources)
	{
		console.log("Source "+i+": "+JSON.stringify(sources[i],null, 4));
		sources[i].memory.squadLeader = 'undefined';
		console.log("Room sources: "+JSON.stringify(sources[i].room.lookAtArea(sources[i].pos.y-3,sources[i].pos.x-3,sources[i].pos.y+3,sources[i].pos.x+3),null,4));
		if(Room.lookForAtArea(FIND_STRUCTURES, sources[i].room.lookAtArea(sources[i].pos.y-3,sources[i].pos.x-3,sources[i].pos.y+3,sources[i].pos.x+3)))
		{sources[i].memory.lair = true;}else{sources[i].memory.lair=false;}
	}
}

function initialize()
{
	Memory.init = true;
	console.log("initializing source list");
	//try
	//{
	console.log("Game.rooms: "+Game.rooms);
	
	/*
	 * Check for Game.rooms.sim, if true, send that to a function, otherwise, for through all rooms and send each one to a function to initialize.
	 */

	
    if(/*typeof Game.rooms[0] != 'undefined' ||*/ typeof Game.rooms != 'undefined')
    {
    	//console.log("Stringified Game: " +JSON.stringify(Game, null, 4));
    	if(typeof Memory.sources === 'undefined')
        {
    		console.log("Memory.sources was undefined");
        	Memory.sources = {};
        }
    	else
    	{
    		console.log("Memory.sources: "+JSON.stringify(Memory.sources, null, 4));
    	}
    	//if(Room.mode === "simulation")
    	//{
    	//	console.log("Room.mode = simulation");
    	//	initRoom(Room.sim);
    	//}
    	//else
    	//{
    	//	console.log("Room.mode != simulation, it actually equals "+Room.mode);
    		for(var i in Game.rooms)
    			console.log("Game.rooms: "+JSON.stringify(Game.rooms,null,4));
    			initRoom(Game.rooms[i]);
    	//}
    }
    else
    {
    	console.log("Game.rooms === undefined, failing initialization");
    	Memory.init = false;
    }
	/*}
	catch(e)
	{
		console.log("Failure during room initialization routine");
		console.log(e);
		Memory.init = false;
	}*/
	console.log("initializing rooms array");
	if(typeof Memory.rooms[0] === 'undefined')
	{
		Memory.rooms[Room.name] = {};
		Memory.rooms[Room.name].typename="home"
	}
	
    //check for creepCount
	console.log("initializing creepCount");
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
    

    /*console.log("initializing source list");
    if(typeof Memory.sourceList === 'undefined')
    {
    	Memory.sourceList = {};
    	Memory.sourceList[Room.name] = {};
    	var sources = Game.spawns[0].room.find(FIND_SOURCES);
    	while(i=sources.shift())
    	{
    		i.memory.squadLeader = "undefined";
    		if(Room.lookForAtArea(keeperLair, i.pos.y-3,i.pos.x+3,i.pos.y+3,i.pos.x-3 ))
    		{i.memory.lair = true;}else{i.memory.lair=false;}
    	}
    }
    
    console.log("initializing roomList");
    if(typeof Memory.roomList === 'undefined')
    {
    	Memory.roomList = {};
    	Memory.roomList[Room.name]={};
    }*/
    
    console.log("initialize done, returning "+Memory.init);
    return;
}

function selfRouteCreep(creep,destId)
{
	if(creep.fatigue>0)
    {return -1;}
    if(typeof destId === "undefined")
    {return -1;}
	else
	{	var dest = Game.getObjectById(destId);}
	
	if(typeof creep.memory.pathCache === "undefined" || creep.memory.pathCache === "undefined")
	{
		creep.memory.pathCache = creep.pos.findPathTo(dest,{ignoreCreeps:false,maxOps:500,heuristicWeight:2,serialize:true});
		console.log("creep.memory.pathCache: "+creep.memory.pathCache);
	}
	creep.moveByPath(creep.memory.pathCache);
	if(creep.memory.lastPos === creep.pos)
	{
		console.log("Stuck, didn't move when we should have?");
		if(creep.pos.getRangeTo(dest) > 1)
		{
			console.log("Yea, not to destination yet");
			var nextDir = Room.deserializePath(creep.memory.pathCache)[0].direction;
			console.log("we were going to go in direction: "+nextDir);
			if(nextDir != TOP)
			{
				nextDir++;
			}
			else
			{
				nextDir = TOP;
			}
			console.log("But now we're going in direction: "+nextDir);
			creep.move(nextDir);
		}
	}
	creep.memory.lastPos = creep.pos;
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

        path = creep.room.findPath(creep.pos,dest.pos,{ignoreCreeps:true,maxOps:500,heuristicWeight:2})
        
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

