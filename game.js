
let slots =[];

function drawGrid() {
  push();
  background(0);
  translate(limit / 2, -size / 2);
  stroke(128);
  strokeWeight(size / 10);
  fill(40);
  rect(0, (limit / 2) + (size / 2), 13.5 * size, 13.5 * size, size / 4);
  noFill();
  rect(-5.85 * size, size * 1.65, size, size, size / 5);
  rect(5.85 * size, size * 1.65, size, size, size / 5);
  rect(-5.85 * size, 12.35 * size, size, size, size / 5);
  noStroke();
  fill(128);
  textSize(size * 0.8);
  text('?', -5.85 * size, size * 1.7);
  text('K', 5.85 * size, size * 1.7);
  for (let row = 0; row < 6; row++) {
   for (let col = 0; col < 5; col++) {
      slots[row][col].show();
      slots[row][col].morph();
  }}
  //cursor.show();
  textSize(size);
  fill(255);
  noStroke();
  text(message, 0, height - size / 2.5);
  if (keyboard) {
 for (let k of keys) {


      k.show();
    }
    enter.show();
    del.show();
  }
  pop();
  if (instructions) showInstructions();
}

function setup() {
createCanvas(window.innerWidth, window.innerHeight);
leftBuffer = createGraphics(window.innerWidth/2, window.innerHeight);
rightBuffer = createGraphics(window.innerWidth/2, window.innerHeight);

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
