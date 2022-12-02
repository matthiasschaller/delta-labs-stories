let radius = { "normal": 8, "small": 4 };
let n = 100;
let rectX = 20;
let pad = 2;
let duration = 1000;
let delay = 6;
let counter = 0;

let y1 = null;
let x1Max = 0;
let y2 = null;
let x2Max = 0;
let mobile = false;
let svg, width, height, scaleX, scaleY, lastIndex;
let data = [];
let animationsArray = [];
let vizIndex = [];
let colors = ["#000000", "#FFFFFF"];
let activeIndex = 0;
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
    removeAnnotation("1");
    removeAnnotation("2");

    svg.selectAll(".bubble")
      .transition().duration(duration).delay((d, i) => i * delay).ease(d3.easeBack)
      .attr('r', radius.normal)
      .attr('cx', (d, i) => (width/2) - radius.normal + (2*radius.normal+pad) * ((i%rectX) - (rectX/2)))
      .attr('cy', (d, i) => (2*height/8) + (Math.floor(i/rectX) * (2*radius.normal + pad)))
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
  radius.normal = Math.round(width / 100);

  initData(n);
  scaleX = d3.scaleLinear().domain([0, 1]).range([50, width-50]);
  scaleY = d3.scaleLinear().domain([0, 1]).range([5*height/8, 7*height/8]);

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
        if (i == vizIndex[0]) {
          playAnimation(DotsToRect);
        } else if (i == vizIndex[1]) {
          playAnimation([MoveBubblesToLeft, MoveBubblesToRight]);
          playAnimation([Annotation1P1, Annotation2P1]);
        } else if (i == vizIndex[2]) {
          playAnimation([MoveBubblesToRight, MoveBubblesToLineHuman, Annotation1P2, Annotation2P1]);
        } else if (i == vizIndex[3]) {
          playAnimation([MoveBubblesToLineHuman, MoveBubblesToLineMachine, Annotation1P2, Annotation2P2]);
        } else if (i == vizIndex[4]) {
          playAnimation([RemoveEndRect, RemoveEndValues, MoveUp, Annotation1P3, Annotation2P3, resetAnimation1, resetAnimation2]);
        } else if (i == vizIndex[5]) {
          playAnimation([HighlightEnd, Annotation1P4, Annotation2P4]);  
          playAnimation([EndValues]);
        } else {
            showText();
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
          d3.select("#section-" + counter).append("p").attr("id", "section-" + counter + "-p").style("font-size", "2.5em").text(sectionTexts[i]);
          counter = counter + 1;
          d3.select("#sections").append("div").attr("id", "section-" + counter).attr("class", "step viz").style("width", "100%").style("height", "100vh");
          vizIndex.push(counter);
          counter = counter + 1;
      }
      showText();
      svg = d3.select("#viz").append("svg").attr("id", "viz-svg").style("width", "100%").style("height", "100%").style("top", "0").style("position", "fixed");
    } else {
      d3.select("#viz-container").append("div").attr("id", "sections").style("width", "30%").style("height", "100%");
      d3.select("#viz-container").append("div").attr("id", "viz").style("width", "70%").style("height", "100%").style("position", "fixed").style("right", "0").style("top", "0");
      
      for (var i = 0; i < sectionTexts.length; i++) {
          d3.select("#sections").append("section").attr("id", "section-" + i).attr("class", "step").style("height", "100vh").style("display", "flex").style("align-items", "center");;
          d3.select("#section-" + i).append("p").attr("id", "section-" + i + "-p").style("font-size", "1.8em").text(sectionTexts[i]);
          vizIndex.push(i);
      }
      svg = d3.select("#viz").append("svg").attr("id", "viz-svg").style("width", "100%").style("height", "100%");
    }
}

