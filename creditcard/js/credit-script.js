// lazyload fonts
document.body.onload = (function loadFonts(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
})('https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700');

(function initCreditForm() {
  var creditForm = {
    init: function formInit() {
      this.cacheDOM();
      this.disableMonths();
      this.events();
    },
    cacheDOM: function cDOM() {
      this.today = new Date();
      this.thisMonth = this.today.getMonth();
      this.thisYear = this.today.getFullYear();
      this.name = document.getElementById('cardholder');
      this.cardNumber = document.getElementById('cardnum');
      this.cvc = document.getElementById('cvc');
      this.month = document.getElementById('exp-month');
      this.year = document.getElementById('exp-year');
      this.submitBtn = document.getElementById('submit-btn');
    },
    // handle invalid input appearance and display message
    invalidInput: function invalidInpFunc(el, msg) {
      var msgEl = el.querySelector('.invalid-msg');

      el.classList.add('invalid-input');
      msgEl.textContent = msg;
    },
    // if previously invalid, checks to see if input is now valid
    isNowValid: function nowValidFunc(el, valid) {
      if (valid) {
        el.classList.remove('invalid-input');
      }
    },
    checkName: function validName(el) {
      var split = el.value.trim().split(' ');

      return split.filter(function(name) {
        return name.length >= 2;
      }).length > 1;
    },
    validateCVC: function cvc(el) {
      var code = el.value.trim();
      var char;
      // assume valid unless test fails
      var valid = true;

      if (code.length === 3) {
        // make sure each character is a digit
        for (var i = 0, l = code.length; i < l; i++) {
          char = el.value.charCodeAt(i);
          if (char < 48 || char > 57) {
            valid = false;
          }
        }
      } else {
        valid = false;
      }
      
      return valid;
    },
    // if current year is selected, disable all months before this month
    // set month to current month automatically (avoids errors when user changes years)
    disableMonths: function dMonths() {
      var options = this.month.querySelectorAll('option');

      if (this.year.value == this.thisYear) {
        for (var i = 0, l = options.length; i < l; i++) {
          if (options[i].textContent.slice(0, 2) < this.thisMonth + 1) {
            options[i].setAttribute('disabled', 'true');
          }
        }
      }
      // auto selects the current month so selecting an expired date is not possible
      this.month.selectedIndex = this.thisMonth;
      this.monthsDisabled = true;
    },
    // if months disabled and a year after current is selected, enable all months
    enableMonths: function dMonths() {
      var options = this.month.querySelectorAll('option');

      for (var i = 0, l = options.length; i < l; i++) {
        options[i].removeAttribute('disabled');
      }
      this.monthsDisabled = false;
    },
    monthsDisabled: false,
    checkExpiration: function checkExp(field) {
      var dateComp = 'field' === 'month' ? this.thisMonth : this.thisYear;

      if (this[field].value == dateComp) {
        this.disableMonths();
      } else if (this.monthsDisabled) {
        this.enableMonths();
      }
    },
    allInputsValid: function validInp() {
      var v_name = this.checkName(this.name);
      var v_cc = validator.isCreditCard(this.cardNumber.value);
      var v_cvc = this.validateCVC(this.cvc);
      console.log(validator);
      console.log(this.cardNumber.value.length);
      if (!v_name) {
        this.invalidInput(this.name.parentNode, 'cardholder\'s full name required');
      }
      if (!v_cc) {
        this.invalidInput(this.cardNumber.parentNode, 'must be 16 characters [0-9][a-z]; dashes allowed');
      }
      if (!v_cvc) {
        this.invalidInput(this.cvc.parentNode, 'CVC code must be 3 digits');
      }

      return v_name && v_cc && v_cvc;
    },
    events: function formEvents() {
      var context = this;

      /***
        CARDHOLDER VALIDATION
      ***/
      this.name.addEventListener('blur', function() {
        if (!context.checkName(this)) {
          context.invalidInput(this.parentNode, 'cardholder\'s full name required');
        }
      }, false);

      // handle previously invalid input
      this.name.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, context.checkName(this));
        } 
      }, false);

      /***
        CARD NUMBER VALIDATION
      ***/
      this.cardNumber.addEventListener('blur', function() {
        if (!validator.isCreditCard(this.value)) {
          context.invalidInput(this.parentNode, 'must be 16 characters [0-9][a-z]; dashes allowed');
        }
      }, false);

      // handle previously invalid input
      this.cardNumber.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, validator.isCreditCard(this.value));
        } 
      }, false);

      /***
        CVC VALIDATION
      ***/
      this.cvc.addEventListener('blur', function() {
        if (!context.validateCVC(this)) {
          context.invalidInput(this.parentNode, 'CVC code must be 3 digits');
        }
      }, false);

      // handle previously invalid input
      this.cvc.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, context.validateCVC(this));
        } 
      }, false);

      /***
        EXP MONTH VALIDATION
      ***/
      this.month.addEventListener('blur', function() {
        context.checkExpiration('month');
      }, false);

      this.month.addEventListener('input', function() {
        context.checkExpiration('month');
      }, false);

      /***
        EXP YEAR VALIDATION
      ***/
      this.year.addEventListener('blur', function() {
        context.checkExpiration('year');
      }, false);

      this.year.addEventListener('input', function() {
        context.checkExpiration('year');
      }, false);

      /***
        SUBMISSION VALIDATION
      ***/
      this.submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        context.allInputsValid();
      }, false); 
    }   
  };
  // init form module
  creditForm.init();
})();