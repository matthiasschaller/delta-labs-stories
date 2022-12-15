let fontSize1 = Math.round(0.015 * width);
let padX = 100;
if (mobile) {
    fontSize1 = Math.round(0.02 * width);
    padX = 10;
}

let keepRepeating = true;
let presentX = null;
let totalY = null;


function initStep1() {
    scrollDownAnimation();

    svg.select("#donut-1-g").remove();
    svg.select("#count-up-clock").remove();


    if (svg.selectAll(".firstRects").size() == 0) {
        singleRect = svg.append("g")
    
        singleRect.append("rect")
            .attr("id", "single-rect-red")
            .attr('fill', colors[3])
            .attr("x", getRectPositionX(0) - 0.5 * rectWidth)
            .attr("y", getRectPositionY(0) - 0.5 * rectWidth)
            .attr("width", (10 * rectWidth) + (10 * pad))
            .attr("height", (10 * rectWidth) + (10 * pad))
            .attr("opacity", 0)
    
        singleRect.append("rect")
            .attr("id", "single-rect-vertical")
            .attr('fill', colors[1])
            .attr("x", getRectPositionX(4) - 0.5 * rectWidth)
            .attr("y", getRectPositionY(0) - 0.5 * rectWidth)
            .attr("width", (2 * rectWidth) + (2 * pad))
            .attr("height", (10 * rectWidth) + (10 * pad))
            .attr("opacity", 0)

        singleRect.append("rect")
            .attr("id", "single-rect-horizontal")
            .attr('fill', colors[1])
            .attr("x", getRectPositionX(0) - 0.5 * rectWidth)
            .attr("y", getRectPositionY(4) - 0.5 * rectWidth)
            .attr("width", (10 * rectWidth) + (10 * pad))
            .attr("height", (2 * rectWidth) + (2 * pad))
            .attr("opacity", 0)

        svg.append("line")
            .attr("id", "total-linethrough")
            .style("stroke", "black")
            .style("stroke-width", 2)
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", getRectPositionY(3) + 50)
            .attr("y2", getRectPositionY(3) + 50)

        svg.append("text")
            .attr("id", "totals-400m")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("x", (width/2))
            .attr("y", getRectPositionY(4) + 70)
            .style("font-size", "0px")
            .text("400.000.000 presents")

        svg.append("text")
            .attr("id", "totals-100m")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("x", (width/2))
            .attr("y", getRectPositionY(4) + fontSize1 + 90)
            .style("font-size", "0px")
            .text("114.000.000 stops")

        rectGroup = svg.append("g");

        rectGroup.selectAll('.firstRects').data(data).enter().append("rect")
            .attr("id", d => {
                return "rect-" + d.id;
            })
            .attr("class", function(d) {
                let classes = "firstRects";
                if (d.color == colors[1]) {
                    classes = classes + " green";
                }
                return classes
            })
            .attr('x', d => {
                return getRectPositionX(d.x)
             })
            .attr('y', d => {
                return getRectPositionY(d.y)
            })
            .attr('width', 0)
            .attr('height', 0)
            .attr('fill', d => { return colors[3] })

        svg.append("line")
            .attr("id", "rect-annotation-horizontal")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("x1", (width/2) - (5 * (pad + rectWidth)) + pad)
            .attr("x2", (width/2) - (5 * (pad + rectWidth)) + pad)
            .attr("y1", (height/2) + (5 * (pad + rectWidth)) + 10)
            .attr("y2", (height/2) + (5 * (pad + rectWidth)) + 10)

        svg.append("line")
            .attr("id", "rect-annotation-vertical")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("x1", (width/2) + (5 * (pad + rectWidth)) + 10)
            .attr("x2", (width/2) + (5 * (pad + rectWidth)) + 10)
            .attr("y1", (height/2) - (5 * (pad + rectWidth)))
            .attr("y2", (height/2) - (5 * (pad + rectWidth)))

        svg.append("text")
            .attr("id", "rect-annotation-horizontal-text")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("x", (width/2))
            .attr("y", (height/2) + (5 * (pad + rectWidth)) + 10 + (1.5 * fontSize))
            .style("font-size", "0px")
            .text("10 presents")

        svg.append("text")
            .attr("id", "rect-annotation-vertical-text")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "start")
            .attr("x", (width/2) + (5 * (pad + rectWidth)) + 10 + (0.5 * fontSize))
            .attr("y", (height/2))
            .style("font-size", "0px")
            .text("10 presents")

        svg.append("text")
            .attr("id", "rect-annotation-x")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("x", (width/2))
            .attr("y", (height/2) + (5 * (pad + rectWidth)) + 10 + (1.5 * fontSize))
            .style("font-size", "0px")
            .text("x")

        svg.append("text")
            .attr("id", "rect-annotation-total")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("x", (width/2))
            .attr("y", (height/2) + (5 * (pad + rectWidth)) + 0.15 * height)
            .style("font-size", "0px")
            .text("100 presents")

    } else {
        resetToOriginalRect();
    }

}

