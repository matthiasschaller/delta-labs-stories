let radius = { "normal": 8, "small": 4 };
let n = 100;
let rectX = 20;
let pad = 2;
let duration = 800;
let delay = 6;

let scaleX, scaleY, x, y;
let data = [];
let colors = ["#000000", "#FFFFFF"];
let moveUpFactor = 4;
if (mobile) {
  moveUpFactor = 2;
}

(function () {
  if (scrollSnap) {
    fullpage_api.getFullpageData().options.onLeave = function(origin, destination, direction, trigger) {
      scroll(scrollPosition);
    }
  } else {
    window.addEventListener('scroll', function(e){ 
      scroll(scrollPosition);
    })
  }

  initData(n);
  radius.normal = Math.round(width / 100);
  scaleX = d3.scaleLinear().domain([0, 1]).range([100, width-100]);
  if (mobile) {
    scaleX = d3.scaleLinear().domain([0, 1]).range([50, width-50]);
  }
  scaleY = d3.scaleLinear().domain([1, 0]).range([5*height/8, 7*height/8]);

  initDots();
  initRectHighlight();
  initAnnotation("1", "humanlike", "50% Lorem Ipsum");
  initAnnotation("2", "machinelike", "0% Lorem Ipsum");
  dotsToRect();

}());

function scroll(scrollPosition) {
  if (scrollPosition == 0) {
    dotsToRect();
    removeAnnotations();
  } else if (scrollPosition == 1) {
    moveBubblesToLeft();
    moveAnnotationToStart("1");

    moveBubblesToRight();
    moveAnnotationToStart("2");

  } else if (scrollPosition == 2) {
    moveBubblesToRight();
    moveAnnotationToStart("2");

    moveBubblesToLineHuman();
    moveAnnotation("1", scaleX((n-1) / n) - radius.small - pad, scaleY(0.5) + radius.small + pad);
  } else if (scrollPosition == 3) {
    removeEndRect();
    removeEndValues();

    moveBubblesToLineHuman();
    moveAnnotation("1", scaleX((n-1) / n) - radius.small - pad, scaleY(0.5) + radius.small + pad - (height/moveUpFactor));

    moveBubblesToLineMachine();
    moveAnnotation("2", scaleX(0) + radius.small + pad, scaleY(0) + radius.small + pad - (height/moveUpFactor));

    standardLayoutAnnotation("1", false, false);
    standardLayoutAnnotation("2", false, false);

  } else if (scrollPosition == 4) {
    highlightEnd();
    expandAnnotation("1", false);
    expandAnnotation("2", true);
    endValues();
  }
}

////////////////////////////////////////////////////////////////
// DATA PREPARATION
////////////////////////////////////////////////////////////////

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

function initRectHighlight() {
  let x = scaleX(x1Max) - radius.normal;
  let y = scaleY(Math.max(y1, y2)) - radius.normal - (height/moveUpFactor);
  let rectWidth = 2 * radius.normal;
  let rectHeight = Math.abs(scaleY(y1) - scaleY(y2)) + (2 * radius.normal);

  svg.append("rect")
    .attr("id", "highlightRect")
    .attr('x', scaleX(getMax("valueX")))
    .attr('y', scaleY((y1 + y2) / 2) - height/moveUpFactor)
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

////////////////////////////////////////////////////////////////
// STEP 0
////////////////////////////////////////////////////////////////
function dotsToRect() {
  svg.selectAll(".bubble")
    .transition().duration(duration).delay((d, i) => i * delay).ease(d3.easeBack)
    .attr("transform","translate(0,0)")
    .attr('r', radius.normal)
    .attr('cx', (d, i) => (width/2) - radius.normal + (2*radius.normal+pad) * ((i%rectX) - (rectX/2)))
    .attr('cy', (d, i) => (navHeight + radius.normal) + (height / 8) + (Math.floor(i/rectX) * (2*radius.normal + pad)))
}

////////////////////////////////////////////////////////////////
// STEP 1
////////////////////////////////////////////////////////////////
function moveBubblesToLeft() {
  let sideX = 0;
  let sideY = 0;

  svg.selectAll(".bubble.humanlike")
    .transition().duration(duration).delay((d, i) => ((2*n)-i) * delay).ease(d3.easeBack)
    .attr("transform","translate(0,0)")
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
}

function moveBubblesToRight() {
  let sideX = 0;
  let sideY = 0;

  svg.selectAll(".bubble.machinelike")
    .transition().duration(duration).delay((d, i) => ((2*n)-i) * delay).ease(d3.easeBack)
    .attr("transform","translate(0,0)")
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
}

////////////////////////////////////////////////////////////////
// STEP 2
////////////////////////////////////////////////////////////////
function moveBubblesToLineMachine() {
  svg.selectAll('.machinelike.bubble')
    .transition().duration(duration).delay((d, i) => i * delay).ease(d3.easeBack)
      .attr("transform","translate(0,-" + height/moveUpFactor + ")")
      .attr('r', radius.small)
      .attr('cx', d => scaleX(d.valueX))
      .attr('cy', d => scaleY(d.valueY))

  svg.selectAll('.humanlike.bubble')
    .transition().duration(duration).delay((d, i) => ((n / 2) * delay) + (i * delay)).ease(d3.easeBack)
      .attr("transform","translate(0,-" + height/moveUpFactor + ")")
}

////////////////////////////////////////////////////////////////
// STEP 3
////////////////////////////////////////////////////////////////
function moveBubblesToLineHuman() {
  svg.selectAll('.humanlike.bubble')
    .transition().duration(duration).delay((d, i) => i * delay).ease(d3.easeBack)
      .attr("transform","translate(0,0)")
      .attr('r', radius.small)
      .attr('cx', d => scaleX(d.valueX))
      .attr('cy', d => scaleY(d.valueY))
}

function removeEndValues() {
  svg.select("#annotation-delta").remove();
  svg.select("#delta-logo").remove();
  svg.select("#delta-text").remove();
  svg.select("#diff-text").remove();

}

function removeEndRect() {
  let x = scaleX(x1Max) - radius.normal;
  let y = scaleY(Math.max(y1, y2)) - radius.normal - (height/moveUpFactor);
  let rectWidth = 2 * radius.normal;
  let rectHeight = Math.abs(scaleY(y1) - scaleY(y2)) + (2 * radius.normal);


  svg.select("#highlightRect")
    .transition().duration(duration).delay(0).ease(d3.easeExpOut)
    .attr('x', scaleX(x1Max))
    .attr('y', scaleY((y1 + y2) / 2))
    .attr('width', 0)
    .attr('height', 0)

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

////////////////////////////////////////////////////////////////
// STEP 4
////////////////////////////////////////////////////////////////
function endValues() {
  let x = scaleX(getMax("valueX")) - (width/4);
  let y = scaleY(0.5) + radius.normal - (height/moveUpFactor);
  if (mobile) {
    x = scaleX(0.3) + 180;
    y = height - 200;
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
      .text("2x")
      .transition().delay(delay*50).duration(duration/3).ease(d3.easeExpOut)
        .style("font-size", "34px")
  }
}

function highlightEnd() {
  let x = scaleX(x1Max) - radius.normal;
  let y = scaleY(Math.max(y1, y2)) - radius.normal - (height/moveUpFactor);
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
    .transition().duration(duration).delay(duration).ease(d3.easeBack)
      .attr("x1", x)
      .attr("x2", x + rectWidth)
}