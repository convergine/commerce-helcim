/*
 HELCIM JAVASCRIPT FOR AJAX CLIENT-SIDE TRANSACTIONS
 VERSION 2.1.3
 LAST UPDATED 2017-06-14
 VISIT WWW.HELCIM.COM/SUPPORT/ FOR DOCUMENTATION
 COPYRIGHT (C) 2006-2017 HELCIM INC. ALL RIGHTS RESERVED.
*/


// SETTINGS
var helcimResultPaneName = document.getElementById('paymentForm-helcim-helcimResults') != null?'paymentForm-helcim-helcimResults':'helcimResults';
var helcimIdsHandlePrefix = document.getElementById('paymentForm-helcim-cardToken') != null?'paymentForm-helcim-':'';
var url = 'https://secure.myhelcim.com/js/';
var language = 'en';

// CHECK FOR PROMISES
if (typeof Promise == 'undefined') {

    var js_script = document.createElement('script');
    js_script.type = "text/javascript";
    js_script.src = url + "es6-promise-fix.js";
    js_script.async = false;
    document.getElementsByTagName('head')[0].appendChild(js_script);
}

var $helcimForm = document.getElementById(helcimIdsHandlePrefix+'helcimToken').form;

$helcimForm.addEventListener('submit',formListener)
function formListener(ev){
    ev.preventDefault();
    sendHelcimForm();
}


