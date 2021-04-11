var user = {};
user.avatar = "/app/images/user.png";

var bot = {};
bot.avatar = "/app/images/bot.png";

var ws

function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


function insertChat(who, text, username) {

    var chat = "";
    var date = formatTime(new Date());

    if (who == "user") {
        chat = 
        `
        <li class="list-group-item list-group-item-dark mt-3">
            <p class="float-left">${username}</p>
            <p class="text-right ">${text}
                <img src="${user.avatar}"
                    class="rounded float-right" alt="user">
            </p>
            <small class="float-left text-secondary">${date}</small><br>
        </li>
        `;
    } else {
        chat = 
        `
        <li class="list-group-item mt-3 ">
        <p class="float-right">${username}</p>

            <p class="text-left">
                <img src="${bot.avatar}" class="rounded float-left" alt="bot">
                ${text}
            </p>
            <small class="float-right text-secondary">${date}</small><br>
        </li>`;
    }
    $("#chat-screen").append(chat).scrollTop($("ul").prop('scrollHeight'));
}


function sendChat(username) {
    var text = $("#inputText").val().trim();
    if (text !== "") {
        insertChat("user", text, username);
        ws.send(JSON.stringify({
            username : username,
            message: text             
        }));
        $("#inputText").val('');
    }
}

$(document).ready(function () {

    var url = 'ws://'+document.location.host +'/ws' ;
    ws = new WebSocket(url);

    var username = "Guest - " + Math.random().toString(16).slice(2)

    ws.onopen = function () {
        console.log("connected to websocket")
    }
    ws.onmessage = function (data) {
        let botResponse = JSON.parse(data.data)
        if(botResponse.username !== username){
            insertChat("bot", botResponse.message, username);
        }
    };

    $("#inputText").on("keydown", function (e) {
        if (e.which == 13) {
            sendChat(username);
        }
    });
    $('#submit').click(function () {
        sendChat(username);
    });
})