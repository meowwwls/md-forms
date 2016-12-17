// lazyload fonts
document.body.onload = (function loadFonts(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
})('https://fonts.googleapis.com/css?family=Roboto+Condensed:300');

(function initLoginForm() {
  var loginForm = {
    init: function formInit() {
      this.cacheDOM();
      this.events();
    },
    cacheDOM: function cDOM() {
      this.email = document.getElementById('email');
      this.password = document.getElementById('password');
      this.submit = document.getElementById('submit-login');
    },
    // handle invalid input appearance and display message
    invalidInput: function invalidInpFunc(el, msg) {
      var msgEl = el.querySelector('.invalid-msg');

      el.classList.add('invalid-input');
      msgEl.innerHTML = msg;
    },
    // if previously invalid, checks to see if input is now valid
    isNowValid: function nowValidFunc(el, valid) {
      if (valid) {
        el.classList.remove('invalid-input');
      }
    },
    // keeps the labels floated when input has value
    floatLabels: function float(el) {
      var p = el.parentNode.classList;

      if (el.value.trim() && !p.contains('float-label')) {
        p.add('float-label');
      }  else if (!el.value.trim() && p.contains('float-label')) {
        p.remove('float-label');
      }
    },
    // returns true if every input is valid when submit button is clicked
    allInputsValid: function submitCheck() {
      var v_email = validator.isEmailAddress(this.email.value);
      var v_password = !validator.isEmpty(this.password.value) && this.password.value.length >= 8;

      if (!v_email) {
        this.invalidInput(this.email.parentNode, 'e-mail is invalid');
      }
      if (!v_password) {
        this.invalidInput(this.password.parentNode, 'password must be at least 8 characters');
      }

      return v_email && v_password;
    },
    events: function formEvents() {
      var context = this;
      /***
        EMAIL VALIDATION EVENTS
      ***/

      // validate input on blur
      this.email.addEventListener('blur', function(e) {
        if (this.value && !validator.isEmailAddress(this.value)) {
          context.invalidInput(this.parentNode, 'e-mail is invalid');
        }
        context.floatLabels(this);
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
      this.password.addEventListener('blur', function(e) {
        if (validator.isEmpty(this.value) || this.value.length < 8) {
          context.invalidInput(this.parentNode, 'password must be at least 8 characters');
        } 
        context.floatLabels(this);
      }, false);

      // handle previously invalid input
      this.password.addEventListener('input', function(e) {
        var p = this.parentNode;
        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, this.value.length >= 8);
        } 
      }, false);

      /***
        FORM SUBMISSION VALIDATION EVENT
      ***/
      this.submit.addEventListener('click', function(e) {
        e.preventDefault();
        context.allInputsValid();
      }, false);
    }
  };

  // init form module
  loginForm.init();
})();