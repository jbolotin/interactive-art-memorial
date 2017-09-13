$(document).ready(function() {

  (function() {
    'use strict';

    let victimNames = [];
    let allIDs = [];

    // Returns Pixel Array
    const getPixels = function() {
      $.ajax({type: 'GET',
        url: '/pixels/' + 'final.jpg',
        dataType: 'json',
        success: function(pixels) {
          createPortraits(pixels);
        },
        error: function(xhr, status, e) {
          console.log(status, e);
        }
      });
    }

    const main = function() {
      readCSV();
      getPixels();
    }

    const readCSV = function() {
      $.ajax({
        type: "GET",
        url: "../victim-names.csv",
        dataType: "text",
        success: function(data) {
          data = data.split(/\n/);
          victimNames = data;
        },
        error: function(xhr, status, e) {
          console.log(status, e);
        }
     });
    }

    async function createPortraits(pixels) {
      let width = pixels.shape[0];
      let height = pixels.shape[1];
      $('.holocaust-art-photos-container').css('width', width);
      let pixelsData = pixels.data.data;

      let formattedPixels = [];
      for (let i = 0; i < pixelsData.length; i += 4) {
        formattedPixels.push([pixelsData[i], pixelsData[i + 1], pixelsData[i + 2]]);
      }
      let square = gcd(height, width); // n x n square of pixels
      // Iterate through each square of pixels
      let blockWidth = width / square;
      for (let row = 0; row < height / square; row++) {
        for (let col = 0; col < width / square; col++) {
          let pixelIndex = (((row * blockWidth) * (square * square)) + (col * square));
          let colors = [[],[],[]]; // RBG
          for (let i = 0; i < square; i++) {
            for (let j = 0; j < square; j++) {
              for (let k = 0; k < 3; k++) {
                colors[k].push(formattedPixels[pixelIndex][k]);
              }
              pixelIndex++;
            }
            pixelIndex += width - square;
          }
          let averages = averageSquare(colors);
          let mapIndex = (row * blockWidth + col);
          allIDs.push(mapIndex);
          createCircle(averages, mapIndex, square); // Create circle with averages RGB values
        }
      }

      $('.holocaust-art-photos-circle').mouseover(function() {
        if(this.style.visibility === 'visible') {
          $('#holocaust-art-photos-name').text(victimNames[this.id]);
        }
      });
      let loops = 1;
      let pixDone = 0;
      let sleepTime = 70;
      while (allIDs.length) {
        if(allIDs.length < loops) {
          loops = allIDs.length;
        }
        for (let i = 0; i < loops; i++) {
          let index = Math.floor((Math.random() * allIDs.length));
          let pixelId = allIDs.splice(index, 1);
          let pixel = document.getElementById(pixelId);
          pixel.style.visibility = 'visible';
          if (pixDone === 1000) {
            sleepTime = 50;
          }
          if (pixDone === 5000) {
            sleepTime = 30;
          }
          if (pixDone === 7500) {
            sleepTime = 15;
          }
          if (pixDone === 10000) {
            sleepTime = 1;
          }
          if (pixDone === 18000) {
            loops += 6;
          }
          if (pixDone === 28000) {
            loops -= 6;
          }
          if (pixDone % 4000 === 0) {
            loops++;
          }
          pixDone++;
        }
        await sleep(sleepTime);
      }
      $('#holocaust-art-photos-name').mouseover(function() {
        $('#holocaust-art-photos-name').text('JULIAN DEBIEC');
      })
    }

    const sleep = function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const createCircle = function(averages, id, square) {
      let circle = document.createElement('div');
      circle.id = id;
      circle.style.height = square + 'px';
      circle.style.width = square + 'px';
      circle.style.backgroundColor = rgbToHex(averages[0], averages[1], averages[2]);
      circle.className = 'holocaust-art-photos-circle';
      circle.style.visibility = 'hidden';
      document.getElementById('photo1').appendChild(circle);
    }

    const componentToHex = function(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    const rgbToHex = function(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    const averageSquare = function(squareColors) {
      let averageRGB = []; // [R, G, B]
      for (let i = 0; i < squareColors.length; i++) {
        let channelArray = squareColors[i];
        let sum = 0;
        for (let j = 0; j < channelArray.length; j++) {
          sum += channelArray[j];
        }
        averageRGB.push(Math.floor(sum / channelArray.length));
      }
      return averageRGB;
    }

    /**
    * @description Finds greatest common divisor between two numbers
    * @param {Number} a -- First number to find divisor of
    * @param {Number} b -- Second number to find divisor of
    * @returns {Number} greatest common divisor
    */
    const gcd = function(a, b) {
        if ( ! b) {
            return a;
        }
        return gcd(b, a % b);
    };

    main()

  }).call(this);
});
