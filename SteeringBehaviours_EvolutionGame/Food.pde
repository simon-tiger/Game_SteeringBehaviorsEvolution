class Food {
  PVector position;
  float lifespan;
  boolean isStatic;
  
  Food(float x, float y, boolean locked) {
    position = new PVector(x, y);
    lifespan = 120;
    isStatic = locked;
  }
  
  void update() {
    position.x += 3;
    lifespan--;
  }
  
  boolean isDead() {
    return lifespan < 0;
  }
  
  void draw() {
    pushStyle();
    fill(0, 255, 0);
    ellipse(position.x, position.y, game.eat_threshold, game.eat_threshold);
    popStyle();
  }
}