/**
 * A module for managing creep jobs.
 * borrowed from https://github.com/Snipey/Screeps/tree/master/dist
 */

module.exports = function() {
    var creep_role = { }

    creep_role.getRole = function(name) 
    {
        try 
        {
            if(this[name] == null || this[name] == undefined) 
            {
                this[name] = require("creep_role_"+name)();
            }
            //console.log("Role method:"+this[name])
            return this[name];
        } 
        catch (e) 
        {
            console.log("Role "+name+" not found! Returning null.")
            console.log(e)
            return null
        }
    }

    creep_role.getRoleParts = function(name) {
        var r = this.getRole(name)
        if(r == null || r == undefined) {
            return null
        } else {
            try {
                return r.getParts()
            } catch(e) {
                console.log("Parts method not found.")
                console.log(e)
                console.log(Object.keys(r))
                return null;
            }
        }
    }
    
    creep_role.getMemory = function(name){
    	var r = this.getRole(name)
    	if(r === null || r === undefined){
    		return null;
    	}
    	else
    	{
    		try
    		{
    			return r.getMemories();
    		}
    		catch(e)
    		{
    			console.log("Memories method not found.");
    			console.log(e);
    			console.log(Object.keys(r));
    			return null;
    		}
    	}
    }

    creep_role.getRoleCost = function(name) {
        var r = this.getRole(name)
        if(r == null || r == undefined) {
            return null
        } else {
            try {
                return r.getCost()
            } catch(e) {
                console.log("Cost method not found.")
                console.log(e)
                console.log(Object.keys(r))
                return null;
            }
        }
    }

    creep_role.getCreepsWithRoleInRoom= function(role, room) {
        room.find(FIND_MY_CREEPS, {
           filter: function(creep) {
               return (creep.memory.role == role)
           }
        })
    }

    creep_role.getSourceMiners = function(id) {
        var Source = Game.getObjectById(id)
        return Source.room.memory.sources[id].miners;
    }

    creep_role.setSourceMiners = function(id, newminers) {
        var Source = Game.getObjectById(id)
        console.log("Setting target miners: "+id+":"+newminers)
        Source.room.memory.sources[id].miners = newminers;
    }

    creep_role.getNearestEnergyStoreId = function(creep){
    	return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: function(o){
				return o.store.energy > -1;
			}
		}).id;
    }
    
    creep_role.getNearestEmptyEnergyStoreId = function(creep){
    	return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: function(o){
				return o.store.energy === 0;
			}
		}).id;
    }
    
    creep_role.getNearestNonEmptyEnergyStoreId = function(creep){
    	return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: function(o){
				return o.store.energy > 0;
			}
		}).id;
    }
    
    creep_role.getNearestFullEnergyStoreId = function(creep){
    	return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: function(o){
				return o.store.energy === o.storeCapacity;
			}
		}).id;
    }
    
    Creep.prototype.performRole = function(CreepRole) {
    	CreepRole.getRole(this.memory.role).performRole(CreepRole, this);
    }

    return creep_role;

}