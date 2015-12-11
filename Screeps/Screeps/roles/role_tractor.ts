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
        //if(this.memory.
    }

}

