class Slot {
  constructor(x, y, size, row, col) {
    this.x = x;
    this.y = y;
    this.w = size;
    this.h = size;
    this.size = size;
    this.f = 'white';
    this.l = '';
    this.a = 0;
    this.ta = PI * (6 - row);
  }
  show() {
    push();
    translate(this.x, this.y);
    fill(this.f);
    stroke(128);
    strokeWeight(size / 10);
    rect(0, 0, this.w, this.h, this.size / 5);
    fill(0);
    noStroke();
    textSize(abs(this.h / 1.5));
    text(this.l.toUpperCase(), 0, this.size / 24);
    pop();
  }
  contains(x, y) {
    let left = x > this.x - this.size / 2;
    let right = x < this.x + this.size / 2;
    let top = y > this.y - this.size / 2;
    let bottom = y < this.y + this.size / 2;
    return (left && right && top && bottom);
  }
  morph() {
    this.a = lerp(this.a, this.ta, 0.1);
    this.h = this.w * abs(cos(this.a));
  }
}
