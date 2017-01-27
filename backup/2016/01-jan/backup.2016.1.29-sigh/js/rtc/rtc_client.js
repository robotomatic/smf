var client = new RTCPeerConnection(cfg, con), dc2;

client.ondatachannel = function(e) {
    dc2 = e.channel || e; // Chrome sends event, FF sends raw channel
    showMessage("data channel received");
    console.log('Received datachannel (client)');
    dc2.onopen = function (e) { 
        showMessage("data channel connect");
        console.log('data channel connect'); 
    };
    dc2.onmessage = function (e) {
        console.log('Got message (client)', e.data);
        var data = JSON.parse(e.data);
        console.log(data.message);
        showMessage(data.message);
  }
}

getJSON("server/rtc_client.php", "offer", true, function(data){
    handleOffer(data);
}, function(data) {
    showError(data);
});

function handleOffer(offer) {
    showMessage("Offer Returned");
    var offerDesc = new RTCSessionDescription(JSON.parse(offer));
    client.setRemoteDescription(offerDesc);
    client.createAnswer(function (answerDesc) {
        client.setLocalDescription(answerDesc);
        showMessage("Set Local Description");
        console.log('Created local answer: ', answerDesc);
  }, function () { console.warn("Couldn't create offer") }, sdpConstraints);
}

client.onicecandidate = function (e) {
    showMessage("Ice candidate");
    console.log('ICE candidate (client)', e)
    if (e.candidate == null) {
        var desc = client.localDescription;
        console.log(desc);
        window.postJSON("server/rtc_client.php", "answer", desc, function(data){
            showMessage("Posted Answer = " + client.localDescription);
            console.log('Posted Answer', client.localDescription);
        }, function(data) {
            showError(data);
        });
    }
}


client.onconnection = function() {
    showMessge('Datachannel connected');
    console.log('Datachannel connected');
}


client.onaddstream = function(e) {
    showMessage("Got stream");
}


client.ondatachannel = function(event) {
    showMessage("Got Data Channel!");
};

client.onsignalingstatechange = function(state) {
    showMessage('signaling state change: ' + state);
    console.info('signaling state change:', state);
}

client.oniceconnectionstatechange = function(state) {
    showMessage('ice connection state change: ' + state);
    console.info('ice connection state change:', state);
}

client.onicegatheringstatechange = function(state) {
    showMessage('ice gathering state change: ' + state);
    console.info('ice gathering state change:', state);
}






function sendMessage(message) {
    data = JSON.stringify(message)
    dc2.send(data)
    return false
}


window.moz = !! navigator.mozGetUserMedia

function showMessage(message) {
    var test = document.getElementById("test");
    test.innerHTML += "<br />" + message;
}