function initData(n) {
    for (i = 0; i < n; i++) {
      data.push({ category: "humanlike", valueX: i/n, valueY: 0.5, color: colors[0], size: 1 });
      data.push({ category: "machinelike", valueX: i/n, valueY: i/n, color: colors[1], size: 1 });
    }

    y1 = 0.5;
    y2 = data[(2*n)-1].valueY;
    x1Max = getMax("valueX", "humanlike");
    x2Max = getMax("valueX", "machinelike");
    data.sort( () => .5 - Math.random() );

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

function calcBubblesX(sideX, side) {
    let factor = 1;
    if (side == "right") {
        factor = 3;
    }

    let response = (factor*width/4) - radius.normal + (2*radius.normal+pad) * ((sideX%(rectX/2)) - (rectX/4))
    return (response);
}

function calcBubblesY(sideY) {
    let response = (3*height/8) + (Math.floor(sideY/(rectX/2)) * (2*radius.normal + pad))

    return (response);
}

const MoveBubblesToLeft = function moveBubblesToLeft() {
  let sideX = 0;
  let sideY = 0;

  svg.selectAll(".bubble.humanlike")
    .transition().duration(duration).delay((d, i) => ((2*n)-i) * delay).ease(d3.easeBack)
    .attr('r', radius.normal)
    .attr('cy', function(d) {
        let posY = calcBubblesY(sideY);
        sideY = sideY + 1;
        return posY;
    })
    .attr('cx', function(d, i) {
        let posX = calcBubblesX(sideX, "left");
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

const MoveBubblesToRight = function moveBubblesToRight() {
  let sideX = 0;
  let sideY = 0;

  svg.selectAll(".bubble.machinelike")
    .transition().duration(duration).delay((d, i) => ((2*n)-i) * delay).ease(d3.easeBack)
    .attr('r', radius.normal)
    .attr('cy', function(d) {
        let posY = calcBubblesY(sideY);
        sideY = sideY + 1;
        return posY;
    })
    .attr('cx', function(d, i) {
        let posX = calcBubblesX(sideX, "right");
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
  let x = scaleX(x1Max) - radius.normal;
  let y = scaleY(Math.min(y1, y2)) - radius.normal - (height/4);
  let rectWidth = 2 * radius.normal;
  let rectHeight = Math.abs(scaleY(y1) - scaleY(y2)) + (2 * radius.normal);

  svg.append("rect")
    .attr("id", "highlightRect")
    .attr('x', scaleX(getMax("valueX")))
    .attr('y', scaleY((y1 + y2) / 2) - height/4)
    .attr('width', 0)
    .attr('height', 0)
    .attr('fill', '#f0f0f0')
    .attr('fill-opacity', '0.5')

  svg.append("line")
    .attr("id", "highlightLineBottom")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", x + (rectWidth / 2))
    .attr("x2", x + (rectWidth / 2))
    .attr("y1", y + rectHeight)
    .attr("y2", y + rectHeight)

  svg.append("line")
    .attr("id", "highlightLineTop")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", x + (rectWidth / 2))
    .attr("x2", x + (rectWidth / 2))
    .attr("y1", y)
    .attr("y2", y)

  svg.append("line")
    .attr("id", "highlightLineRight")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", y + rectHeight)
    .attr("y2", y + rectHeight)

  svg.append("line")
    .attr("id", "highlightLineLeft")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", x + rectWidth)
    .attr("x2", x + rectWidth)
    .attr("y1", y + rectHeight)
    .attr("y2", y + rectHeight)
}

const HighlightEnd = function highlightEnd() {
  let x = scaleX(x1Max) - radius.normal;
  let y = scaleY(Math.min(y1, y2)) - radius.normal - (height/4);
  let rectWidth = 2 * radius.normal;
  let rectHeight = Math.abs(scaleY(y1) - scaleY(y2)) + (2 * radius.normal);

  svg.select("#highlightRect")
    .transition().duration(duration).delay(delay*50).ease(d3.easeExpOut)
      .attr('x', x)
      .attr('y', y)
      .attr('width', rectWidth)
      .attr('height', rectHeight)

  svg.select("#highlightLineBottom")
    .transition().duration(duration).delay(0).ease(d3.easeBack)
      .attr("x1", x)
      .attr("x2", x + rectWidth)

  svg.select("#highlightLineLeft")
    .transition().duration(duration).delay(duration).ease(d3.easeBack)
        .attr("y1", y)

  svg.select("#highlightLineRight")
    .transition().duration(duration).delay(duration).ease(d3.easeBack)
      .attr("y1", y)

  svg.select("#highlightLineTop")
    .transition().duration(duration).delay(2*duration).ease(d3.easeBack)
      .attr("x1", x)
      .attr("x2", x + rectWidth)
      .on("end", function() {
        onEndAnimation();
      });
}

const MoveUp = function moveUp() {
    svg.selectAll(".moveElement")
    .transition().duration(duration).delay((d, i) => i * delay).ease(d3.easeBack)
      .attr("transform","translate(0,-" + height/4 + ")")
      .on("end", function(d, i) {
        let nEls = svg.selectAll('.moveElement').size();
        if (i >= (nEls - 1)) {
          onEndAnimation();
        }
      });
}

const EndValues = function endValues() {

  let x = scaleX(getMax("valueX")) - (width/4);
  // if (mobile) {
  //   x = scaleX(getMax("valueX")) - (3*width/4);
  // }
  let y = scaleY(getMax("valueY")) + radius.normal - (height/4);
  if (mobile) {
    y = scaleY(getMax("valueY")) + radius.normal - (height/8);
  }

  if (svg.selectAll("#delta-logo").size() == 0) {
    svg.append("svg:image")
      .attr("id", "delta-logo")
      .attr('x', x - 180)
      .attr('y', y + 60)
      .attr('width', 0)
      .attr('height', 0)
      .attr("xlink:href", "./img/Logo.png")
      .transition().delay(0).duration(duration/3).ease(d3.easeExpOut)
        .attr('width', 45)
        .attr('height', 48)
  }

  if (svg.selectAll("#delta-text").size() == 0) {
    svg.append("text")
      .attr("id", "delta-text")
      .attr("x", x - 185)
      .attr("y", y + 120)
      .style("font-size", "0px")
      .text("DELTA")
      .transition().delay(delay*50).duration(duration/3).ease(d3.easeExpOut)
        .style("font-size", "19px")
      
  }

  if (svg.selectAll("#diff-text").size() == 0) {
    svg.append("text")
      .attr("id", "diff-text")
      .attr("x", x - 120)
      .attr("y", y + 100)
      .style("font-size", "0px")
      .text("40%")
      .transition().delay(delay*50).duration(duration/3).ease(d3.easeExpOut)
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
  let x = scaleX(x1Max) - radius.normal;
  let y = scaleY(Math.min(y1, y2)) - radius.normal - (height/4);
  let rectWidth = 2 * radius.normal;
  let rectHeight = Math.abs(scaleY(y1) - scaleY(y2)) + (2 * radius.normal);


  svg.select("#highlightRect")
    .transition().duration(duration).delay(0).ease(d3.easeExpOut)
    .attr('x', scaleX(x1Max))
    .attr('y', scaleY((y1 + y2) / 2))
    .attr('width', 0)
    .attr('height', 0)
    .on("end", function() {
      onEndAnimation();
    });

  svg.select("#highlightLineBottom")
    .transition().duration(duration).delay(0).ease(d3.easeExpOut)
      .attr("x1", x + (rectWidth / 2))
      .attr("x2", x + (rectWidth / 2))
      .attr("y1", y + rectHeight)
      .attr("y2", y + rectHeight)

  svg.select("#highlightLineTop")
    .transition().duration(duration).delay(0).ease(d3.easeExpOut)
      .attr("x1", x + (rectWidth / 2))
      .attr("x2", x + (rectWidth / 2))
      .attr("y1", y)
      .attr("y2", y)

  svg.select("#highlightLineRight")
    .transition().duration(duration).delay(0).ease(d3.easeExpOut)
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", y + rectHeight)
      .attr("y2", y + rectHeight)

  svg.select("#highlightLineLeft")
    .transition().duration(duration).delay(0).ease(d3.easeExpOut)
      .attr("x1", x + rectWidth)
      .attr("x2", x + rectWidth)
      .attr("y1", y + rectHeight)
      .attr("y2", y + rectHeight)
}

function getMax(el, category) {
    let max = null;

    if (category) {
        data.forEach(d => {
            if (d.category == category && d[el] > max) {
              max = d[el];
            }
        });
    } else {
        data.forEach(d => {
            if (d[el] > max) {
              max = d[el];
            }
        });
    }

    return (max)
}

function getMin(el, category) {
    let min = 0;

    data.forEach(d => {
        if (d.category == category && d[el] < min) {
          min = d[el];
        }
    });

    return (min)
}

/////////////////////////////////////////////////////////////////////
// ANNOTATION SECTION
/////////////////////////////////////////////////////////////////////
let fontSize = 16;
let lineWidth = 100;
let dxdy = { 
  "1": {"x": 30, "y": 30},
  "2": {"x": -30, "y": 30} 
};

function generateAnnotationLineWidth(id) {
  let thisLineWidth = lineWidth;
  if (dxdy[id].x < 0) {
    thisLineWidth = -thisLineWidth;
  }

  return thisLineWidth;
}

function addAnnotation(x, y, title, label, id, showLabel) {
  thisLineWidth = generateAnnotationLineWidth(id);

  if (svg.select("#annotation-" + id).size() == 0) {
    let annotation = svg.append("g").attr("id", "annotation-" + id);
    annotation.append("line")
      .attr("id", "annotation-" + id + "-connector")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr("x1", x)
      .attr("y1", y)
      .attr("x2", x)
      .attr("y2", y);
  
    annotation.append("line")
      .attr("id", "annotation-" + id + "-line")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr("x1", x + dxdy[id].x)
      .attr("y1", y + dxdy[id].y)
      .attr("x2", x + dxdy[id].x)
      .attr("y2", y + dxdy[id].y);
  
    annotation.append("text")
      .attr("id", "annotation-" + id + "-title")
      .style("font-size", "0px")
      .style("font-weight", "bold")
      .attr("alignment-baseline", "hanging")
      .text(title);
  
    annotation.append("text")
      .attr("id", "annotation-" + id + "-label")
      .attr("alignment-baseline", "ideographic")
      .style("font-size", "0px")
      .text(label);
    

    d3.select("#annotation-" + id + "-title")
      .attr("x", x +  dxdy[id].x + Math.min(thisLineWidth, 0))
      .attr("y", y +  dxdy[id].y + 5)

    d3.select("#annotation-" + id + "-label")
      .attr("x", x + dxdy[id].x + Math.min(thisLineWidth, 0))
      .attr("y", y + dxdy[id].y + fontSize + 5)
      
      standardLayoutAnnotation(id, showLabel);

  } else {
    let x1 = d3.select("#annotation-" + id + "-connector").attr("x1");
    let y1 = d3.select("#annotation-" + id + "-connector").attr("y1");
    let transform = [x1, y1];
  
    let translateX = x - transform[0];
    let translateY = y - transform[1];

    d3.select("#annotation-" + id)
      .transition().duration(duration).delay(0).ease(d3.easeBack)
      .attr("transform", "translate(" + translateX+ ", " + translateY + ")")
      .on("end", function() {
        standardLayoutAnnotation(id, showLabel);
      });  
  }

}

function moveAnnotation(id, x, y) {
  let x1 = d3.select("#annotation-" + id + "-connector").attr("x1");
  let y1 = d3.select("#annotation-" + id + "-connector").attr("y1");
  let transform = [x1, y1];

  let translateX = x - transform[0];
  let translateY = y - transform[1];

  d3.select("#annotation-" + id)
    .transition().duration(duration).delay(delay*50).ease(d3.easeBack)
    .attr("transform", "translate(" + translateX+ ", " + translateY + ")")
    .on("end", function() {
      onEndAnimation();
    });    
}

function standardLayoutAnnotation(id, showLabel) {
  let x = Number(d3.select("#annotation-" + id + "-connector").attr("x1"));
  let y = Number(d3.select("#annotation-" + id + "-connector").attr("y1"));

  thisLineWidth = generateAnnotationLineWidth(id);
  let stepDuration = duration/3;

  svg.select("#annotation-" + id + "-line")
    .transition().duration(stepDuration).delay(stepDuration).ease(d3.easeBack)
      .attr("x1", x + dxdy[id].x)
      .attr("y1", y + dxdy[id].y)
      .attr("x2", x + dxdy[id].x + thisLineWidth)
      .attr("y2", y + dxdy[id].y);

  svg.select("#annotation-" + id + "-connector")
    .transition().duration(stepDuration).delay(stepDuration).ease(d3.easeBack)
      .attr("x1", x)
      .attr("y1", y)
      .attr("x2", x + dxdy[id].x)
      .attr("y2", y + dxdy[id].y);

  svg.select("#annotation-" + id + "-title")
    .transition().duration(stepDuration).delay(2*stepDuration).ease(d3.easeBack)
    .style("font-size", fontSize + "px")
    .attr("x", x +  dxdy[id].x + Math.min(thisLineWidth, 0))
    .attr("y", y +  dxdy[id].y + 5)
    .on("end", function() {
      onEndAnimation();
    });

  if (showLabel) {
    svg.select("#annotation-" + id + "-label")  
      .transition().duration(stepDuration).delay(2*stepDuration).ease(d3.easeBack)
      .attr("x", x +  dxdy[id].x + Math.min(thisLineWidth, 0))
      .attr("y", y +  dxdy[id].y + 5 + fontSize)
      .style("font-size", fontSize + "px")
  } else {
    svg.select("#annotation-" + id + "-label")  
      .transition().duration(stepDuration).delay(2*stepDuration).ease(d3.easeBack)
      .attr("x", x +  dxdy[id].x + Math.min(thisLineWidth, 0))
      .attr("y", y +  dxdy[id].y + 5 + fontSize)
      .style("font-size", "0px")
  }
}

function expandAnnotation(id, top) {
  let connectorLength = 50;
  let offSet = 0;
  if (!top) {
    connectorLength = 120;
    offSet = 10;
  }

  let yLine = scaleY(getMax("valueY", "machinelike")) + radius.normal + connectorLength - (height/4);
  let xEdge = scaleX((n-1) / n) - radius.small - pad - connectorLength;
  let xEnd = scaleX(getMax("valueX")) - (width/4);
  if (mobile) {
    xEnd = scaleX(0)-10;
  }

  svg.select("#annotation-" + id)
    .transition().duration(duration).delay(delay*50).ease(d3.easeBack)
    .attr("transform", "translate(0,0)");

  svg.select("#annotation-" + id + "-connector")
    .transition().duration(duration).delay(delay*50).ease(d3.easeBack)
    .attr("x1", scaleX((n-1) / n) - radius.small - pad)
    .attr("y1", yLine - connectorLength + offSet)
    .attr("x2", xEdge)
    .attr("y2", yLine + offSet)

  svg.select("#annotation-" + id + "-title")
    .transition().duration(duration).delay(delay*50).ease(d3.easeBack)
      .attr("x", xEnd)
      .attr("y", yLine + offSet + 5)
      .transition().duration(duration).delay(delay*50).ease(d3.easeBack)
        .attr("font-weight", "normal")
        .on("end", function() {
            onEndAnimation();
        });

  svg.select("#annotation-" + id + "-label")
    .attr("x", xEnd)
    .attr("y", yLine + offSet)
    .transition().duration(duration).delay((delay*70) + duration).ease(d3.easeBack)
      .style("font-size", fontSize + "px")

  svg.select("#annotation-" + id + "-line")
    .transition().duration(duration).delay(delay*50).ease(d3.easeBack)
    .attr("x1", xEdge)
    .attr("y1", yLine + offSet)
    .attr("x2", xEnd)
    .attr("y2", yLine + offSet)

}

function removeAnnotation(id) {
  d3.select("#annotation-" + id).remove();
}

const Annotation1P1 = function annotation1P1() {
    let x = calcBubblesX(0, "left") + radius.normal + pad;
    let y = calcBubblesY(n-1, "left") + radius.normal + pad;
    addAnnotation(x, y, "machinelike", "50% Lorem Ipsum", "1", false);
}

const Annotation2P1 = function annotation2P1() {
    let x = calcBubblesX(n-1, "right") - radius.normal - pad;
    let y = calcBubblesY(n-1, "right") + radius.normal + pad;
    addAnnotation(x, y, "humanlike", "0% Lorem Ipsum", "2", false);
}

const Annotation1P2 = function annotation1P2() {
    moveAnnotation("1", scaleX(0) + radius.small + pad, scaleY(0.5) + radius.small + pad)
}

const Annotation2P2 = function annotation2P2() {
    moveAnnotation("2", scaleX((n-1) / n) - radius.small - pad, scaleY(1) + radius.small + pad)
}

const Annotation1P3 = function annotation1P3() {
    moveAnnotation("1", scaleX(0) + radius.small + pad, scaleY(0.5) + radius.small + pad - (height/4))
}

const Annotation2P3 = function annotation2P3() {
    moveAnnotation("2", scaleX((n-1) / n) - radius.small - pad, scaleY(1) + radius.small + pad - (height/4))
}

const resetAnimation1 = function resetAnimation1() {
  standardLayoutAnnotation("1", false)
}

const resetAnimation2 = function resetAnimation1() {
  standardLayoutAnnotation("2", false)
}

const Annotation1P4 = function annotation1P4() {
  expandAnnotation("1", false);
}

const Annotation2P4 = function annotation2P4() {
    expandAnnotation("2", true);
}

//   if (mobile) {
//     annotationType = d3.annotationCallout;
//     x = width-100
//     nx = width-100;
//   }