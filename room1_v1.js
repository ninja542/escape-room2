let inventoryMap = {
	tape: "ducttape.svg",
	screwdriver: "screwdriver.svg",
	paperinvis: "paperinvis.svg",
	papervis: "papervis.svg",
	lighter: "lighter.svg",
	candle: "candle.svg",
	flashlight: "flashlight.svg",
	hand: "hand.svg",
	fire: "fire.svg",
	gibberish: "papervis.svg",
};

// ----------VARIABLES--------- //
let screwdriver = false;
let drawerOpen = false;
let tape = false;
let tapeFull = true; // true = not fixed leaky pipe, false = duct tape is used up
let cupboardOpen = false;
let lighter = false; // true = found lighter, false = no lighter or lighter used up
let leakyPipeFixed = false; // true = fixed, false = not fixed
let rope = 50; // rope health (0-50)
let leverSwitch = 0; // numbers for switch positions, -1 can be broken (0,1,2,3,4)
let paper = "hidden"; // maybe paper variable can change to reveal the message through string? (hidden, invisible, visible, burnt)
let mirrorViewed = false; // (false = unviewed, true = viewed)
let candle = false; // (true = found, false = unfound or used up)
let fire = false; // (true = fire made, false = no fire made)
let buttonOrder = "nswe"; // four characters with order that the buttons are pressed in (n = north, s = south, w = west, e = east, correct is nswe)
let safe = false; // true = safe revealed, false = safe not revealed
let safeCombo = "5912"; // four numbers in string -- correct combo  FIXIT
let flashlight = false; // true = having flashlight, false = not flashlight or flashlight out of power
let flashlightOn = false; // true = flashlight turned on, false = flashlight turned off
let flashlightUse = 4; // (0-4) uses

