import java.util.Iterator;

Game game;

void setup() {
  size(640, 360);
  game = new Game();
  game.setup();
}

void draw() {
  game.draw();
}

void keyReleased() {
  game.keyReleased();
}

void keyPressed() {
  game.keyPressed();
}