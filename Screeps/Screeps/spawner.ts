///<reference path=".\screeps.d.ts" />
interface ISpawner extends Spawn {
    createRole(role:string, extMemory?:any): number;
}

class SpawnController implements ISpawner {
    energy: number;
    energyCapacity: number;
    hits: number;
    hitsMax: number;
    id: string;
    memory: SpawnMemory;
    my: boolean;
    name: string;
    owner: Owner;
    pos: RoomPosition;
    room: Room;
    structureType: string;
    spawning: { name: string, needTime: number, remainingTime: number };

    canCreateCreep(body: string[], name?: string) { return Spawn.canCreateCreep(body, name); }
    createCreep(body: string[], name?: string, memory?: any) { return Spawn.createCreep(body, name, memory); }
    destroy() { return Spawn.destroy(); }
    notifyWhenAttacked(enabled: boolean) { return Spawn.notifyWhenAttacked(enabled); }
    transferEnergy(target: Creep, amount?: number) { return Spawn.transferEnergy(target, amount); }

    createRole(role:string, extMemory?:any) {
        extMemory = (typeof extMemory === 'undefined') ? "" : extMemory;
        var nameCount:number = null;
        var name: string = null;
        while (name === null) {
            nameCount++;
            var tryName = role + nameCount;
            if (Game.creeps[tryName] === undefined)
                name = tryName;
        }

        var intMemory = Role.getMemory(role);
        var memory = {};
        for (var key in intMemory) memory[key] = intMemory[key];
        for (var key in extMemory) memory[key] = extMemory[key];
        memory["lastPos"] = { "x": 0, "y": 0, roomName: "undefined" };
        if (memory === null || memory === undefined) {
            console.log("No Memory!");
        }
        else {
            console.log(role + " Memory: " + JSON.stringify(memory));
        }

        var parts = Role.getRoleParts(role, this.room.energyCapacityAvailable);
        if (parts === null || parts === undefined) {
            console.log("No parts!");
        } else {
            console.log("Parts: " + role + ":" + parts);
        }

        var out = <number>this.createCreep(parts, name, memory);
        switch (out) {
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
            default:
                console.log("creating creep: " + out);
                break;
        }
        return out;
    }
}