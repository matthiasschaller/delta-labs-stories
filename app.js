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

app.get("/privacy-paradox", function (req, res) {
    res.render("privacy-paradox");
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, process.env.IP, function() {
    console.log(`Server is running on port ${PORT}`);
});