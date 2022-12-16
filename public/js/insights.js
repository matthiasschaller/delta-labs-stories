let nav, nSections; 
let scrollPosition = 0;
let scrollOrigin = 0;
let margin = 8;

(function () {
    nav = this.document.querySelector("nav");
    navHeight = nav.getBoundingClientRect().height;

    checkMobile();

    svg = d3.select("#viz-svg");
    width = document.querySelector('#viz-svg').getBoundingClientRect().width;
    height = document.querySelector('#viz-svg').getBoundingClientRect().height;
    nSections = document.querySelectorAll(".step").length;

    setTimeout(function() {
        document.querySelector("#section-0").style.opacity = 1;
    }, 500);

    if (scrollSnap) {
        let settings = {
            licenseKey: "KHZH6-CTH47-C4KG8-7JT37-ZQRML",
            autoScrolling:true,
            scrollHorizontally: false,
            navigation: false,
            scrollOverflow: false,
            navigationTooltips: navigationTooltips,
            showActiveTooltip: true,
            credits: { enabled: false, label: '', position: 'right'},
            scrollingSpeed: 1000,
            beforeLeave: function(origin, destination, direction, trigger){
                scrollPosition = destination.index;
                scrollOrigin = origin.index;
                if (destination.index == 0) {
                    showNavbar();
                } else {
                    hideNavbar();
                }

                if (mobile) {
                    fadeScroll();
                }
            }
        }

        if (mobile) {
            settings.navigation = false;
        }

        new fullpage('#left-container', settings);
    } else {
        window.addEventListener('scroll', function(e){ 
            if (this.window.scrollY == 0) {
                showNavbar();
            } else {
                hideNavbar();
            }

            calculateScrollPosition();
            setOpacityOnSections();
    
            d3.select("#scroll-text").text("Section: " + Math.floor(scrollPosition) + " | Process: " + Math.round((scrollPosition % 1) * 100)+ "%")
    
        }, true)
    }

    window.addEventListener("resize", function() {
        checkMobile();
    });
}());

function checkMobile() {
    mobile = false;
    if (d3.select("#viz-container").node().getBoundingClientRect().width < 500) {
        mobile = true;
    }

    if (mobile) {
        document.querySelector("#viz-svg").classList.add("mobile");
        for (const step of document.querySelectorAll(".step-p")) {
            step.classList.add('mobile');
            step.style.marginTop = navHeight + 10 + "px";
        }
        for (const step of document.querySelectorAll(".step")) {
            step.style.alignItems = "flex-start";
        }
    } else {
        document.querySelector("#viz-svg").classList.remove("mobile");
        for (const step of document.querySelectorAll(".step-p")) {
            step.classList.remove('mobile');
            step.style.marginTop = navHeight + "px";
            step.style.marginBottom = "0px";
        }
        for (const step of document.querySelectorAll(".step")) {
            step.style.alignItems = "center";
        }
    }
}

function fadeScroll() {
    for (const step of document.querySelectorAll(".step-p")) {
        step.style.opacity = 0;
    }

    setTimeout(function() {
        document.querySelector("#section-" + scrollPosition + "-p").style.opacity = 1;
    }, 400);
}

function showNavbar() {
    nav.style.top = "0px";
    nav.style.opacity = 1;
}

function hideNavbar() {
    if (mobile) {
        nav.style.top = -navHeight + "px";
        nav.style.opacity = 0;
    }
}

function calculateScrollPosition() {
    scrollPosition = 0.5 + (-document.querySelector('#viz-container').getBoundingClientRect().y + margin) / window.innerHeight;
    if (scrollPosition < 1) {
        scrollPosition = (scrollPosition - 0.5) * 2;
    } else if (scrollPosition >= (nSections - 1)) {
        scrollPosition = scrollPosition + (scrollPosition % 1);
    }
    scrollPosition = Math.min(scrollPosition, nSections);
}

function setOpacityOnSections() {
    for (var i = 0; i < nSections; i++) {
        document.querySelector("#section-" + i).style.opacity = 0;
        let a = scrollPosition % 1;
        if (Math.floor(scrollPosition) == i && a <= 0.5) {
            if (i == 0) {
                document.querySelector("#section-" + i).style.opacity = 1;
            } else {
                document.querySelector("#section-" + i).style.opacity = Math.min(a * 4, 1);
            }
        } else if (Math.floor(scrollPosition) == i && a > 0.5) {
            if (i >= (nSections - 1)) {
                document.querySelector("#section-" + i).style.opacity = 1 ;
            } else {
                document.querySelector("#section-" + i).style.opacity = Math.min((1 - a) / 0.25, 1);
            }
        } else if (scrollPosition == nSections) {
            document.querySelector("#section-" + (nSections-1)).style.opacity = 1 ;
        }
    };
}