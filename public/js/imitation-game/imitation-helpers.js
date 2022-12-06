function getMax(el, category) {
    let max = null;
  
    if (category) {
        data.forEach(d => {
            if (d.category == category && d[el] > max) {
              max = d[el];
            }
        });
    } else {
        data.forEach(d => {
            if (d[el] > max) {
              max = d[el];
            }
        });
    }
  
    return (max)
}

function getMin(el, category) {
    let min = 0;

    data.forEach(d => {
        if (d.category == category && d[el] < min) {
          min = d[el];
        }
    });

    return (min)
}

function calcBubblesX(sideX, side) {
    let factor = 1;
    if (side == "right") {
        factor = 3;
    }

    let response = (factor*width/4) - radius.normal + (2*radius.normal+pad) * ((sideX%(rectX/2)) - (rectX/4))
    return (response);
}

function calcBubblesY(sideY) {
    let response = (3*height/8) + (Math.floor(sideY/(rectX/2)) * (2*radius.normal + pad))

    return (response);
}