const socket = new WebSocket("ws://localhost:8080");
let localStream, peerConnection, userId, remoteUserId;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// Handle WebSocket messages
socket.onmessage = async (event) => {
  const data = JSON.parse(event.data);

  if (data.userId) {
    userId = data.userId; // Assign user ID
    console.log("Your User ID:", userId);
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
