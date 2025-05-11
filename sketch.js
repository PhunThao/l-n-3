let video;
let detections = [];

let faceapi;
let canvas;

let hairstyles = [];
let currentStyle = 0;

function preload() {
  // Load các kiểu tóc
  hairstyles[0] = loadImage('hairstyle1.png');
  hairstyles[1] = loadImage('hairstyle2.png');
  hairstyles[2] = loadImage('hairstyle3.png');
}

function setup() {
  canvas = createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  const detectionOptions = {
    withLandmarks: true,
    withDescriptors: false,
    withExpressions: false,
    minConfidence: 0.2
  };

  faceapi = ml5.faceApi(video, detectionOptions, modelReady);
}

function modelReady() {
  console.log('FaceAPI model ready!');
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  detections = result;
  faceapi.detect(gotResults);
}

function draw() {
  image(video, 0, 0, width, height);

  if (detections.length > 0) {
    const positions = detections[0].landmarks.positions;

    // Lấy điểm mắt
    const leftEye = positions[36];
    const rightEye = positions[45];
    const chin = positions[8];

    // Tính tâm mắt
    const eyeCenter = {
      x: (leftEye.x + rightEye.x) / 2,
      y: (leftEye.y + rightEye.y) / 2
    };

    // Tính vị trí trán tốt hơn
    const foreheadY = eyeCenter.y - (chin.y - eyeCenter.y) * 1.2;
    const centerX = eyeCenter.x;

    // Chiều rộng & cao khuôn mặt
    const faceWidth = dist(positions[0].x, positions[0].y, positions[16].x, positions[16].y);
    const faceHeight = dist(eyeCenter.x, eyeCenter.y, chin.x, chin.y);

    // Tính kích thước tóc
    const hairWidth = faceWidth * 1.8;
    const hairHeight = faceHeight * 2;

    const hairX = centerX - hairWidth / 2;
    const hairY = foreheadY - faceHeight * 0.2;

    const currentHairImage = hairstyles[currentStyle];
    if (currentHairImage) {
      image(currentHairImage, hairX, hairY, hairWidth, hairHeight);
    }
  }

  fill(255, 0, 255);
  textSize(16);
  textAlign(CENTER);
  text("Click chuột để đổi kiểu tóc", width / 2, height - 10);
}

// Chuyển đổi kiểu tóc khi click chuột
function mousePressed() {
  currentStyle = (currentStyle + 1) % hairstyles.length;
}