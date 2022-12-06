var express = require("express");
var app = express();

app.set("view engine", ".ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.redirect("https://www.delta-labs.ch/insights");
});

app.get("/imitation-game", function (req, res) {
    let sections = [
        "What are the consequences when we interact with machines that try to be human?",
        "We tested that. We designed one chatbot that communicated very machine-like. And we designed another chatbot that communicated very human-like by using emojis and other expressives.",
        "People that chatted with our human-like chatbot were less interested in a personal follow-up consultation. That is, their need for personal interaction was satisfied by the chatbot.",
        "People that chatted with our machine-like chatbot were still interested in a personal follow-up consultation. The interaction with the chatbot could not satisfy their need for personal interaction.",
        "People that chatted with our machine-like chatbot were still interested in a personal follow-up consultation. The interaction with the chatbot could not satisfy their need for personal interaction."
    ];

    res.render("insights-template", { 
        title: "The Imitation Game", 
        sections: sections, 
        scrollSnap: true, 
        scriptFolder: "imitation-game", 
        scripts: ["imitation-helpers", "imitation-annotations", "imitation-game"],
        navigationTooltips: [] 
    });
});

app.get("/insights-template-snap", function (req, res) {
    let sections = ["Section 0 - Setup", "Section 1 - Demographics", "Section 2 - Attitudes", "Section 3 - Wordcloud", "Section 4 - Massnahmen", "Section 5 - Simple Bars", "Section 6 - Rank Order"];

    res.render("insights-template",  { title: "The Insights Template", sections: sections, scrollSnap: true });
});

app.get("/insights-template", function (req, res) {
    let sections = ["Section 0 - Setup", "Section 1 - Demographics", "Section 2 - Attitudes", "Section 3 - Wordcloud", "Section 4 - Massnahmen", "Section 5 - Simple Bars", "Section 6 - Rank Order"];

    res.render("insights-template",  { title: "The Insights Template", sections: sections, scrollSnap: false });
});

app.get("/privacy-paradox", function (req, res) {
    let sections = ["Section 0 - Setup", "Section 1 - Demographics", "Section 2 - Attitudes", "Section 3 - Wordcloud", "Section 4 - Massnahmen", "Section 5 - Simple Bars", "Section 6 - Rank Order"];

    res.render("privacy-paradox",  { title: "The Privacy Paradox", sections: sections });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, process.env.IP, function() {
    console.log(`Server is running on port ${PORT}`);
});