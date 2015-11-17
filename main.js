/*
 * borrowing heavily from https://github.com/Snipey/Screeps/tree/master/dist
 */

var CreepSpawner = require('creep_spawner');
var CreepRole = require('creep_role')();
//var SourceMemory = require("SourceMemory");
//var RoomMemory = require("RoomMemory");

function initRoom(room)
{
	if(typeof Memory.sources[room.name] === 'undefined')
	{
		Memory.sources[room.name] = {};
	}
	console.log("Finding Sources for room "+room.name+"!")
	var sourceList = room.find(FIND_SOURCES);
	for(var i in sourceList)
	{
		if(typeof Memory.sources[room.name][sourceList[i].id] === 'undefined')
		{
			Memory.sources[room.name][sourceList[i].id] = {};
		}
		Memory.sources[room.name][sourceList[i].id].squadLeader ='undefined';
		Memory.sources[room.name][sourceList[i].id].lair = false;
	}
	var keepers = sourceList[i].room.find(FIND_HOSTILE_STRUCTURES);
	for(var i in keepers)
	{
		Memory.sources[room.name][keepers[i].pos.findClosestByRange(sourceList).id].lair = true;
	}
}

function initialize()
{
	Memory.init = true;
	console.log("initializing source list");

    if(typeof Game.rooms != 'undefined')
    {
    	if(typeof Memory.sources === 'undefined')
        {
        	Memory.sources = {};
        	for(var i in Game.rooms)
        		Memory.sources[Game.rooms[i].name] = {};
        }
		for(var i in Game.rooms)
		{
			initRoom(Game.rooms[i]);
			Memory.rooms[Game.rooms[i]] = {};
			Memory.rooms[Game.rooms[i]].typename = "home";
		}
    }
    else
    {
    	console.log("Game.rooms === undefined, failing initialization");
    	Memory.init = false;
    }

    if(typeof Memory.spawnQueue === 'undefined')
    {
    	Memory.spawnQueue = [];
    }
    Memory.spawnQueue.push("harvester");
	Memory.spawnQueue.push("tractor");
    console.log("initialize done, returning "+Memory.init);
    return;
}

module.exports.loop = function () 
{
	console.log("****Starting new tick****");
    if(!Memory.init)
    {
        initialize();
    }
	for(var name in Game.creeps) 
    {
		var creep = Game.creeps[name];
		if(creep.spawning || creep.memory.role === undefined || creep.memory.role === null)
			{continue;}
		creep.performRole(CreepRole);

		var error = routeCreep(creep, creep.memory.target)
	}

//	for(var i in Game.rooms)
//	{
//		var room = Game.rooms[i];
//		console.log("Examining room: "+room);
//	}
	for(var i in Game.spawns)
	{
		var spawn = Game.spawns[i];
	
		if(spawn.spawning === null)
		{
			if(Memory.spawnQueue.length > 0)
			{
				console.log("spawn Queue length = "+Memory.spawnQueue.length);
				console.log("    - Spawn has "+spawn.room.energyAvailable+"/"+CreepRole.getRoleCost(Memory.spawnQueue[0],spawn.room.energyCapacityAvailable)+" needed energy");
				if(spawn.room.energyAvailable >= CreepRole.getRoleCost(Memory.spawnQueue[0],spawn.room.energyCapacityAvailable))
				{
					//console.log("spawn.room.energyAvailable >= CreepRole.getRoleCost(Memory.spawnQueue[0],spawn.room.energyCapacityAvailable)");
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
			//console.log("Game.spawns[i]: "+ JSON.stringify(Game.spawns[i],null,4));
			console.log("	- Spawn has "+Game.spawns[i].spawning.remainingTime+" turns until complete");
		}
	}
	console.log("****Ending tick****");
}

function selfRouteCreep(creep,destId)
{
	if(creep.fatigue>0)
    {return -1;}
    if(typeof destId === "undefined")
    {return -1;}
	else
	{	var dest = Game.getObjectById(destId);}
    if(creep.memory.role === "tractor")
    {
    	console.log("tractor trying to self move: "+JSON.stringify(creep));
    }
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

function lookAhead(creep,direction,lastPos)
{
	var x = 0;
	var y = 0;
	console.log("direction: "+direction);

	console.log("Pre x: "+x+",y: "+y);
	switch(direction)
	{
		case '2':
			console.log("case 2");
			x++;
		case '1':
			console.log("case 1");
			y--;
			break;
		case '4':
			console.log("case 4");
			y++;
		case '3':
			console.log("case 3");
			x++;
			break;
		case '6':
			console.log("case 6");
			x--;
		case '5':
			console.log("case 5");
			y++;
			break;
		case '8':
			console.log("case 8");
			y--;
		case '7':
			console.log("case 7");
			x--;
			break;
		default:
			console.log("case default");
			break;
	}
	console.log("Post x: "+x+",y: "+y);
	//var lookpos =creep.room.getPosition(creep.pos.x+x, creep.pos.y+y);
	var target = creep.room.lookAt(creep.pos.x+x, creep.pos.y+y);
	console.log(JSON.stringify(target));
	for(var i in target)
	{
		if(target[i].type === 'creep')
		{
			for(var j in target[i])
			{
				if((target[i][j].id > creep.id) || (creep.pos === creep.memory.lastPos))
				{
					console.log(creep.name+" found block, yielding!");
					creep.say("yielding!");
					return true;
				}
			}
		}
	}
	return false;
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
/*    if(creep.memory.role === "tractor")
    {
    	console.log("tractor trying to move: "+JSON.stringify(creep));
    }*/
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

    if(creep.pos.getRangeTo(dest)>1)
    { //you will need your own "pathisBlocked" function!   && pathisBlocked(creep.pos,dir)
        //dir = Math.floor(Math.random()*8);
    	console.log("creep."+creep.name+" looking ahead");
    	if(lookAhead(creep,dir))
    		dir++;
    }
    creep.memory.lastPos = creep.pos;
    var error = creep.move(dir);
    return error;
}

//http://stackoverflow.com/questions/30147800/extend-source-prototype-to-have-a-memory-object
Object.defineProperty(Source.prototype, 'memory', {
    get: function() {
        if(_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }
        if(!_.isObject(Memory.sources)) {
            return undefined;
        }
        return Memory.sources[this.id] = Memory.sources[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }
        if(!_.isObject(Memory.sources)) {
            throw new Error('Could not set source memory');
        }
        Memory.sources[this.id] = value;
    }
});
