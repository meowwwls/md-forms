// lazyload fonts
document.body.onload = (function loadFonts(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
})('https://fonts.googleapis.com/css?family=Roboto:300,400,600|Libre+Baskerville:400italic,400|Libre+Baskerville:400italic,400');

(function initSchedulingForm() {
  var scheduling = {
    init: function formInit() {
      this.cacheDOM();
      this.events();
    },
    cacheDOM: function cDOM() {
      this.date = document.getElementById('date');
      this.time = document.getElementById('time');
      this.timeRow = document.getElementById('time-row');
      this.phone = document.getElementById('phone');
      this.email = document.getElementById('email');
      this.form = document.getElementById('scheduling-form');
    },
    // handle invalid input appearance and display message
    invalidInput: function invalidInpFunc(el, msg) {
      var msgEl = el.querySelector('.invalid-msg');

      el.classList.add('invalid-input');
      msgEl.style.display = 'block';
      msgEl.textContent = msg;
    },
    // if previously invalid, checks to see if input is now valid
    isNowValid: function nowValidFunc(el, valid) {
      if (valid) {
        el.classList.remove('invalid-input');
        el.querySelector('.invalid-msg').style.display = 'none';
      }
    },
    // convert 12 hour pm input to 24 hr time in browsers without time input
    // else returns time value
    editTime: function time() {
      var timeV = this.time.value.toLowerCase().replace(/\./g, '');
      var slice = timeV.charAt(0) === '0' ? timeV.slice(3, 5) : timeV.slice(2, 4);
      var int = parseInt(timeV.slice(0, 2));
      
      if (timeV.indexOf('pm') > -1) {
        int = int === 12 ? 12 : int + 12;
        return int + ':' + slice;
      }

      return this.time.value;
    },
    // create a new date from time and date input
    buildDate: function bDate() {
      var dateEdit = this.date.value.replace(/-/g, '/');
      var datePicked = new Date(dateEdit + ' ' + this.editTime());

      return datePicked;
    },
    // make sure date picked is after tomorrow
    fullDateAfter: function fullDayfter() {
      var today = new Date();
      var tomorrow = new Date(today.toString().slice(4, 7) + ' ' + (today.getDate() + 1) + ' ' + today.getFullYear() + ' 09:00');
      var datePicked = this.buildDate();
      var pickedHour = datePicked.getHours();
      return validator.isAfterDate(datePicked, tomorrow) && pickedHour > 9 && pickedHour < 17;
    },
    handleDate: function dateHandler() {
      var tdEl = this.timeRow.parentNode;
      
      // if time and date have input, make sure both are after right now
      if (this.time.value && this.date.value) {
        if (!validator.isDate(this.buildDate())) {
          this.invalidInput(tdEl, 'Not a valid date and time. Date should be in the format mm/dd/yyyy and time should be in the format hh:mm (am/pm)');
        } else if (!this.fullDateAfter()) {
          this.invalidInput(tdEl, 'Appointments must be scheduled at least a day in advance. Appointment hours are 9:00 a.m. to 5:00 p.m.');
        }
      }
      // if date has input but time does not
      else if (this.date.value && !this.time.value) {
        this.invalidInput(tdEl, 'Time is required. Appointment hours are 9:00 a.m. to 5:00 p.m.');
      }
      // if time has input but date does not
      else if (this.time.value && !this.date.value) {
        this.invalidInput(tdEl, 'Date is required. Same day appointments are not accepted.');
      }
      // if time and date are both empty
      else if (!this.time.value && !this.date.value) {
        this.invalidInput(tdEl, 'Date and time are both required. Appointments must be scheduled at least a day in advance. Appointment hours are 9:00 a.m. to 5:00 p.m.');
      }
    },
    allInputsValid: function validInp() {
      var v_date = validator.isDate(this.buildDate());
      var v_phone = validator.isPhoneNumber(this.phone.value);
      var v_email = validator.isEmailAddress(this.email.value);
      
      if (!v_date || !this.date.value || !this.time.value) {
        this.handleDate();
      }
      if (!v_phone) {
        this.invalidInput(this.phone.parentNode, 'Not a valid US phone number.');
      }
      if (!v_email) {
        this.invalidInput(this.email.parentNode, 'Not a valid email address.');
      }

      return v_date && v_phone && v_email;
    },
    events: function formEvents() {
      var context = this;

      /***
        TIME VALIDATION
      ***/
      this.time.addEventListener('blur', function() {
        context.handleDate();
      }, false);

      // handle previously invalid input
      this.time.addEventListener('input', function(e) {
        var p = context.timeRow.parentNode;

        if (p.classList.contains('invalid-input') && context.time.value && context.date.value) {
          context.isNowValid(p, validator.isDate(context.buildDate()));
          context.isNowValid(p, context.fullDateAfter());
          context.isNowValid(p, context.date.value && context.time.value);
        }
      }, false);

      /***
        DATE VALIDATION
      ***/
      this.date.addEventListener('blur', function() {
        context.handleDate();
      }, false);

      // handle previously invalid input
      this.date.addEventListener('input', function(e) {
        var p = context.timeRow.parentNode;
        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, context.fullDateAfter());
        } 
      }, false);

      /***
        PHONE NUMBER VALIDATION
      ***/
      this.phone.addEventListener('blur', function() {
        if (!validator.isPhoneNumber(this.value)) {
          context.invalidInput(this.parentNode, 'Not a valid US phone number.');
        }
      }, false);

      // handle previously invalid input
      this.phone.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, validator.isPhoneNumber(this.value));
        } 
      }, false);

      /***
        E-MAIL VALIDATION EVENTS
      ***/

      // validate input on blur
      this.email.addEventListener('blur', function() {
        if (!validator.isEmailAddress(this.value)) {
          context.invalidInput(this.parentNode, 'Not a valid email address.');
        }
      }, false);

      // handle previously invalid input
      this.email.addEventListener('input', function() {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, validator.isEmailAddress(this.value));
        } 
      }, false);
  
      /***
        SUBMISSION VALIDATION
      ***/
      this.form.addEventListener('submit', function(e) {
        e.preventDefault();
        context.allInputsValid();
      }, false); 
    }   
  };
  // init form module
  scheduling.init();
})();