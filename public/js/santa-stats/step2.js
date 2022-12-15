// function step2sub1() {
//     svg.selectAll(".donut-1-g").remove();
//     svg.selectAll(".donut-2-g").remove();
//     svg.select("#count-up-clock").remove();

//     svg.select("#section-divider-text")
//         .text("?")
//         .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
//         .style("font-size", (height / 2) + "px")
    
// }

function step2sub2() {
    svg.selectAll(".donut-1-g").remove();
    svg.selectAll(".donut-2-g").remove();
    svg.select("#count-up-clock").remove();

    // svg.select("#section-divider-text")
    //     .transition().duration(duration.short).delay(0).ease(d3.easeBack)
    //     .style("font-size", "0px")
          
    firstDonut();
    
    var text = svg.append("text")
        .attr("id", "count-up-clock")
        .attr("x", width/2)
        .attr("y", height/2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "0px")
        .text("0h")
        .transition().duration(duration.short).delay(duration.short)
            .style("font-size", width/10 + "px")
    
    text.transition().tween("text", function() {
        var selection = d3.select(this);
        var start = 0;
        var end = 24;
        var interpolator = d3.interpolateNumber(start,end); 

        return function(t) { selection.text(Math.round(interpolator(t)) + "h"); };
        
    }).duration(duration.normal).delay(duration.normal);
        
}

function firstDonut() {
    let radius = (Math.min(width, height) / 4);
    var pie = d3.pie().value(function(d) {
        return d
    })([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);


    var arc = d3.arc().outerRadius(radius-(0.03*width)).innerRadius(radius-(0.03*width)-(width/100));

    var g1 = svg.selectAll("arc")
        .data(pie)
        .enter()
        .append("g")
        .attr("transform", "translate(" + width/2 + ", " + height/2 + ")")
        .attr("class", "arc donut-1-g");

    g1.append("path")
        .style("fill", colors[0])
        .transition().delay(function (d, i) { return i*(duration.long / 24)}).duration(duration.short)
        .attrTween("d", arcTween)  

    function arcTween(d) {
        var i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
            d.endAngle = i(t);
            return arc(d);
        }
    }
}

function step2sub3() {
    svg.select("#stops-to-time-line").remove();
    svg.selectAll(".donut-2-g").remove();
    if (svg.select(".donut-1-g").attr("class").includes("transformed")) {
        svg.selectAll(".donut-1-g").attr("class", "donut-1-g").transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .attr("transform", "translate(" + width/2 + ", " + height/2 + ")")
    }
    moveDown100m();

    secondDonut();
    svg.select("#count-up-clock")
        .attr("y", height/2)
        .style("font-size", width/10 + "px")
        .transition().tween("text", function() {
            var selection = d3.select(this);
            var start = 24;
            var end = 31;
            var interpolator = d3.interpolateNumber(start,end); 

            return function(t) { selection.text(Math.round(interpolator(t)) + "h"); }; 
    })
    .duration(duration.long).delay(0);

}

function secondDonut() {
    let radius = (Math.min(width, height) / 4);
    var pie2 = d3.pie().value(function(d) {
        return d
    })([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);

    var arc2 = d3.arc().outerRadius(radius).innerRadius(radius-(width/100));

    var g2 = svg.selectAll("arc")
        .data(pie2)
        .enter()
        .append("g")
        .attr("class", "arc donut-2-g")
        .attr("transform", "translate(" + width/2 + ", " + height/2 + ")")

    g2.append("path")
        .style("fill", function(d,i) {
            if (i > 7) {
                return "#FFFFFF"
            } else {
                return colors[1]
            }
        })
        .transition().duration(duration.normal).delay(function (d, i) { return i*(duration.long / 7)})
        .attrTween("d", arcTween2)  

    function arcTween2(d) {
        var i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
            d.endAngle = i(t);
            return arc2(d);
        }
    }

    svg.select("#stops-to-time-line").remove();
    svg.select("#stops-per-hour").remove();
}

