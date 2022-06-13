/* jshint esversion: 8 */ 

var leftBuffer;
var rightBuffer;


function setup() {
createCanvas(window.innerWidth, window.innerHeight);
leftBuffer = createGraphics(window.innerWidth/2, window.innerHeight);
rightBuffer = createGraphics(window.innerWidth/2, window.innerHeight);


eraser = loadImage('images/eraser.png');
brush = loadImage('images/brush.png');
select = loadImage('images/select.png');

limit = 400;
size = limit / 14;
 for (let row = 0; row < 6; row++) {
    slots.push([]);
    y = 2 * size + row * 2 * size;
    for (let col = 0; col < 5; col++) {

      x = -4 * size + col * 2 * size;
      slots[row].push(new Slot(x, y, 1.8 * size, row, col));
    }
  }

  


videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];

 videoElement.msHorizontalMirror = true;
       
const canvasCtx = canvasElement.getContext('2d');

xp = 0;
yp = 0;

function fingersUp(landmarks){
  //landmarks[0][4].x > landmarks[0][3].x)
  if ((landmarks[0][4].x < landmarks[0][3].x) && (landmarks[0][8].y > landmarks[0][6].y) &&(landmarks[0][12].y > landmarks[0][10].y) && (landmarks[0][16].y > landmarks[0][14].y) && (landmarks[0][20].y > landmarks[0][18].y) ){
    
    
  return false;
}
  else{
  return true;
}
}


function onResults(results) {

  //canvasCtx.save();

  //canvasCtx.clearRect(100, 100, canvasElement.width, canvasElement.height);
  //canvasCtx.drawImage(
  //    results.image, 100,100, canvasElement.width, canvasElement.height);
      
  handInUse = "";
  if (results.multiHandedness){
    for (const hand of results.multiHandedness){
      if(hand.label=="Right"){
        handInUse = "Left";
      }
      else { handInUse = "Right";}
    }
      
     print(handInUse);
 
    
  }    
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      //drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 3});
      //drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1});
      //drawRectangle(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1});
     
     // DELETE MODE
     if (handInUse == "Left"){
       
       image(eraser, results.multiHandLandmarks[0][8].x*640,results.multiHandLandmarks[0][8].y*480 );
       
        //stroke(255,255,255);
        //strokeWeight(800);

        ////line(xp, yp, results.multiHandLandmarks[0][8].x*640 +600, results.multiHandLandmarks[0][8].y*480+600);
        //line(xp,yp, results.multiHandLandmarks[0][8].x*640,results.multiHandLandmarks[0][8].y*480);
        //xp = results.multiHandLandmarks[0][8].x*640;
        //yp = results.multiHandLandmarks[0][8].y*480;
     }
     // DRAWING MODE
     if (handInUse == "Right" && fingersUp( results.multiHandLandmarks)==true){
         
        if (xp == 0 && yp==0){
        xp = results.multiHandLandmarks[0][8].x*640;
        yp = results.multiHandLandmarks[0][8].y*480;
      }
      
      else{
       // remove(brush);
         image(brush,results.multiHandLandmarks[0][8].x*640-50 ,results.multiHandLandmarks[0][8].y*480 -50 );
        stroke(0,0,255);
        strokeWeight(10);
        line(xp,yp, results.multiHandLandmarks[0][8].x*640,results.multiHandLandmarks[0][8].y*480);
                
      
        xp = results.multiHandLandmarks[0][8].x*640;
        yp = results.multiHandLandmarks[0][8].y*480;
      }
        
     }else{
        image(select,results.multiHandLandmarks[0][8].x*640,results.multiHandLandmarks[0][8].y*480 );
       
      // save("letter.jpg");
     }
    
    }
  }

  canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.65
});
hands.onResults(onResults);




const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({
      image: videoElement
    });
  },
  width: 0,
  height: 0
});
camera.start();
}

function draw() {
 drawLeftBuffer();
    drawRightBuffer();
    // Paint the off-screen buffers onto the main canvas
    image(leftBuffer, 0, 0);
    image(rightBuffer, 400, 0);
}


function drawLeftBuffer() {
     

}

function drawRightBuffer() {
    drawGrid();
}
