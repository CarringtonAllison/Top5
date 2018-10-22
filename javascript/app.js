// Initialize Firebase
var config = {
    fantasyApiKey: "AIzaSyDLh5dJYfHFziQJ5jTlTOdfLhKPjjIMkFA",
    authDomain: "sleepers-9464b.firebaseapp.com",
    databaseURL: "https://sleepers-9464b.firebaseio.com",
    projectId: "sleepers-9464b",
    storageBucket: "sleepers-9464b.appspot.com",
    messagingSenderId: "83781089592"
};
firebase.initializeApp(config);
var database = firebase.database();
var fantasyApiKey = "ryz7dd7qeq6e";
var yelpApiKey = "DEarLC7CAG_qsAEt1-nz8iyDsLL2tcDUn72S1wje4GmAksA05LKkj2MpqqyyNzFMdiysoE-Nv_wTUGQQn-rYM5scXqQpdFu-mObJuPPtwyiGXrqLWPGAYdrG-q7LW3Yx"


// cors hack
jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});


//start button hiding everything 
$(document).ready(function () {
    $(".main-screen").hide();
    $("#start").click(function () {
        $(".main-screen").fadeIn();
        $(".first-buttons").hide();
        $("#zipCode").hide();
        $(this).hide();
    });
});


//when the start button is clicked
$("#start").on("click", function () {

    //Fantasy Football Nerd API
    var queryURL = "https://www.fantasyfootballnerd.com/service/weekly-rankings/json/" + fantasyApiKey + "/QB";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        rank = response.Rankings;
        // console.log(response);

        for (var i = 0; i < 5; i++) {
            var tRow = $("<tr>");
            var playerPosition = $("<td>").text(rank[i].position);
            var playerName = $("<td>").text(rank[i].name);
            var playerTeam = $("<td>").text(rank[i].team);
            var playersScore = $("<td>").text(rank[i].standard);
            playersScore.addClass("scores")
            playersScore.attr("data-ppr", rank[i].ppr);
            playersScore.attr("data-standard", rank[i].standard);
            tRow.append(playerPosition, playerName, playerTeam, playersScore);
            $("tbody").append(tRow);
        }
    });


    var queryURL = "https://www.fantasyfootballnerd.com/service/byes/json/ryz7dd7qeq6e/ppr/";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {


        console.log(response);

        // for (var i = 0; i < 5; i++) {
        //     var tRow = $("<tr>");
        //     var playerPosition = $("<td>").text(rank[i].position);
        //     var playerName = $("<td>").text(rank[i].name);
        //     var playerTeam = $("<td>").text(rank[i].team);
        //     var playersScore = $("<td>").text(rank[i].standard);
        //     playersScore.addClass("scores")
        //     playersScore.attr("data-ppr", rank[i].ppr);
        //     playersScore.attr("data-standard", rank[i].standard);
        //     tRow.append(playerPosition, playerName, playerTeam, playersScore);
        //     $("tbody").append(tRow);
        // }
    });

    var zip = $("#zipCode").val();


    // Yelp API 
    var yelpUrl = "https://api.yelp.com/v3/businesses/search?location=" + zip + "&categories=sportsbars&limit=5"

    $.ajax({
        url: yelpUrl,
        headers: {
            'Authorization': 'Bearer DEarLC7CAG_qsAEt1-nz8iyDsLL2tcDUn72S1wje4GmAksA05LKkj2MpqqyyNzFMdiysoE-Nv_wTUGQQn-rYM5scXqQpdFu-mObJuPPtwyiGXrqLWPGAYdrG-q7LW3Yx',
        },
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            sportsBar = data.businesses
            console.log(sportsBar)

            for (var i = 0; i < 5; i++) {
                var $div = $("<div>");
                $div.addClass("col d-flex justify-content-center layout");
                var $2div = $("<div>");
                $2div.addClass("card bars");
                $2div.attr("data-url", sportsBar[i].url);
                var $img = $("<img>");
                $img.addClass("card-img-top img-size");
                $img.attr("src", sportsBar[i].image_url);
                $img.attr("alt", sportsBar[i].name);
                var $3div = $("<div>");
                $3div.addClass("card-body");
                var $p = $("<p>");
                $p.addClass("card-text");
                $p.attr("id", "barInfo")
                $p.append("<h5>" + sportsBar[i].name + "</h5>", "<p class='barText'>" + sportsBar[i].location.display_address + "</p>", "<p class='barText'>" + "Phone: " + sportsBar[i].phone + "</p>");
                $div.append($2div);
                $2div.append($img, $3div);
                $3div.append($p);
                $("#barListing").append($div);
            }
        }
    });
});


