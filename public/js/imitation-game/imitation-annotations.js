let fontSize = 16;
let lineWidth = 100;
let dxdy = { 
  "1": {"x": -30, "y": 30},
  "2": {"x": 30, "y": 30} 
};

if (mobile) {
  dxdy = { 
    "1": {"x": -10, "y": 10},
    "2": {"x": 10, "y": 10} 
  };
  fontSize = 12;
  lineWidth = 60;
}

function generateAnnotationLineWidth(id) {
  let thisLineWidth = lineWidth;
  if (dxdy[id].x < 0) {
    thisLineWidth = -thisLineWidth;
  }

  return thisLineWidth;
}

function initAnnotation(id, title, label) {
    if (id == "1") {
        x = calcBubblesX(0, "left") + radius.normal + pad;
        y = calcBubblesY(n-1, "left") + radius.normal + pad;
    } else {
        x = calcBubblesX(n-1, "right") - radius.normal - pad;
        y = calcBubblesY(n-1, "right") + radius.normal + pad;
    }

    let thisLineWidth = generateAnnotationLineWidth(id);

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
        .attr("y", y + dxdy[id].y + fontSize + 5);
}

function moveAnnotationToStart(id) {
    if (id == "1") {
        x = calcBubblesX(n-1, "left") - radius.normal - pad;
        y = calcBubblesY(n-1, "left") + radius.normal + pad;
    } else {
        x = calcBubblesX(0, "right") + radius.normal + pad;
        y = calcBubblesY(n-1, "right") + radius.normal + pad;
    }

    let x1 = d3.select("#annotation-" + id + "-connector").attr("x1");
    let y1 = d3.select("#annotation-" + id + "-connector").attr("y1");
    let transform = [x1, y1];

    let translateX = x - transform[0];
    let translateY = y - transform[1];

    d3.select("#annotation-" + id)
        .transition().duration(duration).delay(0).ease(d3.easeBack)
        .attr("transform", "translate(" + translateX+ ", " + translateY + ")")
        .on("end", function() {
          standardLayoutAnnotation(id, false, false);
    });
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
}

function standardLayoutAnnotation(id, showLabel, instant) {
  let x = Number(d3.select("#annotation-" + id + "-connector").attr("x1"));
  let y = Number(d3.select("#annotation-" + id + "-connector").attr("y1"));

  thisLineWidth = generateAnnotationLineWidth(id);
  let stepDuration = duration/3;
  if (instant) {
    stepDuration = 0;
  }

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

  let yLine = scaleY(getMax("valueY", "humanlike")) + radius.normal + connectorLength - (height/moveUpFactor);
  let xEdge = scaleX((n-1) / n) - radius.small - pad - connectorLength;
  let xEnd = scaleX(getMax("valueX")) - (width/4);
  if (mobile) {
    xEnd = scaleX(0.3);
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
          standardAnnotation = false;
        });

  // svg.select("#annotation-" + id + "-label")
  //   .attr("x", xEnd)
  //   .attr("y", yLine + offSet)
  //   .transition().duration(duration).delay((delay*70) + duration).ease(d3.easeBack)
  //     .style("font-size", fontSize + "px")

  svg.select("#annotation-" + id + "-line")
    .transition().duration(duration).delay(delay*50).ease(d3.easeBack)
    .attr("x1", xEdge)
    .attr("y1", yLine + offSet)
    .attr("x2", xEnd)
    .attr("y2", yLine + offSet)

}

function removeAnnotations() {
    ["1", "2"].forEach(id => {

        if (id == "1") {
            x = calcBubblesX(0, "left") + radius.normal + pad;
            y = calcBubblesY(n-1, "left") + radius.normal + pad;
        } else {
            x = calcBubblesX(n-1, "right") - radius.normal - pad;
            y = calcBubblesY(n-1, "right") + radius.normal + pad;
        }

        d3.select("#annotation-" + id + "-line").transition().duration(duration).delay(0).ease(d3.easeExpOut).attr("x1", x + dxdy[id].x).attr("y1", y + dxdy[id].y).attr("x2", x + dxdy[id].x).attr("y2", y + dxdy[id].y);
        d3.select("#annotation-" + id + "-connector").transition().duration(duration).delay(0).ease(d3.easeExpOut).attr("x1", x).attr("y1", y).attr("x2", x).attr("y2", y);
        d3.select("#annotation-" + id + "-title").transition().duration(duration).delay(0).ease(d3.easeExpOut).style("font-size", "0px")
        d3.select("#annotation-" + id + "-label").transition().duration(duration).delay(0).ease(d3.easeExpOut).style("font-size", "0px")
    });

}
