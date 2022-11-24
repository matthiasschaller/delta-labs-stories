let radius = { "normal": 12, "small": 4 };
let n = 100;
let rectX = 20;
let pad = 2;
let duration = 1000;
let delay = 5;
let counter = 0;

let y1 = null;
let x1Max = 0;
let y2 = null;
let x2Max = 0;
let mobile = false;
let svg, data, width, height, scaleX, scaleY, lastIndex, lastIndexAnno;
let animationsArray = [];
let vizIndex = [];
let colors = ["#000000", "#FFFFFF"];
let activeIndex = 0;
let activeIndexAnno = 0;
let setDuration = duration;
let setDelay = delay;
let sectionTexts = [
  "What are the consequences when we interact with machines that try to be human?",
  "We tested that. We designed one chatbot that communicated very machine-like. And we designed another chatbot that communicated very human-like by using emojis and other expressives.",
  "People that chatted with our human-like chatbot were less interested in a personal follow-up consultation. That is, their need for personal interaction was satisfied by the chatbot.",
  "People that chatted with our machine-like chatbot were still interested in a personal follow-up consultation. The interaction with the chatbot could not satisfy their need for personal interaction.",
  "People that chatted with our machine-like chatbot were still interested in a personal follow-up consultation. The interaction with the chatbot could not satisfy their need for personal interaction.",
  "People that chatted with our machine-like chatbot were still interested in a personal follow-up consultation. The interaction with the chatbot could not satisfy their need for personal interaction."
];

(function () {

  const DotsToRect = function dotsToRect() {
    svg.selectAll(".bubble")
      .transition().duration(duration).delay((d, i) => i * delay).ease(d3.easeBack)
      .attr('r', radius.normal)
      .attr('cx', (d, i) => (width/2) - radius.normal + (2*radius.normal+pad) * ((i%rectX) - (rectX/2)))
      .attr('cy', (d, i) => (height/8) + (Math.floor(i/rectX) * (2*radius.normal + pad)))
      .on("end", function(d, i) {
        let nEls = svg.selectAll(".bubble").size();
        if (i >= (nEls - 1)) {
          onEndAnimation();
        }
      });
  }

  createHTML();
  width = svg.node().getBoundingClientRect().width;
  height = svg.node().getBoundingClientRect().height;

  data = initData(n);
  scaleX = d3.scaleLinear().domain([0, 1]).range([50, width-50]);
  scaleY = d3.scaleLinear().domain([0, 1]).range([4*height/8, 6*height/8]);

  initDots();
  initRectHighlight();
  if (!mobile) {
    playAnimation(DotsToRect);
  } else {
    radius = { "normal": 7, "small": 4 };
  }
  
  let scrollViz = scroller(".step").container(d3.select('#sections'))
  scrollViz();

  scrollViz.on('active', function(index){
    if (!mobile) {
      d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    }
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
      switch (i) {
        case vizIndex[0]:
          playAnimation(DotsToRect);
          break;
        case vizIndex[1]:
          playAnimation([moveBubblesToLeft, moveBubblesToRight]);
          break;
        case vizIndex[2]:
          playAnimation([moveBubblesToRight, MoveBubblesToLineHuman]);
          break;
        case vizIndex[3]:
          playAnimation([MoveBubblesToLineHuman, MoveBubblesToLineMachine]);
          break;
        case vizIndex[4]:
          playAnimation([RemoveEndRect, RemoveEndValues, MoveUp]);
          break;
        case vizIndex[5]: 
          playAnimation([HighlightEnd, EndValues]);
          break;
        default: 
          showText();
          break;
      }
    })
    lastIndex = activeIndex;
  })

}());

function playAnimation(animation) {
    if (mobile) {
        showAnimation();
    }
    animationsArray.push(animation);
    if (animationsArray.length == 1) {
        if (Array.isArray(animationsArray[0])) {
        counter = 0;
        animationsArray[0].forEach(anim => {
            anim();
        });
        } else {
        animationsArray[0]();
        }
    }
}

function startNext() {
  animationsArray.shift();
  if (animationsArray.length > 0) {
    if (Array.isArray(animationsArray[0])) {
      counter = 0;
      animationsArray[0].forEach(anim => {
        anim();
      });
    } else {
      animationsArray[0]();
    }
  }
}

function onEndAnimation() {
  if (animationsArray.length > 1) {
    duration = setDuration / animationsArray.length;
    delay = setDelay / animationsArray.length;
  } else {
    duration = setDuration;
    delay = setDelay;
  }
  if (Array.isArray(animationsArray[0])) {
    counter = counter + 1;
    if (animationsArray[0].length == counter) {
      startNext();
    }
  } else {
   startNext();
  }
}

