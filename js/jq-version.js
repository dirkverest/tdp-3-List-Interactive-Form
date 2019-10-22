// JQuery VERSION

// =====================================
// LIST OF VARIABLES
// =====================================
// Form
const regForm          = document.querySelector('form');
// Form Basic Info
const nameInput         = document.querySelector('input#name');
const emailInput        = document.querySelector('input#mail');
// IN JQUERY => 
const $titleDropDown    = $('select#role');
const $otherJobTitle    = $('input#otherrole');
// IN JQUERY =>  Form T-Shirt info
const $designDropDown   = $('select#design');
const $colorDiv         = $('#colors-js-puns');
const $colorSelect      = $('select#color');
const $colorOptions     = $('select#color option');
const selectTheme       = document.createElement('OPTION'); //Add instructions to color color field
// Form Register Activities Section
const activities        = document.querySelector('fieldset.activities');
const activitiesCheck   = activities.querySelectorAll('input[type="checkbox"]'); //limits the selection to the activity checkboxes
const activityTotal     = document.createElement('P'); // Add total cost element
const totalCost         = document.createElement('SPAN'); // Add
let   calcCost          = 0; // Set standard fee 
// Form Payment Info
const paymentOptions    = document.querySelector('#payment');
const creditCard        = document.querySelector('#credit-card');
const payPal            = document.querySelector('#paypal');
const bitCoin           = document.querySelector('#bitcoin');
const CardNumberInput   = document.querySelector('input#cc-num');
const CardZipInput      = document.querySelector('input#zip');
const CardCcvInput      = document.querySelector('input#cvv');
// Form Regular Expressions
const rxName        = /^[A-Za-z.\s_-]+$/i;
const rxEmail       = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const rxCardNumber  = /\d{13,16}/; 
const rxCardZip     = /\d{5}/;
const rxCardCcv     = /\d{3}/;
const ccCheck       = /credit/i;
const ppCheck       = /paypal/i;
const bcCheck       = /bitcoin/i;

// =====================================
// Disable HTML validation if JS loads
// =====================================
regForm.setAttribute('novalidate', '');

// =====================================
// General functions
// =====================================
// Hide element function
function hideElement(hideThis) {
    hideThis.style.display = 'none';
};
// Show element function
function showElement(showThis) {
    showThis.style.display = 'inline-block';
};

// =====================================
// IN JQUERY => Basisc info Section
// =====================================
// Set focus on Name Input Element
window.onload = ()=>{
    nameInput.focus();
};

// Show/Hide Other Job Role Input Element on Job Role Selection
$otherJobTitle.hide();
$titleDropDown.on('change', function(e) {
    if (e.target.value === 'other') {
        $otherJobTitle.fadeIn();
    } else {
        $otherJobTitle.fadeOut();
    }
});

// =====================================
// IN JQUERY =>  T-Shirt info Section
// =====================================
$colorOptions[0].before(selectTheme); // Create color dropdown instrunction element
$colorSelect.hide(); // Hide Color Option

// Show/Hide Color options based on slected theme
function themeBasedColor(selection) {
    selectTheme.textContent = 'Select a T-Shirt Color';
    $('select#color>option:eq(0)').prop('selected', true);
    $colorOptions.each(function(index, child) {
        if (selection.test($(child).text()) === false) {
            $(child).prop("disabled", true);
            $(child).hide();
        } else {
            $(child).prop("disabled", false);
            $(child).show();
        }
    });
    $colorSelect.fadeIn();
};

