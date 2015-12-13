///<reference path="..\screeps.d.ts" />
class tractor extends Role{

    memories: { role: string, task: string, trucksRequested: number, haulSquad: [string] };
    constructor() {
        super();        
        this.parts =
            [[BodyParts.WORK, BodyParts.WORK, BodyParts.CARRY, BodyParts.MOVE],
            [BodyParts.WORK, BodyParts.WORK, BodyParts.WORK, BodyParts.CARRY, BodyParts.CARRY, BodyParts.CARRY, BodyParts.MOVE, BodyParts.MOVE, BodyParts.MOVE]];
        this.costs =
            [300,
            600];
        this.memories = { role: 'tractor', task: 'harvest', trucksRequested: 0, haulSquad: [""] };
    }

    performRole() {
        if (this.memory.trucksRequested === 0 || this.memory.haulSquad.length !== this.memory.trucksRequested) {
            Memory.spawnQueue.push({ role: { name: "truck", memories: "" } });
            this.memory.trucksRequested++;
        }

        switch (this.task) {
            case 'harvest':
                if (typeof this.memory.target === "undefined" || this.memory.target === "undefined") {
                    var sources: Source[] = this.room.find<Source>(FindType.FIND_SOURCES, {
                        filter: function (o) {
                            return ((Memory.sources[this.room.name][o.id].squadLeader === 'undefined') && (Memory.sources[this.room.name][o.id].lair === false));
                        }
                    });

                    if (sources.length > 0) {
                        var target: Source = this.pos.findClosestByRange<Source>(sources);
                        console.log("target: " + JSON.stringify(target, null, 4));
                        this.memory.target = target.id;
                        Memory.sources[this.room.name][target.id].squadLeader = this.id;
                        this.action = "move";
                    }
                    else {
                        console.log(this.name + " thinks all sources are accounted for!");
                        console.log(this.name + " switching to upgrade gcl!");
                        var controllers: Controller[] = this.room.find<Controller>(FindType.FIND_STRUCTURES, {
                            filter: { structureType: StructureType.STRUCTURE_CONTROLLER }

                        });
                        if (controllers.length > 0) {
                            console.log(this.name + " going to update controller id " + controllers[0].id);
                            this.task = "upgrade";
                            this.action = "collect";
                        }
                    }
                }
                break;
        }
    }
}

interface SourceMemory {
    squadLeader: string;
}

interface CreepMemory {
    trucksRequested: number;
    haulSquad: [string];
    target: string;
}