function showText() {
    d3.select('#viz-svg')
      .transition().duration(300)
      .style('opacity', '0');

    d3.selectAll('.text')
      .transition().duration(300)
      .style('opacity', '1');
}

function showAnimation() {
  d3.select('#viz-svg')
    .transition().duration(300)
    .style('opacity', '1');

  d3.selectAll('.text')
    .transition().duration(300)
    .style('opacity', '0');
}

function scroller(className){
    let container = d3.select('body')
    let dispatch = d3.dispatch('active', 'progress');
    let sections = d3.selectAll(className)
    let sectionPositions
    let currentIndex = -1
    let containerStart = 0;
  // Binds the position function to the scroll event, and the resize function to the resize event. What these functions do are detailed below. 
    function scroll(){
      d3.select(window)
        .on('scroll.scroller', position)
        .on('resize.scroller', resize)
        resize();
      let timer = d3.timer(function() {
        position();
        timer.stop();
      });
    }
  //The resize function determines where each of the .step elements are on the page, relative to the top of the first element. It saves all of the co-ordinates of these elements in an array called sectionPositions
    function resize(){
      sectionPositions = [];
      let startPos;
      sections.each(function(d, i) {
        let top = this.getBoundingClientRect().top;
        if (i === 0 ){
          startPos = top;
        }
        sectionPositions.push(top - startPos)
      });
    }
  //The position function determines where the user is on the page (using window.pageYOffset), and uses that to determine which section of text should currently be in view. It then uses D3’s dispatching tools to signal the 'progress' event, which will be used in the main script, passing along the current section index so that the script knows which stage of the animation/visualisation should be showing. 
    function position() {
      let pos = window.pageYOffset - 300 - containerStart;
      let sectionIndex = d3.bisect(sectionPositions, pos);
      sectionIndex = Math.min(sections.size()-1, sectionIndex);
      if (currentIndex !== sectionIndex){
        dispatch.call('active', this, sectionIndex);
        currentIndex = sectionIndex;
      }
      let prevIndex = Math.max(sectionIndex - 1, 0);
      let prevTop = sectionPositions[prevIndex]
      let progress = (pos - prevTop) / (sectionPositions[sectionIndex]   - prevTop);
      dispatch.call('progress', this, currentIndex, progress)
    }
  //The code here adds an event listener to the dispatcher.
    scroll.container = function(value) {
      if (arguments.legth === 0){
        return container
      }
      container = value
      return scroll
    }
    scroll.on = function(action, callback){
      dispatch.on(action, callback)
    };
    return scroll;
}

function createHTML() {
    d3.select("#viz-container").style("display", "flex");
    if (d3.select("#viz-container").node().getBoundingClientRect().width < 500) {
      mobile = true
    }
    
    if (mobile) {
      d3.select("#viz-container").append("div").attr("id", "sections").style("width", "100%"); 
      d3.select("#viz-container").append("div").attr("id", "viz").style("width", "100%").style("height", "100vh").style("position", "fixed");
      let counter = 0;
      for (var i = 0; i < sectionTexts.length; i++) {
          d3.select("#sections").append("section").attr("id", "section-" + counter).attr("class", "step text").style("height", "100vh").style("display", "flex").style("align-items", "center");
          d3.select("#section-" + counter).append("p").attr("id", "section-" + counter + "-p").style("font-size", "2.8em").text(sectionTexts[i]);
          counter = counter + 1;
          d3.select("#sections").append("div").attr("id", "section-" + counter).attr("class", "step viz").style("width", "100%").style("height", "100vh");
          vizIndex[i] = counter;
          counter = counter + 1;
      }
      showText();
      svg = d3.select("#viz").append("svg").attr("id", "viz-svg").style("width", "100%").style("height", "100%");
    } else {
      d3.select("#viz-container").append("div").attr("id", "sections").style("width", "30%").style("height", "100%");
      d3.select("#viz-container").append("div").attr("id", "viz").style("width", "70%").style("height", "100%").style("position", "fixed").style("right", "0");
      
      for (var i = 0; i < sectionTexts.length; i++) {
          d3.select("#sections").append("section").attr("id", "section-" + i).attr("class", "step").style("height", "100vh").style("display", "flex").style("align-items", "center");;
          d3.select("#section-" + i).append("p").attr("id", "section-" + i + "-p").style("font-size", "1.8em").text(sectionTexts[i]);
          vizIndex[i] = i;
      }
      svg = d3.select("#viz").append("svg").attr("id", "viz-svg").style("width", "100%").style("height", "100%");
    }
}

