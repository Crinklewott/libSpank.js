/*
 * Spanking simulation library.
 * By thingywhat <thingywhat@live.com>
 */

// Default output, console.log exists both in a browser and in Node.js
var output = console.log;

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
   *   spec.tolerance  - A numerical tolerance value, tolerance makes
   *                     spankees able to take more spanking with
   *                     less intense reactions. (Default: 1000)
   *   spec.protection - A numerical value of how much protection the
   *                     spankee has on their butt.
   *   spec.reactions  - An array of arrays, the outer array holds,
   *                     in intensity order, the arrays of reactions
   *                     that a spankee will give when spanked.
   *   spec.pain       - The starting-out soreness level.
   *   spec.callback   - A function that will be called with the
   *                     current reaction.
   */
  function Spankee(spec){
    this.spec = spec || {};
    this.toler = this.spec.tolerance || toler;
    this.callback = this.spec.callback || false;
    this.reactions = this.spec.reactions || [["Ouch!"]];
    this.protection = this.spec.protection || protection;
    this.pain = this.spec.pain || pain;

    this.lastSwat = 1;
    this.timer = setInterval(function(){
      var relief = Math.floor(
	((this.pain * 0.992) + -((this.pain < 1 ? 1 : this.pain) /
				 this.toler)));
      this.pain = relief < 0 ? 0 : relief;
    }.bind(this), 250);

    /**
     * Internal function to get the reaction of the spankee from the
     * reactions array.
     * @returns the reaction from the nested reaction array based on the
     * RNG as well as the current pain level.
     */
    this.getReaction = function(){
      var level = Math.floor(this.pain/this.toler) + (
	Math.random() < 0.1 ? (Math.random() < 0.3 ? -1 : 1) : 0
      );

      return this.reactions[
	level < this.reactions.length ?
	  Math.abs(level) :
	  this.reactions.length - 1
      ][
	Math.floor(Math.random() * this.reactions[
	  level < this.reactions.length ?
	    Math.abs(level) : this.reactions.length - 1
	].length)
      ];
    };
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
   * @param impl <Implement> optional: You pass in an instance of
   * implement you wish to spank the spankee with. If no implement is
   * defined, hand is used.
   */
  Spankee.prototype.spank = function(impl){
    if(impl == undefined)
      impl = hand;
    if(!impl instanceof Implement)
      throw new "You can't spank with that!";

    this.pain += Math.floor((Math.pow(impl.sting, impl.weight) +
			   (this.pain / 10 + 1 / this.lastSwat))
			  - (100 - (this.protection * 10)) +
			    10 * impl.sting);

    this.lastSwat = 1;

    if(impl.callback)
      impl.callback();

    if(this.callback)
      return this.callback(this.getReaction());
    return this.getReaction();
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
    if(amount) return this.protection =- amount;
    return --this.protection;
  };

  /**
   * Stops any sense of time in this world.
   */
  Spankee.prototype.stopTimer = function(){
    return clearInterval(this.timer);
  };

  return Spankee;
})();

