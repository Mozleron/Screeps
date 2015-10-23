/**
 * Methods involving spawning creeps.
 * borrowed from https://github.com/Snipey/Screeps/tree/master/dist
 */

Spawn.prototype.createRole = function(CreepRole, role, memory) {
    var nameCount = null
    var name = null
    while(name == null) {
        nameCount++
        var tryName = role + nameCount
        if(Game.creeps[tryName] == undefined)
            name = tryName
    }

    if(memory == undefined)
        memory = {}

    memory['role'] = role

    var parts = CreepRole.getRoleParts(role)
    if(parts == null || parts == undefined) {
        console.log("No parts!")
    } else {
        console.log("Parts: "+role+":"+parts)
    }

    var out = this.createCreep(parts, name, memory)
    switch(out) {
    case 0:
    	if(!Memory.creepCount[Room.name].role)
    	{
    		Memory.creepCount[Room.name].role = 1;
    	}
    	else
    	{
    		Memory.creepCount[Room.name].role++;
    	}
    	break;
    case -1:
        console.log("Error spawning creep: You don't own this spawn.")
        break;
    case -3:
        console.log("Error spawning creep: A creep already has that name.")
        break;
    case -4:
        console.log("Error spawning creep: This spawn is busy.")
        break;
    case -6:
        console.log("Error spawning creep: This spawn doesn't have enough energy.")
        break;
    case -10:
        console.log("Error spawning creep: Body not properly described, improper arguments.")
        break;
    case -14:
        console.log("Error spawning creep: You don't own this spawn.")
        break;
    }
    return out;
}