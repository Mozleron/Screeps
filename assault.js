/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('assault'); // -> 'a thing'
 */
 module.exports = function(creep){
     var targets = creep.room.find(FIND_HOSTILE_CREEPS, {filter: function(i){
         if(i.owner.username !== 'Source Keeper'){
             return i;
         }
     }});
     if(targets.length){
         for(var i = 0; i < targets.length; i++)
         {
             if(targets[i].owner.username !== 'Source Keeper')
             /* danger, don't engage if over 1k hp yet! */
             {
                 if(creep.attack(targets[0]) === ERR_NOT_IN_RANGE){
                     creep.moveTo(targets[0]);
                 }
             }
         }

     }
     else
     {
         creep.moveTo(Game.spawns.Spawn1);
     }
 }