function resetToOriginalRect() {
    svg.selectAll('.firstRects')
    .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
        .attr('fill', d => { return colors[3] })
        .attr('x', d => {
            return getRectPositionX(d.x)
        })
        .attr('y', d => {
            return getRectPositionY(d.y)
        })
        .attr('width', 0)
        .attr('height', 0)

    svg.select("#rect-annotation-horizontal")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
            .attr("x2", (width/2) - (5 * (pad + rectWidth)) + pad)

    svg.select("#rect-annotation-vertical")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
            .attr("y2", (height/2) - (5 * (pad + rectWidth)) + 0 * (pad + rectWidth))

    svg.select("#rect-annotation-horizontal-text")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .style("font-size", "0px")

    svg.select("#rect-annotation-vertical-text")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .style("font-size", "0px")
}

function getRectPositionX(x) {
    return (width/2) - (4.5 * (pad + rectWidth)) + x * (pad + rectWidth);
}

function getRectPositionY(y) {
    return (height/2) - (4.5 * (pad + rectWidth)) + y * (pad + rectWidth);
}

function getRectPositionXFull(x) {
    return (10 + (x + 0.5) * (pad + rectWidth));
}

function getRectPositionYFull(y) {
    if (mobile) {
        return (10 + y * (pad + rectWidth));
    } else {
        return (navHeight + 10 + y * (pad + rectWidth));
    }
}

function growRect() {
    keepRepeating = false;
    d3.select("#section-divider-text").style("font-size", "0px");

    svg.select("#single-rect-red").transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
            .attr("opacity", 0)

    rectGroup.attr("opacity", 1)

    let delay = 0.45 / 100;
    svg.selectAll(".firstRects")
        .transition().duration(duration.long).delay((d, i) => i * delay).ease(d3.easeExpOut)
            .attr("x", function(d) {
                return getRectPositionX(d.x) - (0.5 * rectWidth)
            })
            .attr("y", function(d) {
                return getRectPositionY(d.y) - (0.5 * rectWidth)
            })
            .attr("width", rectWidth)
            .attr("height", rectWidth)

    svg.select("#rect-annotation-horizontal")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
        .attr("x2", (width/2) - (5 * (pad + rectWidth)) + (10 * rectWidth) + (9 * pad))

    svg.select("#rect-annotation-vertical")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
        .attr("y2", (height/2) - (5 * (pad + rectWidth)) + 10 * (pad + rectWidth))

    svg.select("#rect-annotation-horizontal-text")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
        .attr("transform", "translate(0,0)")
        .attr("x", (width/2))
        .style("font-size", fontSize1 + "px")

    svg.select("#rect-annotation-vertical-text")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
        .attr("transform", "translate(0,0)")
        .attr("y", (height/2))
        .attr("x", (width/2) + (5 * (pad + rectWidth)) + 10 + (0.5 * fontSize))
        .style("font-size", fontSize1 + "px")

    svg.select("#rect-annotation-total")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .style("font-size", "0px")

    svg.select("#rect-annotation-x")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .style("font-size", "0px")
}

