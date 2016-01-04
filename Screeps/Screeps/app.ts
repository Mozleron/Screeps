///<reference path=".\screeps.d.ts" />
///<reference path=".\node.d.ts" />
///<reference path=".\roles\role.ts"/>
class Loop {

    spawnController: SpawnController;
    constructor()
    {
        if(this.spawnController === null)
            this.spawnController = new SpawnController();
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
            if (spawn.spawning === null) {
                if (Memory.spawnQueue.length > 0) {
                    console.log("Spawn Queue length = " + Memory.spawnQueue.length);
                    console.log("   - Spawn has " + spawn.room.energyAvailable + "/" + Role.getRoleCost(Memory.spawnQueue[0].role.name, spawn.room.energyCapacityAvailable) + " needed energy");
                    if (spawn.room.energyAvailable >= Role.getRoleCost(Memory.spawnQueue[0].role.name, spawn.room.energyCapacityAvailable)) {
                        if (this.isNumeric(this.spawnController.createRole(Memory.spawnQueue[0].role.name, (typeof Memory.spawnQueue[0].role.memories === undefined) ? {} : Memory.spawnQueue[0].role.memories))) {
                            console.log("Creating creep: Failed");
                        }
                        else {
                            console.log("Creating creep: Success");
                            Memory.spawnQueue.shift();
                        }
                    }
                }
                else {
                    console.log("   - Spawn has " + Spawn.energy + "/" + spawn.energyCapacity + " and nothing in queue");
                }
            }
            else {
                console.log("   - Spawn has " + Game.spawns[i].spawning.remainingTime + " turns until complete");
            }
        }
        console.log("***Ending Run***");
    }

    private isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
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
        else {
            console.log("Game.rooms === undefined, failing initialization");
            Memory.init = false;
        }

        if (typeof Memory.spawnQueue === 'undefined') {
            //Memory.spawnQueue = <SpawnQueueMemory>[];
        }


    }

    private initRoom(room: Room) {
        /*if (typeof Memory.sources[room.name] === 'undefined') {
            console.log("sources list empty: initializing");
            Memory.sources[room.name] = <SourceMemory>[];
        }*/

        var sourceList = room.find<Source>(FindType.FIND_SOURCES);
        console.log("sourceList: " + JSON.stringify(sourceList, null, 4));
        for (var i in sourceList) {
            if (typeof Memory.sources[room.name] === 'undefined') {
                Memory.sources[room.name] = { sourceList[i].id:{squadLeader: "undefined", lair: false }}
            console.log("sourceList[" + i + "]: ");
            if (typeof Memory.sources[room.name][sourceList[i].id] === 'undefined') {
                console.log("Initializing sources[" + room.name + "][" + sourceList[i].id + "]");
                Memory.sources[room.name][sourceList[i].id] = {};
            }
            Memory.sources[room.name][sourceList[i].id].squadLeader = 'undefined';
            Memory.sources[room.name][sourceList[i].id].
            console.log("Memory.sources[room.name][" + sourceList[i].id + "]: " + JSON.stringify(Memory.sources[room.name][sourceList[i].id, null, 4));
        }
        var keepers = sourceList[i].room.find<Structure>(FindType.FIND_HOSTILE_STRUCTURES);
        for (var i in keepers) {
            Memory.sources[room.name][keepers[i].pos.findClosestByRange<Source>(sourceList).id].lair = true;
        }
    }
}

interface SourceMemory {
    lair: boolean,
    squadLeader: string
}

module.exports.loop = function () {
    var loop = new Loop();
    loop.run();
};