function step2sub4() {
    let yLine = height/4;
    let yTotals = height/4 - (fontSize1 * 2) - 10;
    if (mobile) {
        yLine = 80;
        yTotals = 50;
    }
    svg.selectAll(".donut-1-g")
        .attr("class", "donut-1-g transformed")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .attr("transform", "translate(" + (width/2 - fontSize1 * 6) + ", " + (height/2) +") scale(0.10)")
            .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .attr("transform", "translate(" + (width/2 - fontSize1 * 6) + ", " + ((height/4) + (2*fontSize1) + 10) +") scale(0.10)")

    svg.selectAll(".donut-2-g")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .attr("transform", "translate(" + (width/2 - fontSize1 * 6) + ", " + height/2 +") scale(0.1)")
            .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
                .attr("transform", "translate(" + (width/2 - fontSize1 * 6) + ", " + ((height/4) + (2*fontSize1) + 10) + ") scale(0.12)")

    svg.select("#count-up-clock")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .style("font-size", fontSize1 * 4 + "px")
            .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .attr("y", ((height/4) + (2*fontSize1) + 10))
    
    svg.select("#totals-100m")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .attr("y", yTotals)
            .attr("x", width / 2)
            .style("font-size", fontSize1 * 4 + "px")

    svg.select("#single-rect-red").transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
        .attr("y", yTotals - (0.5 * rectWidth) - 3)
        .attr("x", width/2 - fontSize1 * 20)

    svg.select("#single-rect-vertical").transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
        .attr("y", yTotals - (0.5 * rectWidth) - 3)
        .attr("x", width/2 - fontSize1 * 20 + (0.4 * rectWidth))

    svg.select("#single-rect-horizontal").transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
        .attr("y", yTotals - (0.5 * rectWidth) + (0.4 * rectWidth) - 3)
        .attr("x", width/2 - fontSize1 * 20)

    svg.append("line")
        .attr("id", "stops-to-time-line")
        .style("stroke-width", 2)
        .style("stroke", "black")
        .attr("x1", width/2 - fontSize1 * 24)
        .attr("x2", width/2 - fontSize1 * 24)
        .attr("y1", yLine)
        .attr("y2", yLine)
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
            .attr("x2", width/2 + fontSize1 * 24)

    svg.select("#stops-per-hour").remove();
    svg.append("text")
        .attr("id", "stops-per-hour")
        .attr("x", width/2)
        .attr("y", height/2 + (fontSize1 * 5))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", fontSize1 * 2 + "px")
        .attr("opacity", 0)
        .text("0 STOPS PER HOUR")
            .transition().duration(duration.short).delay(duration.short).ease(d3.easeExpOut)
            .attr("opacity", 1)

        textTransition("stops-per-hour", 0, 3677419, duration.short, duration.normal, null, " STOPS PER HOUR")
}   

// function step2sub5() {
//     svg.select("#stops-per-minute").remove();
//     svg.select("#stops-per-hour").remove();

//     svg.append("text")
//         .attr("id", "stops-per-hour")
//         .attr("x", width/2)
//         .attr("y", height/2 + (fontSize1 * 5))
//         .attr("text-anchor", "middle")
//         .attr("alignment-baseline", "middle")
//         .style("font-size", fontSize1 * 2 + "px")
//         .attr("opacity", 0)
//         .text("0 STOPS PER HOUR")
//             .transition().duration(duration.short).delay(0).ease(d3.easeExpOut)
//             .attr("opacity", 1)

//         textTransition("stops-per-hour", 0, 3677419, duration.short, duration.normal, null, " STOPS PER HOUR")
// }

function step2sub6() {
    svg.select("#stops-per-minute").remove();
    svg.select("#stops-per-second").remove();
    svg.append("text")
        .attr("id", "stops-per-minute")
        .attr("x", width/2)
        .attr("y", height/2 + (fontSize1 * 10))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", fontSize1 * 2 + "px")
        .attr("opacity", 0)
        .text("0 STOPS PER MINUTE")
            .transition().duration(duration.short).delay(0).ease(d3.easeExpOut)
            .attr("opacity", 1)

            textTransition("stops-per-minute", 0, 61290, duration.short, duration.normal, null, " STOPS PER MINUTE")
}

function step2sub7() {
    if (svg.select("#totals-100m").attr("opacity") == 0) {
        hideStep2(1);
    }
    svg.select("#stops-per-second").remove();
    svg.append("text")
        .attr("id", "stops-per-second")
        .attr("x", width/2)
        .attr("y", height/2 + (fontSize1 * 16))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", fontSize1 * 3 + "px")
        .text("0 STOPS PER SECOND")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
            .attr("opacity", 1)

            textTransition("stops-per-second", 0, 1022, duration.normal, duration.normal, null, " STOPS PER SECOND")

    keepRepeating = false;
    d3.select("#section-divider-text").style("font-size", "0px");
}

function step2sub8() {
    svg.select("#distance-rect-total").remove();
    svg.select("#distance-text-total").remove();
    svg.select("#distance-rect-sun").remove();
    svg.select("#distance-rect-earth-moon").remove();
    svg.select("#distance-text-earth-moon").remove();

    hideStep2(0);
    
    keepRepeating = true;
    setTimeout(function() {
        scrollDownAnimation();
    }, 2*duration.normal);
}

function hideStep2(opacity) {
    ["stops-per-second", "stops-per-minute", "stops-per-hour", "count-up-clock", "stops-to-time-line", "single-rect-red", "single-rect-vertical", "single-rect-horizontal", "totals-100m"].forEach(el => {
        d3.select("#" + el).transition().duration(duration.normal).delay(function(d,i) {
            return (Math.random() * duration.normal)
        }).ease(d3.easeBack)
            .attr("opacity", opacity)
    })

    svg.selectAll(".donut-1-g")
        .transition().duration(duration.normal).delay(duration.short).ease(d3.easeBack)
            .attr("opacity", opacity)

    svg.selectAll(".donut-2-g")
        .transition().duration(duration.normal).delay(duration.short).ease(d3.easeBack)
            .attr("opacity", opacity)
}