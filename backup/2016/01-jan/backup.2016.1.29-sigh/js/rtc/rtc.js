var cfg = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]}, con = { 'optional': [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }] };
var sdpConstraints = {
    'mandatory':
    {
        'OfferToReceiveAudio': false,
        'OfferToReceiveVideo': false
    }
};