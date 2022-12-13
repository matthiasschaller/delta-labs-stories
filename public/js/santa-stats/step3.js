let padX = 100;
if (mobile) {
    padX = 10;
}

function step3sub1() {
    keepRepeating = false;
    svg.select("#section-divider-text").style("font-size", "0px");

    svg.select("#distance-rect-total").remove();
    svg.select("#distance-text-total").remove();
    svg.select("#distance-rect-sun").remove();
    svg.select("#distance-rect-earth-moon").remove();
    svg.select("#distance-text-earth-moon").remove();

    let y = ((1 - (0.5 / 0.8)) / 2) * height;
    svg.append("rect")
        .attr("id", "distance-rect-sun")
        .attr("fill", colors[0])
        .attr("fill-opacity", 1)
        .attr("stroke", colors[1])
        .attr("stroke-width", 2)
        .attr("x", padX - 2)
        .attr("y", y)
        .attr("width", 0)
        .attr("height", 0)

    svg.append("rect")
        .attr("id", "distance-rect-total")
        //.attr("class", "hbar christmas-striped")
        .attr("fill", colors[1])
        .attr("fill-opacity", 1)
        .attr("stroke", colors[0])
        .attr("stroke-width", 2)
        .attr("x", height/2)
        .attr("y", width/2)
        .attr("width", 0)
        .attr("height", 0)
        .transition().duration(duration.long).delay(0).ease(d3.easeExpOut)
            .attr("x", padX)
            .attr("y", height/4)
            .attr("width", width-(2*padX))
            .attr("height", height/2)

    svg.append("text")
        .attr("id", "distance-text-total")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "ideographic")
        .attr("x", width - padX - 4)
        .attr("y", 3*height/4 - 4)
        .style('fill', '#FFFFFF')
        .style("font-size", fontSize1 + "px")

    textTransition("distance-text-total", 0, 75000000, duration.normal, duration.normal, null,  " MILES");
}

function step3sub2() {
    svg.select("#distance-rect-earth-moon").remove();
    svg.select("#distance-text-earth-moon").remove();
    svg.select("#distance-rect-earth").remove();
    svg.select("#distance-text-earth").remove();

    svg.append("rect")
        .attr("id", "distance-rect-earth-moon")
        .attr("fill", colors[0])
        .attr("fill-opacity", 1)
        .attr("stroke", colors[1])
        .attr("stroke-width", 2)
        .attr("x", padX + 2)
        .attr("y", height/4 + 2)
        .attr("width", 0)
        .attr("height", 0)
        .transition().duration(duration.long).delay(0).ease(d3.easeExpOut)
            .attr("width", moonRect)
            .attr("height", moonRect)

    svg.append("text")
        .attr("id", "distance-text-earth-moon")
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "hanging")
        .attr("x", padX + 4 + moonRect + 5)
        .attr("y", height / 4 + 4)
        .style('fill', '#FFFFFF')
        .attr("opacity", 0)
        .text("DISTANCE EARTH-MOON: 0 MILES")
        .style("font-size", fontSize1 + "px")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
            .attr("opacity", 1)

        textTransition("distance-text-earth-moon", 0, 238855, duration.normal, duration.normal, "DISTANCE EARTH-MOON: ",  " MILES");


}

function step3sub3() {
    let y = height/4 + 2 + moonRect;
    if (mobile) {
        y = height/4 + 2 + (2 * fontSize1)
    }
    svg.select("#distance-rect-sun").transition().duration(duration.long).delay(0).ease(d3.easeExpOut)
        .attr("width", 0)
        .attr("height", 0)
        
    svg.select("#distance-text-sun").remove();
    svg.select("#distance-rect-earth").remove();
    svg.select("#distance-text-earth").remove();

    svg.append("rect")
        .attr("id", "distance-rect-earth")
        .attr("fill", colors[0])
        .attr("fill-opacity", 1)
        .attr("stroke", colors[1])
        .attr("stroke-width", 2)
        .attr("x", padX + 2 + moonRect - earthRect)
        .attr("y", y)
        .attr("width", 0)
        .attr("height", 0)
        .transition().duration(duration.long).delay(0).ease(d3.easeExpOut)
            .attr("width", earthRect)
            .attr("height", earthRect)

    svg.append("text")
        .attr("id", "distance-text-earth")
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "ideographic")
        .attr("x", padX + 4 + moonRect + 5)
        .attr("y", y + earthRect + 2)
        .style('fill', '#FFFFFF')
        .attr("opacity", 0)
        .text("TRIP AROUND THE EARTH: 0 MILES")
        .style("font-size", fontSize1 + "px")
        .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
            .attr("opacity", 1)

        textTransition("distance-text-earth", 0, 24901, duration.normal, duration.normal, "TRIP AROUND THE EARTH: ",  " MILES");
}

function step3sub4() {
    if (svg.select("#distance-rect-earth").attr("opacity") == 0) {
        showAllStep3(1);
    } else {
        let y = ((1 - (0.5 / 0.8)) / 2) * height;

        svg.select("#distance-rect-sun")
            .transition().duration(duration.long).delay(0).ease(d3.easeExpOut)
            .attr("width", width - (2 * padX) + 4)
            .attr("height", 0.5/0.8 * height)
    
        svg.append("text")
            .attr("id", "distance-text-sun")
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "hanging")
            .attr("x", padX + 4 )
            .attr("y", y + 4)
            .style('fill', '#FFFFFF')
            .attr("opacity", 0)
            .text("TRIP AROUND THE EARTH: 0 MILES")
            .style("font-size", fontSize1 + "px")
            .transition().duration(duration.normal).delay(0).ease(d3.easeExpOut)
                .attr("opacity", 1)
    
            textTransition("distance-text-sun", 0, 91000000, duration.normal, duration.normal, "DISTANCE EARTH-SUN: ",  " MILES");
    }
}

function step3sub5() {
    ["speed-y-axis-line", "speed-reindeer-text", "speed-reindeer-bar", "speed-reindeer-value"].forEach(el => {
        svg.select("#" + el).remove();
    });
    showAllStep3(0);
    keepRepeating = true;
    setTimeout(function() {
        scrollDownAnimation();
    }, 2*duration.normal);
}

function showAllStep3(opacity) {
    ["earth", "earth-moon", "total", "sun"].forEach(el => {
        ["rect", "text"].forEach(p => {
            svg.select("#distance-" + p + "-" + el).transition().duration(duration.normal).delay(function(d,i) {
                return (Math.random() * duration.normal)
            }).ease(d3.easeExpOut).attr("opacity", opacity);
        })
    });
}