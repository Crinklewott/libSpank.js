/*
 * Spanking simulation library.
 * By thingywhat <thingywhat@live.com>
 */

// Default output, console.log exists both in a browser and in Node.js
var output = console.log;

var Spankee = (function(){
  var reactions,
      pain       = 0,    // The current level of pain
      lastSwat   = 1,    // How long ago the last slap was
      protection = 10,   // How protected is the butt?
      toler      = 1000, // The pain tolerance of the spankee
      callback,          // Will be called with each swat's reaction
      timer,             // Timer object for temporal judgement
      hand = new Implement("Hand", 1, 1, function(){ // Default implement
	output("SLAP!");
      });


  /**
   * The Spankee constructor
   * Creates a spankee object. Either default, or a specific type of
   * spankee.
   * @param spec <Object>: Accepts an object with the desired
   * paramaters for the spankee. The arguments of the spec object
   * are as follows:
   *   spec.tolerance - A numerical tolerance value, tolerance makes
   *                    spankees able to take more spanking with
   *                    less intense reactions. (Default: 1000)
   *   spec.reactions - An array of arrays, the outer array holds,
   *                    in intensity order, the arrays of reactions
   *                    that a spankee will give when spanked.
   *   spec.callback  - A function that will be called with the
   *                    current reaction.
   */
  function Spankee(spec){
    spec = spec || {};
    toler = spec.tolerance || toler;
    callback = spec.callback || false;
    reactions = spec.reactions || [["Ouch!"]];

    timer = setInterval(function(){
      if(Math.random() < (lastSwat++ / toler) + ((pain / toler) / toler))
	pain--;
    }, 100);
  }

  /**
   * Internal function to get the reaction of the spankee from the
   * reactions array.
   * @returns the reaction from the nested reaction array based on the
   * RNG as well as the current pain level.
   */
  function getReaction(){
    var level = Math.floor(pain/toler) + (
      Math.random() < 0.1 ? (Math.random() < 0.3 ? -1 : 1) : 0
    );

    return reactions[
      level < reactions.length ? Math.abs(level) : reactions.length - 1
    ][
      Math.floor(Math.random() * reactions[
	level < reactions.length ?
	  Math.abs(level) : reactions.length - 1
      ].length)
    ];
  }

  /**
   * Spank the spankee, this will add a certain amount of pain to the
   * current spankee object and fire off the callbacks for both the
   * implement object passed in, as well as the spankee's callback.
   * 
   * This function, the faster it is called, will increase the amount
   * of pain given... And if there is a delay, the spankee's pain goes
   * down.
   *
   * @param implement <Implement> optional: You pass in an instance of
   * implement you wish to spank the spankee with. If no implement is
   * defined, hand is used.
   */
  Spankee.prototype.spank = function(implement){
    if(implement == undefined)
      implement = hand;
    if(!implement instanceof Implement)
      throw new "You can't spank with that!";

    pain += (100 / protection) * implement.sting * (10 / lastSwat);
    lastSwat = 1;

    if(implement.callback)
      implement.callback();

    if(callback)
      return callback(getReaction());
    return getReaction();
  };

  /**
   * Removes a particular amount of protection from the spankee's
   * butt. Negative values are allowed for things that make a spanking
   * worse. (Eg, things like spanking cream or putting water on it.)
   * @param amount <Number> optional: Removes this amount of
   * protection, or 1 protection if not defined.
   * @returns the new portection value.
   */
  Spankee.prototype.removeProtection = function(amount){
    if(amount) return protection =- amount;
    return protection--;
  };

  /**
   * Stops any sense of time in this world.
   */
  Spankee.prototype.stopTimer = function(){
    return clearInterval(timer);
  };

  return Spankee;
})();

/**
 * The Spanking Implement constructor
 * This constructor allows you to construct spanking implements for
 * use with the Spankee.prototype.spank() function.
 * @param name <String>: The name of the implement.
 * @param sting <Number>: How much does this implement sting when not
 * considering its weight. (Eg: A heavy paddle doesn't sting as much
 * as a cane)
 * @param weight <Number>: How heavy is this implement?
 * @param callback <Function> optional: The function that will be
 * called when this implement is used.
 */
var Implement = function(name, sting, weight, callback){
  this.name = name;
  this.sting = sting;
  this.weight = weight;
  this.callback = callback;
};
