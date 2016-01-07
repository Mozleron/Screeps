///<reference path="..\screeps.d.ts" />
//interface SourceMemory {
//    squadLeader: string;
//}

interface CreepMemory {
    trucksRequested: number;
    haulSquad: [string];
    target: string;
    haulPathLength: number;
}

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
        this.memory.haulPathLength = 0;
    }

    performRole() {
        if (this.memory.trucksRequested === 0 || this.memory.haulSquad.length !== this.memory.trucksRequested) {
            Memory.spawnQueue[this.room.name].push({ name: "truck", memories: "" } );
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
                            this.memory.target = controllers[0].id;
                        }
                    }
                }
                if (this.action === 'move') {
                    if (this.pos.getRangeTo(Game.getObjectById<{ pos: RoomPosition }>(this.memory.target)) === 1) {
                        if (this.carry.energy < this.carryCapacity) {
                            this.action = "collect";
                            if (typeof this.memory.haulPathLength === 'undefined' || this.memory.haulPathLength === 0) {
                                this.memory.haulPathLength = this.pos.getRangeTo(this.pos.findClosestByRange(this.room.find<{ pos: RoomPosition }>(FindType.FIND_MY_SPAWNS)));
                                //TODO: Find the formula to determine how many truck CARRY parts are needed
                                //		Formula parts: WORK parts, CARRY parts on Tractor, total CARRY parts on trucks in Haul Squad, distance between nearest store and source.
                                //creep.memory.haulersNeeded = 
                            }
                        }
                        else {
                            this.action = "unload";
                        }
                    }
                }
                if (this.action === "collect") {
                    if (this.carry.energy < this.carryCapacity) {
                        var hr = this.harvest(<Source>Game.getObjectById<{ pos: RoomPosition }>(this.memory.target))
                        {
                            if (hr !== 0) {
                                console.log("Error trying to harvest! " + hr);
                                this.say("ERROR: " + hr);
                            }
                        }
                        console.log("this.memory.haulSquad.length: " + this.memory.haulSquad.length);
                        if (this.memory.haulSquad.length === 0) {
                            if (this.carry.energy >= this.carryCapacity) {
                                this.action = "move";
                                this.memory.target = this.pos.findClosestByRange<Spawn>(<Spawn[]>this.room.find(FindType.FIND_MY_SPAWNS)).id;
                                console.log("I have no trucks and i'm full.  Moving off to dump at: " + JSON.stringify(Game.getObjectById(this.memory.target)));
                            }
                        }
                        else {
                            var nearCreeps = this.room.lookForAtArea('creep', this.pos.y + 1, this.pos.x + 1, this.pos.y - 1, this.pos.x - 1);
                            if (nearCreeps) {
                                //var nearest: Creep = this.pos.findClosestByRange<Creep>(nearCreeps, {
                                //    filter: { role: "truck", squadLeader: this.id }
                                //});
                            }

                        }

                    }
                }
                break;
        }
    }
}