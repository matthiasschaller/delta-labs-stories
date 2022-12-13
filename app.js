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
        "Ho, ho, ho. It's that time of the year again. And we'd like to extend our best holiday wishes the way we know best - with numbers.",
        "There are approximately 2.1 billion children (persons under 18) in the world. For simplicity's sake, we assume every child gets exactly one present. 2.1 billion presents  - let's have a look at this number. Here we have 10 rows with 10 presents each.",
        "Let's store these 100 presents in a somewhat larger box, so this new mystical, magical box now contains 100 hundred presents.",
        "Next, we take 100 of these bigger boxes and put these in another - even larger - box. Each of these boxes now contains a whopping 10.000 presents.",
        "But we're not stopping there. Let's do it one more time. Another 100 boxes with 10.000 presents each. One million presents in total. But we'd still need a staggering 2.100 boxes to fit all the childrens' presents in.",
        "We still can't really fit 2.100 of these boxes in your display, so we need to do another round. Another 100 boxes, this time with one million presents each. Get's a bit boring? Ok, lets wrap it up. Literally and figuratively.",
        "We still need 21 of these super-sized boxes to fit all the presents in. It seems kind of unrealistic that Santa would be able to hand out all 2.1 billion presents in a single night, doesn't it? But wait...",
        "We're not supporting any of this, but apparently, Santa is not required to visit children of Muslim, Hindu, Jewish or Buddhist religions. This reduces the workload for Christmas night to 15% of the total, or 378 million. Just to be on the safe side, we'll round it to 400 million.",
        "At an average rate of 3.5 children per household, which appears to be the worldwide average, that comes to 114 million stops, presuming that there is at least one good child in each household.",
        
        "Let's keep this number in mind and go on. 114 million stops. But what does that mean exactly?",
        "Santa is supposed to bring all presents during a single day. That's 24 hours on a regular day.",
        "But this is Santa and thanks to the different time zones and the rotation of the earth, assuming he travels east to west (which seems logical), he has about 31 hours of Christmas to work with.",
        
        "So we're looking at 114 million stops over 31 hours. 114 million times parking the sleigh, hopping out, jumping down the chimney, leave the presents under the tree, eat whatever snacks have been left for him, get back up the chimney, jump into the sleigh and get on to the next house.",
        "114 million stops over 31 hours come up at 3.68 million stops per hour...", 
        "or roughly 60.000 stops per minute...",
        "or just over 1.000 stops per second.",
        "Let's take the somewhat oversimplistic assumption that the 114 million stops are evenly distributed around the globe and we are talking about 0.78 miles per stop.",
        "This adds up to a total trip of 75.5 million miles, not counting bathroom stops or breaks.",
        "Just to put this in perpective - that's roughly 314 times the distance between earth and moon.",
        "Or, on a more earthly scale, it's 3012 times around the world. A trip of a measly 24.901 miles.",
        "Santa, living at the Northpole, is probably not to keen on high temperatures, but if he were to go 75 million in the direction to the sun, he would actually be 80% there.",

        "So how fast would Santa need to be? Well, his sled is pulled by reindeer?",
        "A conventional reindeer can run (at best) 15 miles per hour.",
        "Santa's reindeer fly, though. So they might be considerably faster. We don't know how fast flying reindeer exactly are, but the fastest non-reindeer flying animal on earth is a falcon, reaching up to 185 miles per hour. Granted, thats only when diving during a hunt, but anyway...",
        "The fastest man-made vehicle, the Ulysses space probe, moves at a poky 27.4 miles per second, almost 100.000 miles per hour. That's in space, though.",
        "Santa, with reindeer, on earth, would need to travel 75 million miles in 31 h or 650 miles. Per SECOND. That's 2.34 million miles per hour. On the other hand, that's only 0.3% the speed of light.",
        
        "And this is where things get a little grinch-y...",
        "Assuming that each child gets nothing more than a medium sized Lego set (two pounds) and taking into account that we'll realistically need slightly more than eight reindeer to pull all of the presents, the sleigh is carrying around 350.000 tons.",
        "350.000 tons traveling at 650 miles per second creates enormous air resistance, which will heat the reindeer up in the same fashion as spacecraft re-entering the earth's atmosphere.",
        "The lead pair of reindeer will absorb 14.3 quintillion joules of energy. Per second. Each. In short, they will burst into flame almost instantaneously, exposing the reindeer behind them, and create deafening sonic booms in their wake. The entire reindeer team will be vaporized within 4.26 thousandths of a second. Or somewhere in between stop 4 and 5...",
        "Santa, meanwhile, will be subjected to centrifugal forces 17.500 times greater than gravity. A 250-pound Santa (not fat-shaming here, but realistically, it might be more...) would be pinned to the back of his sleigh by 4.315.015 pounds of force.",

        "Either way, that's it from our side. All that's left is for us to wish you..."
    ];

    res.render("insights-template",  { title: "The Santa Stats", sections: sections, scrollSnap: true, scriptFolder: "santa-stats", scripts: ["d3-cloud", "step1", "step2", "step3", "step4", "step5", "santa-stats"], navigationTooltips: []  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, process.env.IP, function() {
    console.log(`Server is running on port ${PORT}`);
});