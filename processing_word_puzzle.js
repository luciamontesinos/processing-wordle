/* jshint esversion: 8 */ 
function setup() {
createCanvas(640, 480);

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
     
     // SELECTION MODE
     
     if (handInUse == "Left"){
         // 
         
        stroke(255,255,255);
        strokeWeight(800);

        //line(xp, yp, results.multiHandLandmarks[0][8].x*640 +600, results.multiHandLandmarks[0][8].y*480+600);
        line(xp,yp, results.multiHandLandmarks[0][8].x*640,results.multiHandLandmarks[0][8].y*480);
        xp = results.multiHandLandmarks[0][8].x*640;
        yp = results.multiHandLandmarks[0][8].y*480;
     }
     
     if (handInUse == "Right" && fingersUp( results.multiHandLandmarks)==true){
         
        if (xp == 0 && yp==0){
        xp = results.multiHandLandmarks[0][8].x*640;
        yp = results.multiHandLandmarks[0][8].y*480;
      }
      else{
        
        stroke(0,0,255);
        strokeWeight(10);

        //line(xp, yp, results.multiHandLandmarks[0][8].x*640 +600, results.multiHandLandmarks[0][8].y*480+600);
        line(xp,yp, results.multiHandLandmarks[0][8].x*640,results.multiHandLandmarks[0][8].y*480);
                
       

        xp = results.multiHandLandmarks[0][8].x*640;
        yp = results.multiHandLandmarks[0][8].y*480;
      }
         // 
     }
     
     // DRAWING MODE
     
     
     

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

}
