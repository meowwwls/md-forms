// lazyload fonts
document.body.onload = (function loadFonts(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
})('https://fonts.googleapis.com/css?family=Cardo|Carrois+Gothic+SC');

(function initSurvey() {
  var survey = {
    init: function formInit() {
      this.cacheDOM();
      this.events();
    },
    cacheDOM: function cDOM() {
      this.other = document.getElementById('other-inp');
      this.otherRadio = document.getElementById('other')
      this.form = document.getElementById('survey-form');
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
    handleOther: function otherHandler() {
      var p = this.other.parentNode;
      var checked = this.form.querySelector('input[name="learning-topic"]:checked').value;
      var invalidClassCheck = p.classList.contains('invalid-input');

      if (checked === 'other') {
        if (invalidClassCheck) {
          this.isNowValid(p, this.other.value.trim());
        } else if (!this.other.value.trim()) {
          this.invalidInput(p, 'please provide an answer if choosing “other”');
        }
      }  
      if (checked !== 'other') {
        this.isNowValid(this.other.parentNode, true);
      }   
    },
    events: function formEvents() {
      var context = this;
      /***
        OTHER INPUT VALIDATION
      ***/

      // selects the 'other' radio button when text input is focused
      this.other.addEventListener('focus', function() {
        context.otherRadio.checked = true;
      }, false);

      this.other.addEventListener('input', function() {
        context.handleOther();
      }, false);

      this.form.addEventListener('submit', function(e) {
        var check = this.querySelector('input[name="learning-topic"]:checked').value;

        e.preventDefault();
        context.handleOther();

      }, false); 

      this.form.addEventListener('click', function() {
        var checked = this.querySelector('input[name="learning-topic"]:checked').value;

        if (checked === 'other') {
            context.handleOther();
        }
        if (context.other.parentNode.classList.contains('invalid-input')) {
          context.handleOther();
        } 
      }, false);
    }   
  };
  // init form module
  survey.init();
})();