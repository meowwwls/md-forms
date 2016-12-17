// lazyload fonts
document.body.onload = (function loadFonts(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
})('https://fonts.googleapis.com/css?family=Open+Sans:400,300,600');

(function initSearchForm() {
  var search = {
    init: function formInit() {
      this.cacheDOM();
      this.events();
    },
    cacheDOM: function cDOM() {
      this.form = document.getElementById('this-form');
      this.searchField = document.getElementById('search-field');
      this.categories = document.getElementById('categories');
      this.form = document.getElementById('search-form');
    },
    // handle invalid input appearance and display message
    invalidInput: function invalidInpFunc(el, msg) {
      var msgEl = el.querySelector('.invalid-msg');

      el.classList.add('invalid-input');
      msgEl.style.display = 'block';
      msgEl.innerHTML = msg;
    },
    // if previously invalid, checks to see if input is now valid
    isNowValid: function nowValidFunc(el, valid) {
      if (valid) {
        el.classList.remove('invalid-input');
        el.querySelector('.invalid-msg').style.display = 'none';
      }
    },
    // returns true if every input is valid when submit button is clicked
    allInputsValid: function submitCheck() {
      var v_search = this.searchField.value.trim();
      var v_cat = this.categories.value;

      if (!v_search) {
        this.invalidInput(this.searchField.parentNode, 'Enter a search term.');
      }
      if (!v_cat) {
        this.invalidInput(this.categories.parentNode, 'Please select a city.');
      }

      return v_search && v_cat;
    },
    events: function formEvents() {
      var context = this;
      /***
        SEARCH FIELD VALIDATION EVENTS
      ***/

      // validate input on blur
      // make sure search term is at least one character
      this.searchField.addEventListener('blur', function(e) {
        if (!this.value.trim().length) {
          context.invalidInput(this.parentNode, 'Enter a search term.');
        }
      }, false);

      // handle previously invalid input
      this.searchField.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, this.value.trim().length);
        } 
      }, false);
      /***
        CATEGORIES VALIDATION EVENTS
      ***/

      // validate input on blur
      // make sure a category is selected
      this.categories.addEventListener('blur', function(e) {
        if (!this.value) {
          context.invalidInput(this.parentNode, 'Please select a city.');
        }
      }, false);

      // handle previously invalid input
      this.categories.addEventListener('input', function(e) {
        var p = this.parentNode;

        if (p.classList.contains('invalid-input')) {
          context.isNowValid(p, this.value);
        } 
      }, false);

      /***
        FORM SUBMISSION VALIDATION EVENT
      ***/
      this.form.addEventListener('submit', function(e) {
        e.preventDefault();
        context.allInputsValid();
      }, false);
    }
  };

  // init form module
  search.init();
})();