// Add Theme based functionality to the design dropdown
$designDropDown.on('change', (e) => {
    // Filter options based on design name and color name (in case more color options will be added later)
    const rexDesignPuns = /(JS)\s(Puns)/i;
    const rexDesignHeart = /JS.?(?!.?puns)/i;
    if (rexDesignPuns.test($designDropDown.val()) === true) {
        themeBasedColor(rexDesignPuns);
    } else if (rexDesignHeart.test($designDropDown.val()) === true) {
        themeBasedColor(rexDesignHeart);
    } else { //Only used if entire color DIv will not be hidden
        selectTheme.textContent = 'Please select a T-shirt theme';
        $('select#color>option:eq(0)').prop('selected', true);
        $colorOptions.each(function(index, child) {
            $(child).prop("disabled", true);
            $(child).show();
        });
        $colorSelect.hide();
    }
});

// =====================================
// Register Activities Section
// =====================================
// Calculate and Display Total Fee
function calcTotalFee (addOrSubtract, target) {
    let usedCurrency        = '';
    const checkCurrency     = /^./;
    const removeDollar      = /^\$/; 
    const classPrice        = parseInt(target.getAttribute('data-cost').replace(removeDollar, ''));
    // Change total currency symbol based on input currency
    usedCurrency = checkCurrency.exec(target.getAttribute('data-cost')); //Change Currency
    // Calculate fee based on selection
    if (addOrSubtract === 'add') {
        calcCost += classPrice;
    } else if (addOrSubtract === 'subtract') {
        calcCost -= classPrice;
    }
    activityTotal.innerHTML = '<span>Total Cost: ' + usedCurrency + calcCost + '</span>';;
    activities.appendChild(activityTotal)
};

// Disable/Enable options
function availableActivities(target, active, textColor, textDec) {
    for (let i = 0; i < activitiesCheck.length; i ++) {
        if (target.getAttribute('data-day-and-time') === activitiesCheck[i].getAttribute('data-day-and-time')) {
            if (target != activitiesCheck[i]) {
                activitiesCheck[i].disabled = active;
                activitiesCheck[i].parentNode.style.color = textColor;
                activitiesCheck[i].parentNode.style.textDecoration = textDec;
            }
        }
    }
};

// Selection based options and Total Fee
activities.addEventListener('change', (e) => {
    // Disable competing option on selection
    if (e.target.checked == true ) {
        calcTotalFee('add', e.target);
        availableActivities(e.target, true, 'rgba(255, 0, 0, 0.5)', 'line-through');
        activities.firstElementChild.style.color = 'black';
    }
    // Enable competing option on deselection
    if (e.target.checked == false ) {
        calcTotalFee('subtract', e.target);
        availableActivities(e.target, false, 'black', 'none');
    }
    if (calcCost <= 0) {
        activities.firstElementChild.nextElementSibling.style.display = "inherit";
    } else {
        activities.firstElementChild.nextElementSibling.style.display = "none";
    }
});

// =====================================
// Payment Info Section
// =====================================
// Hide all Payment options
function hidePSP() {
    hideElement(creditCard);
    hideElement(payPal);
    hideElement(bitCoin);
};
hidePSP();

// If available, set Credit Card as default option and remove the select payment option instructions
for (let i = 0; i < paymentOptions.children.length; i ++) {
    if (ccCheck.test(paymentOptions.children[i].value) === true ) {
        paymentOptions.selectedIndex = [i];
        showElement(creditCard);
        hideElement(paymentOptions.children[0]);
    }
};

// Manually select a payment option
paymentOptions.addEventListener('change', (e) => {
    hidePSP();
    if (ccCheck.test(paymentOptions.value) === true) {
        showElement(creditCard);
    } else if (ppCheck.test(paymentOptions.value) === true) {
        showElement(payPal);
    } else if (bcCheck.test(paymentOptions.value) === true) {
        showElement(bitCoin);
    };
});

// =====================================
// REAL-TIME Validation
// =====================================

// Error Message
function fieldMessage(element) {
    if (element === nameInput) {
        element.nextElementSibling.textContent = 'Name can contain only letters';
    } 
    if (element === emailInput) {
        element.nextElementSibling.textContent = 'Must be a valid email address';
    } 
    if (element === CardNumberInput) {
        element.nextElementSibling.textContent = 'Enter between 13 and 16 digits';
    } 
    if (element === CardZipInput) {
        element.nextElementSibling.textContent = 'Enter 5 digits';
    } 
    if  (element === CardCcvInput) {
        element.nextElementSibling.textContent = 'Enter 3 digits';
    }  
}

