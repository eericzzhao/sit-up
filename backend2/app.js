const videoEl = document.getElementById("video");
const outEl = document.getElementById("out");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");

let endpoint = null;
let stream = null;
let stopped = false;

// Example “Visual Intelligence Pop”: Detect person → Crop → Ask question(s)
// Visual Intelligence is built around `eyepop.image-contents:latest`. :contentReference[oaicite:5]{index=5}
const PersonPostureVisualIntelligence = {
  components: [{
    type: PopComponentType.INFERENCE,
    ability: "eyepop.person:latest",
    categoryName: "person",
    confidenceThreshold: 0.9,
    forward: {
      operator: { type: ForwardOperatorType.CROP },
      targets: [{
        type: PopComponentType.INFERENCE,
        ability: "eyepop.image-contents:latest",
        params: {
          prompts: [{
            prompt:
              "Analyze the image and classify the person's posture as one of: " +
              "[standing, sitting, lying, squatting, kneeling, bending, walking, running, jumping, other]. " +
              "If you are unable to provide a category with a value then set its classLabel to null."
          }]
        }
      }]
    }
  }]
};

startBtn.onclick = async () => {
  stopped = false;
  startBtn.disabled = true;
  stopBtn.disabled = false;

  // 1) Get webcam
  stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  videoEl.srcObject = stream;
  await videoEl.play();

  // 2) Get server-minted session (recommended vs putting secret key in browser) :contentReference[oaicite:6]{index=6}
  const session = await (await fetch("http://localhost:3000/eyepop/session")).json();

  // 3) Connect to EyePop with that session
  endpoint = await EyePop.workerEndpoint({
    auth: { session },                         // client uses session :contentReference[oaicite:7]{index=7}
    popId: session.popId || undefined          // optional; session usually encodes it
  }).connect();

  // 4) Load your Visual Intelligence pipeline
  await endpoint.changePop(PersonPostureVisualIntelligence);

  // 5) Live ingress + continuous processing (webcam stream) :contentReference[oaicite:8]{index=8}
  const ingress = await endpoint.liveIngress(stream);
  const results = await endpoint.process({ ingressId: ingress.ingressId() });

  for await (const result of results) {
    if (stopped) break;
    outEl.textContent = JSON.stringify(result, null, 2);
  }
};

stopBtn.onclick = async () => {
  stopped = true;
  startBtn.disabled = false;
  stopBtn.disabled = true;

  if (stream) stream.getTracks().forEach(t => t.stop());
  stream = null;

  if (endpoint) await endpoint.disconnect();
  endpoint = null;
};
