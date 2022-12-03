var express = require("express");
var app = express();

app.set("view engine", ".ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.redirect("https://www.delta-labs.ch/insights");
});

app.get("/imitation-game", function (req, res) {
    res.render("imitation-game");
});

app.get("/insights-template", function (req, res) {
    let sections = ["Section 0 - Setup", "Section 1 - Demographics", "Section 2 - Attitudes", "Section 3 - Wordcloud", "Section 4 - Massnahmen", "Section 5 - Simple Bars", "Section 6 - Rank Order"];

    res.render("insights-template",  { title: "The Insights Template", sections: sections });
});

app.get("/privacy-paradox", function (req, res) {
    let sections = ["Section 0 - Setup", "Section 1 - Demographics", "Section 2 - Attitudes", "Section 3 - Wordcloud", "Section 4 - Massnahmen", "Section 5 - Simple Bars", "Section 6 - Rank Order"];

    res.render("privacy-paradox",  { title: "The Privacy Paradox", sections: sections });
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, process.env.IP, function() {
    console.log(`Server is running on port ${PORT}`);
});