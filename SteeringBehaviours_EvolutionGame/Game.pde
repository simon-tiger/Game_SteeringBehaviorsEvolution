// Game class

class Game {
  // Variables for our game
  ArrayList<Food> food;
  ArrayList<PVector> poison;
  float eat_threshold = 5;
  Invader invader;
  float stepSize = 3;
  PVector poisonInvader;
  float xoff = 0;
  ArrayList<Vehicle> vehicles;
  float cloningChance = 0.0035;
  boolean debug = false;

  void setup() {
    // Create ArrayLists
    food = new ArrayList<Food>();
    poison = new ArrayList<PVector>();
    vehicles = new ArrayList<Vehicle>();
    // Create the invaders
    invader = new Invader(50, height/2);
    poisonInvader = new PVector(width/2, height/2);
    // Put some vehicles into the world
    for (int i = 0; i < 10; i++) {
      vehicles.add(new Vehicle(random(width/3, width), random(0, height)));
    }
  }

  void draw() {
    background(51);
    pushStyle();
    noStroke();
    
    // Display all of the food
    for (Food v : food) {
      v.draw();
    }
    
    // Display all of the poison
    for (PVector v : poison) {
      fill(255, 0, 0);
      ellipse(v.x, v.y, eat_threshold, eat_threshold);
    }
    popStyle();
    
    // Display the food invader and move
    // all of the food
    invader.draw();
    for (int i = food.size()-1; i >= 0; i--) {
      Food f = food.get(i);
      if (!f.isStatic) {
        f.update();
        if (f.isDead()) {
          food.remove(i);
        }
      }
    }
    
    // Display the poison invader as a circle
    // and move it according to perlin noise
    pushStyle();
    fill(51);
    stroke(255);
    strokeWeight(5);
    ellipse(poisonInvader.x, poisonInvader.y, 30, 30);
    popStyle();
    poisonInvader.x = map(noise(xoff), 0, 1, 0, width);
    poisonInvader.y = map(noise(xoff + 10000), 0, 1, 0, height);
    poisonInvader.x = constrain(poisonInvader.x, 0, width);
    poisonInvader.y = constrain(poisonInvader.y, 0, height);
    xoff += 0.01;
    
    // Let the poison invader add poison!
    if (random(1) < 0.03) {
      poison.add(poisonInvader.copy());
    }
    // Add some food randomly
    if (random(1) < 0.06) {
      food.add(new Food(random(width/3, width), random(0, height), true));
    }
    
    // If there is too many poison, delete some
    if (poison.size() > 25) {
      poison.remove(0);
    }
    // If there is too many food, delete some
    if (food.size() > 75) {
      food.remove(0);
    }
    
    // Do everything to the vehicles:
    float record = 0;
    Vehicle fitest = null;
    for (int i = vehicles.size()-1; i >= 0; i--) {
      Vehicle v = vehicles.get(i);
      // Move it
      v.update();
      // Display it
      v.draw();
      // Apply steering forces to it
      v.applyForce(PVector.mult(v.eat(food, v.dna[2]), v.dna[0]));
      v.applyForce(PVector.mult(v.eat(poison, -0.65, v.dna[3]), v.dna[1]));
      v.applyForce(v.checkBounds(25));
      // Evolve!
      Vehicle copy = v.clone();
      if (v.health > record) {
        record = v.health;
        fitest = v.fixedClone();
      }
      if (random(1) < cloningChance) {
        vehicles.add(copy);
      }
      if (v.isDead()) {
        // Die
        food.add(new Food(v.position.x, v.position.y, true));
        vehicles.remove(i);
      }
    }  
    // Highlight the best one (if a best one exists)
    if (fitest != null) {
      fitest.highlight();
    }
    cloningChance *= 0.997;
  }
  
  void keyReleased() {
    // Stop moving
    if (key != ' ' && key != 'd') {
      invader.setSteps(0);
    }
  }

  void keyPressed() {
    if (key == CODED) {
      // If we are pressing the up arrow key
      if (keyCode == UP) {
        // Move up
        invader.setSteps(-stepSize);
      // If we are pressing the down arrow key
      } else if (keyCode == DOWN) {
        // Move down
        invader.setSteps(stepSize);
      }
    }
    // If we are pressing the space bar
    if (key == ' ') {
      // Let the invader add some food!
      food.add(new Food(invader.position.x + 30, invader.position.y, false));
    // If we are pressing 'd'
    } else if (key == 'd') {
      // Toggle debugging info
      debug = !debug;
    }
  }
}