function growToSingleRect() {
    increaseRectSize(duration.normal, 0);

    svg.select("#rect-annotation-horizontal-text")
        .text("10")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
            .attr("x", (width/2) - (2.5 * rectWidth) - (2.5 * pad))
            .style("font-size", fontSize1 + "px")
        
    svg.select("#rect-annotation-vertical-text")
        .text("10 presents")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
            .attr("y", (height/2) + (5 * (pad + rectWidth)) + 10 + (1.5 * fontSize))
            .style("font-size", fontSize1 + "px")
            .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
                .attr("x", (width/2) + (1.5 * (rectWidth + pad)))

    svg.select("#rect-annotation-horizontal")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
        .attr("x2", (width/2) - (5 * (pad + rectWidth)) + (10 * rectWidth) + (9 * pad))

    svg.select("#rect-annotation-vertical")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
        .attr("y2", (height/2) - (5 * (pad + rectWidth)) + 0 * (pad + rectWidth))

    svg.select("#rect-annotation-x")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
        .style("font-size", fontSize1 + "px")

    svg.select("#rect-annotation-total")
        .text("100 presents")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
        .style("font-size", fontSize1 * 2 + "px")

    svg.select("#single-rect-red")
        .attr("opacity", 0)
        .attr('fill', colors[3])
        .transition().duration(duration.short).delay(duration.normal).ease(d3.easeExpOut)
            .attr("opacity", 1)

    svg.selectAll(".firstRects")
        .attr('fill', colors[3])
    
}

function increaseRectSize(duration, delay) {
    svg.selectAll(".firstRects")
        .attr("x", function(d) {
            return getRectPositionX(d.x) - (0.5 * rectWidth)
        })
        .attr("y", function(d) {
            return getRectPositionY(d.y) - (0.5 *  rectWidth)
        })
        .attr("width", rectWidth)
        .attr("height", rectWidth)
        .transition().duration(duration).delay(delay).ease(d3.easeBack) 
            .attr("x", function(d) {
                return getRectPositionX(d.x) - (0.5 * rectWidth)
            })
            .attr("y", function(d) {
                return getRectPositionY(d.y) - (0.5 *  rectWidth)
            })
            .attr("width", rectWidth + pad)
            .attr("height", rectWidth + pad)
}

function redoGrow(step) {
    rectGroup.attr("opacity", 1);
    svg.selectAll(".rects-21").remove();

    let child1 = "100";
    let child2 = "100 presents";
    let childTotal = "10.000 presents";
    svg.selectAll(".firstRects").attr('fill', colors[2-step]);
    svg.select("#single-rect-vertical").attr("opacity", 0);
    svg.select("#single-rect-horizontal").attr("opacity", 0);

    if (step == 2) {
        child1 = "100";
        child2 = "10.000 presents"
        childTotal = "1.000.000 presents";
    // } else if (step == 3) {
    //     child1 = "100";
    //     child2 = "1.000.000 presents"
    //     childTotal = "100.000.000 presents";

        svg.selectAll(".firstRects.green").attr('fill', colors[1]);
        svg.select("#single-rect-vertical")
        .attr("x", getRectPositionX(4) - 0.5 * rectWidth)
        .attr("y", getRectPositionY(0) - 0.5 * rectWidth)
        .transition().duration(duration.short).delay(duration.short + duration.normal).ease(d3.easeExpOut)   
            .attr("opacity", 1)
            .attr("width", (2 * rectWidth) + (2 * pad))
            .attr("height", (10 * rectWidth) + (10 * pad))

        svg.select("#single-rect-horizontal")
            .attr("x", getRectPositionX(0) - 0.5 * rectWidth)
            .attr("y", getRectPositionY(4) - 0.5 * rectWidth)
            .transition().duration(duration.short).delay(duration.short + duration.normal).ease(d3.easeExpOut)   
                .attr("width", (10 * rectWidth) + (10 * pad))
                .attr("height", (2 * rectWidth) + (2 * pad))
                .attr("opacity", 1)
    }

    svg.select("#single-rect-red")
        .transition().duration(duration.short).delay(0).ease(d3.easeExpOut)    
            .attr("width", rectWidth)
            .attr("height", rectWidth)
            .attr("x", getRectPositionX(0) - 0.5 * rectWidth)
            .attr("y", getRectPositionY(0) - 0.5 * rectWidth)
            .transition().duration(duration.short).delay(duration.normal).ease(d3.easeExpOut)   
                .attr("fill", colors[2-step])
                .attr("width", (10 * rectWidth) + (10 * pad))
                .attr("height", (10 * rectWidth) + (10 * pad)) 
                .attr("opacity", 1)

    svg.selectAll(".firstRects")
        .attr("opacity", 0)
        .attr("width", rectWidth)
        .attr("height", rectWidth)
        .transition().duration(duration.short).delay(function(d, i) {
            return (duration.short + (i/100) * duration.normal)
        }).ease(d3.easeExpOut)
            .attr("opacity", 1)
            .transition().duration(duration.short).delay(0).ease(d3.easeExpOut)
                .attr("width", rectWidth + pad)
                .attr("height", rectWidth + pad)

    svg.select("#rect-annotation-horizontal")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
        .attr("x2", (width/2) - (5 * (pad + rectWidth)) + (10 * rectWidth) + (9 * pad))

    svg.select("#rect-annotation-total").attr("y", (height/2) + (5 * (pad + rectWidth)) + 0.15 * height)

    updateChildrenText("rect-annotation-vertical-text", child2, fontSize1);
    updateChildrenText("rect-annotation-horizontal-text", child1, fontSize1);
    updateChildrenText("rect-annotation-total", childTotal, 2* fontSize1);
    updateChildrenText("rect-annotation-x", "x", fontSize1);
    
}

