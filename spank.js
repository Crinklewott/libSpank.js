/*
 * Spanking simulation library.
 * By thingywhat <thingywhat@live.com>
 */

var output = console.log;

var Spankee = (function(){
    var reactions,
	pain = 0,
	lastSwat = 1,
	protection = 10,
	toler,
	callback,
	timer;

    /*
     * The Spankee constructor
     * Creates a spankee object. Either default, or a specific type of
     * spankee.
     * @param spec Object: Accepts an object with the desired
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
	toler = spec.tolerance || 1000;
	callback = spec.callback || false;
	reactions = spec.reactions || 
	    [["Eck!", "Ow", "Ugh!", "*grunt*", "Ack!"],
	     ["Oww!", "Ouch!", "Yeowch!", "U-ugh!", "Yip"],
	     ["Ahaow!", "OW!", "Damn!", "G-yeh!"],
	     ["Yeaaaaow!", "Aahhh!", "*sniff*", "AHHH!", "Owwwwwww!"],
	     ["Nooooo!", "Waaah!", "*sniffle*", "*whimper*"],
	     ["Noohohoho!!!", "Whahahaaaa!!!", "STOOOOOOOP!!", "P-PLEASE!!"],
	     ["AAAAAAAAAAAAAAAA!!!!", "NOOOOOOOOO!!!",
	      "I-it hurts sooo BAAAAD!!!", "STOOOOOP!!!"],
	     ["WAAAAAHHHH!!!", "WAAAAAHAHAHA!!!", "AAAAAAAAAAAAAAAAAA!!!!"],
	     ["WAH--AAHHH!!!", "WAAAAAAA--AAAAAAA--hAAAAAA!!"]];

	timer = setInterval(function(){
	    lastSwat++;
	    if(Math.random() < (lastSwat / toler) + ((pain / toler) / toler))
		pain--;
	}, 100);
    }

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

    Spankee.prototype.spank = function(implement){
	// Faster means more pain
	pain += (100 / protection) * implement.force * (10 / lastSwat);
	lastSwat = 1;

	if(implement.callback)
	    implement.callback();
	if(callback)
	    return callback(getReaction());
	return getReaction();
    };

    Spankee.prototype.removeProtection = function(){
	return protection--;
    };

    Spankee.prototype.stopTimer = function(){
	return clearInterval(timer);
    };

    return Spankee;
})();

var Implement = function(name, force, weight, callback){
    this.name = name;
    this.force = force;
    this.weight = weight;
    this.callback = callback;
};

var hairbrush = new Implement("Hairbrush", 2, 1, function(){
    output("THWACK!");
});
var spankee = new Spankee();
