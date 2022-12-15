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
        "We tested just that. We designed one chatbot that communicated very machine-like.  And we designed another chatbot that communicated very human-like by using emojis and other expressives",
        "People that chatted with our human-like chatbot showed a low interest in a personal follow-up consultation, regardless of each individuals’ unique need for human contact.",
        "People that chatted with our machine-like chatbot showed an increased interest in a personal follow-up consultation. This was especially true for individuals with a generally high need for human contact.",
        "Among individuals with a high need for human contact, interest in face-to-face follow-up counseling was twice as high when interacting with a machine-like chatbot than with a human-like chatbot."
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

    res.render("insights-template",  { title: "The Privacy Paradox", sections: sections, scrollSnap: false, scriptFolder: "privacy-paradox", scripts: ["privacy-paradox"], navigationTooltips: []  });
});

app.get("/santa-stats", function (req, res) {
    let sections = [
        "So here's a toast to the season of giving, <br>And to all the special people who make our lives worth living! <br>With numbers we know and facts to share, <br>About Santa's big night and how much he'll bear.<br>The world is full of little ones who want presents, you see,<br>With two point one billion children under eighteen.<br><br>But let's not forget, not all children believe, <br>So we can reduce Santa's workload to fifteen percent, what a relief! <br>With four hundred million presents, Santa will do it just right. <br>But how to pack the toys so they will fit neat and tight? <br><br>",
        "We'll array ten presents, all perfectly lined, <br><br>With ropes and ribbons, ten rows are intertwined.<br><br>",
        "We'll put these one hundred presents in one little box, <br><br>To make it a bit easier, than using Santa's old socks.<br><br>",
        "We'll take one hundred boxes and put them in a crate, <br><br>Each one now has ten thousand presents, that's quite a freight! <br><br>",
        "But we cannot stop here, let's do it again! <br><br>One hundred more crates, with a total of one million in. <br><br>",
        "We pack 400 big boxes, we cannot stop,<br><br>To fit all the kid's toys, oh my that's a lot! <br><br>",
        "With 3.5 children in a home, give or take, <br><br>Santa has a whooping 114 million stops to make!<br><br>",
        "Hopping out of his sleigh, down chimneys he'll slide,  <br><br>Leaving 400 million presents, then back up he'll glide.<br><br>",
        "But can Santa really deliver them all, <br><br>In 24 hours, no less, he'd be on a roll!<br><br>",
        "But flying West, he can gain prescious time,<br><br>So Santa has 31 hours for chimmneys to climb.<br><br>",
        "That's 3.68 million stops in one prescious hour, <br><br>",
        "Or 60,000 per minute, that's real Santa power!<br><br>",
        "Over 1,000 stops in one blink of an eye, <br><br>To deliver the huge stack of Christmas supply.<br><br>",
        "Now let's assume these stops are evenly spread, <br><br>Santa has distance of a quater mile per stop ahead.<br><br>",
        "That's a total of 75 million miles to be traveled, <br><br>Not counting breaks, that's quite a feat unraveled!<br><br>",
        "That's 314 trips from earth to moon, <br><br>",
        "Or 3012 times around the world, Santa needs to travel so soon.<br><br>",
        "And if Santa was travelling to the sun,<br><br>He'd have 80% of the journey blissfully done.<br><br>",
        "So how fast must Santa go to get this work done? <br><br>His reindeer can fly, it's true, faster than anyone! <br><br>",
        "But reindeers don't like to hurry, they like a cozy pace,<br><br>",
        "They are easily bypassed by a speedy falcon in a race.<br><br>",
        "As fast as a the Ulysses spacecraft with 100.000 miles per hour?<br><br>",
        "No, Santa needs to go much faster and use his Santa superpower!<br><br>",
        "It all sounds quite mystical, you may say,<br><br>You're right, belief is key ingredient of Christmas Day.<br><br>",
        "With love and joy, and lots of cheer, <br><br>We wish you a very magical holiday this year!<br><br>",
    ];

    res.render("insights-template",  { title: "The Santa Stats", sections: sections, scrollSnap: true, scriptFolder: "santa-stats", scripts: ["d3-cloud", "step1", "step2", "step3", "step4", "step5", "santa-stats"], navigationTooltips: []  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, process.env.IP, function() {
    console.log(`Server is running on port ${PORT}`);
});