function updateChildrenText(id, text, size) {
    svg.select("#" + id)
    .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
        .attr("opacity", 0)
        .transition().duration(0).delay(0).ease(d3.easeExpOut)
            .text(text)
            .style("font-size", size + "px")
            .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
                .attr("opacity", 1)
}

function moveFirstRectToTop() {
    rectGroup.attr("opacity", 0);
    svg.select("#single-rect-red").transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
        .attr("width", rectWidth)
        .attr("height", rectWidth)
        .attr("x", getRectPositionXFull(0) - (0.5 * rectWidth))    
        .attr("y", getRectPositionYFull(0) - (0.5 * rectWidth))

    svg.select("#single-rect-vertical").transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
        .attr("x", getRectPositionXFull(0) - (0.1 * rectWidth))    
        .attr("y", getRectPositionYFull(0) - (0.5 * rectWidth))
        .attr("width", 0.2 *rectWidth)
        .attr("height", rectWidth)

    svg.select("#single-rect-horizontal").transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
        .attr("x", getRectPositionXFull(0) - (0.5 * rectWidth))
        .attr("y", getRectPositionYFull(0) - (0.1 * rectWidth))
        .attr("width", rectWidth)
        .attr("height", 0.2 * rectWidth)

    svg.select("#rect-annotation-x")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
        .style("font-size", "0px")

    svg.select("#rect-annotation-vertical-text")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
        .style("font-size", "0px")

    svg.select("#rect-annotation-horizontal-text")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
        .style("font-size", "0px")

    svg.select("#rect-annotation-horizontal")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
            .attr("x2", (width/2) - (5 * (pad + rectWidth)) + pad)

    multiplyPresent();
}

