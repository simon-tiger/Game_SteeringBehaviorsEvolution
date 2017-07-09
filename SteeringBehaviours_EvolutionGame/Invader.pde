// Invader class

class Invader {
  // Position
  PVector position;
  // Step size (negative if moving up)
  float steps = 0;
  
  Invader(float x, float y) {
    position = new PVector(x, y);
  }
  
  // This function sets the step size
  void setSteps(float steps) {
    this.steps = steps;
  }
  
  // Move the invader
  void update() {
    position.y += steps;
  }
  
  // Draw the invader
  void draw() {
    update();
    pushStyle();
    pushMatrix();
    translate(position.x, position.y);
    stroke(255);
    fill(51);
    strokeWeight(5);
    beginShape();
    vertex(-30, -20);
    vertex(-30, 20);
    vertex(30, 0);
    endShape(CLOSE);
    popMatrix();
    popStyle();
  }
}