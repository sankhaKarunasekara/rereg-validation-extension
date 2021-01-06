
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
var company = "";
var vat_exp = "";
var sms = "";

chrome.runtime.onMessage.addListener(function ({
	VAT_NO,
	TIN_NO,
	COMPANY_NAME,
	VAT_EXPIRY_DATE,
	SMS }) {

	vat = VAT_NO;
	tin = TIN_NO;
	company = COMPANY_NAME;
	vat_exp = VAT_EXPIRY_DATE;
	sms = SMS;

	fetch('IRD.json')
		.then(response => response.json())
		.then(data => {
			// Do something with your data
			// var SUSPENDED_VATS = data;
			var last4digits = vat.slice(vat.length - 4)

			isSuspended = data.SUSPENDED.filter(item => item.TIN == tin).length == 1;
			if (isSuspended) {
				document.getElementById('VAT_NO').style.color = "red";
				// document.getElementById('VAT_NO').style.backgroundColor = 'red';
			} else {
				if ((last4digits == "7000") && (!isSuspended)) {
					document.getElementById('VAT_NO').style.color = "green";
				}
			}

			if (last4digits == "7000") {
				var expiryElem = document.getElementById('VAT_EXPIRY_DATE')
				var expiryHead = document.getElementById('VAT_EXPIRY_DATE_HEADING')
				expiryElem.parentNode.removeChild(expiryElem);
				expiryHead.parentNode.removeChild(expiryHead);
			} else {
				document.getElementById('VAT_EXPIRY_DATE').innerHTML = vat_exp;
			}

		});

	document.getElementById('COMPANY_NAME').innerHTML = company;
	document.getElementById('VAT_NO').innerHTML = vat;
	document.getElementById('TIN_NO').innerHTML = tin;


	var last4digits = vat.slice(vat.length - 4)

	if (last4digits == "7000") {
		var expiryElem = document.getElementById('VAT_EXPIRY_DATE')
		var expiryHead = document.getElementById('VAT_EXPIRY_DATE_HEADING')
		expiryElem.parentNode.removeChild(expiryElem);
		expiryHead.parentNode.removeChild(expiryHead);
	} else {
		document.getElementById('VAT_EXPIRY_DATE').innerHTML = vat_exp;
	}

	document.getElementById('SMS').innerHTML = sms;
	document.getElementById("copyButton").addEventListener("click", copy);

	function copy() {


		var string1 = `COMPANY_NAME: ${company}\nVAT_NO: ${vat}\nTIN_NO: ${tin}\nVAT_EXPIRY_DATE: ${vat_exp}\nSMS: ${sms}`;
		var string2 = `COMPANY_NAME: ${company}\nVAT_NO: ${vat}\nTIN_NO: ${tin}\nSMS: ${sms}`;

		const ta = document.createElement('textarea');
		ta.style.cssText = 'opacity:0; position:fixed; width:1px; height:1px; top:0; left:0;';

		if (last4digits == "7000") {
			ta.value = string2;
		} else {
			ta.value = string1;
		}

		document.body.appendChild(ta);
		ta.focus();
		ta.select();
		document.execCommand('copy');
		ta.remove();
		window.close();
	}

});
