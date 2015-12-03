///<reference path=".\screeps.d.ts" />
///<reference path=".\node.d.ts" />
///<reference path=".\roles\role.ts"/>
class Loop {
    constructor()
    {
        this.run();
    }

    //console.log("in Loop");
    public run()
    {

        console.log("***Starting Run***");
        if (!Memory.init) {
            this.initialize();
        }

        for (var name in Game.creeps) {
            var creep = <Creep>Game.creeps[name];
            if (creep.spawning || creep.memory.role === undefined || creep.memory.role === null) {
                {
                    continue;
                }
                (<Role>creep).performRole();

            }
        }
        for (var i in Game.spawns) {
            var spawn = Game.spawns[i];
            if (Memory.spawnQueue.length > 0) {
                console.log("Spawn Queue length = " + Memory.spawnQueue.length);
                console.log("   - Spawn has " + spawn.room.energyAvailable + "/"+Role.getRoleCost(Memory.spawnQueue[0].role.name,spawn.room.energyCapacityAvailable)+" needed energy");
                if (spawn.room.energyAvailable >= Role.getRoleCost(Memory.spawnQueue[0].role.name, spawn.room.energyCapacityAvailable)) {
                    //if(typeof spawn.createRole

                }
            }
        }
        console.log("***Ending Run***");
    }

    private initialize()
    {
        Memory.init = true;

        if (typeof Game.rooms != 'undefined') {
            if (typeof Memory.sources === 'undefined') {
                Memory.sources = {};
                for (var i in Game.rooms) {
                    this.initRoom(Game.rooms[i]);
                }

            }
        }
    }

    private initRoom(room: Room) {
        if (typeof Memory.sources[room.name] === 'undefined') {
            Memory.sources[room.name] = {};
        }

        var sourceList = room.find<Source>(FindType.FIND_SOURCES);
        for (var i in sourceList) {
            if (typeof Memory.sources[room.name][sourceList[i].id] === 'undefined') {
                Memory.sources[room.name][sourceList[i].id] = {};
            }
            Memory.sources[room.name][sourceList[i].id].squadLeader = 'undefined';
            Memory.sources[room.name][sourceList[i].id].lair = false;
        }
        var keepers = sourceList[i].room.find<Structure>(FindType.FIND_HOSTILE_STRUCTURES);
        for (var i in keepers) {
            Memory.sources[room.name][keepers[i].pos.findClosestByRange<Source>(sourceList).id].lair = true;
        }
    }
}

module.exports.loop = function () {
    var loop = new Loop();
    loop.run();
};