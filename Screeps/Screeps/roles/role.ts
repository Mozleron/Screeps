﻿///<reference path="..\screeps.d.ts" />
interface IRole extends Creep {
    parts: [[BodyParts]];
    costs: [number];
    _role: string;
    _task: string;
    _action: string;
    memories: { role: string, task: string};

    getMemory(name: string);
    getRoleParts(name: string, eCap: number): BodyParts[];
    getRoleCost(name: string, eCap: number): number;

    performRole(): void;
}
interface Creep {
    task: string;
}

class Role implements IRole {
    body: BodyPartDefinition[];
    carry: { energy: number };
    carryCapacity: number;
    fatigue: number;
    hits: number;
    hitsMax: number;
    id: string;
    memory: CreepMemory;
    my: boolean;
    name: string;
    owner: Owner;
    pos: RoomPosition;
    room: Room;
    spawning: boolean;
    ticksToLive: number;

    parts: [[BodyParts]];
    costs: [number];
    _role: string;
    get role(): string { return this._role; }
    set role(theRole: string) {
        this._role = theRole;
        Creep.memory.role = this._role;
    }

    _task: string;
    get task() { return this._task; }
    set task(theTask: string) {
        this._task = theTask;
    }

    _action: string;
    get action() { return this._action; }
    set action(theAction: string) { this._action = theAction; }

    memories: { role:string,task:string };
    constructor() {

    }

    /* Creep methods */
    attack(target: Creep | Spawn | Structure) { return Creep.attack(target); }
    build(target: ConstructionSite) { return Creep.build(target); }
    cancelOrder(methodName: string) { return Creep.cancelOrder(methodName); }
    claimController(target: Structure) { return Creep.claimController(target); }
    dropEnergy(amount?: number) { return Creep.dropEnergy(amount); }
    getActiveBodyparts(type: string) { return Creep.getActiveBodyparts(type); }
    harvest(target: Source) { return Creep.harvest(target); }
    heal(target: Creep) { return Creep.heal(target); }
    move(direction: Direction) { return Creep.move(direction); }
    moveByPath(path: PathStep[]) { return Creep.moveByPath(path); }
    moveTo(target: RoomPosition | { pos: RoomPosition }, opts?: MoveToOpts): number;
    moveTo(x: number, y: number, opts?: MoveToOpts): number;// { return Creep.moveTo(x, y, opts); }
    moveTo(target: any,yOrOpts?: any, opts?: any) {
        if (typeof target == "number") {
            return Creep.moveTo(target, yOrOpts, opts);
        }
        else{
            return Creep.moveTo(target, yOrOpts);
        }
    }
    notifyWhenAttacked(enabled: boolean) { return Creep.notifyWhenAttacked(enabled); }
    pickup(target: Energy) { return Creep.pickup(target); }
    rangedAttack(target: Creep | Spawn | Structure) { return Creep.rangedAttack(target); }
    rangedHeal(target: Creep) { return Creep.rangedHeal(target); }
    rangedMassAttack() { return Creep.rangedMassAttack(); }
    repair(target: Spawn | Structure) { return Creep.repair(target); }
    say(message: string) { return Creep.say(message); }
    suicide() { return Creep.suicide(); }
    transferEnergy(target: Creep | Spawn | Structure, amount?: number) { return Creep.transferEnergy(target, amount); }
    unclaimController(target: Structure) { return Creep.unclaimController(target); }
    upgradeController(target: Structure) { return Creep.upgradeController(target); }
    /* IRole methods */
    getMemory(name: string) {
        throw "not implemented"
        var r = this.getRole(name);
        if (r === null || r === undefined) {
            return null;
        }
        else {
            return r.getMemories();
        }
    }

    getRoleParts(name, eCap) {
        throw "not implemented"
        //eCap = (typeof eCap === undefined) ? eCap : 0;
        //var r = this.getRole(name);
        //if (r === null || r === undefined)
        //    return null;
        //else
        //    return r.getParts(eCap);
        return new Array<BodyParts>();
    }

    performRole()
    {
        throw "not implemented"
        //this.getRole(this.memory.role).performRole(this);
    }


    getRole(name: string) {
        throw "not implemented"
        if (this[name] == null || this[name] == undefined) {
            this[name] = require("role_" + name)();
        }
        return this[name];
    }

    getRoleCost(name:string, eCap:number) {
        //var r=this.getRole(name);
        //if (r == null || r == undefined) {
        //    return null;
        //}
        //else {
        //    return r.getCost(eCap);
        //}
        throw "not implemented";
        return 0;
    }
}

class InstanceLoader<T>{
    constructor(private context: Object) {
    }
    getInstance(name: string, ...args: any[]): T {
        var instance = Object.create(this.context[name].prototype);
        instance.constructor.apply(instance, args);
        return <T>instance;
    }
}