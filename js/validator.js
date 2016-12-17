(function(window) {
  var validator = {};
  validator.isEmailAddress = function isEmailFunc(input) {
    var at = input.indexOf('@');
    var beforeAt = input.slice(0, at).length;
    var afterAt = input.slice(at + 1);
    var dot = input.lastIndexOf('.');
    var afterDot = input.slice(dot + 1).length;

    if (input === undefined) {
      throw 'No input provided. Input must be a string.';
    }
    
    if (!input) {
      return false;
    } 
    
    // if input has no @, more than 1 @, no ., 
    if (at === -1) {
      console.error('Valid e-mail addresses must contain an "@" symbol.');
      return false;
    } else if (dot === -1 || dot < at) {
      console.error('Valid e-mail addresses must contain a . after the @ symbol.');
      return false;
    } else if (!beforeAt && at > - 1) {
      console.error('Valid e-mail addresses must contain at least one character before "@"');
      return false;
    } else if (input.indexOf('@') !== input.lastIndexOf('@')) {
      console.error('Valid e-mail addresses must contain only one "@" symbol.');
      return false;
    } else if (afterAt.length < 5 || afterDot < 2) {
      console.error('Not a valid e-mail address.');
      return false;
    } 

    return true;
  };

  validator.isPhoneNumber = function isPhoneNumberFun(input) {
    var number = input.replace(/-/g, '');
    var l = number.length;

    if (!input) {
      return false;
    }

    function isNumber(n) {
      return number.charCodeAt(n) < 48 || number.charCodeAt(n) > 57;
    }

    if (!input || number.length < 10) {
      console.error('Input must be a 10-11 digit number in the format of X-XXX-XXX-XXXX or XXX-XXX-XXX');
      return false;
    } else if (l === 10 && parseInt(number.charAt(0), 10) < 2) {
      console.error('Valid area codes in the US cannot start with 0 or 1');
      return false;
    } else if (l === 11 && number.charAt(0) === '1') {
      for (var i = 1; i < l; i++) {
        if (!!isNumber(i)) {
          console.error('Input must be a 10-11 digit number in the format of X-XXX-XXX-XXXX or XXX-XXX-XXX');
          return false;
        }
      }
    }
    return true;
  };

  validator.withoutSymbols = function withoutSymbolsFunc(input) {
    var sanitized = '';
    var charCode;

    if (typeof input !== 'string') {
      throw 'Cannot perform action on input; input must be a string';
    }  

    for (var i = 0, l = input.length; i < l; i++) {
      charCode = input.charAt(i).charCodeAt();
      if (charCode >= 65 && charCode <= 90 || charCode >= 97 && charCode <= 122
          || charCode >= 48 && charCode <= 57 || charCode === 32) {
        sanitized += input.charAt(i);
      }
    }
    return sanitized;
  };

  validator.isDate = function isDateFunc(input) {
    input = typeof input === 'string' ? new Date(input) : input;

    if (input === undefined) {
      console.error('No input provided');
      return false;
    }

    return input.toString() !== 'Invalid Date';
  };

  validator.isBeforeDate = function isBeforeDateFunc(input, reference) {
    input = typeof input === 'string' ? new Date(input) : input;
    reference = typeof reference === 'string' ? new Date(reference) : reference;
    
    if (input === undefined || reference === undefined) {
      console.error('Two dates must be provided.');
      return false;
    }

    if (!(this.isDate(input) && this.isDate(reference))) {
      console.error('Input and reference are both invalid dates.');
      return false;
    } else if (!this.isDate(input)) {
      console.error('Input is not a valid date.');
      return false;
    } else if (!this.isDate(reference)) {
      console.error('reference is not a valid date.');
      return false;
    }

    return input < reference;
  };

  validator.isAfterDate = function isAfterDateFunc(input, reference) {
    input = typeof input === 'string' ? new Date(input) : input;
    reference = typeof reference === 'string' ? new Date(reference) : reference;
    
    if (input === undefined || reference === undefined) {
      console.error('Two dates must be provided.');
      return false;
    }

    if (!(this.isDate(input) && this.isDate(reference))) {
      console.error('Input and reference are both invalid dates.');
      return false;
    } else if (!this.isDate(input)) {
      console.error('Input is not a valid date.');
      return false;
    } else if (!this.isDate(reference)) {
      console.error('reference is not a valid date.');
      return false;
    }

    return input > reference;
  };

  validator.isBeforeToday = function isBeforeTodayFunc(input) {
    var valid;
    input = typeof input === 'string' ? new Date(input) : input;
    // make sure input is a valid date
    valid = this.isDate(input);
    return valid && input < new Date();
  };

  validator.isAfterToday = function isAfterTodayFunc(input) {
    var valid;
    input = typeof input === 'string' ? new Date(input) : input;
    // make sure input is a valid date
    valid = this.isDate(input);
    return valid && input > new Date();
  };

  validator.isEmpty = function(input) {
    var charCode;
    
    if (typeof input !== 'string') {
      throw 'Cannot perform action on input; input must be a string';
    }

    // if input === '', loop never runs and true is still returned
    for (var i = 0, l = input.length; i < l; i++) {
      charCode = input.charAt(i).charCodeAt();
      if (charCode !== 32) {
        return false;
      }
    }
    return true;
  };

  validator.contains = function containsFunc(input, words) {
    var arrInput = removeSymbols(input).split(' ');
    var count = 0;
    var wordsL = words.length;
    var wordIndx = 0;

    // replace punctuation with white space to easily split string into words
    function removeSymbols(input) {
      var newStr = input.toLowerCase();
      var sanitized = '';
      var charCode;

      for (var i = 0, l = newStr.length; i < l; i++) {
        charCode = newStr.charAt(i).charCodeAt();
        if (charCode >= 97 && charCode <= 122
            || charCode >= 48 && charCode <= 57 || charCode === 32) {
          sanitized += newStr.charAt(i);
        } else if (charCode < 65) {
          sanitized += ' ';
        }
      }
      return sanitized;
    }
    
    for (var i = 0, l = arrInput.length; i < l; i++) {
      wordIndx = 0;
      // compare word in split string to words in word arr
      while(wordIndx < wordsL) {
        if (arrInput[i] === words[wordIndx]) {
          count++;
        }
        wordIndx++;
      }
    }
    return count > 0;
  };

  validator.lacks = function lacksFunc(input, words) {
    var arrInput = removeSymbols(input).split(' ');
    var count = 0;
    var wordsL = words.length;
    var wordIndx = 0;

    // replace punctuation with white space to easily split string into words
    function removeSymbols(input) {
      var newStr = input.toLowerCase();
      var sanitized = '';
      var charCode;

      for (var i = 0, l = newStr.length; i < l; i++) {
        charCode = newStr.charAt(i).charCodeAt();
        if (charCode >= 97 && charCode <= 122
            || charCode >= 48 && charCode <= 57 || charCode === 32) {
          sanitized += newStr.charAt(i);
        } else if (charCode < 65) {
          sanitized += ' ';
        }
      }
      return sanitized;
    }
    
    for (var i = 0, l = arrInput.length; i < l; i++) {
      wordIndx = 0;
      // compare word in split string to words in word arr
      while(wordIndx < wordsL && !count) {
        if (arrInput[i] === words[wordIndx]) {
          count++;
        }
        wordIndx++;
      }
    }
    return count <= 0;
  };

  validator.isComposedOf = function isComposedOfFunc(input, strings) {
    var l;
    var stringsCopy;
    var str;
    var matched;

    if (input === undefined || strings === undefined) {
      throw 'Both a string and an array of words must be provided.';
    } else if (typeof input !== 'string') {
      throw 'Input must be a string';
    } else if (!Array.isArray(strings)) {
      throw 'Second argument must be an array of strings.';
    } 

    l = strings.length;
    stringsCopy = strings.slice();
    str = this.withoutSymbols(input).toLowerCase();

    // sort strings array copy so longest words are first
    stringsCopy.sort(function (a, b) {
      return b.length - a.length;
    });

    // loop through strings array and remove matched words from string
    for(var i = 0; i < l; i++) {
      if(!str.length) {
        return true;
      } else {
        matched = stringsCopy[i].toLowerCase();
        str = str.replace(matched, '');
      }
    }
    
    return this.isEmpty(str);
  };

  validator.isLength = function isLengthFunc(input, n) {
   // convert n to number in case it's passed as a string
   n = typeof n === 'string' ? parseInt(n, 10) : n;

   if (typeof input !== 'string') {
     throw 'Input must be a string';
   } else if (input === undefined) {
     throw 'Input must be provided.';
   } else if (n === undefined) {
     throw 'Length (n) must be provided.';
   } else if (typeof n !== 'number') {
     throw 'Length must be a number.';
   }
   
   return input.length <= n;
  };
  
  validator.isOfLength = function isOfLengthFunc(input, n) {
    // convert n to number in case it's passed as a string
    if (typeof n === 'string') {
      n = parseInt(n, 10);
    }

    if (typeof input !== 'string') {
      throw 'Input must be a string';
    } else if (input === undefined) {
      throw 'Input must be provided.';
    } else if (n === undefined) {
      throw 'Length (n) must be provided.';
    } else if (typeof n !== 'number') {
      throw 'Length must be a number.';
    }

    return input.length >= n;
  };

  validator.countWords = function countWordsFunc(input) {
    var arr;
   
    if (typeof input !== 'string') {
      throw 'Cannot perform word count on input type; input must be a string.';
    }

    arr = removeSymbols(input).split(' ');
    
    // replace punctuation with white space to easily split string into words
    function removeSymbols(input) {
      var newStr = input.toLowerCase();
      var sanitized = '';
      var charCode;

      for (var i = 0, l = newStr.length; i < l; i++) {
        charCode = newStr.charAt(i).charCodeAt();
        if (charCode >= 97 && charCode <= 122
            || charCode >= 48 && charCode <= 57 || charCode === 32) {
          sanitized += newStr.charAt(i);
        } else if (charCode < 65) {
          sanitized += ' ';
        }
      }
      return sanitized;
    }
    // make sure no empty strings are in the array
    return arr.filter(function(word) {
      return word !== '';
    }).length;
  };

  validator.lessWordsThan = function lessWordsFunc(input, n) {
    // in case n is provided as a string
    if (typeof n === 'string') {
      n = parseInt(n, 10);
    }
    if (typeof n !== 'number') {
      throw 'n must be a number.';
    } else if (input === undefined || n === undefined) {
      throw 'An input and a number must be provided.';
    }

    return this.countWords(input) <= n;
  };

  validator.moreWordsThan = function moreWordsFunc(input, n) {
    // in case n is provided as a string
    n = typeof n === 'string' ? parseInt(n, 10) : n;

    if (typeof n !== 'number') {
      throw 'n must be a number.';
    } else if (input === undefined || n === undefined) {
      throw 'An input and a number must be provided.';
    }

    return this.countWords(input) >= n;
  };

  validator.isAlphanumeric = function isAlphanumFunc(input) {
    var strLower = input.toLowerCase();
    var valid = true;
    var i = 0;
    var len = input.length;
    var charCode;

    if (typeof input !== 'string') {
      console.error('Input must be a string.'); 
      return false;
    }

    while (i < len && valid) {
      charCode = strLower.charCodeAt(i);
      if (!((charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 122))) {
        valid = false;
      }
      i++;
    }

    return valid;
  };

  validator.isBetween = function isBetweenFunc(input, floor, ceil) {
    input = typeof input === 'string' ? parseFloat(input, 10) : input;
    input = typeof floor === 'string' ? parseFloat(floor, 10) : floor;
    input = typeof ceil === 'string' ? parseFloat(ceil, 10) : ceil; 

    if (input === undefined && floor === undefined && ceil === undefined) {
      throw 'Provide an input as well as a minimum and maximum range.';
    } else if (floor === undefined) {
      throw 'Provide a minimum and maximum range.';
    } else if (ceil === undefined) {
       throw'Provide a maximum for the range.';
    }

    return input >= floor && input <= ceil;
  };

  validator.isCreditCard = function isCCNumFunc(input) {
    var cc = input.toLowerCase();
    // store str length and update as it changes
    var n = cc.length;
    var valid = true;
    var dashIndx = cc.indexOf('-');
    // build new string without dashes if they exist
    var dashless;
    var charCode;
    var i; 
    // if dashes, build a new string without
    if (dashIndx !== -1) {
      dashless = '';
      dashless = cc.slice(0, dashIndx);
      for (i = dashIndx; i < n; i++) {
        if (cc.charAt(i) !== '-') {
          dashless += cc.charAt(i);
        }
      }
      n = dashless.length;
    } else {
      dashless = cc;
    }
    // reset index and string length
    i = 0;

    if(n < 16) {
      console.error('A valid credit card or bank number is 16 alphanumeric characters.');
      return false;
    } else { // make sure each character is a letter or number
        while(i < n && valid) {
          charCode = dashless.charCodeAt(i);
          if(!(charCode >= 97 && charCode <= 122  || charCode >= 48 && charCode <= 57)) {
            valid = false;
            console.error('A valid credit card or bank number is 16 alphanumeric characters.');
          }
          i++;
        }
    }
    return valid;
  };

  validator.isHex = function isHexFunc(input) {
    var isHex = true;
    var i = 1;
    var trimmed;
    var len;
    var charCode;

    if (input === undefined) {
      console.error('No input provided');
      return false;
    }

    trimmed = input.trim().toLowerCase();
    len = trimmed.length;

    if(len !== 7 && len !== 4 || trimmed.charAt(0) !== '#') {
      console.error('hex colors must be between 4 and 7 characters ranging from 0-9 or A-F, starting with #');
      return false;
    }
    
    while (i < len && isHex) {
      charCode = trimmed.charCodeAt(i);
      // if char is not a # between 0-9 or a letter between a-f, not a hex code
      if (!((charCode >= 48 && charCode <= 57) || (charCode >= 97  && charCode <= 102))) {
        isHex = false;
      }
      i++;
    } 

    return isHex;
  };

  validator.isRGB = function isRGBFunc(input) {
    var trimmed;
    var rgb;
    var openPIndx;
    var closePIndx;
    var split;
    
    if (input === undefined) {
      console.error('No input provided');
      return false;
    }

    trimmed = input.trim().toLowerCase();
    rgb = trimmed.slice(0, 3) === 'rgb';
    openPIndx = trimmed.indexOf('(');
    closePIndx = trimmed.indexOf(')');
    split = trimmed.slice(openPIndx + 1, closePIndx).split(',');

    if (typeof input !== 'string') {
      console.error('Input must be a string.');
      return false;
    } else if (!rgb) {
      console.error('Valid rgb colors must start with rgb');
      return false;
    } else if (split.length !== 3) {
      console.error('You must provide values for red, blue, and green, and separate each with a comma (,)');
      return false;
    } else if (openPIndx > -1 && openPIndx !== trimmed.lastIndexOf('(')) {
      console.error('There can only be one "(" in a valid rgb color.');
      return false;
    } else if (openPIndx === -1) {
      console.error('There must be a "(" in a valid rgb color.');
      return false;
    } else if (closePIndx > -1 && closePIndx !== trimmed.lastIndexOf(')')) {
      console.error('There can only be one ")" in a valid rgb color.');
      return false;
    } else if (closePIndx === -1) {
      console.error('There must be a ")" in a valid rgb color.');
      return false;
    }

    return this.isBetween(split[0], 0, 255) && this.isBetween(split[1], 0, 255) && this.isBetween(split[2], 0, 255);
  };

  validator.isHSL = function isHSLFunc(input) {
    var trimmed;
    var hsl;
    var openPIndx;
    var closePIndx;
    var split;
    
    if (input === undefined) {
      console.error('No input provided');
      return false;
    }

    trimmed = input.trim().toLowerCase();
    hsl = trimmed.slice(0, 3) === 'hsl';
    openPIndx = trimmed.indexOf('(');
    closePIndx = trimmed.indexOf(')');
    split = trimmed.slice(openPIndx + 1, closePIndx).split(',');

    if (typeof input !== 'string') {
      console.error('Input must be a string.');
      return false;
    } else if (!hsl) { // if string does not start with HSL
      console.error('Valid hsl colors must start with hsl');
      return false;
    } else if (split.length !== 3) { // if hue, sat, and lightness are not all provided
      console.error('You must provide values for Hue, Saturation, and Lightness, and separate each with a comma (,)');
      return false;
    } else if (openPIndx > -1 && openPIndx !== trimmed.lastIndexOf('(')) {
      console.error('There can only be one "(" in a valid hsl color.');
      return false;
    } else if (openPIndx === -1) { // if ( is omitted
      console.error('There must be a "(" in a valid hsl color.');
      return false;
    } else if (closePIndx > -1 && closePIndx !== trimmed.lastIndexOf(')')) {
      console.error('There can only be one ")" in a valid hsl color.');
      return false;
    } else if (closePIndx === -1) { // if ) is omitted
      console.error('There must be a ")" in a valid hsl color.');
      return false;
    }
    
    return this.isBetween(split[0], 0, 360) && this.isBetween(split[1], 0, 100) && this.isBetween(split[2], 0, 100);
  };

  validator.isColor = function isColorFunc(input) {
    if (input === undefined) {
      console.error('No input provided.');
      return false;
    }
    return this.isHex(input) || this.isRGB(input) || this.isHSL(input);
  };

  validator.isTrimmed = function isTrimmedFunc(str) {
    // if there's whitespace at the start or end of the str, end function early
    if (typeof str !== 'string') {
      throw 'Input must be a valid string.';
    } else if (str.charAt(0) === ' ' || str.charAt(str.length - 1) === ' ') { 
      return false;
    } 
    // filter out words and just return array of empty strings
    // if there are any, the string is not trimmed
    return str === '' || str.split(' ').filter(function(val) {
      return val === '';
    }).length === 0;
  };
  
  window.validator = validator;
})(window);