let data = [];
let sectionLabels = ["start", "gender"];
let bubbles;
let radius = 15;
let pad = 5;
let padding = 20;
let circlesPerBarWidth = 5;
let fontSize = { small: 12, normal: 24, large: 50 };
let n = 100;

let scaleX = d3.scaleLinear().domain([0, 1]).range([padding, width-padding]);
let scaleY = d3.scaleLinear().domain([0, 1]).range([padding + navHeight, height-padding]);

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

    initData();
    initDots();

}());

function scroll(pos) {
    //console.log(pos)
    if (pos < 1) {
        showDots();
    } else if (pos < 2) {
        showDescriptives("gender");
    }
}

function initData() {
    for (let x = 1; x <= n; x++) {
        let gender = "male";
        let random = Math.random();
        if (random > 0.45 && random < 0.9) {
            gender = "female";
        } else if (random >= 0.9) {
            gender = "other";
        }

        let delay = Math.random();
        data.push({ id: x, gender: gender, delay: delay, positions: { 
            start: { cx: null, cy: null },
            gender: { cx: null, cy: null },
        } });
    }

    initDescriptiveData("gender");
    initDescriptivesLabels("gender");
    initDescriptivesValues("gender");
}

function initDescriptiveData(label) {
    let x = getXPosBars(label);

    let y = scaleY(0.8);

    data.forEach(d => {
        d.positions[label].cx = x[d[label]].pos + ((x[d[label]].counter % circlesPerBarWidth) * ((2*radius) + pad));
        d.positions[label].cy = y - (Math.floor(x[d[label]].counter / circlesPerBarWidth) * ((2*radius) + pad))
        x[d[label]].counter = x[d[label]].counter + 1;
    });
}

function getXPosBars(label) {
    let x = {};

    let categories = getCategories(label);

    let barPad = ((width / categories.length) - (circlesPerBarWidth * ((2*radius) + pad))) / 2;
    categories.forEach(function(cat, index) {
        x[cat] = {};
        x[cat].pos = barPad + (index * width / categories.length)
        x[cat].counter = 0;
    });

    return x;
}

function getCategories(label) {
    let totals = calculateTotals(label);
    let categories = Object.keys(totals);
    return categories;
}

function initDots() {
    bubbles = svg.selectAll('.bubble').data(data).enter()
        .append('circle')
        .attr("class", (d) => d.gender + " bubble")
        .attr("id", (d) => "bubble-" + d.id)
        .attr('r', 0)
        .attr('fill', "#c3c3c3")
        .attr("cx", d => scaleX(Math.random()))
        .attr("cy", d => scaleY(randn_bm()));

    storePositions("start");
}

function showDots() {
    let delayDenom = 1.5;
    bubbles.attr("r",function(d) {
        if (scrollPosition > (d.delay / delayDenom)) {
            let thisRadius = Math.min(radius, (scrollPosition - (d.delay / delayDenom)) * 100);
            return thisRadius;
        }
    });
}

function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) return randn_bm()
    return num
}

function showDescriptives(label) {
    let sectionIndex = sectionLabels.indexOf(label);
    let localPosition = scrollPosition - sectionIndex;

    colorDots(localPosition, label);

    let movementDuration = 0.25;
    bubbles
        .attr("cx", function(d) {
            let delay = ((d.id / n) / 5) + 0.25;
            if (localPosition >= delay) {
                let progress = Math.min((localPosition - delay) / movementDuration, 1);
                return ((progress * d.positions[label].cx) + ((1-progress) * d.positions[sectionLabels[sectionIndex-1]].cx))
            } else {
                return (d.positions[sectionLabels[sectionIndex-1]].cx)
            }
        })
        .attr("cy", function(d) {
            let delay = ((d.id / n) / 5) + 0.25;
            if (localPosition >= delay) {
                let progress = Math.min((localPosition - delay) / movementDuration, 1);
                return ((progress * d.positions[label].cy) + ((1-progress) * d.positions[sectionLabels[sectionIndex-1]].cy))
            } else {
                return d.positions[sectionLabels[sectionIndex-1]].cy
            }
        })
    
    showDecriptiveLabels(label, localPosition);
    showDecriptiveValues(label, localPosition);

}

function initDescriptivesLabels(label) {
    let categories = getCategories(label);
    let x = getXPosBars(label);


    categories.forEach(function(cat, index) {
        svg.append("text")
            .text(cat)
            .attr("id", "desc-" + cat + "-label")
            .attr("text-anchor", "middle")
            .attr("x", x[cat].pos + ((circlesPerBarWidth * radius * 2) / 2) - pad)
            .attr("y", scaleY(0.8) + (2 * radius) + pad + 10)
            .style("font-size", "0px")
    });
}

function initDescriptivesValues(label) {
    let totals = calculateTotals(label);
    let categories = getCategories(label);
    let x = getXPosBars(label);

    categories.forEach(function(cat, index) {
        svg.append("text")
            .text(Math.round((totals[cat] / n) * 100) + "%")
            .attr("id", "desc-" + cat + "-value")
            .attr("text-anchor", "middle")
            .attr("x", x[cat].pos + ((circlesPerBarWidth * radius * 2) / 2) - pad)
            .attr("y", scaleY(0.8) - (Math.ceil(totals[cat] / circlesPerBarWidth) * (2 * radius + pad)) - pad - 10)
            .style("font-size", "0px")
    });
}

function showDecriptiveLabels(label, localPosition) {
    let categories = getCategories(label);
    let movementDuration = 0.25;
    categories.forEach(function(cat, index) {
        svg.select("#desc-" + cat + "-label")
            .style("font-size", function(d) {
                if (localPosition >= 0.5) {
                    let progress = Math.min((localPosition - 0.5) / movementDuration, 1);
                    return (Math.round(progress * fontSize.normal) + "px")
                } else {
                    return (0 + "px")
                }
            });
    });
}

function showDecriptiveValues(label, localPosition) {
    let categories = getCategories(label);
    let movementDuration = 0.25;
    categories.forEach(function(cat, index) {
        svg.select("#desc-" + cat + "-value")
            .style("font-size", function(d) {
                if (localPosition >= 0.5) {
                    let progress = Math.min((localPosition - 0.5) / movementDuration, 1);
                    return (Math.round(progress * fontSize.large) + "px")
                } else {
                    return (0 + "px")
                }
            });
    });
}

function colorDots(localPosition, label) {
    let delayDenom = 5;
    bubbles.attr("class", function(d) {
        if (localPosition > (d.delay / delayDenom)) {
            return "bubble " + label + " " + d.gender;
        } else {
            return "bubble " + d[label];
        }
    });
}

function calculateTotals(label) {
    let totals = {};
    data.forEach(d => {
        if (!Object.keys(totals).includes(d[label])) {
            totals[d[label]] = 0;
        }

        totals[d[label]] = totals[d[label]] + 1;
    });

    return totals;
}

function storePositions(section) {
    data.forEach(d => {
        d.positions[section].cx = d3.select("#bubble-" + d.id).attr("cx");
        d.positions[section].cy = d3.select("#bubble-" + d.id).attr("cy");
    });
}