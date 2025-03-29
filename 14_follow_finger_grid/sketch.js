let cols, rows;
let spacing = 30; // Increased spacing for a larger grid
let size = [];
let scl = 0.10;

// Webcam variables
let capture;
let captureEvent;

function setup() {
  createCanvas(windowWidth, windowHeight); // Make canvas fullscreen
  cols = width / spacing;
  rows = height / spacing;
  rectMode(CENTER);
  
  captureWebcam(); // Launch webcam
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(20);
  fill('white');
}

function draw() {
  background(0);
  
  // Optional: Draw the webcam feed (commented out)
  /*
  push();
  centerOurStuff();
  scale(-1, 1);
  image(capture, -capture.scaledWidth, 0, capture.scaledWidth, capture.scaledHeight);
  scale(-1, 1);
  pop();
  */

  let pointerX = width / 2;
  let pointerY = height / 2;

  // Check if MediaPipe tracking is available
  if (mediaPipe.landmarks[0]) {
    pointerX = map(mediaPipe.landmarks[0][8].x, 1, 0, 0, capture.scaledWidth);
    pointerY = map(mediaPipe.landmarks[0][8].y, 0, 1, 0, capture.scaledHeight);
  }

  // Draw interactive grid
  for (let i = 0; i < cols; i++) {
    size[i] = [];
    for (let j = 0; j < rows; j++) {
      size[i][j] = dist(pointerX, pointerY, i * spacing, j * spacing) * scl;
      fill(220);
      rect(spacing / 2 + i * spacing, spacing / 2 + j * spacing, size[i][j], size[i][j]);
    }
  }
}

// Function: launch webcam
function captureWebcam() {
  capture = createCapture(
    {
      audio: false,
      video: {
        facingMode: "user",
      },
    },
    function (e) {
      captureEvent = e;
      console.log(captureEvent.getTracks()[0].getSettings());
      capture.srcObject = e;

      setCameraDimensions(capture);
      mediaPipe.predictWebcam(capture);
    }
  );
  capture.elt.setAttribute("playsinline", "");
  capture.hide();
}

// Function: resize webcam depending on orientation
function setCameraDimensions(video) {
  const vidAspectRatio = video.width / video.height;
  const canvasAspectRatio = width / height;

  if (vidAspectRatio > canvasAspectRatio) {
    video.scaledHeight = height;
    video.scaledWidth = video.scaledHeight * vidAspectRatio;
  } else {
    video.scaledWidth = width;
    video.scaledHeight = video.scaledWidth / vidAspectRatio;
  }
}

// Function: center the webcam feed
function centerOurStuff() {
  translate(width / 2 - capture.scaledWidth / 2, height / 2 - capture.scaledHeight / 2);
}

// Function: window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = width / spacing;
  rows = height / spacing;
  setCameraDimensions(capture);
}
