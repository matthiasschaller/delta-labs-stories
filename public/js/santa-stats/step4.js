let y1 = height/4;
let y2 = 3*height/4;
let fontSize = 14;
let chartHeight = height/2;
let x = width/5;
if (mobile) {
    x = 120;
}

function step4sub1() {
    keepRepeating = false;
    d3.select("#section-divider-text").style("font-size", "0px");

    if (svg.select("#speed-y-axis-line").size() == 0) {
        svg.append("line")
        .attr("id", "speed-y-axis-line")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("x1", x-2)
        .attr("x2", x-2)
        .attr("y1", y1)
        .attr("y2", y1)
    }

    svg.select("#speed-y-axis-line")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
        .attr("y2", y2)

    speedAddBar("reindeer", 15);
}

function step4sub2() {
    speedAddBar("falcon", 185);
}

function step4sub3() {
    speedAddBar("ulysses", 98640);
}

function step4sub4() {
    if (svg.select("#speed-y-axis-line").attr("opacity") == 0) {
        showAllStep4(1);
        keepRepeating = false;
        d3.select("#section-divider-text").style("font-size", "0px");
    } else {
        speedAddBar("santa", 2340000);
    }
}

function speedAddBar(text, value) {
    let bars = ["reindeer", "falcon", "ulysses", "santa"];
    let values = [15, 185, 98640, 2340000];
    let currentIndex = bars.indexOf(text);
    let barHeight = [0.5, 0.35, 0.2, 0.15][currentIndex] * chartHeight;
    let padHeight = [0.25, 0.1, 0.1, 0.4/5][currentIndex] * chartHeight;

    for ( var i = bars.length-1; i > currentIndex; i-- ) {
        let id = bars[i];
        svg.select("#speed-" + id + "-text").remove();
        svg.select("#speed-" + id + "-bar").remove();
        svg.select("#speed-" + id + "-value").remove();
    }

    for (var i = 0; i <= currentIndex; i++) {
        let id = bars[i];

        let thisDelay = 0;
        if (i == currentIndex) {
            thisDelay = duration.normal;
        }

        if (svg.select("#speed-" + id + "-bar").size() == 0) {

            svg.append("rect")
            .attr("id", "speed-" + id + "-bar")
            .style("stroke", colors[bars.length-1-i])
            .style("stroke-width", 2)
            .attr("fill", colors[bars.length-1-i])
            .attr("fill-opacity", 1)
            .attr("x", x)
            .attr("y", y1 + ((i + 1) * padHeight) + (i * barHeight))
            .attr("width", 0)
            .attr("height", barHeight)
            .transition().duration(duration.normal).delay(thisDelay).ease(d3.easeExpOut)
                .attr("width", (width-(2*x)) / values[currentIndex] * values[i])

        } else {

            svg.select("#speed-" + id + "-bar")
            .transition().duration(duration.normal).delay(thisDelay).ease(d3.easeExpOut)
                .attr("width", (width-(2*x)) / values[currentIndex] * values[i])
                .attr("y", y1 + ((i + 1) * padHeight) + (i * barHeight))
                .attr("height", barHeight)

        }
    
        if (svg.select("#speed-" + id + "-text").size() == 0) {

            svg.append("text")
                .attr("id", "speed-" + id + "-text")
                .attr("x", x-10)
                .attr("y", y1 + ((i + 1) * padHeight) + ((i + 0.5) * barHeight))
                .attr("text-anchor", "end")
                .attr("alignment-baseline", "middle")
                .style("font-size", "0px")
                .text(text.toUpperCase())
                .transition().duration(duration.normal).delay(thisDelay).ease(d3.easeBack)
                    .style("font-size", fontSize + "px")

        } else {
            svg.select("#speed-" + id + "-text")
            .transition().duration(duration.normal).delay(thisDelay).ease(d3.easeBack)
                .style("font-size", fontSize + "px")
                .attr("y",  y1 + ((i + 1) * padHeight) + ((i + 0.5) * barHeight))
        }

        if (svg.select("#speed-" + id + "-value").size() == 0) {

            svg.append("text")
                .attr("id", "speed-" + id + "-value")
                .attr("x", x + (width-(2*x)) / values[currentIndex] * values[i] + 10)
                .attr("y", y1 + ((i + 1) * padHeight) + ((i + 0.5) * barHeight))
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "middle")
                .style("font-size", "0px")
                .text(value)
                .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
                    .style("font-size", fontSize + "px")

            textTransition("speed-" + id + "-value", 0, value, duration.normal, duration.normal, null, " MPH")

        } else {

            svg.select("#speed-" + id + "-value")
            .transition().duration(duration.normal).delay(thisDelay).ease(d3.easeBack)
                .style("font-size", fontSize + "px")
                .attr("y",  y1 + ((i + 1) * padHeight) + ((i + 0.5) * barHeight))
                .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
                    .attr("x", x + (width-(2*x)) / values[currentIndex] * values[i] + 10)

        }

    }
}

function step4sub5() {
    showAllStep4(0);
    if (keepRepeating) {
        keepRepeating = false;
        d3.select("#section-divider-text").style("font-size", "0px");
    } else {
        keepRepeating = true;
        setTimeout(function() {
            scrollDownAnimation();
        }, 2*duration.normal);
    }
}

function showAllStep4(opacity) {
    ["speed-y-axis-line", 
    "speed-reindeer-text", "speed-falcon-text", "speed-ulysses-text", "speed-santa-text",
    "speed-reindeer-bar", "speed-falcon-bar", "speed-ulysses-bar", "speed-santa-bar",
    "speed-reindeer-value", "speed-falcon-value", "speed-ulysses-value", "speed-santa-value"].forEach(el => {
        svg.select("#" + el).transition().duration(duration.normal).delay(function(d,i) {
            return (Math.random() * duration.normal)
        }).ease(d3.easeExpOut).attr("opacity", opacity);
    });
}