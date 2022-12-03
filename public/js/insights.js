let svg, width, height, xPos, yPos, lastY, nav, navHeight, nSections, activeSection, lastActiveSection, scrollDirection; 
let mobile = false;
let sections = [];
let scrollPosition = 0;

let margin = 8;
let inViewMargin = 0.75;

(function () {
    nav = this.document.querySelector("nav");
    navHeight = nav.getBoundingClientRect().height;

    if (d3.select("#viz-container").node().getBoundingClientRect().width < 500) {
        mobile = true;
        document.querySelector("#viz-svg").classList.add("mobile");
        for (const step of document.querySelectorAll(".step-p")) {
            step.classList.add('mobile');
            step.style.marginTop = navHeight + "px";
        }
        for (const step of document.querySelectorAll(".step")) {
            step.style.alignItems = "flex-start";
        }
    }

    svg = d3.select("#viz-svg");
    width = document.querySelector('#viz-svg').getBoundingClientRect().width;
    height = document.querySelector('#viz-svg').getBoundingClientRect().height;
    

    initSections();

    svg.append("text")
      .attr("id", "scroll-text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .style("font-size", "20px")
      .text("Section: 0 | Process: 0")

    window.addEventListener('scroll', function(e){ 
        let el = document.querySelector('#viz-container').getBoundingClientRect();
        xPos = el.x;
        yPos = el.y;

        if (lastY && lastY < yPos) {
            scrollDirection = "up";
        } else if (lastY && lastY > yPos) {
            scrollDirection = "down";
        }
        lastY = yPos;

        scrollNavbar();
        scrollSections();
        opacitySections();

        d3.select("#scroll-text").text("Section: " + Math.floor(scrollPosition) + " | Process: " + Math.round((scrollPosition % 1) * 100)+ "%")

    }, true)
}());

function initSections() {
    nSections = document.querySelectorAll(".step").length;

    setTimeout(function() {
        document.querySelector("#section-0").style.opacity = 1;
    }, 500);

    for (var i = 0; i < nSections; i++ ) {
        sections.push({ "inView": 0, "active": false, "viewed": false, yTop: null, yBottom: null });
    }

    scrollSections();
    sections[0].inView = 1;
    sections[0].active = true;

}

function scrollNavbar() {
    if (yPos < -margin) {
        nav.style.top = -navHeight + "px";
        nav.style.opacity = 0;
    } else {
        nav.style.top = "0px";
        nav.style.opacity = 1;
    }
}

function scrollSections() {
    let maxInView = 0;
    let maxIndex = 0;
    let maxValue = 0;

    for (var i = 0; i < nSections; i++ ) {
        let yTop = document.querySelector("#section-" + i).getBoundingClientRect().y - document.querySelector('#viz-container').getBoundingClientRect().y;
        let yBottom = document.querySelector("#section-" + i).getBoundingClientRect().y + document.querySelector("#section-" + i).getBoundingClientRect().height - document.querySelector('#viz-container').getBoundingClientRect().y;
        sections[i].yTop = yTop;
        sections[i].yBottom = yBottom;
        sections[i].inView = Math.max(Math.min((window.innerHeight - Math.abs(document.querySelector("#section-" + i).getBoundingClientRect().y)) / window.innerHeight, 1), 0);
        
        if (sections[i].inView > maxInView) {
            maxInView = sections[i].inView;
            maxIndex = i;
            maxValue = sections[i].inView;
        }
    }

    sections.forEach(function(section, index) {
        section.active = false;
        section.viewed = false;
        if (index <= maxIndex) {
            section.viewed = true;
        }
    });
    sections[maxIndex].active = true;

    if (maxValue > inViewMargin) {
        activeSection = maxIndex;
    } else {
        activeSection = null;
    }

    scrollPosition = 0.5 + (-document.querySelector('#viz-container').getBoundingClientRect().y + margin) / window.innerHeight;
    if (scrollPosition < 1) {
        scrollPosition = (scrollPosition - 0.5) * 2;
    } else if (scrollPosition >= (nSections - 1)) {
        scrollPosition = scrollPosition + (scrollPosition % 1);
    }
    scrollPosition = Math.min(scrollPosition, nSections);
}

function opacitySections() {
    sections.forEach(function(section, index) {
        //document.querySelector("#section-" + index).style.opacity = (section.inView - 0.5) / 0.5;
        document.querySelector("#section-" + index).style.opacity = 0;
        /// CHANGE SO THAT 0 -- > 0; 25% --> 1 ; 75% --> 1; 100% --> 0%;
        let a = scrollPosition % 1;
        if (Math.floor(scrollPosition) == index && a <= 0.5) {
            if (index == 0) {
                document.querySelector("#section-" + index).style.opacity = 1;
            } else {
                document.querySelector("#section-" + index).style.opacity = Math.min(a * 4, 1);
            }
        } else if (Math.floor(scrollPosition) == index && a > 0.5) {
            if (index >= (nSections - 1)) {
                document.querySelector("#section-" + index).style.opacity = 1 ;
            } else {
                document.querySelector("#section-" + index).style.opacity = Math.min((1 - a) / 0.25, 1);
            }
        } else if (scrollPosition == nSections) {
            document.querySelector("#section-" + (nSections-1)).style.opacity = 1 ;
        }
    });
}