let data = [];
let sectionLabels = ["start", "gender", "age", "education"];
let bubbles;
let radius = 15;
let pad = 5;
let padding = 20;
let circlesPerBarWidth = 5;
let fontSize = { small: 12, normal: 24, large: 50 };
let n = 100;

let scaleX = d3.scaleLinear().domain([0, 1]).range([padding, width-padding]);
let scaleY = d3.scaleLinear().domain([0, 1]).range([padding + navHeight, height-padding]);

let palette = ["#212529", "#E9ECEF", "#495057", "#CED4DA", "#ADB5BD"]
let datacolors = { 
        gender: { male: palette[0], female: palette[1], other: palette[2] },
        age: { 1: palette[0], 2: palette[1], 3: palette[2], 4: palette[3], 5: palette[4] },
        education: { 1: palette[0], 2: palette[1], 3: palette[2], 4: palette[3], 5: palette[4] }
    };

let datalabels = { 
    gender: { male: "male", female: "female", other: "other"},
    age: { 1: "below 18", 2: "18 to 39", 3: "40-59", 4: "60-79", 5: "80 and up" },
    education: { 1: "none", 2: "highschool", 3: "bachelor", 4: "master" }
    };

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
    showDots(0);
    showBars("gender", 1);
    showBars("age", 2);
    showBars("education", 3);
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

        let age = "1";
        random = Math.round(Math.random() * 100) / 100;
        if (random >= 0.2 && random < 0.4) {
            age = "2";
        } else if (random >= 0.4 && random < 0.7) {
            age = "3";
        } else if (random >= 0.7 && random < 0.9) {
            age = "4";
        } else if (random >= 0.9) {
            age = "5";
        }


        let education = "1";
        random = Math.random();
        if (random > 0.2 && random < 0.4) {
            education = "2";
        } else if (random > 0.4 && random < 0.7) {
            education = "3";
        } else if (random > 0.7 ) {
            education = "4"
        }

        let delay = Math.random();
        data.push({ id: x, gender: gender, age: age, education: education, delay: delay, 
            positions: { 
                start: { cx: null, cy: null },
                gender: { cx: null, cy: null },
                age: { cx: null, cy: null },
                education: { cx: null, cy: null },
            }, 
            color: {},
            label: {}
        });
    }

    initBarData("gender");
    initBarData("age");
    initBarData("education");
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

function showDots(section) {
    let delayDenom = 1.5;
    if (scrollPosition < (section + 1)) {
        bubbles.attr("r",function(d) {
            if (scrollPosition > (d.delay / delayDenom)) {
                let thisRadius = Math.min(radius, (scrollPosition - (d.delay / delayDenom)) * 100);
                return thisRadius;
            }
        });
    }
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

function colorDots(localPosition, label) {
    let delayDenom = 5;
    bubbles.style("fill", function(d) {
        if (localPosition > (d.delay / delayDenom)) {
            return "bubble " + label + " " + d[label];
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

function checkSection(section) {
    return (scrollPosition >= section && scrollPosition < (section + 1));
}