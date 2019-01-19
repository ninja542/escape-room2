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