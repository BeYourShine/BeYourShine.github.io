const socket = io('https://happycat002.herokuapp.com');
$('#chat').hide();

function openStream(){
	const config = { audio: false, video: true};
	return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream){
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
};

// openStream()
// .then(stream => playStream('localStream', stream));

const peer = new Peer({key: 'peerjs', host: 'https://mypeer1311.herokuapp.com/', secure: true, port: 443});

peer.on('open', id => {
	$('#myPeer').append(id);
	$('#btnSignUp').click(() => {
		const username = $('#txtUserName').val();
		socket.emit('Nguoi_dung_Dang_Ky', { ten: username, peerId: id });
	});
});

$('#btnCall').click(() => {
	const id = $('#remoteId').val();
	openStream()
	.then(stream => {
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

//Callee
peer.on('call', call => {
	openStream()
	.then(stream => {
		call.answer(stream);
		playStream('localStream', stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

socket.on('Danh_sach_online', arrUserInfo => {
	$('#chat').show();
	$('#DANGKY').hide();
	arrUserInfo.forEach(user =>{
		const { ten, peerId } = user;
		$('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
	});

	socket.on('Co_nguoi_dung', user => {
		const { ten, peerId } = user;
		$('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
	});

	//nguoi dung ngat ket noi
	socket.on('Ai_do_ngat', peerId => {
		$(`#${peerId}`).remove();
	});
});

// dang ky that bai
socket.on('Dang_ky_that_bai',() => alert('Vui long chon username khac'));

////click user
$('#ulUser').on('click', 'li', function() {
	const id = ($(this).attr('id'));
	openStream()
	.then(stream => {
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});