// Show or hide Input Instructions (also used for ON-SUBMIT Validation)
function showInputInstr(showTip, element) {
  // show element when show is true, hide when false
  if (showTip) {
    fieldMessage(element);
    element.nextElementSibling.style.display = "inherit";
    element.style.boxShadow = 'none';
    if (element.hasAttribute('placeholder')) {
        element.setAttribute('placeholder', '');
    }
  } else {
    element.nextElementSibling.style.display = "none";
    element.style.boxShadow = 'none';
    if (element.hasAttribute('placeholder')) {
        element.setAttribute('placeholder', '');
    }
  }
};

// Create Listerner for addEventListener and execute show or hide Input Instructions
function createListener(rxValue) {
  return e => { // Execute function on selected listener (input field)
    const inputValue = e.target.value; // Get value of selected input field
    const correctInput = rxValue.test(inputValue); // Test if inout is correct
    const showTip = inputValue !== "" && !correctInput; // Return false on incorect or empty input
    const tipBox = e.target; // Select span.alertmssg
    showInputInstr(showTip, tipBox); // Show or span.alertmssg 
  }
};

// Check input validity for available fields
nameInput.addEventListener("input", createListener(rxName));
emailInput.addEventListener("input", createListener(rxEmail));
CardNumberInput.addEventListener("input", createListener(rxCardNumber));
CardZipInput.addEventListener("input", createListener(rxCardZip));
CardCcvInput.addEventListener("input", createListener(rxCardCcv));


// =====================================
// ON SUBMIT Validation
// =====================================

// Check for empty fields
function validateInput(field, rxValue) {
    if (field.value === '') {
        field.style.boxShadow = '0 0 5px 1px red';
        field.setAttribute('placeholder', 'Can\'t be empty');
        field.nextElementSibling.textContent = 'Field can not be empty';
        field.nextElementSibling.style.display = "inherit";
        field.focus();
        return false;
    } else if (field.value != '' && rxValue.test(field.value) === false ) {
        field.style.boxShadow = '0 0 5px 1px red';
        field.focus();
        return false;
    } else {
        return true;
    }
};

// Check for correct input 
function falseInput(field, rx) {
    const inputValue = field.value; // Get value of selected input field
    const correctInput = rxValue.test(inputValue); // Test if inout is correct
    const showTip = !correctInput; // Return false on incorect or empty input
    const tipBox = field; // Select span.alertmssg
    showInputInstr(showTip, tipBox); // Show or span.alertmssg
    field.style.boxShadow = '0 0 5px 1px red';
    field.focus();
    return false;
};

// Validate checkboxes (Activities)
function validateActivities() {
    const activitiesChecked   = activities.querySelectorAll('input[type="checkbox"]:checked');
    if (activitiesChecked.length === 0) {
        activities.firstElementChild.style.color = 'red';
        activities.firstElementChild.nextElementSibling.style.display = "inherit";
        return false;
    }
};

// Validate Form on submit
regForm.addEventListener('submit', function(e) {
    if (ccCheck.test(paymentOptions.value) === true) {
        if (validateInput(CardCcvInput, rxCardCcv) === false) {
            e.preventDefault();
        }
        if (validateInput(CardZipInput, rxCardZip) === false) {
            e.preventDefault();
        }
        if (validateInput(CardNumberInput, rxCardNumber) === false) {
            e.preventDefault();
        }
    }
    if (validateInput(emailInput, rxEmail) === false) {
         e.preventDefault();
    }
    if (validateInput(nameInput, rxName) === false) {
         e.preventDefault();
    }
    if (validateActivities() === false) {
         e.preventDefault();
    }

});