//Position buttons
$(".positionButtons").on("click", function () {
    $("#player").empty();
    var position = $(this).attr("id")
    var queryURL = "https://www.fantasyfootballnerd.com/service/weekly-rankings/json/" + fantasyApiKey + "/" + position;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        rank = response.Rankings;

        for (var i = 0; i < 5; i++) {
            var tRow = $("<tr>");
            var playerPosition = $("<td>").text(rank[i].position);
            var playerName = $("<td>").text(rank[i].name);
            var playerTeam = $("<td>").text(rank[i].team);
            var playersScore = $("<td>").text(rank[i].standard);
            playersScore.addClass("scores");
            playersScore.attr("data-ppr", rank[i].ppr);
            playersScore.attr("data-standard", rank[i].standard);
            tRow.append(playerPosition, playerName, playerTeam, playersScore);
            $("tbody").append(tRow);
        }
    });
});


//chat submit button
$('#btnSubmit').click(function () {
    var u = $('#nameIpt').val();
    var m = $('#msgIpt').val();
    database.ref().push({ name: u, text: m });
    $('#msgIpt').val('');
});

//when a msg is added it runs the displayMsg function
database.ref().on('child_added', function (snapshot) {
    var msg = snapshot.val();
    displayMsg(msg.name, msg.text);
});

//dipslays the msg on the chat screen 
function displayMsg(name, text) {
    $('<div />').text(text).prepend($('<em/>').text(name + ': ')).appendTo('#msgList');
    $('#msgList')[0].scrollTop = $('#msgList')[0].scrollHeight;
};


//The League buttons 
$("#ppr").on("click", function () {
    console.log("working");
    $(".scores").empty();
    $(".scores").text($(".scores").attr("data-ppr"))
})

$("#standard").on("click", function () {
    console.log("working");
    $(".scores").empty();
    $(".scores").text($(".scores").attr("data-standard"))
})