//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - PROCESS TRANSACTION
//////////////////////////////////////////////////////////////////////////////////////
function helcimProcess(){

    // RETURN PROMISE
    return new Promise(function(resolve, reject) {

        // SET LANGUAGE
        helcimSetLanguage();

        // CHECK REQUIRED FIELDS
        if(helcimRequiredFields() == true){

            // CHECK FOR CORS SUPPORT
            if(helcimCheckBrowserSupport() == false){

                // NOT SUPPORTED
                document.getElementById(helcimResultPaneName).innerHTML = helcimTranslate('YOUR BROWSER IS NOT SUPPORTED');

            }else{

                // DISABLE BUTTON
                helcimToggleButton();

                // REQUIRED FIELDS
                var token = null;
                var test = false;
                var plugin = null;
                var pluginVersion = null;

                // OPTIONAL - CARD INFORMATION
                var cardNumber = null;
                var cardExpiry = null;
                var cardCVV = null;
                var cardToken = null;	// THIS IS ONLY USED TO UPDATE CARD INFORMATION

                // OPTIONAL - AVS
                var cardHolderName = null;
                var cardHolderLastName = null;
                var cardHolderAddress = null;
                var cardHolderPostalCode = null;

                // BANK ACCOUNT INFORMATION
                var bankAccountToken = null; // THIS IS ONLY USED TO UPDATE BANK ACCOUNT INFORMATION
                var bankAccountType = null;
                var bankAccountCorporate = null;
                var bankTransitNumber = null;
                var bankAccountNumber = null;
                var bankFirstName = null;
                var bankLastName = null;
                var bankCompanyName = null;
                var bankStreetAddress = null;
                var bankCity = null;
                var bankProvince = null;
                var bankCountry = null;
                var bankPostalCode = null;

                // OPTIONAL - ORDER
                var amount = '0.00';
                var currency = null;
                var currencyHash = null;
                var amountHash = null;
                var orderNumber = null;
                var customerCode = null;
                var amountShipping = null;
                var amountTax = null;
                var amountDiscount = null;
                var comments = null;

                // OPTIONAL - BILLING
                var billing_name = null;
                var billing_contactName = null;
                var billing_businessName = null;
                var billing_street1 = null;
                var billing_street2 = null;
                var billing_city = null;
                var billing_province = null;
                var billing_postalCode = null;
                var billing_country = null;
                var billing_phone = null;
                var billing_email = null;
                var billing_fax = null;

                // OPTIONAL - SHIPPING
                var shipping_name = null;
                var shipping_contactName = null;
                var shipping_businessName = null;
                var shipping_street1 = null;
                var shipping_street2 = null;
                var shipping_city = null;
                var shipping_province = null;
                var shipping_postalCode = null;
                var shipping_country = null;
                var shipping_phone = null;
                var shipping_email = null;
                var shipping_fax = null;

                // OPTIONAL - ITEMS
                var items = [];

                // OPTIONAL - CAPTCHA
                var captcha = null;

                // SET
                var dataPOST = '';

                // CHECK FOR TEST MODE
                if (document.getElementById(helcimIdsHandlePrefix + 'helcimTest') != null) {
                    test = document.getElementById(helcimIdsHandlePrefix + 'helcimTest').value;
                }

                // GET VALUES - REQUIRED
                if (document.getElementById(helcimIdsHandlePrefix + 'helcimToken') != null) {
                    token = document.getElementById(helcimIdsHandlePrefix + 'helcimToken').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'plugin') != null) {
                    plugin = document.getElementById(helcimIdsHandlePrefix + 'plugin').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'pluginVersion') != null) {
                    pluginVersion = document.getElementById(helcimIdsHandlePrefix + 'pluginVersion').value;
                }

                // GET VALUES - CARD INFORMATION
                if (document.getElementById(helcimIdsHandlePrefix + 'cardNumber') != null) {
                    cardNumber = document.getElementById(helcimIdsHandlePrefix + 'cardNumber').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'cardCVV') != null) {
                    cardCVV = document.getElementById(helcimIdsHandlePrefix + 'cardCVV').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'cardToken') != null) {
                    cardToken = document.getElementById(helcimIdsHandlePrefix + 'cardToken').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'cardExpiry') != null) {
                    cardExpiry = document.getElementById(helcimIdsHandlePrefix + 'cardExpiry').value;
                }

                // GET VALUES - AVS
                if(document.getElementById(helcimIdsHandlePrefix + 'cardHolderName') != null){ cardHolderName = document.getElementById(helcimIdsHandlePrefix + 'cardHolderName').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'cardHolderLastName') != null){ cardHolderLastName = document.getElementById(helcimIdsHandlePrefix + 'cardHolderLastName').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'cardHolderAddress') != null){ cardHolderAddress = document.getElementById(helcimIdsHandlePrefix + 'cardHolderAddress').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'cardHolderPostalCode') != null){ cardHolderPostalCode = document.getElementById(helcimIdsHandlePrefix + 'cardHolderPostalCode').value; }


                // GET VALUES - ORDER
                if (document.getElementById(helcimIdsHandlePrefix + 'amount') != null) {
                    amount = document.getElementById(helcimIdsHandlePrefix + 'amount').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'currency') != null) {
                    currency = document.getElementById(helcimIdsHandlePrefix + 'currency').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'currencyHash') != null) {
                    currencyHash = document.getElementById(helcimIdsHandlePrefix + 'currencyHash').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'amountHash') != null) {
                    amountHash = document.getElementById(helcimIdsHandlePrefix + 'amountHash').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'orderNumber') != null) {
                    orderNumber = document.getElementById(helcimIdsHandlePrefix + 'orderNumber').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'customerCode') != null) {
                    customerCode = document.getElementById(helcimIdsHandlePrefix + 'customerCode').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'amountShipping') != null) {
                    amountShipping = document.getElementById(helcimIdsHandlePrefix + 'amountShipping').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'amountTax') != null) {
                    amountTax = document.getElementById(helcimIdsHandlePrefix + 'amountTax').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'amountDiscount') != null) {
                    amountDiscount = document.getElementById(helcimIdsHandlePrefix + 'amountDiscount').value;
                }
                if (document.getElementById(helcimIdsHandlePrefix + 'comments') != null) {
                    comments = document.getElementById(helcimIdsHandlePrefix + 'comments').value;
                }

                // GET VALUES - BILLING
                if(document.getElementById(helcimIdsHandlePrefix + 'billing_contactName') != null){ billing_contactName = document.getElementById(helcimIdsHandlePrefix + 'billing_contactName').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'billing_businessName') != null){ billing_businessName = document.getElementById(helcimIdsHandlePrefix + 'billing_businessName').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'billing_street1') != null){ billing_street1 = document.getElementById(helcimIdsHandlePrefix + 'billing_street1').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'billing_street2') != null){ billing_street2 = document.getElementById(helcimIdsHandlePrefix + 'billing_street2').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'billing_city') != null){ billing_city = document.getElementById(helcimIdsHandlePrefix + 'billing_city').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'billing_province') != null){ billing_province = document.getElementById(helcimIdsHandlePrefix + 'billing_province').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'billing_postalCode') != null){ billing_postalCode = document.getElementById(helcimIdsHandlePrefix + 'billing_postalCode').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'billing_country') != null){ billing_country = document.getElementById(helcimIdsHandlePrefix + 'billing_country').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'billing_phone') != null){ billing_phone = document.getElementById(helcimIdsHandlePrefix + 'billing_phone').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'billing_email') != null){

                    // CHECK VALID EMAIL
                    if(helcimValidateEmail(document.getElementById(helcimIdsHandlePrefix + 'billing_email').value)){

                        // SET
                        billing_email = document.getElementById(helcimIdsHandlePrefix + 'billing_email').value;

                    }

                }

                if(document.getElementById(helcimIdsHandlePrefix + 'billing_fax') != null){ billing_fax = document.getElementById(helcimIdsHandlePrefix + 'billing_fax').value; }

                // GET VALUES - SHIPPING
                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_contactName') != null){ shipping_contactName = document.getElementById(helcimIdsHandlePrefix + 'shipping_contactName').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_businessName') != null){ shipping_businessName = document.getElementById(helcimIdsHandlePrefix + 'shipping_businessName').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_street1') != null){ shipping_street1 = document.getElementById(helcimIdsHandlePrefix + 'shipping_street1').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_street2') != null){ shipping_street2 = document.getElementById(helcimIdsHandlePrefix + 'shipping_street2').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_city') != null){ shipping_city = document.getElementById(helcimIdsHandlePrefix + 'shipping_city').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_province') != null){ shipping_province = document.getElementById(helcimIdsHandlePrefix + 'shipping_province').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_postalCode') != null){ shipping_postalCode = document.getElementById(helcimIdsHandlePrefix + 'shipping_postalCode').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_country') != null){ shipping_country = document.getElementById(helcimIdsHandlePrefix + 'shipping_country').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_phone') != null){ shipping_phone = document.getElementById(helcimIdsHandlePrefix + 'shipping_phone').value; }
                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_email') != null){

                    // CHECK VALID EMAIL
                    if(helcimValidateEmail(document.getElementById(helcimIdsHandlePrefix + 'shipping_email').value)){

                        // SET
                        shipping_email = document.getElementById(helcimIdsHandlePrefix + 'shipping_email').value;

                    }

                }

                if(document.getElementById(helcimIdsHandlePrefix + 'shipping_fax') != null){ shipping_fax = document.getElementById(helcimIdsHandlePrefix + 'shipping_fax').value; }

                //
                // GET VALUES - ITEMS
                //

                // LOOP THROUGH ALL ITEMS
                var count = 1;
                while(document.getElementById(helcimIdsHandlePrefix + 'itemSKU'+count) != null){

                    // CREATE VARIABLES
                    var sku = '';
                    var description = '';
                    var serialNumber = '';
                    var quantity = '';
                    var price = '';
                    var total = '';

                    // GET VALUES
                    if(document.getElementById(helcimIdsHandlePrefix + 'itemSKU'+count) != null){ sku = document.getElementById(helcimIdsHandlePrefix + 'itemSKU'+count).value; }
                    if(document.getElementById(helcimIdsHandlePrefix + 'itemDescription'+count) != null){ description = document.getElementById(helcimIdsHandlePrefix + 'itemDescription'+count).value; }
                    if(document.getElementById(helcimIdsHandlePrefix + 'itemSerialNumber'+count) != null){ serialNumber = document.getElementById(helcimIdsHandlePrefix + 'itemSerialNumber'+count).value; }
                    if(document.getElementById(helcimIdsHandlePrefix + 'itemQuantity'+count) != null){ quantity = document.getElementById(helcimIdsHandlePrefix + 'itemQuantity'+count).value; }
                    if(document.getElementById(helcimIdsHandlePrefix + 'itemPrice'+count) != null){ price = document.getElementById(helcimIdsHandlePrefix + 'itemPrice'+count).value; }
                    if(document.getElementById(helcimIdsHandlePrefix + 'itemTotal'+count) != null){ total = document.getElementById(helcimIdsHandlePrefix + 'itemTotal'+count).value; }

                    // ADD VALUES TO ITEMS ARRAY
                    items[count-1] = {itemSKU: sku, itemDescription: description, itemSerialNumber: serialNumber, itemQuantity: quantity, itemPrice: price, itemTotal: total};

                    count++;

                }

                // GET VALUES - CAPTCHA
                if(document.getElementById(helcimIdsHandlePrefix + 'g-recaptcha-response') != null){ captcha = document.getElementById(helcimIdsHandlePrefix + 'g-recaptcha-response').value; }

                // SET ERROR DEFAULT
                var errors = '';

                // CHECK FIELDS
                if(!token){

                    // ERROR
                    errors = errors+"<span class='helcim-error'>("+helcimTranslate('INVALID HELCIM.JS TOKEN')+"</span>) ";

                }

                // CHECK FOR EFT/ACH
                if(bankAccountType){

                    //
                    // EFT
                    //

                    // CHECK FIELDS
                    if(!customerCode){

                        // ERROR
                        errors = errors+"<span class='helcim-error'>("+helcimTranslate('INVALID CUSTOMER CODE')+") </span>";

                    }

                }else{

                    //
                    // CARD TRANSACTION
                    //

                    //if(!cardHolderName.length ||!$('.card-holder-last-name').val().length ){
                    if(!cardHolderName.length || !cardHolderLastName.length ){

                        errors = errors+"<span class='helcim-error'>"+helcimTranslate('Your Card Holder First Name/Last Name is incomplete')+"</span><br>";

                    }

                    if(!cardHolderAddress || !cardHolderPostalCode){
                        errors = errors+"<span class='helcim-error'>"+helcimTranslate('Billing Address and Postal code are required')+"</span><br>";
                    }

                    if(/[^0-9-\s]+/.test(cardNumber)){

                        errors = errors+"<span class='helcim-error'>"+helcimTranslate('Your card number is incomplete')+"</span><br>";

                    }

                    // REMOVE SPACES AND DASHES
                    cardNumber = cardNumber.replace(/\D/g,"");

                    // CHECK CARD LEN (AMEX MUST START WITH 3)
                    if(!((cardNumber.length == 15 && cardNumber.charAt(0) == 3) || cardNumber.length == 16 || (cardNumber.length == 14 && cardNumber.charAt(0) == 3))){

                        errors = errors+"<span class='helcim-error'>"+helcimTranslate('Your card number is incomplete')+"</span><br>";

                    }
                    // CHECK FIELDS
                    if(helcimValidateCardNumber(cardNumber) == false){ errors = errors+"<span class='helcim-error'>"+helcimTranslate('Your card number is incorrect')+"</span><br>"; }
                    if(helcimValidateCardExpiry(cardExpiry) == false){ errors = errors+"<span class='helcim-error'>"+helcimTranslate('Your card\'s expiration date is incomplete')+"</span><br>"; }
                    if(helcimValidateCardCVV(cardCVV) == false){ errors = errors+"<span class='helcim-error'>"+helcimTranslate('Your card\'s security code is incomplete')+"</span><br>"; }

                    //TODO: AVS CHECKING

                }

                // CHECK FOR SSL
                if(helcimCheckSSL() == false){

                    // CHECK ENVIRONEMNT MODE
                    if(test == false){

                        // MISSING SSL
                        errors = errors+"<span class='helcim-error'>("+helcimTranslate('BROWSER SSL CERTIFICATE MISSING')+") </span>";

                    }else{

                        //
                        // MISSING SSL ALLOWED (TEST MODE)
                        //

                    }

                }

                // CHECK FOR ERRORS
                if(errors == ''){

                    // SHOW ERROR
                    document.getElementById(helcimResultPaneName).innerHTML = helcimTranslate('CONNECTING') + '...'; // DO NOT CHANGE BEING CHECKED IN WOOCOMMERCE

                    // CREATE XML REQUEST
                    var req = new XMLHttpRequest();

                    // SET POST DATA
                    var dataPOST = '';

                    // ADD
                    if (token != null) {
                        dataPOST += 'token=' + token;
                    }
                    if (plugin != null) {
                        dataPOST += '&plugin=' + plugin;
                    }
                    if (pluginVersion != null) {
                        dataPOST += '&pluginVersion=' + pluginVersion;
                    }
                    if (test != null) {
                        dataPOST += '&test=' + test;
                    }
                    if (document.getElementById('woocommerce') != null && document.getElementById('woocommerce').value == 1) {
                        dataPOST += '&thirdParty=woocommerce';
                    }
                    if (cardNumber != null) {
                        dataPOST += '&cardNumber=' + cardNumber;
                    }
                    if (cardExpiry != null) {
                        dataPOST += '&cardExpiry=' + cardExpiry;
                    }
                    if (cardCVV != null) {
                        dataPOST += '&cardCVV=' + cardCVV;
                    }
                    if (cardToken != null) {
                        dataPOST += '&cardToken=' + cardToken;
                    }
                    if (cardHolderName != null) {
                        dataPOST += '&cardHolderName=' + cardHolderName;
                    }
                    if (cardHolderAddress != null) {
                        dataPOST += '&cardHolderAddress=' + cardHolderAddress;
                    }
                    if (cardHolderPostalCode != null) {
                        dataPOST += '&cardHolderPostalCode=' + cardHolderPostalCode;
                    }
                    if (amount != null) {
                        dataPOST += '&amount=' + amount;
                    }
                    if (currency != null) {
                        dataPOST += '&currency=' + currency;
                    }
                    if (currencyHash != null) {
                        dataPOST += '&currencyHash=' + currencyHash;
                    }
                    if (amountHash != null) {
                        dataPOST += '&amountHash=' + amountHash;
                    }
                    if (orderNumber != null) {
                        dataPOST += '&orderNumber=' + orderNumber;
                    }
                    if (customerCode != null) {
                        dataPOST += '&customerCode=' + customerCode;
                    }
                    if (amountShipping != null) {
                        dataPOST += '&amountShipping=' + amountShipping;
                    }
                    if (amountTax != null) {
                        dataPOST += '&amountTax=' + amountTax;
                    }
                    if (amountDiscount != null) {
                        dataPOST += '&amountDiscount=' + amountDiscount;
                    }
                    if (comments != null) {
                        dataPOST += '&comments=' + comments;
                    }
                    if (bankAccountToken != null) {
                        dataPOST += '&bankAccountToken=' + bankAccountToken;
                    }
                    if(bankAccountType != null){ dataPOST += '&bankAccountType='+bankAccountType; }
                    if(bankAccountCorporate != null){ dataPOST += '&bankAccountCorporate='+bankAccountCorporate; }
                    if(bankTransitNumber != null){ dataPOST += '&bankTransitNumber='+bankTransitNumber; }
                    if(bankAccountNumber != null){ dataPOST += '&bankAccountNumber='+bankAccountNumber; }
                    if(bankFirstName != null){ dataPOST += '&bankFirstName='+bankFirstName; }
                    if(bankLastName != null){ dataPOST += '&bankLastName='+bankLastName; }
                    if(bankCompanyName != null){ dataPOST += '&bankCompanyName='+bankCompanyName; }
                    if(bankStreetAddress != null){ dataPOST += '&bankStreetAddress='+bankStreetAddress; }
                    if(bankCity != null){ dataPOST += '&bankCity='+bankCity; }
                    if(bankProvince != null){ dataPOST += '&bankProvince='+bankProvince; }
                    if(bankCountry != null){ dataPOST += '&bankCountry='+bankCountry; }
                    if(bankPostalCode != null){ dataPOST += '&bankPostalCode='+bankPostalCode; }
                    if(billing_contactName != null){ dataPOST += '&billing_contactName='+billing_contactName; }
                    if(billing_businessName != null){ dataPOST += '&billing_businessName='+billing_businessName; }
                    if(billing_street1 != null){ dataPOST += '&billing_street1='+billing_street1; }
                    if(billing_street2 != null){ dataPOST += '&billing_street2='+billing_street2; }
                    if(billing_city != null){ dataPOST += '&billing_city='+billing_city; }
                    if(billing_province != null){ dataPOST += '&billing_province='+billing_province; }
                    if(billing_postalCode != null){ dataPOST += '&billing_postalCode='+billing_postalCode; }
                    if(billing_country != null){ dataPOST += '&billing_country='+billing_country; }
                    if(billing_phone != null){ dataPOST += '&billing_phone='+billing_phone; }
                    if(billing_email != null){ dataPOST += '&billing_email='+billing_email; }
                    if(billing_fax != null){ dataPOST += '&billing_fax='+billing_fax; }
                    if(shipping_contactName != null){ dataPOST += '&shipping_contactName='+shipping_contactName; }
                    if(shipping_businessName != null){ dataPOST += '&shipping_businessName='+shipping_businessName; }
                    if(shipping_street1 != null){ dataPOST += '&shipping_street1='+shipping_street1; }
                    if(shipping_street2 != null){ dataPOST += '&shipping_street2='+shipping_street2; }
                    if(shipping_city != null){ dataPOST += '&shipping_city='+shipping_city; }
                    if(shipping_province != null){ dataPOST += '&shipping_province='+shipping_province; }
                    if(shipping_postalCode != null){ dataPOST += '&shipping_postalCode='+shipping_postalCode; }
                    if(shipping_country != null){ dataPOST += '&shipping_country='+shipping_country; }
                    if(shipping_phone != null){ dataPOST += '&shipping_phone='+shipping_phone; }
                    if(shipping_email != null){ dataPOST += '&shipping_email='+shipping_email; }
                    if(shipping_fax != null){ dataPOST += '&shipping_fax='+shipping_fax; }
                    if(captcha != null){ dataPOST += '&g-recaptcha-response='+captcha; }

                    // LOOP THROUGH ITEMS
                    for(var index = 0, len = items.length; index < len; index++){

                        // ADD ITEMS TO POST STRING
                        dataPOST += '&itemSKU'+(index+1)+'='+items[index]['itemSKU'];
                        dataPOST += '&itemDescription'+(index+1)+'='+items[index]['itemDescription'];
                        dataPOST += '&itemSerialNumber'+(index+1)+'='+items[index]['itemSerialNumber'];
                        dataPOST += '&itemQuantity'+(index+1)+'='+items[index]['itemQuantity'];
                        dataPOST += '&itemPrice'+(index+1)+'='+items[index]['itemPrice'];
                        dataPOST += '&itemTotal'+(index+1)+'='+items[index]['itemTotal'];

                    }



                    // CREATE XML REQUEST
                    var newRequest = new XMLHttpRequest();

                    // OPEN REQUEST
                    newRequest.open('POST',url,true);

                    // SEND INFO WITH REQUEST
                    newRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");

                    // THESE FIELDS GIVE JAVASCRIPT ERRORS
                    // newRequest.setRequestHeader("Content-length",dataPOST.length);
                    // newRequest.setRequestHeader("Connection","close");

                    // CHANGE STATE
                    newRequest.onreadystatechange = function(){

                        // CHECK READY STATE
                        if(this.readyState == 4){
                            console.log(this.status)
                            // CHECK GOOD STATUS
                            if(this.status == 200){

                                // GET XML
                                var responseXML = newRequest.responseXML;

                               var result = helcimParseXMLtoFields(responseXML);

                               if(!result.error) {
                                   // TRANSACTION COMPLETED
                                   document.getElementById(helcimResultPaneName).innerHTML = result.html;

                                   // CHECK
                                   if ($helcimForm.length && helcimResultPaneName.length) {
                                       // CLEAN SENSITIVE DATA
                                       helcimCleanCardData();
                                       console.log('form submit')
                                       // SUBMIT FORM
                                       $helcimForm.removeEventListener('submit',formListener);
                                       $helcimForm.submit();

                                   }
                               }else{
                                   document.getElementById(helcimResultPaneName).innerHTML = '<span class="helcim-error">'+result.html+'<span>';
                               }

                                // RESOLVE PROMISE
                                resolve(document.getElementById(helcimResultPaneName).innerHTML);

                            }else{

                                // ENABLE BUTTON
                                helcimToggleButton();

                                // SHOW ERROR
                                document.getElementById(helcimResultPaneName).innerHTML = helcimTranslate('ERROR')+'(STATUS:'+this.status+'): '+helcimTranslate('COMMUNICATION ERROR');

                                // REJECT PROMISE
                                reject(document.getElementById(helcimResultPaneName).innerHTML);

                            }

                        }else{

                            // ENABLE BUTTON
                            //helcimToggleButton();

                            // HIDE ERROR SINCE STATE 4 CAN TAKE A WHILE TO LOAD
                            //document.getElementById(helcimResultPaneName).innerHTML = 'ERROR: JS ERROR '+newRequest.readyState;

                        }

                    }

                    // SEND NULL
                    newRequest.send(dataPOST);

                }else{

                    // ENABLE BUTTON
                    helcimToggleButton();

                    // SHOW ERROR
                    document.getElementById(helcimResultPaneName).innerHTML = /*helcimTranslate('ERROR')+': '+*/errors;
                    reject(helcimTranslate('ERROR')+': '+errors);

                }

            }

        }

    });

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - VALIDATE EMAIL
//////////////////////////////////////////////////////////////////////////////////////
function helcimValidateEmail(email) {

    // REGEX
    var re = /\S+@\S+\.\S+/;

    // RETURN RESULT
    return re.test(email);

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - VALIDATE CREDIT CARD NUMBER (original code by DiegoSalazar)
//////////////////////////////////////////////////////////////////////////////////////
function helcimValidateCardNumber(value){

    // ACCEPT ONLY DIGITS, DASHES OR SPACES

    // LUHN ALGORITHM
    var nCheck = 0;
    var nDigit = 0;
    var bEven = false;

    // LOOP
    for(var n = value.length - 1; n >= 0; n--){

        // SET VALUES
        var cDigit = value.charAt(n);
        var nDigit = parseInt(cDigit, 10);

        // CHECK FOR EVEN
        if(bEven){

            // CHECK FOR SOMETHING
            if((nDigit *= 2) > 9){

                // SUBSRACT 9
                nDigit -= 9;

            }

        }

        // INCREASE
        nCheck += nDigit;
        bEven = !bEven;

    }

    // RETURN
    return (nCheck % 10) == 0;

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - VALIDATE CREDIT CARD EXPIRY
//////////////////////////////////////////////////////////////////////////////////////
function helcimValidateCardExpiry(value){

    // CHECK LENGTH
    if(value.length == 4){

        // CHECK DIGITS
        if(value.match(/^[0-9]+$/) != null){

            return true;

        }else{

            return false;

        }

    }else{

        return false;

    }

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - VALIDATE CREDIT CARD CVV
//////////////////////////////////////////////////////////////////////////////////////
function helcimValidateCardCVV(value){

    // CHECK LENGTH
    if(value.length == 3 || value.length == 4){

        // CHECK DIGITS
        if(value.match(/^[0-9]+$/) != null){

            return true;

        }else{

            return false;

        }

    }else{

        return false;

    }

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - ENABLE AND DISABLE PROCESS BUTTON
//////////////////////////////////////////////////////////////////////////////////////
function helcimToggleButton(){

    var button = $helcimForm.querySelector('[type="submit"]');

    // CHECK FOR CURRENT STATUS
    if(button.disabled == true){

        // ENABLE
        button.html = helcimTranslate('Process Payment') ;
        button.disabled=false;

    }else{

        // DISABLE
        button.html = helcimTranslate(helcimTranslate('Processing, Please Wait')+'...') ;
        button.disabled=true;

    }

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - CHECK REQUIRED FIELDS
//////////////////////////////////////////////////////////////////////////////////////
function helcimRequiredFields(){

    // SET ERROR DEFAULT
    var errors = '';

    // CHECK FIELDS
    if(document.getElementById(helcimResultPaneName) == null){ errors = errors+'('+helcimResultPaneName+')'; }
    if(document.getElementById(helcimIdsHandlePrefix+'helcimToken') == null){ errors = errors+'(token)'; }
    if($helcimForm == null){

        // CHECK FOR SUBMITTION
        if((document.getElementById('woocommerce') != null && document.getElementById('woocommerce').value == 1)
            || (document.getElementById('dontSubmit') != null && document.getElementById('dontSubmit').value == 1)){

            // ALL GOOD, WOO COMMERCE FORM NAME IS checkout

        }else{

            // ERROR
            errors = errors+'(paymentForm)';

        }

    }

    // CHECK FOR ERRORS
    if(errors == ''){

        return true;

    }else{

        // ALERT
        window.alert('HELCIM REQUIRED FIELDS MISSING: '+errors);

        return false

    }

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - CHECK PARSE XML TO FIELDS
//////////////////////////////////////////////////////////////////////////////////////
function helcimParseXMLtoFields(xmlObject){

    // SET DEFAULT
    var html = '';
    var loopCount;
    var fieldNames;
    var tempKey;
    var tempValue;

    // DESIRED FIELDS
    fieldNames = [
        'response',
        'responseMessage',
        'noticeMessage',
        'date',
        'time',
        'type',
        'amount',
        'cardHolderName',
        'cardNumber',
        'cardExpiry',
        'cardToken',
        'cardType',
        'transactionId',
        'avsResponse',
        'cvvResponse',
        'approvalCode',
        'orderNumber',
        'customerCode',
        'currency',
        'bankAccountType',
        'bankAccountCorporate',
        'bankAccountToken',
        'bankFinancialNumber',
        'bankTransitNumber',
        'bankAccountNumber',
        'xmlHash',
    ];

    var error = false;
    var message = '';
    // LOOP THROUGH ARRAY
    for(loopCount = 0; loopCount < fieldNames.length; ++loopCount){

        // GET ARRAY KEY AND VALUE
        tempKey = fieldNames[loopCount];
        tempValue = '';


        // CHECK FOR VALID XML CHILD
        if(xmlObject.getElementsByTagName(tempKey)[0] != null){

            // SET VALUE
            tempValue = '';

            // CHECK FOR VALID XML FIRST CHILD
            if(xmlObject.getElementsByTagName(tempKey)[0].firstChild != null){

                // CHECK FOR VALID XML FIRST CHILD VALUE
                if(xmlObject.getElementsByTagName(tempKey)[0].firstChild.nodeValue != null){

                    // SET VALUE
                    tempValue = xmlObject.getElementsByTagName(tempKey)[0].firstChild.nodeValue;

                }

            }
            if(tempKey =='orderNumber'){
                tempKey = '_orderNumber';

            }
            if(tempKey =='response' && tempValue=='0'){
                error = true;

            }
            if(tempKey =='responseMessage'){
                message = tempValue;

            }


            // DRAW HTML
            html = html+'<input type="hidden" name="'+tempKey+'" id="'+tempKey+'" value="'+tempValue+'">';

            html = html+'<input type="hidden" name="paymentForm[helcim]['+tempKey+']" id="'+tempKey+'" value="'+tempValue+'">';
            // CHECK
            if(tempKey == 'xmlHash' && typeof xmlObject.getElementsByTagName(tempKey)[0] != 'undefined'){

                // REMOVE XML HASH
                hash = xmlObject.getElementsByTagName(tempKey)[0];
                xmlObject.documentElement.removeChild(hash);

            }

        }

    }


    // CONVERT XML OBJECT TO STRING
    var xmlString = new XMLSerializer().serializeToString(xmlObject.documentElement);

    // REPLACE SELF CLOSING TAGS WITH START AND END TAGS
    xmlString = helcimFormatXML(xmlString);

    // SET
    tempKey = 'includeXML';

    if(xmlObject.getElementsByTagName(tempKey)[0] == null || xmlObject.getElementsByTagName(tempKey)[0].firstChild == null || xmlObject.getElementsByTagName(tempKey)[0].firstChild.nodeValue == null || xmlObject.getElementsByTagName(tempKey)[0].firstChild.nodeValue == 1){

        // PUT XML RESPONSE IN INPUT FIELD
        html = html+'<input type="hidden" name="xml" id="xml" value="'+xmlString+'">';

    }

    if(error){
        html = message;
        helcimToggleButton();
    }

    // RETURN
    return {html:html,error:error};

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - CHECK IF TRANSACTION WAS APPROVED
//////////////////////////////////////////////////////////////////////////////////////
function helcimCheckForApproval(xmlObject){

    // CHECK FOR VALID FIELD
    if(xmlObject.getElementsByTagName('response')[0] != null){

        // CHECK FOR VALID FIELD
        if(xmlObject.getElementsByTagName('response')[0].firstChild != null){

            // CHECK RESPONSE
            if(xmlObject.getElementsByTagName('response')[0].firstChild.nodeValue != null){

                // CHECK RESPONSE
                if(xmlObject.getElementsByTagName('response')[0].firstChild.nodeValue == '1'){

                    return true;

                }else{

                    return false;

                }

            }else{

                return false;

            }

        }else{

            return false;

        }

    }else{

        return false;

    }

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - CHECK IF TRANSACTION WAS APPROVED
//////////////////////////////////////////////////////////////////////////////////////
function helcimGetReponseMessage(xmlObject){

    // CHECK FOR VALID FIELD
    if(xmlObject.getElementsByTagName('responseMessage')[0].firstChild != null){

        return xmlObject.getElementsByTagName('responseMessage')[0].firstChild.nodeValue;

    }else{

        return 'ERROR: NO RESPONSE DATA';

    }

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - CHECK IF BROWSER CAN HANDLE CROSS-SITE DATA
//////////////////////////////////////////////////////////////////////////////////////
function helcimCheckBrowserSupport(){

    // CHECK FOR CORS SUPPORT WITH CREDENTIALS
    if('withCredentials' in new XMLHttpRequest()){

        // SUPPORTED
        return true;

    }else{

        // NOT SUPPORTED
        return false;

    }

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - CHECK IF SSL CONNECTION IS PRESENT
//////////////////////////////////////////////////////////////////////////////////////
function helcimCheckSSL(){

    // CHECK FOR SSL CONNECTION
    if(document.location.protocol === 'https:'){

        // SECURE
        return true;

    }else{

        // NOT SECURE
        return false;

    }

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - CLEAN CARDHOLDER DATA
//////////////////////////////////////////////////////////////////////////////////////
function helcimCleanCardData(){

    // CLEAN CARD
    if(document.getElementById(helcimIdsHandlePrefix+'cardNumber') != null){ document.getElementById(helcimIdsHandlePrefix+'cardNumber').value = ''; }
    if(document.getElementById(helcimIdsHandlePrefix+'cardExpiry') != null){ document.getElementById(helcimIdsHandlePrefix+'cardExpiry').value = ''; }
    if(document.getElementById(helcimIdsHandlePrefix+'cardExpiryMonth') != null){ document.getElementById(helcimIdsHandlePrefix+'cardExpiryMonth').value = ''; }
    if(document.getElementById(helcimIdsHandlePrefix+'cardExpiryYear') != null){ document.getElementById(helcimIdsHandlePrefix+'cardExpiryYear').value = ''; }
    if(document.getElementById(helcimIdsHandlePrefix+'cardCVV') != null){ document.getElementById(helcimIdsHandlePrefix+'cardCVV').value = ''; }


} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - SET LANGUAGE
//////////////////////////////////////////////////////////////////////////////////////
function helcimSetLanguage(){

    // UPDATE FORM ID
    helcimUpdateFormId();

    // SET
    var formObject = $helcimForm;

    // CHECK FORM
    if(formObject != null){

        // SET
        var languageObject = formObject.elements['language'];

        // CHECK LANGUAGE
        if(languageObject != null){

            // CHECK VALUE
            if(typeof languageObject.value == 'string'){

                // SET TEMP LANGUAGE
                var languageValue = languageObject.value;

                // TO LOWER
                languageValue = languageValue.toLowerCase();

                // TRIM
                languageValue = languageValue.trim();

                // CHECK FOR VALID LANGUAGE
                if(languageValue == 'fr'){ language = languageValue; }
                else if(languageValue == 'sp'){ language = languageValue; }
                else if(languageValue == 'en'){ language = languageValue; }

            }

        }

    }


} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - GET ERROR
//////////////////////////////////////////////////////////////////////////////////////
function helcimTranslate(message){

    // SET
    var messageResult = message;
    var messageLowerCase = message.toLowerCase();
    var messages = [];
    messages['YOUR BROWSER IS NOT SUPPORTED'.toLowerCase()] = {
        'fr':'VOTRE NAVIGATEUR N\'EST PAS COMPATIBLE',
        'sp':'SU NAVEGADOR NO ES COMPATIBLE'
    };
    messages['CONNECTING'.toLowerCase()] = {
        'fr':'CONNEXION',
        'sp':'CONECTANDO'
    };
    messages['ERROR'.toLowerCase()] = {
        'fr':'ERREUR',
        'sp':'ERROR'
    };
    messages['COMMUNICATION ERROR'.toLowerCase()] = {
        'fr':'ERREUR: PROBLÃˆME DE COMMUNICATION',
        'sp':'ERROR DE COMUNICACION'
    };
    messages['INVALID HELCIM.JS TOKEN'.toLowerCase()] = {
        'fr':'HELCIM.JS JETON NON VALIDE',
        'sp':'TOKEN HELCIMJS INVALIDO'
    };
    messages['INVALID CUSTOMER CODE'.toLowerCase()] = {
        'fr':'CODE DU CLIENT NON VALIDE',
        'sp':'CODIGO DE CLIENTE INVALIDO'
    };
    messages['INVALID CREDIT CARD NUMBER'.toLowerCase()] = {
        'fr':'NUMÃ‰RO DE CARTE DE CRÃ‰DIT NON VALIDE',
        'sp':'NUMERO DE TARJETA DE CREDITO INVALIDO'
    };
    messages['INVALID CREDIT CARD EXPIRY'.toLowerCase()] = {
        'fr':'DATE Dâ€™EXPIRATION NON VALIDE',
        'sp':'FECHA DE EXPIRACION INVALIDA'
    };
    messages['INVALID CREDIT CARD CVV'.toLowerCase()] = {
        'fr':'VVC NON VALIDE',
        'sp':'NUMERO CVV DE TARJETA DE CREDITO INVALIDO'
    };
    messages['BROWSER SSL CERTIFICATE MISSING'.toLowerCase()] = {
        'fr':'CERTIFICAT DE NAVIGUATEUR SSL MANQUANT',
        'sp':'FALTA CERTIFICADO SSL DE NAVEGADOR'
    };
    messages['Processing, Please Wait'.toLowerCase()] = {
        'fr':'En traitement, Veuillez patienter',
        'sp':'Procesando, Favor de Esperar'
    };
    messages['Process Payment'.toLowerCase()] = {
        'fr':'Traiter la Transaction',
        'sp':'Procesar Transaccion'
    };

    // CHECK MESSAGE
    if(typeof messages[messageLowerCase] != 'undefined'){

        // CHECK ERROR BY LANGUAGE
        if(typeof messages[messageLowerCase][language] != 'undefined'){

            // CHECK LENGTH
            if(messages[messageLowerCase][language].length > 0){

                // USE TRANSLATED
                message = messages[messageLowerCase][language];

            }

        }

    }

    // RETURN
    return message;

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - GET FORM ID
//////////////////////////////////////////////////////////////////////////////////////
function helcimUpdateFormId(){

    // CHECK TOKEN
    if(document.getElementById('token') != null){

        // CHECK FORM
        if(document.getElementById('token').form != null && document.getElementById('token').form.tagName == 'FORM'){

            // CHECK FORM ID
            if(typeof document.getElementById('token').form.id == 'string' && document.getElementById('token').form.id.length > 0){

                // UPDATE FORM ID
                formId = document.getElementById('token').form.id;

            }

        }

    }

} // END FUNCTION

//////////////////////////////////////////////////////////////////////////////////////
// FUNCTION - FORMAT XML
//////////////////////////////////////////////////////////////////////////////////////
function helcimFormatXML(xmlString){

    // MATCHES <selfClosingTag1/>
    var pattern = /<([a-z]+[a-z0-9]*)\/>/ig;

    // REPLACE SELF CLOSING TAGS WITH START AND END TAGS
    // <selfClosingTag1></selfClosingTag1>
    var updatedXMLString = xmlString.replace(pattern,"<$1></$1>");

    // RETURN
    return updatedXMLString;

} // END FUNCTION


document.selectedCard = "";
const all_cards = $helcimForm.querySelectorAll(".card-number-input img");
function checkNumHighlight(strNum) {
    //console.log(strNum)
    previewCCResult(strNum);
    if (document.selectedCard == "") {
        var cctype = highlightCard(strNum);
        console.log(cctype)
        if (cctype != false) {

            document.selectedCard = cctype;
            [...all_cards].forEach((el)=>{
                el.style.display='none'
            })
            $helcimForm.querySelector(".card-number-input img[data-id='"+cctype+"']").style.display='inline-block';


        }
    } else if (strNum == "") {
        [...all_cards].forEach((el)=>{
            el.style.display='none'
        })
        $helcimForm.querySelector(".card-number-input img[data-id='card']").style.display='inline-block';
        document.selectedCard = "";
    }

}

function previewCCResult(strNum) {
    if(strNum.length > 15) {
        if (isValidCardNumber(strNum) && strNum.length > 13) {

           helcimResultPaneName.html='';
        } else {

            helcimResultPaneName.html ='Invalid Card Number';
        }
    }else{

        helcimResultPaneName.html='';
    }
}

function isValidCardNumber(strNum) {
    var nCheck = 0;
    var nDigit = 0;
    var bEven = false;

    for (let n = strNum.length - 1; n >= 0; n--) {
        var cDigit = strNum.charAt(n);
        if (isDigit(cDigit)) {
            nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9)
                    nDigit -= 9;
            }
            nCheck += nDigit;
            bEven = !bEven;
        } else if (cDigit != ' ' && cDigit != '.' && cDigit != '-') {
            return false;
        }
    }
    return (nCheck % 10) == 0;
}

function highlightCard(strNum) {

    if ((strNum.substring(0, 1) == '4')) {
        return "visa";
    } else if ((strNum.substring(0, 2) == '34' || strNum.substring(0, 2) == '37')) {
        return "amex";
    } else if ((strNum.substring(0, 2) == '51' || strNum.substring(0, 2) == '52'
        || strNum.substring(0, 2) == '53' || strNum.substring(0, 2) == '54'
        || strNum.substring(0, 2) == '55')) {
        return "mc";
    } else if ((strNum.substring(0, 4) == '6011' || strNum.substring(0, 3) == '622'
        || strNum.substring(0, 2) == '64' || strNum.substring(0, 2) == '65')) {
        return "disc";
    } else if ((strNum.substring(0, 3) == '300' || strNum.substring(0, 3) == '301' || strNum.substring(0, 3) == '302' || strNum.substring(0, 3) == '303' || strNum.substring(0, 3) == '304'
        || strNum.substring(0, 3) == '305' || strNum.substring(0, 2) == '36' || strNum.substring(0, 2) == '38')) {
        return "DI";
    } else {
        return false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.card-number-input input').addEventListener('keypress',ev=>{
        checkNumHighlight(ev.currentTarget.value);
    })
});
if($helcimForm.paymentAmount){
    console.log($helcimForm.paymentAmount)
    $helcimForm.paymentAmount.readOnly = true;
}
function isDigit(c) {
    var strAllowed = "1234567890";
    return (strAllowed.indexOf(c) != -1);
}