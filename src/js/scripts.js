// google analytics tracking code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-64481180-1', 'auto');
ga('send', 'pageview');

window.onload = function() {
  "use strict";

  // animations on skills
  var svgPathElements = document.getElementsByClassName("svg-path");
  var svgTextElements = document.getElementsByClassName("svg-text");
  var intervals = [];

  // array of predifined colors
  var colors = ["#CACAAA", "#EEC584", "#C8AB83", "#55868C", "#7F636E"];

  function clear(i) {
    return function(){
      clearInterval(intervals[i]);
    };
  }
  function clearAll() {
    for (var i = intervals.length - 1; i >= 0; i--) {
      clearInterval(intervals[i]);
    }
  }
  function stroke(elem) {
    elem.setAttribute("stroke-dashoffset", parseInt(elem.getAttribute("stroke-dashoffset"))-3);
  }
  for (var i = svgPathElements.length - 1; i >= 0; i--) {
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    svgPathElements[i].setAttribute("stroke", randomColor);
    svgTextElements[i].setAttribute("fill", randomColor);
    var timer = Math.round(15 / parseInt(svgPathElements[i].getAttribute("data-amount")) * 252);
    intervals[i] = setInterval(function(elem, interv) {
      if(parseInt(elem.getAttribute("stroke-dashoffset")) <= 1000 - parseInt(elem.getAttribute("data-amount"))) {
        clear(interv);
      }
      else {
        stroke(elem);
      }
    }, timer, svgPathElements[i], i);
  }
  // clear all intervals anyways, because apparently they keep running on forever
  // btw this is really shitty
  setTimeout(clearAll, 2500);
}