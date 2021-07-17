# rereg-validation-extension

Scraper with a copy function for the SL Customs Electronic Registration RMU Validation

## Chrome webstore link

click [here](https://chrome.google.com/webstore/detail/re-registration-validatio/fkpnnofbkmfnibkdcblgbkmlhnbcmjnp) get the extention from the Chrome Web Store.

## What does it do

1. SUSPENDED VAT INDICATOR: It shows VAT Numbers in  
   - RED :IRD Suspended 7000 VATS
   - GREEN : indicates 7000 VATs not suspended by IRD
   - BLACK :usual 2525 VATS
2. COPY FEATURE: Generate the Whatsapp messages(ORDERS) RMU officers send to TIN/VAT UNIT
3. SEND MAIL FEATURE: Automatically open up the default email Client with company details.
   - `to` : the mail address company mentioned under the the declaration section
   - `subject` : ```SL CUSTOMS ELECTRONIC REGISTRATION OF M/S. ${company} (TIN: ${tin})```
   - `body` : ```Dear Sir/Madam,
         This is in relation to the Sri Lanka Customs Electronic Registration profile you created on behalf of the company M/s. ${company} (TIN:${tin}).
         Best Regards,```

4. *(NEW)* VALIDATING VAT FEATURE: Display a red flag when VAT number cannot be validated through ASYCUDA data feeded in to e-reg system. Extention will automatically send a request to server with the user entered tin number and get the response is to whether it's a valid TIN number from the data from asycuda that were already feeded in to e-registration system. If it's not, extention will display a red flag 🚩 in front of the VAT number field. Extention will also check whether right form of the VAT number (2525 or 7000) is entered by the user. If user has entered new type of a vat number( Ex: 2525 for 7000) which is not in the asycuda system yet, extention will show the same red flag 🚩.

## How to use Set Up Your Computer to use Send Email Feature

1. Download and install [Zibra Desktop Client](https://www.zimbra.com/downloads/zimbra-desktop/)
2. Open the Zibra Desktop Client and add your Customs mail account 
   - mail server: `mail.customs.gov.lk`
   - security: `None`
  
3. Set Zibra Desktop Client as your default mail client.
   - [How to set your default mail client on windows](https://kb.wisc.edu/helpdesk/page.php?id=170#:~:text=In%20the%20search%20bar%20or,you%20wish%20to%20make%20default.)

4. You are done.! 🙌
5. To use the feature Click on the SEND MAIL Button on the extention after reviewing the application.

## TODO

- [x] check mark to indicate completed applications
- [x] indicate latest version number in the popup
- [x] Add date and type of the company lines or add a text box for the Remarks.