let app = new Vue({
	el: "#game",
	data: {
		orientation: 0, // 0 = north, 1 = east, 2 = south, 3 = west
		inventory: ["hand"], // items in inventory
		isActive: "hand",
		mode: "", // examine, combine, use
		ropehealth: 20,
		spiderhealth: 2
	},
	computed: {
		orientationStyle: function(){
			if (this.orientation == 0){
				document.getElementById("game").style.backgroundImage = "url(NorthWall.png)";
				return {borderTopColor: "#FF0000"};
			}
			else if (this.orientation == 1){
				document.getElementById("game").style.backgroundImage = "url(EastWall.png)";
				return {borderRightColor: "FF0000"};
			}
			else if (this.orientation == 2){
				document.getElementById("game").style.backgroundImage = "url(SouthWall.png)";
				return {borderBottomColor: "FF0000"};
			}
			else if (this.orientation == 3){
				document.getElementById("game").style.backgroundImage = "url(WestWall.png)";
				return {borderLeftColor: "FF0000"};
			}
		},
		iconSVG: function(){
			// return this.inventory.map((x) => inventoryMap[x]);
			return {
				tape: "ducttape.svg",
				screwdriver: "screwdriver.svg",
				paperinvis: "paperinvis.svg",
				papervis: "papervis.svg",
				lighter: "lighter.svg",
				candle: "candle.svg",
				flashlight: "flashlight.svg",
				hand: "hand.svg",
				fire: "fire.svg"
			};
		},
		// talk: function(){
			// return "";
		// }
	},
	methods: {
		arrowKeyListener: function(){
			if (event.keyCode == 39){ // right arrow key
				this.increaseOrientation();
			}
			else if (event.keyCode == 37){ // left arrow key
				this.decreaseOrientation();
			}
		},
		increaseOrientation: function(){
			if (this.orientation != 3){
				this.orientation += 1;
			}
			else {
				this.orientation = 0;
			}
		},
		decreaseOrientation: function(){
			if (this.orientation != 0){
				this.orientation -= 1;
			}
			else {
				this.orientation = 3;
			}
		},
		pickup: function(item){
			this.inventory.push(item);
			if (item == "paperinvis"){
				item = "Blank Paper";
			}
			if (item == "fire"){
				item = "lit candle";
			}
			if (item == "papervis"){
				item = "instruction paper";
			}
			if (item == "gibberishpaper"){
				item = "Gibberish paper";
			}
			let pickup = capitalize(item) + " acquired.";
			this.fadeText2(pickup);
			if (item == "screwdriver"){
				this.fadeText("This will be useful...");
			}
			else if (item == "tape"){
				this.fadeText("There's only enough for one use.");
			}
			else if (item == "lighter"){
				this.fadeText("There's very little fluid left. Why is everything almost used up in this room?");
			}
			else if (item == "Blank Paper"){
				this.fadeText("At least it smells nice.");
			}
			else if (item == "wire"){
				this.fadeText("It's very thin. I should be careful with it.");
			}
			else if (item == "code 2"){
				this.fadeText("Now I can solve it.");
			}
			else if (item == "pliers"){
				this.fadeText("Maybe I can use this to pry something off.");
			}
			else if (item == "lit candle"){
				this.fadeText("This one seems obvious.");
			}
			else if (item == "instruction paper"){
				this.fadeText("It was written in invisible ink! It says: Press the buttons in ascending order, but there aren't numbers on the buttons.", 4000);
			}
			else if (item == "completed code"){
				this.fadeText("Looks like the completed code says: 'The Answer lies in Darkness.' Talk about a cliche.");
			}
		},
		examine: function(item){
			if(item == "table"){
				this.fadeText("This table has seen better days.");
			}
			else if (item == "drawer"){
				this.fadeText("It's jammed shut. There doesn't appear to be a keyhole.");
			}
			else if (item == "opened drawer"){
				this.fadeText("An open drawer... Very interesting.");
			}
			else if (item == "lighter"){
				this.fadeText("Smoking reduces your lifespan by about 10 years. Not that I need to worry about that right now...");
				setTimeout(function(){app.pickup("lighter");}, 4000);
			}
			else if (item == "tape"){
				this.fadeText("Duct tape fixes everything! Except for broken bones. And broken hearts.");
				setTimeout(function(){app.pickup("tape");}, 4000);
			}
			else if (item == "cupboard"){
				this.fadetext("It's held closed by rope. I feel like that's a bit excessive.");
			}
			else if (item == "opened cupboard"){
				this.fadeText("There's a number written on the inside. It's the number 5.");
			}
			else if (item == "switch"){
				this.fadeText("It looks like a complex puzzle. There's a poem engraved beside it.");
				setTimeout(function(){app.fadeText("One Alligator, Two Raven, Three Shark, Four Hippopotamus, Five Butterfly");}, 4000);
			}
			else if (item == "mirror"){
				this.fadeText("This mirror is so dirty that I can barely see myself.");
				setTimeout(function(){app.fadeText("There's something reflected behind me. It's the number 9.");}, 4000);
			}
			else if (item == "mirror alcove"){
				this.fadeText("Looks like the second half of the code. Thankfully, this part isn't reversed.");
				setTimeout(function(){app.pickup("code 2");}, 4000);
			}
			else if (item == "skeleton"){
				this.fadeText("Hey, why are skeletons so calm? Because nothing gets under THEIR SKIN. Hahaha.");
			}
			else if (item == "safe"){
				this.fadeText("Everyone knows that safes always have important things in them, but how'd they get this in here without me noticing? ");
				setTimeout(function(){app.fadeText("There's something engraved on it: 1 and 5 are not adjacent. Even. Multiply the outside to get the inside.");}, 4000);
			}
			else if (item == "empty safe"){
				this.fadeText("There's nothing inside anymore, but there are still secrets to be discovered");
			}
			else if (item == "og door"){
				this.fadeText("My one way out of here. The lock looks complicated and too sturdy to break.");
			}
			else if (item == "light"){
				this.fadeText("How many game designers does it take to change a lightbulb? Too many apparently.");
				setTimeout(function(){app.fadeText("There's something stuck in it, but it's too difficult to reach.");}, 4000);
			}
			else if (item == "rug" && this.inventory.includes("paperinvis") == false){
				this.fadeText("Usually there's something underneath these.");
				setTimeout(function(){app.pickup("paperinvis");}, 4000);
			}
			else if (item == "rug"){
				this.fadeText("Nothing to see here.");
			}
			else if (item == "top cubby"){
				this.fadeText("Too dark to see inside.");
			}
			else if (item == "bottom cubby"){
				this.fadeText("It's locked but the lock looks simple. I wonder if it holds anything important.");
			}
			else if (item == "bottom cubby unlocked"){
				this.fadeText("Even darker than the top one.");
			}
			else if (item == "leaky pipe"){
				this.fadeText("Drip. Drip. Drip. It's hard to think over that annoying sound. Drip. Drip. Drip.");
			}
			else if (item == "fixed pipe"){
				this.fadeText("I should become a plumber. Maybe I'll even wear a red hat. And say ya-HOO on occasion.");
			}
			else if (item == "window"){
				this.fadeText("There are iron bars across it. I can't make out anything significant.");
			}
			else if (item == "button"){
				this.fadeText("Looks like a button of some kind. There's one on every wall, so maybe I need to press them in a specific order...");
			}
			else if (item == "hidden door"){
				this.fadeText("A hidden door! The people who designed this room are pretty evil. I bet that this is the real way out.");
			}
		},
		use: function(item){
			if (item == "leaky pipe"){
				if (this.isActive == "screwdriver"){
					this.fadeText("Uh, not sure how this will work, but there's no harm in trying! BANG BANG BANG. Whoops. Oh no, the room's filling up with water that's not-BLUB BLUB blub...", 4000);
				}
				if (this.isActive == "tape"){
					this.fadeText("Finally, some peace and quiet. Oh! A number was under the tape on the duct tape roll. It's the number 1.");
				}
			}
			else if (item == "window"){
				if (this.isActive == "flashlight"){
					this.fadeText("This flashlight sure is helpful. There's something on the windowsill.");
					this.pickup('wire');
				}
			}
			else if (item == "mirror"){
				if (this.isActive == "gibberishpaper"){
					this.fadeText("I've seen this work in a movie once. Hey, it's legible in the mirror! Can't believe I didn't recognize reversed letters. Looks like this is only half of the full thing.", 4000);
					this.pickup("code 1");
				}
			}
			else if (item == "cupboard"){
				if (this.isActive == "lighter"){
					this.fadeText("This seems unlikely to work, but let's try. . . The rope is only slightly charred. The lighter is out of fluid now...");
				}
				if (this.isActive == "screwdriver"){
					this.fadeText("I think this is called death by a thousand paper cuts. I'll need to cut many times.");
					this.ropehealth -= 1;
					if (this.ropehealth == 0){
						this.fadeText("What an ordeal. I think I would have prefered an obscure puzzle instead.");
					}
				}
			}
			else if (item == "switch"){
				if (this.isActive == "screwdriver"){
					this.fadeText("Maybe I can just force it to work... SNAP. I knew I shouldn't have dropped that lever handling class.");
				}
				if (this.isActive == "hand"){
					this.fadeText("I think I have this puzzle figured out.");
					// puzzle code for switch, has the pass/fail
				}
			}
			else if (item == "drawer"){
				if (this.isActive == "screwdriver"){
					this.fadeText("Maybe I can force it open with this...there we go. ");
				}
			}
			else if (item == "skeleton"){
				if (this.isActive == "plier"){
					this.fadeText("Looks like these bones come off easily. Yoink!");
					this.pickup("Sharp bone");
				}
			}
			else if (item == "light"){
				if (this.isActive == "plier"){
					this.fadeText("Now I can get whatever is stuck in there. Looks like another number puzzle.");
					setTimeout(function(){app.fadeText("2 is only bordered by one other number. Odd. The odd numbers are in ascending order.");}, 4000);
				}
			}
			else if (item == "top cubby"){
				if (this.isActive == "lighter"){
					this.fadeText("The cubby is illuminated.");
					setTimeout(function(){app.pickup("candle");}, 2000);
					setTimeout(function(){app.fadeText("The lighter is out of fluid now...");}, 4000);
				}
				if (this.isActive == "hand"){
					this.fadeText("Gulp. Just gotta go for it...Oh! I feel something.");
					setTimeout(function(){app.pickup("candle");}, 2000);
					setTimeout(function(){app.fadeText("Hey there's a number written on the bottom. It's the number 2.");}, 4000);
				}
			}
			else if (item == "bottom cubby"){
				if (this.isActive == "wire"){
					this.fadeText("Another marketable skill for my resume. CLICK. I'm in.");
					// change to unlocked bottom cubby
				}
			}
			else if (item == "unlocked bottom cubby"){
				if (this.isActive == "flashlight" && this.spiderhealth > 0){
					this.fadeText("Now that I have this, I won't surprised again... WOAH A SPIDER. Oh crap it's coming at me!");
					// spider attack animation thing
				}
				if (this.isActive == "flashlight" && this.spiderhealth == 0){
					this.fadeText("If there's a second spider, I'd rather just die. There's another tool back here.");
					setTimeout(function(){app.pickup("pliers");}, 4000);
				}
			}
			else if (item == "spider"){
				if (this.isActive == "bone" && this.spiderhealth > 0){
					this.fadeText("It won't go down I'll have to use it again!");
				}
				else {
					this.fadeText("Die! Die! Back to the hell you came from!");
				}
			}
			else if (item == "mirror"){
				if (this.isActive == "bone"){
					this.fadeText("I bet there's something behind this mirror. As a bonus, I won't have to look at my face anymore... I'm on a roll here!",  3000);
				}
			}
			else if (item == "light"){
				if (this.isActive == "bone"){
					this.fadeText("Every intelligent cell in my body is telling me not to break my only light source, but I must follow the directions from an obscure hint on a scrap of paper hidden behind a mirror!", 4000);
				}
			}
			else if (item == "og door"){
				if (this.isActive == "wire"){
					this.fadeText("Trust me, I'm an expert at lockpicking. CREAK. Nobody heard that. The wire's warped and useless now.");
					this.inventory.splice(this.inventory.indexOf("wire"), 1);
				}
				if (this.isActive == "key"){
					this.fadeText("I'm free! Uh why is it pitch black? What's that sound coming closer?! Fate is cruel.");
				}
			}
			else if (item == "hidden door"){
				if (this.isActive == "hand"){
					this.fadeText("It's locked. I need a key but I can't search for one in this darkness.");
				}
				if (this.isActive == "key"){
					this.fadeText("I'm free! Thanks for playing everyone! Onward to my routine and boring normal life!");
				}
			}
			else if (item == "safe" && this.inventory.includes("flashlight") == false){
				if (this.isActive == "hand"){
					this.fadeText("Let's give this a whirl. Hopefully, it doesn't do something dumb like explode if I get it wrong.");
				}
				// stuff for safe cracking
			}
			else if (item == "safe" && this.inventory.includes("flashlight")){
				if (this.isActive == "hand"){
					this.fadeText("Let's see if there's anything underneath here. Bingo! It's a piece of paper with some gibberish... Slightly better than being blank I suppose.");
					this.pickup('gibberishpaper');
				}
			}
			else if (item == "safe" && this.inventory.includes("gibberishpaper")){
				if (this.isActive == "hand"){
					this.fadeText("Time to reveal the last secret of this safe. ");
					// safe logic
				}
			}
			else {
				this.fadeText("I don't think this will help me here.");
			}
		},
		combine: function(item){
			if (item == "lighter" || this.isActive == "lighter"){
				if (item == "candle" || this.isActive == "candle"){
					this.pickup("fire");
				}
			}
			if (item == "paperinvis" || this.isActive == "paperinvis"){
				if (item == "fire" || this.isActive == "fire"){
					this.pickup('papervis');
				}
			}
			if (item == "code1" || this.isActive == "code1"){
				if (item == "code2" || this.isActive == "code2"){
					this.pickup('completed code');
				}
			}
			else {
				this.fadeText("I don't think these two items are compatible");
			}
		},
		fadeText: function(message, time = 2000){
			document.getElementById("dialoguetext").innerText = message;
			anime({
				targets: "#dialoguetext",
				opacity: [
					{value: 1, duration: time},
					{value: 0, duration: time}
				],
				easing: "easeInOutQuart",
			});
		},
		fadeText2: function(message, time = 3000){
			document.getElementById("acquiredtext").innerText = message;
			anime({
				targets: "#acquiredtext",
				opacity: [
					{value: 1, duration: time},
					{value: 0, duration: time}
				],
				easing: "easeInOutQuart",
			});
		}
	},
	mounted: function(){
		document.addEventListener('keyup', this.arrowKeyListener);
	}
});

