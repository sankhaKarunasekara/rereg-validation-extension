
// Inject the payload.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});;
});

// Listen to messages from the payload.js script and write to popout.html

var isSuspended = false;
var vat = "";
var tin = "";
var type = "";
var newOrOld = ""
var completedOrIncomplete = "";
var activateTill = "";
var company = "";
var vat_exp = "";
var sms = "";
var email = "";
var remarks = "";

chrome.runtime.onMessage.addListener(function ({
	COMPANY_NAME,
	TYPE,
	VAT_NO,
	TIN_NO,
	VAT_EXPIRY_DATE,
	SMS,
	EMAIL }) {

	vat = VAT_NO;
	tin = TIN_NO;
	company = COMPANY_NAME;
	vat_exp = VAT_EXPIRY_DATE;
	sms = SMS;
	type = TYPE;
	email = EMAIL;

	//IRD suspended list
	fetch('IRD.json')
		.then(response => response.json())
		.then(data => {
			// Do something with your data
			// var SUSPENDED_VATS = data;
			var last4digits = vat.slice(vat.length - 4)

			isSuspended = data.SUSPENDED.filter(item => item.TIN == tin).length == 1;
			debugger;
			if (isSuspended) {
				document.getElementById('VAT_NO').style.color = "red";
				// document.getElementById('VAT_NO').style.backgroundColor = 'red';
			} else {
				if ((last4digits == "7000") && (!isSuspended)) {
					document.getElementById('VAT_HEADER').style.color = "green";
					document.getElementById('VAT_NO').style.color = "green";
				}
			}

			if (last4digits == "7000") {
				var expiryHead = document.getElementById('VAT_EXPIRY_DATE_HEADING')
				expiryHead.parentNode.removeChild(expiryHead);
			} else {
				document.getElementById('VAT_EXPIRY_DATE').innerHTML = vat_exp;
			}

		});


	// var optionsOLD_OR_NEW = document.getElementsByName("OLD_OR_NEW");
	// if (optionsOLD_OR_NEW) {
	// 	for (var i = 0; i < optionsOLD_OR_NEW.length; i++) {
	// 		if (optionsOLD_OR_NEW[i].checked) {
	// 			newOrOld = optionsOLD_OR_NEW[i].value;
	// 		}
	// 	}
	// }

	// var optionsREGISTRATION_STATUS = document.getElementsByName("REGISTRATION_STATUS");
	// if (optionsREGISTRATION_STATUS) {
	// 	for (var i = 0; i < options.length; i++) {
	// 		if (optionsREGISTRATION_STATUS[i].checked) {
	// 			completedOrIncomplete = options[i].value;
	// 		}
	// 	}
	// }

	document.getElementById('COMPANY_NAME').innerHTML = company;
	document.getElementById('TYPE').innerHTML = type;
	document.getElementById('VAT_EXPIRY_DATE').value = vat_exp;
	document.getElementById('ACTIVATE_TILL_DATE').value = vat_exp;
	document.getElementById('VAT_NO').innerHTML = vat;
	document.getElementById('TIN_NO').innerHTML = tin;
	document.getElementById('SMS').innerHTML = sms;
	document.getElementById('VERSION').innerHTML = "(v" + chrome.app.getDetails().version + ")";

	document.getElementById("copyButton").addEventListener("click", copy);
	document.getElementById("sendEmailButton").addEventListener("click", sendEmail);
	document.getElementById("ACTIVATE_TILL_DATE").addEventListener("change", setFocusToRemarks);

	function copy() {

		completedOrIncomplete = document.getElementById('REGISTRATION_STATUS').value;

		if (completedOrIncomplete == "COMPLETE") {
			completedOrIncomplete = "*" + completedOrIncomplete + "*" + " ✅"
		} else {
			//do nothing
		}

		newOrOld = document.getElementById('OLD_OR_NEW').value;
		activateTill = document.getElementById('ACTIVATE_TILL_DATE').value;
		remarks = document.getElementById('REMARKS').value;

		var string1 = `-----\n${type} [${newOrOld}]\n${vat}\n${company}\n\nRegistration: ${completedOrIncomplete}\nVAT expiry date: ${vat_exp}\nActivate Till: ${activateTill}\nSMS: ${sms}\n`;
		var string2 = `-----\n${type} [${newOrOld}]\n${vat}\n${company}\n\nRegistration: ${completedOrIncomplete}\nActivate Till: ${activateTill}\nSMS: ${sms}\n`;
		var string3 = `-----\n${type} [${newOrOld}]\n${vat}\n${company}\n\nRegistration: ${completedOrIncomplete}\nActivate: NO EXPIRY \nSMS: ${sms}\n`;

		const ta = document.createElement('textarea');
		ta.style.cssText = 'opacity:0; position:fixed; width:1px; height:1px; top:0; left:0;';

		var last4digits = vat.slice(vat.length - 4)
		if (last4digits == "7000") {
			ta.value = string2;
			if (activateTill == 0) {
				ta.value = string3;
			}
		} else {
			ta.value = string1;
		}

		if (remarks == "") {
			ta.value = `${ta.value}-----`
		} else {
			ta.value = `${ta.value}\nRemarks:\n${remarks}\n-----`
		}

		document.body.appendChild(ta);
		ta.focus();
		ta.select();
		document.execCommand('copy');
		ta.remove();
		window.close();
	}

	function setFocusToRemarks() {
		document.getElementById('REMARKS').focus()
	}

	function sendEmail() {
		var toEmail = email;

		//TODO: encording using encodeURIComponent didn't work, although it converted the text, somehow it converted back to original form in the mail
		var encodedCompany = company.replaceAll("&", "and");

		var subject = `SL CUSTOMS ELECTRONIC REGISTRATION OF M/S. ${encodedCompany} (TIN: ${tin})`;

		// %0D%0A is the fancy newline charactor <br> or \n does not work
		var emailBody = `Dear Sir/Madam,
		%0D%0A
		%0D%0A
		This is in relation to the Sri Lanka Customs Electronic Registration profile you created on behalf of the company M/s. ${encodedCompany} (TIN:${tin}).
		%0D%0A 
		Best Regards,`;

		document.location = `mailto: ${toEmail}?subject=${subject}&body=${emailBody}`;
	}

});
