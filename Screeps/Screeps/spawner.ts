///<reference path=".\screeps.d.ts" />
interface ISpawner extends Spawn {
    createRole(): number;
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
        return null;
    }
}