function initData(n) {
    let data = [];

    for (i = 0; i < n; i++) {
      data.push({ category: "humanlike", valueX: i/n, valueY: 0.5, color: colors[0], size: 1 });
      data.push({ category: "machinelike", valueX: i/n, valueY: i/n, color: colors[1], size: 1 });
    }

    data.sort( () => .5 - Math.random() );

    return (data);
}

function initDots() {
  svg.selectAll('.bubble').data(data).enter()
    .append('circle')
    .attr("class", (d) => d.category + " bubble moveElement")
    .attr("id", (d, i) => "bubble-" + i)
    .attr('r', radius.small)
    .attr('fill', d => d.color)
    .style('stroke', "#000000")
    .attr('stroke-width', '0.3')
    .attr("cx", d => scaleX(Math.random()))
    .attr("cy", -radius.normal)
}

function moveBubblesToLeft() {
  let sideX = 0;
  let sideY = 0;

  svg.selectAll(".bubble.humanlike")
    .transition().duration(duration).delay((d, i) => ((2*n)-i) * delay).ease(d3.easeBack)
    .attr('r', radius.normal)
    .attr('cy', function(d) {
        let posY = (2*height/8) + (Math.floor(sideY/(rectX/2)) * (2*radius.normal + pad));
        sideY = sideY + 1;
        return posY;
    })
    .attr('cx', function(d, i) {
        let posX = (1*width/4) - radius.normal + (2*radius.normal+pad) * ((sideX%(rectX/2)) - (rectX/4));
        sideX = sideX + 1;
        return posX;
    })
    .on("end", function(d, i) {
      let nEls = svg.selectAll(".bubble.humanlike").size();
      if (i >= (nEls - 1)) {
        onEndAnimation();
      }
    });
}

function moveBubblesToRight() {
  let sideX = 0;
  let sideY = 0;

  svg.selectAll(".bubble.machinelike")
    .transition().duration(duration).delay((d, i) => ((2*n)-i) * delay).ease(d3.easeBack)
    .attr('r', radius.normal)
    .attr('cy', function(d) {
        let posY = (2*height/8) + (Math.floor(sideY/(rectX/2)) * (2*radius.normal + pad));
        sideY = sideY + 1;
        return posY;
    })
    .attr('cx', function(d, i) {
        let posX = (3*width/4) - radius.normal + (2*radius.normal+pad) * ((sideX%(rectX/2)) - (rectX/4));
        sideX = sideX + 1;
        return posX;
    })
    .on("end", function(d, i) {
      let nEls = svg.selectAll(".bubble.machinelike").size();
      if (i >= (nEls - 1)) {
        onEndAnimation();
      }
    });
}

const MoveBubblesToLineMachine = function MoveBubblesToLineMachine() {
  svg.selectAll('.machinelike.bubble')
    .transition().duration(duration).delay((d, i) => i * delay).ease(d3.easeBack)
      .attr("transform","translate(0,0)")
      .attr('r', radius.small)
      .attr('cx', d => scaleX(d.valueX))
      .attr('cy', d => scaleY(d.valueY))
      .on("end", function(d, i) {
        let nEls = svg.selectAll('.machinelike.bubble').size();
        if (i >= (nEls - 1)) {
          onEndAnimation();
        }
      });
}

const MoveBubblesToLineHuman = function MoveBubblesToLineHuman() {
  svg.selectAll('.humanlike.bubble')
    .transition().duration(duration).delay((d, i) => i * delay).ease(d3.easeBack)
      .attr("transform","translate(0,0)")
      .attr('r', radius.small)
      .attr('cx', d => scaleX(d.valueX))
      .attr('cy', d => scaleY(d.valueY))
      .on("end", function(d, i) {
        let nEls = svg.selectAll('.humanlike.bubble').size();
        if (i >= (nEls - 1)) {
          onEndAnimation();
        }
      });
}

function initRectHighlight() {
  data.forEach(d => {
    if (d.category == "humanlike" && d.valueX > x1Max) {
      y1 = d.valueY;
      x1Max = d.valueX;
    } else if (d.category == "machinelike" && d.valueX > x2Max) {
      y2 = d.valueY;
      x2Max = d.valueX;
    }
  });

  svg.append("rect")
    .attr("id", "highlightRect")
    .attr('x', scaleX(x1Max))
    .attr('y', scaleY((y1 + y2) / 2))
    .attr("transform","translate(0,-" + height/4 + ")")
    .attr('width', 0)
    .attr('height', 0)
    // .attr('stroke-width', '0.3')
    // .attr('stroke', '#000000')
    .attr('fill', '#f0f0f0')
    .attr('fill-opacity', '0.5')
}