function multiplyPresent() {
    d3.selectAll(".rects-21").remove();
    let currentY = 0;
    let currentX = 0;
    let thisY = 0;
    let presentsPerRow = Math.floor((width - (2*10)) / (rectWidth + pad));

    for (var i = 0; i < 400; i++) {
        thisY = Math.floor(i / presentsPerRow);
        if (thisY > currentY) {
            currentY = thisY;
            currentX = 0;
        }
        if (i > 0) {
            svg.append("rect")
            .attr("class", "rects-21")
            .attr("id", "rects-21-red-" + i)
            .attr('fill', colors[0])
            .attr("x", getRectPositionXFull(currentX) - (0.5 * rectWidth))
            .attr("y", getRectPositionYFull(currentY) - (0.5 * rectWidth))
            .attr("width", rectWidth)
            .attr("height", rectWidth)
            .attr("opacity", 0)
            .transition().duration(duration.normal).delay(d => {
                return ((1000 / 400) * i)
            }).ease(d3.easeExpOut)
                .attr("opacity", 1)

            svg.append("rect")
                .attr("class", "rects-21")
                .attr("id", "rects-21-green1-" + i)
                .attr('fill', colors[1])
                .attr("x", getRectPositionXFull(currentX) - (0.1 * rectWidth))    
                .attr("y", getRectPositionYFull(currentY) - (0.5 * rectWidth))
                .attr("width", 0.2 *rectWidth)
                .attr("height", rectWidth)
                .attr("opacity", 0)
                .transition().duration(duration.normal).delay(d => {
                    return ((1000 / 400) * i)
                }).ease(d3.easeExpOut)
                    .attr("opacity", 1)

            svg.append("rect")
                .attr("class", "rects-21")
                .attr("id", "rects-21-green2-" + i)
                .attr('fill', colors[1])
                .attr("x", getRectPositionXFull(currentX) - (0.5 * rectWidth))
                .attr("y", getRectPositionYFull(currentY) - (0.1 * rectWidth))
                .attr("width", rectWidth)
                .attr("height", 0.2 * rectWidth)
                .attr("opacity", 0)
                .transition().duration(duration.normal).delay(d => {
                    return ((1000 / 400) * i)
                }).ease(d3.easeExpOut)
                    .attr("opacity", 1)

        }
        currentX++;

    }       

    totalY = getRectPositionYFull(currentY + 1) + 50;
    if (mobile) {
        totalY = totalY - 50;
    }
    svg.select("#rect-annotation-total")
    .transition().duration(duration.short).delay(0).ease(d3.easeExpOut)
        .attr("opacity", 0)
        .transition().duration(0).delay(0).ease(d3.easeExpOut)
            .text("400.000.000 presents")
            .style("font-size", fontSize1 * 2 + "px")
            .transition().duration(duration.short).delay(duration.short).ease(d3.easeExpOut)
                .attr("opacity", 1)
                .transition().duration(duration.short).delay(0).ease(d3.easeBack)
                    .attr("y", totalY)

    allChildrenWidth = d3.select("#rect-annotation-total").node().getComputedTextLength();

    svg.select("#total-linethrough")
    .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
        .attr("x1", (width/2) - (allChildrenWidth / 2))
        .attr("x2", (width/2) - (allChildrenWidth / 2))

    svg.select("#totals-400m")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
            .style("font-size", "0px")

    svg.select("#totals-100m")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .attr("y", totalY + fontSize1 * 1.5 + 30)
            .style("font-size", "0px")
}

function fifteenPercent() {
    // for (var i = 1; i <= 20; i++) {
    //     let opa = 1;
    //     if (i >= 4) {
    //         opa = 0.3;
    //     }

    //     svg.select("#rects-21-red-" + i)
    //     .transition().duration(duration.normal).delay(d => {
    //         return ((500 / 20) * (i-4))
    //     }).ease(d3.easeExpOut)
    //         .attr("opacity", opa)

    //     svg.select("#rects-21-green1-" + i)
    //     .transition().duration(duration.normal).delay(d => {
    //         return ((500 / 20) * (i-4))
    //     }).ease(d3.easeExpOut)
    //         .attr("opacity", opa)

    //     svg.select("#rects-21-green2-" + i)
    //     .transition().duration(duration.normal).delay(d => {
    //         return ((500 / 20) * (i-4))
    //     }).ease(d3.easeExpOut)
    //         .attr("opacity", opa)
    // }

    // allChildrenWidth = d3.select("#rect-annotation-total").node().getComputedTextLength();

    // svg.select("#total-linethrough")
    //     .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
    //         .attr("x2", (width/2) + (allChildrenWidth / 2))
    //         .attr("x1", (width/2) - (allChildrenWidth / 2))

    // svg.select("#totals-400m")
    //     .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
    //         .style("font-size", fontSize1 * 1.5 + "px")


}