// if the yelp results are clicked then they will open another page with the yelp website 
$(document).on("click", ".bars", function () {
    var barUrl = $(this).attr("data-url");
    console.log(barUrl);
    window.open(barUrl)

})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// PUT NEW CODE BELOW ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var teamLogos = {

    cardinals: "https://www.printyourbrackets.com/nfl-logos/arizona-cardinals-logo.png",

    falcons: "https://www.printyourbrackets.com/nfl-logos/atlanta-falcons-logo.png",

    ravens: "https://www.printyourbrackets.com/nfl-logos/baltimore-ravens-logo.png",

    bills: "https://www.printyourbrackets.com/nfl-logos/buffalo-bills-logo.png",

    panthers: "https://www.printyourbrackets.com/nfl-logos/carolina-panthers-logo.png",

    bears: "https://www.printyourbrackets.com/nfl-logos/chicago-bears-logo.png",

    bengals: "https://www.printyourbrackets.com/nfl-logos/cincinnati-bengals-logo.png",

    browns: "https://banner2.kisspng.com/20180123/bxe/kisspng-logos-and-uniforms-of-the-cleveland-browns-nfl-fir-5a67fbb0cec1d5.2080489315167640808469.jpg", //Find Antother

    cowboys: "https://www.printyourbrackets.com/nfl-logos/dallas-cowboys-logo.png",

    broncos: "https://www.printyourbrackets.com/nfl-logos/denver-broncos-logo.png",

    lions: "https://www.printyourbrackets.com/nfl-logos/detroit-lions-logo.png",

    packers: "https://www.printyourbrackets.com/nfl-logos/green-bay-packers-logo.png",

    texans: "https://www.printyourbrackets.com/nfl-logos/houston-texans-logo.png",

    colts: "https://www.printyourbrackets.com/nfl-logos/indianapolis-colts-logo.png",

    jaguars: "https://www.printyourbrackets.com/nfl-logos/jacksonville-jaguars-logo.png",

    chiefs: "https://www.printyourbrackets.com/nfl-logos/kansas-city-chiefs-logo.png",

    chargers: "https://banner2.kisspng.com/20180624/pjx/kisspng-los-angeles-chargers-logo-beak-line-font-uc-san-diego-tritons-5b2f6e89879138.2104036215298351455553.jpg", //Find Another

    rams: "https://www.printyourbrackets.com/nfl-logos/st-louis-rams-logo.png",

    dolphins: "https://www.printyourbrackets.com/nfl-logos/miami-dolphins-logo.png",

    vikings: "https://www.printyourbrackets.com/nfl-logos/minnesota-vikings-logo.png",

    patriots: "https://www.printyourbrackets.com/nfl-logos/new-england-patriots-logo.png",

    saints: "https://www.printyourbrackets.com/nfl-logos/new-orleans-saints-logo.png",

    giants: "https://www.printyourbrackets.com/nfl-logos/new-york-giants-logo.png",

    jets: "https://www.printyourbrackets.com/nfl-logos/new-york-jets-logo.png",

    raiders: "https://www.printyourbrackets.com/nfl-logos/oakland-raiders-logo.png",

    eagles: "https://www.printyourbrackets.com/nfl-logos/philadelphia-eagles-logo.png",

    steelers: "https://www.printyourbrackets.com/nfl-logos/pittsburgh-steelers-logo.png",

    niners: "https://www.printyourbrackets.com/nfl-logos/san-francisco-49ers-logo.png",

    seahawks: "https://www.printyourbrackets.com/nfl-logos/seattle-seahawks-logo.png",

    buccaneers: "https://www.printyourbrackets.com/nfl-logos/tampa-bay-buccaneers-logo.png",

    titans: "https://www.printyourbrackets.com/nfl-logos/tennessee-titans-logo.png",

    redskins: "https://www.printyourbrackets.com/nfl-logos/washington-redskins-logo.png",


}
favTeamColor()