function deathCheck(){
		// death scenario when safe combo is wrong
}

/*
	Find screwdriver on table, SCREWDRIVER = true, need to click on screwdriver on table
  Open drawer in table, DRAWEROPEN = true
	Find Duct Tape and Lighter, TAPE = true, LIGHTER = true
		// Internal monologue, like "lighter feels hollow", to hint that lighter is almost empty
	Saw open cupboard using screwdriver, ROPE = 0, CUPBOARDOPEN = true
		// click on rope while holding screwdriver item to decrease rope health
	Switch needs to be set to correct position of the 5 different positions, SWITCH = correct numbers
		-> If screwdriver used on switch, SWITCH = -1, bad ending
	Click on rug to find piece of blank paper, PAPER = "invisible"
	Look into mirror to find number, MIRRORVIEWED = true
	Candle stub inside cubby hole on shelf next to door, reach in with hand or screwdriver to get candle, CANDLE = true
		-> don't use lighter, LIGHTER = false
	Use Lighter with Candle to make fire, FIRE = true
	Click on candle with fire while holding paper to heat the paper, After 10 seconds, PAPER = "visible"
		-> After 15 seconds, paper burns, PAPER = "burnt"
	Buttons pressed in correct order to reveal the safe, BUTTONORDER = "NSWE", SAFE = true
	Safe combo entered correctly, SAFECOMBO = "5912"
	Find flashlight inside safe, FLASHLIGHT = true

	continuous death check function, or set variable death = true, and then if death = true, trigger some function to determine how you die.

	------ bad endings -------

	Breaking the screwdriver on the switch
	Burn up paper by holding paper over fire for too long Can have options for 5 sec, 30 sec, 5 min
	Pressing buttons in wrong order, room fills up with water and u die kaboom
	Using up the lighter fluid in the wrong spot making it impossible to see the button order
	Wrong safe combination

*/
function capitalize(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}