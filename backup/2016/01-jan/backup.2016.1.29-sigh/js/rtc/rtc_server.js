// try stuffing the ICE Candidates into the DB

var server = new RTCPeerConnection(cfg, con), dc1;

try {
    dc1 = server.createDataChannel('test', {reliable: true});
    showMessage("data channel open");
    console.log('Created datachannel (pc1)');
} catch (e) { console.warn('No data channel (pc1)', e); };

server.createOffer(function (desc) {
    server.setLocalDescription(desc, function () {}, function () {});
    showMessage("created local offer");
    console.log('created local offer', desc);
}, function () { console.warn("Couldn't create offer") }, sdpConstraints);


dc1.onopen = function (e) { 
    showMessage("data channel connect");
    console.log('data channel connect');
}

dc1.onmessage = function (e) {
    console.log('Got message (pc1)', e.data);
    if (e.data.charCodeAt(0) == 2) return;
    console.log(e);
    var data = JSON.parse(e.data);
    console.log(data.message);
    showMessage("Got Message: " + data.message);
}

function receiveRemoteOffer(offer) {
    var offerDesc = new RTCSessionDescription(JSON.parse(offer));
    console.log('Received remote offer', offerDesc);
    handleOffer(offerDesc);
}
    
server.onicecandidate = function(e) {
    showMessage("ICE Candidate Server");
    console.log('ICE candidate (pc1)', e);
    if (e.candidate == null) {
        showMessage("Posting Local Offer");
        console.log("Local Offer");
        var desc = server.localDescription;
        console.log(desc);
        window.postJSON("server/rtc_server.php", "offer", desc, function(data){
            showMessage("Posted Offer");
            console.log('Posted local offer', desc);
        }, function(data) {
            showError(data)
        });
    }
}

function connectClients() {
    showMessage("Requested Answers");
    console.log('requested answers');
    window.getJSON("server/rtc_server.php", "answers", true, function(data){
        handleAnswers(data);
    }, function(data) {
        showError(data);
    });
}

function handleAnswers(data) {
    showMessage("Received Answers");
    console.log('Received Answers', data);
//    var answers = JSON.parse(data);
    for (var i = 0; i < data.length; i++) handleAnswerFromClient(data[i]);
}

function handleAnswerFromClient(answer) {
    var a = JSON.parse(answer);
    var answerDesc = new RTCSessionDescription(a);
    showMessage("Handle Answer = " + answerDesc);
    console.log('Received remote answer: ', answerDesc);
    server.setRemoteDescription(answerDesc, 
    function() {
        showMessage("Success!!!");
    }, function(e) {
        showMessage("Fuckkkkk!!!");
        console.log("Error!!!!", e);
    });
}


server.onconnection = function() {
    showMessage("server connection");
    console.log('Datachannel connected');
}


server.onaddstream = function(e) {
    showMessage("Got stream");
}

server.ondatachannel = function(event) {
    showMessage("Got Data Channel!");
};


server.onsignalingstatechange = function(state) {
    showMessage('signaling state change: ' + state);
    console.info('signaling state change:', state);
}

server.oniceconnectionstatechange = function(state) {
    showMessage('ice connection state change: ' + state);
    console.info('ice connection state change:', state);
}

server.onicegatheringstatechange = function(state) {
    showMessage('ice gathering state change: ' + state);
    console.info('ice gathering state change:', state);
}





function sendMessage(message) {
    data = JSON.stringify(message)
    dc1.send(data)
    return false
}





window.moz = !! navigator.mozGetUserMedia

function showMessage(message) {
    var test = document.getElementById("test");
    test.innerHTML += "<br />" + message;
}
