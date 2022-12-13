function step5pre() {
  svg.select("#wordcloud-g").remove();
  if (!keepRepeating) {
    keepRepeating = true;
    setTimeout(function() {
        scrollDownAnimation();
    }, 2*duration.normal);
  } 
}

function step5sub1() {
  keepRepeating = false;
  d3.select("#section-divider-text").style("font-size", "0px");
  var layout = d3.layout.cloud()
      .size([width, height/2])
      .words(["Felices fiestas", "Buone feste", "Joyeuses fêtes", "Frohe Festtage",  "Feliz Natal", "Vrolijke feestdagen", "С Рождеством", "God jul",  "メリークリスマス", "Merry Christmas", "Happy Holidays", "Season's Greetings",  "Wesołych Świąt", "Frohe Weihnachten", "Nollaig Shona Dhuit",  "Frohe Festtage", "Sarbatori vesele", "С Рождеством", "圣诞快乐",  "Joyeux Noël", "Zalig Kerstfeest", "Buon Natale", "Frohe Weihnachten",  "Glædelig Jul", "FELIZ NAVIDAD", "Καλά Χριστούγεννα", "Nadolig Llawen"].map(function(d) {
          
        return {text: d, size: 10 + Math.random() * (width / 25), test: "haha"};
      }))
      .padding(5)
      .rotate(function() { return (~~(Math.random() * 6) - 3) * 30; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw);

layout.start();

function draw(words) {
    svg
    .append("g")
      .attr("id", "wordcloud-g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + height / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .attr("id", function(d,i) {
        return ("wordcloud-" + i);
      })
      .style("font-size", "0px")
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return colors[Math.floor(Math.random() * colors.length)] })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; })
      .transition().duration(duration.normal).delay(function(d,i) {
        return (i / (words.length - 1) * duration.normal)
      }).ease(d3.easeExpOut)
        .style("font-size", function(d) { return d.size + "px"; })
        .transition().duration(0).delay(2*duration.normal)
      
      setTimeout(function() {
        repeat();
      }, 500)

    function repeat() {
      let thisID = Math.floor(Math.random() * words.length);
      svg.select("#wordcloud-" + thisID)
        .transition().duration(duration.normal).delay(duration.short).ease(d3.easeBack)
        .style("font-size", function(d) { return (1.3 * d.size) + "px"; })
          .transition().duration(duration.normal).ease(d3.easeBack)
            .style("font-size", function(d) { return d.size + "px"; })
            .on("end", repeat);
    };
}
    
}


