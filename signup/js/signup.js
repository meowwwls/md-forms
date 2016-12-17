// lazyload fonts
document.body.onload = (function loadFonts(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
})('https://fonts.googleapis.com/css?family=Playfair+Display:400,400italic|Cutive+Mono');

(function initSignupForm() {
  var signupForm = {
    init: function formInit() {
      this.cacheDOM();
      this.events();
    },
    cacheDOM: function cDOM() {
      this.form = document.getElementById('this-form');
      this.fullName = document.getElementById('full-name');
      this.dob = document.getElementById('dob');
      this.email = document.getElementById('email');
      this.pass = document.getElementById('password');
      this.passConfirm = document.getElementById('password-con');
      this.form = document.getElementById('signup-form');
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
    // make sure full name is at least two words, each being at least 2 chars
    checkName: function validName(el) {
      var split = el.value.trim().split(' ');

      return split.filter(function(name) {
        return name.length >= 2;
      }).length > 1;
    },
    // handle different cases with DOB
    handleDOB: function dobHandler(el) {
      var con = this.confirmDOB(el);

      if (!con) {
        this.invalidInput(el.parentNode, 'invalid birthday — try the format: mm/dd/yyyy');
      } else if (con === 'future date') {
        this.invalidInput(el.parentNode, 'birthday must not be a future date');
      } else if (con === 'not old enough') {
        this.invalidInput(el.parentNode, 'must be 14 or older to register');
      }
    },
    // test DOB for validity and age
    confirmDOB: function dob(el) {
      var str = el.value.trim();
      var d = validator.isDate(str);
      var today = new Date();
      // if a valid date
      if (d) {
        // make sure it's before today; if not, return a msg
        if (!validator.isBeforeToday(str, today)) {
          return 'future date';
        } else if (today.getFullYear() - new Date(str).getFullYear() < 14) {
          return 'not old enough';
        }
        return true;
      }
      return false;     
    },
    // returns true if passwords are DIFFERENT
    comparePasswords: function pWords() {
      var p1 = this.pass.value;
      var p2 = this.passConfirm.value;
      var different = p1 !== p2;
      var p1Parent = this.pass.parentNode;
      var p2Parent = this.passConfirm.parentNode;
      
      if (different) {
        this.invalidInput(p1Parent, 'passwords do not match');
        this.invalidInput(p2Parent, 'passwords do not match');
      } // if previously invalid, check validity upon new input
        else if ((p1Parent.classList.contains('invalid-input') || p2Parent.classList.contains('invalid-input')) && !different) {
        this.isNowValid(p1Parent, p1 === p2);
        this.isNowValid(p2Parent, p1 === p2);
      }

      return different;
    },
    // returns true if every input is valid when submit button is clicked
    allInputsValid: function submitCheck() {
      var v_name = this.checkName(this.fullName);
      var v_dob = this.confirmDOB(this.dob);
      var v_email = validator.isEmailAddress(this.email.value.trim());
      var v_pass = this.pass.value.trim().length >= 5;
      var v_passCon = this.passConfirm.value.trim().length > 0;
      var v_passMatch = this.comparePasswords();

      if (!v_name) {
        this.invalidInput(this.fullName.parentNode, 'please provide a first and last name');
      }
      if (!v_dob) {
        this.handleDOB(this.dob);
      }
      if (!v_email) {
        this.invalidInput(this.email.parentNode, 'this is not a valid email address');
      }
      if (!v_pass) {
        this.invalidInput(this.pass.parentNode, 'password must be at least 6 characters');
      } 
      if (!v_passCon) {
        this.invalidInput(this.passConfirm.parentNode, 'please confirm your password');
      }
      // comparePasswords func returns true if passwords are different
      if (v_pass && v_passMatch) {
        this.invalidInput(this.pass.parentNode, 'passwords do not match');
        this.invalidInput(this.passConfirm.parentNode, 'passwords do not match');
      } 

      return v_name && v_dob && v_email && v_pass && v_passCon && !v_passMatch;
    },
    events: function formEvents() {
      var context = this;
      /***
        FULL NAME VALIDATION EVENTS
      ***/

      // validate input on blur
      // make sure at least a first and last name are provided
      this.fullName.addEventListener('blur', function(e) {
        if (!context.checkName(this)) {
          context.invalidInput(this.parentNode, 'please provide a first and last name');
        }
      }, false);

      // handle previously invalid input
      this.fullName.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, context.checkName(this));
        } 
      }, false);

      /***
        D.O.B. VALIDATION EVENTS
      ***/

      // make sure dob is not in the future and person is 14 or older
      this.dob.addEventListener('blur', function(e) {
        context.handleDOB(this);
      }, false);

      // handle previously invalid input
      this.dob.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, context.confirmDOB(this));
        } 
      }, false);

      /***
        E-MAIL VALIDATION EVENTS
      ***/

      // validate input on blur
      this.email.addEventListener('blur', function(e) {
        if (!validator.isEmailAddress(this.value)) {
          context.invalidInput(this.parentNode, 'this is not a valid email address');
        }
      }, false);

      // handle previously invalid input
      this.email.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, validator.isEmailAddress(this.value));
        } 
      }, false);

      /***
        PASSWORD VALIDATION EVENTS
      ***/

      // validate input on blur
      // confirm password length and matching passwords
      this.pass.addEventListener('blur', function(e) {
        if (!validator.isOfLength(this.value, 6)) {
          context.invalidInput(this.parentNode, 'password must be at least 6 characters');
        } else if (context.passConfirm.value) {
          context.comparePasswords();
        }
      }, false);

      this.passConfirm.addEventListener('blur', function(e) {
        if (!validator.isOfLength(this.value, 6)) {
          context.invalidInput(this.parentNode, 'please confirm your password');
        } else {
          context.comparePasswords();
        }
      }, false);

      // handle previously invalid input
      this.pass.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input') && !context.passConfirm.value) {
          context.isNowValid(p, validator.isOfLength(this.value, 6));
        }
        if (context.passConfirm.value) {
          context.comparePasswords();
        }
      }, false);

      this.passConfirm.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input') && !context.pass.value) {
          context.isNowValid(p, context.comparePasswords());
        }
        if (context.pass.value) {
          context.comparePasswords();
        }
      }, false);


      /***
        FORM SUBMISSION VALIDATION EVENT
      ***/
      this.form.querySelector('.btn').addEventListener('click', function(e) {
        e.preventDefault();
        context.allInputsValid();
      }, false);
    }
  };

  // init form module
  signupForm.init();
})();