function favTeamColor() {
    console.log("click");
    // console.log(this);

    $(".dropdown-item").on("click", function () {
        var logos = $("<image>").attr("class", "logos");
        $(".logos").attr("src", teamLogos.cardinals)
        $(".main-screen").append(logos);
        var teamSelected = $(this).attr("value");
        console.log(teamSelected);
        if (teamSelected === "Arizona Cardinals") {
            $(".logos").attr("src", teamLogos.cardinals);
            $("body").stop().animate({
                backgroundColor: "rgb(151,35,63)",
                color: "rgb(255,182,18)"
            }, 1000);
        } else if (teamSelected === "Atlanta Falcons") {
            $(".logos").attr("src", teamLogos.falcons);
            $("body").stop().animate({
                backgroundColor: "rgb(167,25,48)",
                color: "rgb(0, 0, 0)"
            }, 1000);
        } else if (teamSelected === "Baltimore Ravens") {
            $("body").stop().animate({
                backgroundColor: "rgb(26,25,95)",
                color: "rgb(158,124,12)"
            }, 1000);
        } else if (teamSelected === "Buffalo Bills") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,51,141)",
                color: "rgb(198,12,48)"
            }, 1000);
        } else if (teamSelected === "Carolina Panthers") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,133,202)",
                color: "rgb(16,24,32)"
            }, 1000);
        } else if (teamSelected === "Chicago Bears") {
            $("body").stop().animate({
                backgroundColor: "rgb(11,22,42)",
                color: "rgb(0,75,100,0)"
            }, 1000);
        } else if (teamSelected === "Cincinnati Bengals") {
            $("body").stop().animate({
                backgroundColor: "rgb(251,79,20,2)",
                color: "rgb(0,0,0)"
            }, 1000);
        } else if (teamSelected === "Cleveland Browns") {
            $("body").stop().animate({
                backgroundColor: "rgb(49,29,0)",
                color: "rgb(255,60,0)"
            }, 1000);
        } else if (teamSelected === "Dallas Cowboys") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,53,148)",
                color: "rgb(134,147,151)"
            }, 1000);
        } else if (teamSelected === "Dallas Cowboys") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,53,148)",
                color: "rgb(134,147,151)"
            }, 1000);
        } else if (teamSelected === "Denver Broncos") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,34,68)",
                color: "rgb(251,79,20)"
            }, 1000);
        } else if (teamSelected === "Detroit Lions") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,118,182)",
                color: "rgb(176,183,188)"
            }, 1000);
        } else if (teamSelected === "Green Bay Packers") {
            $("body").stop().animate({
                backgroundColor: "rgb(24 48 40)",
                color: "rgb(255,184,28)"
            }, 1000);
        } else if (teamSelected === "Houston Texans") {
            $("body").stop().animate({
                backgroundColor: "rgb(3,32,47)",
                color: "rgb(167,25,48)"
            }, 1000);
        } else if (teamSelected === "Indianapolis Colts") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,44,95)",
                color: "rgb(162,170,173)"
            }, 1000);
        } else if (teamSelected === "Jacksonville Jaguars") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,103,120)",
                color: "rgb(159,121,44)"
            }, 1000);
        } else if (teamSelected === "Kansas City Chiefs") {
            $("body").stop().animate({
                backgroundColor: "rgb(227,24,55)",
                color: "rgb(255,184,28)"
            }, 1000);
        } else if (teamSelected === "Los Angeles Chargers") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,128,198)",
                color: "rgb(255,194,14)"
            }, 1000);
        } else if (teamSelected === "Los Angeles Rams") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,34,68)",
                color: "rgb(134,109,75)"
            }, 1000);
        } else if (teamSelected === "Miami Dolphins") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,142,151)",
                color: "rgb(242,106,36)"
            }, 1000);
        } else if (teamSelected === "Minnesota Vikings") {
            $("body").stop().animate({
                backgroundColor: "rgb(79,38,131)",
                color: "rgb(255,198,47)"
            }, 1000);
        } else if (teamSelected === "New England Patriots") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,34,68)",
                color: "rgb(198,12,48)"
            }, 1000);
        } else if (teamSelected === "New Orleans Saints") {
            $("body").stop().animate({
                backgroundColor: "rgb(211,188,141)",
                color: "rgb(16,24,31)"
            }, 1000);
        } else if (teamSelected === "New York Giants") {
            $("body").stop().animate({
                backgroundColor: "rgb(1,35,82)",
                color: "rgb(163,13,45)"
            }, 1000);
        } else if (teamSelected === "New York Jets") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,63,45)",
                color: "rgb(39,37,31)"
            }, 1000);
        } else if (teamSelected === "Oakland Raiders") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,0,0)",
                color: "rgb(165,172,175)"
            }, 1000);
        } else if (teamSelected === "Philadelphia Eagles") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,76,84)",
                color: "rgb(95,96,98)"
            }, 1000);
        } else if (teamSelected === "Pittsburgh Steelers") {
            $("body").stop().animate({
                backgroundColor: "rgb(255,182,18)",
                color: "rgb(16,24,32)"
            }, 1000);
        } else if (teamSelected === "San Francisco 49ers") {
            $("body").stop().animate({
                backgroundColor: "rgb(170,0,0)",
                color: "rgb(173,153,93)"
            }, 1000);
        } else if (teamSelected === "Seattle Seahawks") {
            $("body").stop().animate({
                backgroundColor: "rgb(105,190,40)",
                color: "rgb(0,34,68)"
            }, 1000);
        } else if (teamSelected === "Tampa Bay Buccaneers") {
            $("body").stop().animate({
                backgroundColor: "rgb(213,10,10)",
                color: "rgb(52,48,43)"
            }, 1000);
        } else if (teamSelected === "Tennessee Titans") {
            $("body").stop().animate({
                backgroundColor: "rgb(0,42,92)",
                color: "rgb(68,149,209)"
            }, 1000);
        } else {
            $("body").stop().animate({
                backgroundColor: "rgb(63,16,16)",
                color: "rgb(255,182,18)"
            }, 1000);
        }

    });


};
