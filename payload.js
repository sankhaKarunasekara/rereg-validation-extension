// send the page title as a chrome message

var details = getCompanyDetails();
chrome.runtime.sendMessage(details);

function getCompanyDetails() {
    var VAT_NO = document.getElementsByName("BAS_TVP_VAT")[0].value;
    var TIN_NO = document.getElementsByName("BAS_TVP_TIN")[0].value;
    var COMPANY_NAME = document.getElementsByName("BAS_BID_NAM")[0]
        .value;
    var VAT_EXPIRY_DATE = document.getElementsByName("BAS_TVP_VAT_EXP")[0]
        .value;
    var SMS = document.getElementsByName("DEC_SMS_NUM")[0]
        .value;

    return {
        VAT_NO: VAT_NO,
        TIN_NO: TIN_NO,
        COMPANY_NAME: COMPANY_NAME,
        VAT_EXPIRY_DATE: VAT_EXPIRY_DATE,
        SMS: SMS
    }
}