// lazyload fonts
document.body.onload = (function loadFonts(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
})('https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700');

(function initShipForm() {
  var shippingForm = {
    init: function formInit() {
      this.cacheDOM();
      this.events();
    },
    cacheDOM: function cDOM() {
      this.form = document.getElementById('shipping-and-billing-form');
      this.shippingInputs = document.getElementById('shipping-address-FS').querySelectorAll('input');
      this.billingInputs = document.getElementById('billing-address-FS').querySelectorAll('input');
      this.checkbox = document.getElementById('same-address');
      this.submitBtn = document.getElementById('submit');
    },
    allInputsValid: function validInps() {
      var i = 0;
      var l;
      var inputs;
      var current;

      // if shipping-is-same-as-billing is checked, just validate shipping inputs
      if (this.checkbox.checked) {
        inputs = this.shippingInputs;
        l = inputs.length;
      } else {
        inputs = this.form.querySelectorAll('input:not([type="checkbox"])');
        l = inputs.length;
      }

      for ( ; i < l; i++) {
        current = inputs[i];
        if (current.value.trim().length < 2 && current.hasAttribute('required')) {
          return false; 
        }
      }

      return true;
    },
    events: function formEvents() {
      var context = this;

      /*** 
        CHECKBOX EVENT
      ***/
      this.checkbox.addEventListener('input', function() {
        // if shipping-is-same is checked, fill in those fields from the shipping form values
        if (this.checked) {
          context.billingInputs.forEach(function(input, indx) {
            input.value = context.shippingInputs[indx].value.trim();
          });
        // if the user changes their mind, delete all shipping values from billing inputs
        } else {
          context.billingInputs.forEach(function(input, indx) {
            input.value = '';
          });
        }
      });

      /***
        SUBMISSION VALIDATION
      ***/

      this.submitBtn.addEventListener('click', function(e) {
        e.preventDefault();

        var valid = context.allInputsValid();

        if (valid && context.form.classList.contains('invalid-form')) {
          context.form.classList.remove('invalid-form');
        } else if (valid) {
          context.form.classList.add('valid-form');
        } else {
          window.location.hash = "#shipping-and-billing-form";
          context.form.classList.add('invalid-form');
        }

      }, false); 
    }   
  };

  // init form module
  shippingForm.init();
  
})();