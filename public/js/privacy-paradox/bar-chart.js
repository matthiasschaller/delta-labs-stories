function initBarData(label) {
    let x = getXPosBars(label);

    let y = scaleY(0.8);

    data.forEach(d => {
        d.positions[label].cx = x[d[label]].pos + ((x[d[label]].counter % circlesPerBarWidth) * ((2*radius) + pad));
        d.positions[label].cy = y - (Math.floor(x[d[label]].counter / circlesPerBarWidth) * ((2*radius) + pad));
        d.label[label] = datalabels[label][d[label]];
        d.color[label] = datacolors[label][d[label]];
        
        x[d[label]].counter = x[d[label]].counter + 1;
    });

    initBarLabels(label, "label");
    initBarLabels(label, "value");
}

function initBarLabels(label, element) {
    let totals = calculateTotals(label);
    let categories = getCategories(label);
    let x = getXPosBars(label);

    categories.forEach(function(cat, index) {
        let content = datalabels[label][cat];
        let y = scaleY(0.8) + (2 * radius) + pad + 10;
        if (element == "value") {
            content = Math.round((totals[cat] / n) * 100) + "%";
            y = scaleY(0.8) - (Math.ceil(totals[cat] / circlesPerBarWidth) * (2 * radius + pad)) - pad - 10;
        }

        svg.append("text")
            .text(content)
            .attr("id", "bar-" + label + "-" + cat + "-" + element)
            .attr("text-anchor", "middle")
            .attr("x", x[cat].pos + ((circlesPerBarWidth * radius * 2) / 2) - pad)
            .attr("y", y)
            .style("font-size", "0px")
    });
}

function showBars(label, section) {
    let sectionIndex = sectionLabels.indexOf(label);
    let localPosition = scrollPosition - sectionIndex;
    let colorDelay = 5;

    if (checkSection(section)) {
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
            .style("fill", function(d) {
                if (localPosition > (d.delay / colorDelay)) {
                    return d.color[label];
                } else {
                    return (d3.select(this).style("fill"))
                }
            });
    }

    showBarLabels(label, localPosition, section, "label");
    showBarLabels(label, localPosition, section, "value");
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

function showBarLabels(label, localPosition, section, element) {
    let categories = getCategories(label);
    let movementDuration = 0.01;
    let showStart = 0.5;
    let hideStart = 0.95;
    categories.forEach(function(cat, index) {
        if (svg.select("#bar-" + label + "-" + cat + "-" + element).size() > 0) {
            
            svg.select("#bar-" + label + "-" + cat + "-" + element)
                .style("font-size", function(d) {
                    if (localPosition >= showStart && localPosition < hideStart) {
                        let progress = Math.min((localPosition - showStart) / movementDuration, 1);
                        return (Math.round(progress * fontSize.normal) + "px");
                    } else if (localPosition >= hideStart) {
                        let progress = Math.min((localPosition - 0.75) / movementDuration, 1);
                        return (Math.round((1-progress) * fontSize.normal) + "px");
                    } else if (!checkSection(section)) {
                        return ("0px");
                    } else {
                        let currentFontSize = svg.select("#bar-" + label + "-" + cat + "-" + element).style("font-size");
                        return (currentFontSize);
                    }
                });
        } 
    });
}
