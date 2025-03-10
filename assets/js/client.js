const socket = new WebSocket("wss://webcam-production.up.railway.app/videocall");
let localStream, peerConnection, userId, remoteUserId;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// Handle WebSocket messages
socket.onmessage = async (event) => {
  const data = JSON.parse(event.data);

  if (data.userId) {
    userId = data.userId; // Assign user ID
    console.log("Your User ID:", userId);
  }

  if (data.type === "userConnected") {
    showPopup(`User ${data.userId} has connected.`);
  }

  if (data.type === "userDisconnected") {
    showPopup(`User ${data.userId} has disconnected.`);
  }
  if (data.type === "endCall") {
    console.log("Call ended by remote user.");
    endCall(); // Automatically end call when the other user hangs up
  }

  if (data.from) {
    remoteUserId = data.from;
    console.log(`Message from ${data.from}:`, data);

    if (data.offer) {
      await handleOffer(data.offer, data.from);
    } else if (data.answer) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }
};

function showPopup(message) {
  const popup = document.createElement("div");
  popup.innerText = message;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.background = "rgba(0, 0, 0, 0.8)";
  popup.style.color = "#fff";
  popup.style.padding = "10px 20px";
  popup.style.borderRadius = "5px";
  popup.style.zIndex = "1000";
  document.body.appendChild(popup);

 
}

// Start local camera
async function startLocalVideo() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.getElementById("localVideo").srcObject = localStream;
  console.log("Camera started");
}

// Start a call
async function initiateCall() {
  remoteUserId = document.getElementById("remoteUserId").value;

  if (!remoteUserId) {
    alert("Enter the remote user ID to call!");
    return;
  }

  peerConnection = createPeerConnection(remoteUserId);
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.send(JSON.stringify({ offer, to: remoteUserId }));
  console.log("Offer sent to", remoteUserId);
}

// Handle incoming offer
async function handleOffer(offer, from) {
  peerConnection = createPeerConnection(from);
  
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.send(JSON.stringify({ answer, to: from }));
  console.log("Answer sent to", from);
}



function endCall() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    document.getElementById("localVideo").srcObject = null;
  }

  if (remoteUserId) {
    socket.send(JSON.stringify({ type: "endCall", to: remoteUserId }));
    console.log("Call ended and notified:", remoteUserId);
  }

  document.getElementById("remoteVideo").srcObject = null;
  remoteUserId = null;
}

// Create WebRTC connection
function createPeerConnection(remoteUserId) {
  const pc = new RTCPeerConnection(config);
  
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.send(JSON.stringify({ candidate: event.candidate, to: remoteUserId }));
      console.log("ICE candidate sent");
    }
  };

  pc.ontrack = (event) => {
    document.getElementById("remoteVideo").srcObject = event.streams[0];
    console.log("Remote video received");
  };

  return pc;
}
