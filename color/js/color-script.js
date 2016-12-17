// lazyload fonts
document.body.onload = (function loadFonts(url) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
})('https://fonts.googleapis.com/css?family=Arimo:400,700');

(function initColorForm() {
  var colors = {
    init: function formInit() {
      this.cacheDOM();
      this.events();
    },
    cacheDOM: function cDOM() {
      this.RGBA = '';
      this.red = document.getElementById('red');
      this.redOut = document.getElementById('redout');
      this.green = document.getElementById('green');
      this.greenOut = document.getElementById('greenout');
      this.blue = document.getElementById('blue');
      this.blueOut = document.getElementById('blueout');
      this.alpha = document.getElementById('alpha');
      this.alphaOut = document.getElementById('alphaout');
      this.rgbaOut = document.getElementById('rgba');
      this.hexOut = document.getElementById('hex');
      this.colorBox = document.getElementById('color-box');
    },
    updateColors: function colors(color) {
      this.RGBA = 'rgba(' + this.red.value + ',' + this.green.value + ', ' + this.blue.value + ', ' + this.alpha.value + ')';
      this.rgbaOut.value = this.RGBA;
      this.hexOut.value = this.rgbToHex();
      this.colorBox.style.backgroundColor = this.RGBA;
    },
    rgbToHex: function() {
      var split = this.RGBA.slice(this.RGBA.indexOf('(') + 1, this.RGBA.indexOf(')')).split(',');
      var hex = '#' + parseInt(split[0]).toString(16) + parseInt(split[1]).toString(16) + parseInt(split[2]).toString(16);
      return hex;
    },
    events: function formEvents() {
      var context = this;
      /***
        UPDATE COLOR EVENTS
      ***/
      this.red.addEventListener('input', function() {
        context.updateColors(context.red);
        console.log(context.rgbToHex());
      }, false);

      this.green.addEventListener('input', function() {
        context.updateColors(context.green);
      }, false);

      this.blue.addEventListener('input', function() {
        context.updateColors(context.blue);
      }, false);

      this.alpha.addEventListener('input', function() {
        context.updateColors(context.alpha);
      }, false);
    }
  };

  // init form module
  colors.init();
})();