var harvester = require('harvester');

var assault = require('assault');
/* Game.spawns.Spawn1.createCreep([ATTACK, ATTACK, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH], null, {role: 'assault'}); */
module.exports.loop = function () 
{
    if(!Memory.init)
    {
        initialize();
    }
	for(var name in Game.creeps) {
		var creep = Game.creeps[name];

		if(creep.memory.role === 'harvester') 
		{
			harvester(creep);
		}
        if(creep.memory.role === 'assault')
        {
            assault(creep);
        }
		/*if(creep.memory.role === 'builder') {
		
			if(creep.carry.energy === 0) {
				if(Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
					creep.moveTo(Game.spawns.Spawn1);				
				}
			}
			else {
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if(targets.length) {
					if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0]);					
					}
				}
			}
		}*/
		if(!creep.spawning)
		{
		    routeCreep(creep,creep.memory.target);
		}
	}
}

function routeCreep(creep,dest) 
{
    if(creep.fatigue>0)
    {return -1;}
    if(typeof dest === "undefined")
    {return -1;}
    //else
    //{dest = Game.getObjectById(dest);}

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
    //check for creepCount
    if(typeof Memory.creepCount === 'undefined')
    {
        Memory.creepCount = {};
    }
    //create a harvester
    Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, MOVE], null, {role: 'harvester',task: 'harvest'});
    Memory.init = true;
    return;
}