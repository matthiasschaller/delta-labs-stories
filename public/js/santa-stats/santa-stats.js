let colors = ["#CC231E", "#0F8A5F", "#34A65F", "#F5624D", "#235E6F"];
let rectWidth = width * height / 40000;
if (mobile) {
  rectWidth =width * height / 15000;
}
let pad = 4;
let scrollStops = [1, 2, 3, 4, 5];
let duration = { normal: 500, long: 900, short: 250};
let data = [];

let rectGroup, singleRect, allChildrenWidth;
let totalVol = (width-(2*100)) * (height/2);
let earthRect = Math.sqrt(totalVol / 3012);
let moonRect = Math.sqrt(totalVol / 314);

(function () {
    if (!mobile) {
      document.getElementById("viz-container").insertAdjacentHTML("beforeend", `
      <div class="santa-window" id="santa-window">
      <div class="santa">
          <div class="head">
          <div class="face">
              <div class="redhat">
              <div class="whitepart"></div>
              <div class="redpart"></div>
              <div class="hatball"></div>
              </div>
              <div class="eyes"></div>
              <div class="beard">
              <div class="nouse"></div>
              <div class="mouth"></div>
              </div>
          </div>
          <div class="ears"></div>
          </div>
          <div class="body"></div>
      </div>
  </div>`);
    }
    if (scrollSnap) {
      fullpage_api.getFullpageData().options.onLeave = function(origin, destination, direction, trigger) {
        scroll(scrollPosition);
      }
    } else {
      window.addEventListener('scroll', function(e){ 
        scroll(scrollPosition);
      })
    }  

    svg.append("text")            
        .attr("id", "section-divider-text")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height/2)
        .style("font-size", "0px")
        .style('fill', colors[1])
        .text("")

    initData();
    initStep1();

}());

function scroll(scrollPosition) {
  let step1 = 0;
  let step2 = step1 + 7;
  let step3 = step2 + 7;
  let step4 = step3 + 5;
  let step5 = step4 + 5;

  console.log(scrollPosition)
  if (scrollPosition == step1) {
    initStep1();
  } else if (scrollPosition == step1 + 1) {
    growRect();
  } else if (scrollPosition == step1 + 2) {
    growToSingleRect();
  } else if (scrollPosition == step1 + 3) {
    redoGrow(1);
  } else if (scrollPosition == step1 + 4) {
    redoGrow(2);
  // } else if (scrollPosition == step1 + 5) {
  //   redoGrow(3);
  } else if (scrollPosition == step1 + 5) {
    moveFirstRectToTop();
  // } else if (scrollPosition == step1 + 6) {
  //   fifteenPercent();
  } else if (scrollPosition == step1 + 6) {
    nStops();
  } else if (scrollPosition == step2) {
    moveStopsDown();
  } if (scrollPosition == step2 + 1) {
    step2sub2();
  } else if (scrollPosition == step2 + 2) {
    step2sub3();
  } else if (scrollPosition == step2 + 3) {
    step2sub4();
  } else if (scrollPosition == step2 + 4) {
    step2sub6();
  } else if (scrollPosition == step2 + 5) {
    step2sub7();
  } else if (scrollPosition == step2 + 6) {
    step2sub8();
  } 

  if (scrollPosition == step3) {
      step3sub1();
  } else if (scrollPosition == step3 + 1) {
      step3sub2();
  } else if (scrollPosition == step3 + 2) {
      step3sub3();
  } else if (scrollPosition == step3 + 3) {
      step3sub4();
  } else if (scrollPosition == step3 + 4) {
      step3sub5();
  }

  if (scrollPosition == step4) {
    step4sub1();
  } else if (scrollPosition == step4 + 1) {
    step4sub2();
  } else if (scrollPosition == step4 + 2) {
    step4sub3();
  } else if (scrollPosition == step4 + 3) {
    step4sub4();
  } else if (scrollPosition == step4 + 4) {
    step4sub5();
  }

  if (scrollPosition == step5) {
      step5sub1();
  }

}

function initData() {
    let counter = 0;
    for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 10; y++) {
            let color = colors[0];
            if (x == 4 || x == 5 || y == 4 || y == 5) {
                color = colors[1]
            }
            data.push({ id:  counter, x: x, y: y, color: color });
            counter++;
        }
    }
}

function textTransition(id, start, end, duration, delay, prefix, suffix) {
    svg.select("#" + id).transition().tween("text", function() {
        var selection = d3.select(this);
        var interpolator = d3.interpolateNumber(start,end); 

        return function(t) { 
            if (prefix != null && suffix != null) {
                selection.text(prefix + Math.round(interpolator(t)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + suffix); 
            } else if (prefix != null) {
                selection.text(prefix + Math.round(interpolator(t)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")); 
            } else if (suffix != null) {
                selection.text(Math.round(interpolator(t)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + suffix); 
            }
            
        };
    }).duration(duration).delay(delay);
}


(function () {

    var COUNT = 300;
    var masthead = document.querySelector('#viz-container');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = masthead.clientWidth;
    var height = masthead.clientHeight;
    var i = 0;
    var active = false;
  
    function onResize() {
      width = masthead.clientWidth;
      height = masthead.clientHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = '#FFF';
  
      var wasActive = active;
      active = width > 600;
  
      if (!wasActive && active)
        requestAnimFrame(update);
    }
  
    var Snowflake = function () {
      this.x = 0;
      this.y = 0;
      this.vy = 0;
      this.vx = 0;
      this.r = 0;
  
      this.reset();
    }
  
    Snowflake.prototype.reset = function() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.vy = 1 + Math.random() * 3;
      this.vx = 0.5 - Math.random();
      this.r = 1 + Math.random() * 2;
      this.o = 0.5 + Math.random() * 0.5;
    }
  
    canvas.style.position = 'absolute';
    canvas.style.left = canvas.style.top = '0';
  
    var snowflakes = [], snowflake;
    for (i = 0; i < COUNT; i++) {
      snowflake = new Snowflake();
      snowflake.reset();
      snowflakes.push(snowflake);
    }
  
    function update() {
  
      ctx.clearRect(0, 0, width, height);
  
      if (!active)
        return;
  
      for (i = 0; i < COUNT; i++) {
        snowflake = snowflakes[i];
        snowflake.y += snowflake.vy;
        snowflake.x += snowflake.vx;
  
        ctx.globalAlpha = snowflake.o;
        ctx.beginPath();
        ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
  
        if (snowflake.y > height) {
          snowflake.reset();
        }
      }
  
      requestAnimFrame(update);
    }
  
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  
    onResize();
    window.addEventListener('resize', onResize, false);
  
    masthead.appendChild(canvas);
  })();
  

function scrollDownAnimation() {
  keepRepeating = true;
  svg.select("#section-divider-text")
      .text("\u2304")
      .style("font-size", (height / 2) + "px")
      .attr("opacity", 1)
      
  
  repeat();

  function repeat() {
      if (keepRepeating) {
          svg.select("#section-divider-text")
          .transition().duration(2000).delay(0)
              .attr("y", height/2 + 100 )
              .attr("opacity", 0)
                  .transition().duration(0).delay(0).ease(d3.easeBack)
                  .attr("y", height/2)
                      .transition().duration(0).delay(0)
                          .attr("opacity", 1)
                          .on("end", repeat);
      }
  };
}