function nStops() {
    svg.select("#section-divider-text")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
        .style("font-size", "0px")

    svg.select("#totals-100m")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
            .style("font-size", fontSize1 * 1.5 + "px")
            .attr("y", totalY + fontSize1 * 1.5 + 30)

    // svg.select("#totals-400m")
    //     .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
    //         .style("font-size", fontSize1 * 1.5 + "px")

    // svg.select("#total-linethrough")
    //     .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
    //         .attr("x2", (width/2) + (allChildrenWidth / 2))
    //         .attr("x1", (width/2) - (allChildrenWidth / 2))

    svg.select("#rect-annotation-total")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
            .style("font-size", fontSize1 * 2 + "px")

    svg.select("#single-rect-red").transition().duration(duration.normal).delay(0).ease(d3.easeBack)
        .attr("x", getRectPositionXFull(0) - 0.5 * rectWidth)
        .attr("y", getRectPositionYFull(0) - 0.5 * rectWidth)
    
    svg.select("#single-rect-vertical").transition().duration(duration.normal).delay(0).ease(d3.easeBack)
        .attr("x", getRectPositionXFull(0) - (0.1 * rectWidth))    
        .attr("y", getRectPositionYFull(0) - (0.5 * rectWidth))


    svg.select("#single-rect-horizontal").transition().duration(duration.normal).delay(0).ease(d3.easeBack)
        .attr("x", getRectPositionXFull(0) - (0.5 * rectWidth))
        .attr("y", getRectPositionYFull(0) - (0.1 * rectWidth))

}

function moveStopsDown() {
    svg.selectAll(".donut-1-g").remove();
    svg.selectAll(".donut-2-g").remove();
    svg.select("#count-up-clock").remove();
    // svg.select("#totals-400m")
    //     .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
    //         .style("font-size", "0px")

    // svg.select("#total-linethrough")
    //     .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
    //         .attr("x2", (width/2) - (allChildrenWidth / 2))
    //         .attr("x1", (width/2) - (allChildrenWidth / 2))

    svg.select("#rect-annotation-total")
        .transition().duration(duration.normal).delay(duration.normal).ease(d3.easeExpOut)
            .style("font-size", "0px")

    for (var i = 400; i >= 1; i--) {
        svg.select("#rects-21-red-" + i)
        .transition().duration(duration.normal).delay(d => {
            return ((1000 / 400) * i)
        }).ease(d3.easeExpOut)
            .attr("opacity", 0)

        svg.select("#rects-21-green1-" + i)
        .transition().duration(duration.normal).delay(d => {
            return ((1000 / 400) * i)
        }).ease(d3.easeExpOut)
            .attr("opacity", 0)

        svg.select("#rects-21-green2-" + i)
        .transition().duration(duration.normal).delay(d => {
            return ((1000 / 400) * i)
        }).ease(d3.easeExpOut)
            .attr("opacity", 0)
    }

    presentX = (width/2) - (d3.select("#totals-100m").node().getComputedTextLength() / 2) - rectWidth - 15;
    moveDown100m();
}

function moveDown100m() {
    let bt = width * 0.035;
    svg.select("#totals-100m")
        .transition().duration(duration.normal).delay(0).ease(d3.easeBack)
            .style("font-size", fontSize1 * 1.5 + "px")
            .attr("y", height - bt)

    svg.select("#single-rect-red").transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
        .attr("x", presentX)
        .attr("y", height - bt - (0.5 * rectWidth))

    svg.select("#single-rect-vertical").transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
        .attr("x", presentX + (0.4 * rectWidth))
        .attr("y", height - bt - (0.5 * rectWidth))

    svg.select("#single-rect-horizontal").transition().duration(duration.normal).delay(duration.normal).ease(d3.easeBack)
        .attr("x", presentX)
        .attr("y", height - bt - (0.5 * rectWidth) + (0.4 * rectWidth))

}