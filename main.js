// get references
let submitButton = document.getElementById("submit_button");
let userInputArray = document.getElementsByClassName("user_input");
let optionalUserInputArray = document.getElementsByClassName("optional_user_input");
let optionalOutputDiv = document.getElementById("optional_output");
let requiredOutputDiv = document.getElementById("required_output");
let copyTextbox = document.getElementById("copy_textbox");

let dueArray = [];
let submissionArray = [];
let dueDate;
let submissionDate;
let numberOfGraceDays = 10;
let numberOfSecondsPerDay = 86400;
let tenDaysAfterDueArray = [];
let officialTenDaysAfterDueArray = [];
let monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",];

submitButton.onclick = function(event) {
	event.preventDefault();

	// reset every time the submit button is clicked
	requiredOutputDiv.innerHTML = "";
	optionalOutputDiv.innerHTML = "";
	dueArray = [];
	submissionArray = [];
	tenDaysAfterDueArray = [];
	officialTenDaysAfterDueArray = [];

	// get user input
	for (let i = 0; i < userInputArray.length - 1; i++) {
		dueArray[i] = parseInt(userInputArray[i].value);
		submissionArray[i] = parseInt(optionalUserInputArray[i].value);
	}

	// validate date 
	let valid = validateDate(dueArray);
	let valid2 = false;
	let submissionDateBoolean = true;

	// if any entry of submissionArray is empty
	for (let i = 0; i < submissionArray.length; i++) {
		if (isNaN(submissionArray[i])) {
			submissionDateBoolean = false;
		}
	}

	if (submissionDateBoolean == true) {
		valid2 = validateDate(submissionArray);
	}

	// valid date
	if (valid) {
		// get AM / PM and adjust hour accordingly
		dueArray[userInputArray.length - 1] = userInputArray[userInputArray.length - 1].value;

		if (dueArray[userInputArray.length - 1] == "PM") {
			dueArray[3] += 12;
		}

		else if (dueArray[userInputArray.length - 1] == "AM" && dueArray[3] == 12) {
			dueArray[3] = 0;
		}

		//                        year        month          day         hour       minute
		dueDate = new Date(dueArray[0], dueArray[1], dueArray[2], dueArray[3], dueArray[4], 0, 0);

		// generate timestamps for up to 10 days after due date
		for (let i = 0; i < numberOfGraceDays; i++) {
			let tempTime = dueDate.getTime() + (numberOfSecondsPerDay * 1000 * (i + 1)) ;
			let tempDateObject = new Date();
			tempDateObject.setTime(tempTime);
			tenDaysAfterDueArray.push(tempDateObject);
		}

		// generate dates for up to 10 days after due date
		for (let i = 0; i < tenDaysAfterDueArray.length; i++) {
			let tempArray = [];
			tempArray.push(String(tenDaysAfterDueArray[i].getFullYear()));
			tempArray.push(String(tenDaysAfterDueArray[i].getMonth()));
			tempArray.push(String(tenDaysAfterDueArray[i].getDate()));
			tempArray.push(String(tenDaysAfterDueArray[i].getHours()));
			tempArray.push(String(tenDaysAfterDueArray[i].getMinutes()));
			tempArray.push(String(0));
			tempArray.push(String(0));
			officialTenDaysAfterDueArray.push(tempArray);
		}


		// output
		let temph2 = document.createElement("h2");
		temph2.innerHTML = "Grace Day Chart";
		requiredOutputDiv.appendChild(temph2);

		for (let i = 0; i < officialTenDaysAfterDueArray.length; i++) {
			let tempOutput = document.createElement("p");

			tempOutput.innerHTML += "SUBMIT BEFORE&nbsp;&nbsp;&nbsp;";
			tempOutput.innerHTML += monthsArray[officialTenDaysAfterDueArray[i][1]] + " ";
			
			if (officialTenDaysAfterDueArray[i][2].length == 1) {
				tempOutput.innerHTML += "&nbsp;" + officialTenDaysAfterDueArray[i][2] + " ";
			}

			else {
				tempOutput.innerHTML += officialTenDaysAfterDueArray[i][2] + " ";
			} 

			if (officialTenDaysAfterDueArray[i][3].length == 1) {
				tempOutput.innerHTML += "&nbsp;" + officialTenDaysAfterDueArray[i][3] + ":";
			}

			else {
				tempOutput.innerHTML += officialTenDaysAfterDueArray[i][3] + ":";
			} 

			tempOutput.innerHTML += officialTenDaysAfterDueArray[i][4] + " " + dueArray[userInputArray.length - 1];

			// number of grace days to deduct
			let deduct = i + 1;

			if (deduct <= 1) {
				tempOutput.innerHTML += " ---> DEDUCT &nbsp;<span id='red'>" + deduct + "</span> GRACE DAY";
			}

			else if (deduct <= 9) {
				tempOutput.innerHTML += " ---> DEDUCT &nbsp;<span id='red'>" + deduct + "</span> GRACE DAYS";
			}

			else {
				tempOutput.innerHTML += " ---> DEDUCT <span id='red'>" + deduct + "</span> GRACE DAYS";
			}

			requiredOutputDiv.appendChild(tempOutput);

			// copy to clipboard stuff
			// set up onclick for the most recently added child
			requiredOutputDiv.children[i + 1].onclick = function() {
				copyTextbox.style.display = "inline";
				let copyText = copyTextbox;
				copyText.value = deduct;
				copyText.select();
				document.execCommand("copy");
				copyTextbox.style.display = "none";
			}
		}

		// submission date stuff
		if (valid2 == true) {
			optionalOutputDiv.style.display = "block";

			// get AM / PM and adjust hour accordingly
			submissionArray[optionalUserInputArray.length - 1] = optionalUserInputArray[optionalUserInputArray.length - 1].value;

			if (submissionArray[optionalUserInputArray.length - 1] == "PM") {
				submissionArray[3] += 12;
			}

			else if (submissionArray[optionalUserInputArray.length - 1] == "AM" && submissionArray[3] == 12) {
				submissionArray[3] = 0;
			}

			//                                      year               month                 day                hour              minute
			submissionDate = new Date(submissionArray[0], submissionArray[1], submissionArray[2], submissionArray[3], submissionArray[4], 0, 0);

			let tempSubmissionTime = submissionDate.getTime();
			let tempDueTime = dueDate.getTime();

			if (tempSubmissionTime > tempDueTime) {
				// find time difference
				let timeDifference = tempSubmissionTime - tempDueTime;
				let numberOfDaysLate = Math.ceil(timeDifference / (numberOfSecondsPerDay * 1000));
				
				let tempOutput2 = document.createElement("p");

				if (numberOfDaysLate <= 1) {
					tempOutput2.innerHTML += "<span id='red'>" + numberOfDaysLate + "</span> " + "DAY LATE ---> DEDUCT <span id='red'>" + numberOfDaysLate + "</span> GRACE DAY";
				}

				else if (numberOfDaysLate <= 10) {
					tempOutput2.innerHTML += "<span id='red'>" + numberOfDaysLate + "</span> " + "DAYS LATE ---> DEDUCT <span id='red'>" + numberOfDaysLate + "</span> GRACE DAYS";
				}

				else {
					tempOutput2.innerHTML += "<span id='red'>" + numberOfDaysLate + "</span> " + "DAYS LATE (MORE THAN 10 DAYS LATE) ---> <span id='red'>SUBMISSION NOT ACCEPTED</span>";
				}
				
				optionalOutputDiv.appendChild(tempOutput2);

				// copy to clipboard stuff
				optionalOutputDiv.children[0].onclick = function() {
					copyTextbox.style.display = "inline";
					let copyText2 = copyTextbox;
					copyText2.value = numberOfDaysLate;
					copyText2.select();
					document.execCommand("copy");
					copyTextbox.style.display = "none";
				}
			}

			// submission date before due date
			else {
				let tempOutput2 = document.createElement("p");
				tempOutput2.innerHTML += "SUBMITTED BEFORE DUE DATE ---> NOT LATE";
				optionalOutputDiv.appendChild(tempOutput2);
			}

		}
	}

	// invalid date
	else {
		let temph1 = document.createElement("h1");
		temph1.innerHTML = "<span id='red'>INVALID DATE</span>";
		requiredOutputDiv.appendChild(temph1);
	}
}

function validateDate(arr) {
	// if month is feb
	if (arr[1] == 1) {
		// if it is a leap year
		if ((!(arr[0] % 4) && arr[0] % 100) || !(arr[0] % 400)) {
			if (arr[2] > 29) {
				return false;
			}
		}
		
		// if it's not a leap year
		else {
			if (arr[2] > 28) {
				return false;
			}
		}
	}

	// if month is not feb
	else {
		// if the month is supposed to have 30 days (apr, jun, sep, nov)
		if (arr[1] == 3 || arr[1] == 5 || arr[1] == 8 || arr[1] == 10) {
			if (arr[2] >= 31) {
				return false;
			}
		}
	}

	return true;
}