const HighlightEnd = function highlightEnd() {
  svg.select("#highlightRect")
    .transition().duration(duration).delay(300).ease(d3.easeExpOut)
      .attr('x', scaleX(x1Max) - radius.normal)
      .attr('y', scaleY(Math.min(y1, y2)) - radius.normal)
      .attr('width', 2 * radius.normal)
      .attr('height', Math.abs(scaleY(y1) - scaleY(y2)) + (2 * radius.normal))
      .on("end", function() {
        onEndAnimation();
      })
}

const MoveUp = function moveUp() {
  if (svg.select(".moveElement").attr("transform") == "translate(0,0)" || svg.select(".moveElement").attr("transform") == "") {
    svg.selectAll(".moveElement")
    .transition().duration(duration).delay((d, i) => i * delay).ease(d3.easeBack)
      .attr("transform","translate(0,-" + height/4 + ")")
      .on("end", function(d, i) {
        let nEls = svg.selectAll('.moveElement').size();
        if (i >= (nEls - 1)) {
          onEndAnimation();
        }
      });
  } else {
    onEndAnimation();
  }
}

const EndValues = function endValues() {
  let annotationType = d3.annotationCalloutElbow;
  let x = scaleX(getMax("valueX")) - (width/4);
  let y = scaleY(getMax("valueY")) + radius.normal - (height/4);

  let nx = scaleX(getMax("valueX"))-(width/4);
  if (mobile) {
    annotationType = d3.annotationCallout;
    x = width-100
    nx = width-100;
  }

  const annotations = [{
    note: {
      label: "machinelike interaction",
      title: "10%"
    },
    x: scaleX(getMax("valueX")),
    y: y,
    ny: y + 30,
    nx: nx
  }, {
    note: {
      label: "humanlike interaction",
      title: "40%"
    },
    x: scaleX(getMax("valueX")),
    y: y + 5,
    ny: y + 120,
    nx: nx-10
  }];

  const makeAnnotations = d3.annotation().type(annotationType).annotations(annotations);
  if (svg.selectAll("#annotation-delta").size() == 0) {
    svg.append("g").attr("class", "annotation-group").attr("id", "annotation-delta").call(makeAnnotations)
  }

  if (svg.selectAll("#delta-logo").size() == 0) {
    svg.append("svg:image")
      .attr("id", "delta-logo")
      .attr('x', x - 250)
      .attr('y', y + 70)
      .attr('width', 0)
      .attr('height', 0)
      .attr("xlink:href", "./img/Logo.png")
      .transition().delay(0).duration(300).ease(d3.easeExpOut)
        .attr('width', 45)
        .attr('height', 48)
  }

  if (svg.selectAll("#delta-text").size() == 0) {
    svg.append("text")
      .attr("id", "delta-text")
      .attr("x", x - 252)
      .attr("y", y + 130)
      .style("font-size", "0px")
      .text("DELTA")
      .transition().delay(200).duration(300).ease(d3.easeExpOut)
        .style("font-size", "19px")
      
  }

  if (svg.selectAll("#diff-text").size() == 0) {
    svg.append("text")
      .attr("id", "diff-text")
      .attr("x", x - 190)
      .attr("y", y + 110)
      .style("font-size", "0px")
      .text("40%")
      .transition().delay(400).duration(300).ease(d3.easeExpOut)
        .style("font-size", "34px")
        .on("end", function() {
            onEndAnimation();
        });
  } else {
    onEndAnimation();
  }
}

const RemoveEndValues = function removeEndValues() {
  svg.select("#annotation-delta").remove();
  svg.select("#delta-logo").remove();
  svg.select("#delta-text").remove();
  svg.select("#diff-text").remove();

  onEndAnimation();
}

const RemoveEndRect = function removeEndRect() {
  svg.select("#highlightRect")
    .transition().duration(duration).delay(0).ease(d3.easeExpOut)
    .attr('x', scaleX(x1Max))
    .attr('y', scaleY((y1 + y2) / 2))
    .attr('width', 0)
    .attr('height', 0)
    .on("end", function() {
      onEndAnimation();
    });
}

function getMax(el) {
  let max = null;

  data.forEach(d => {
    if (d[el] > max) {
      max = d[el];
    }
  });

  return (max);
}