// Vehicle class

class Vehicle {
  // All of our physics stuff...
  PVector position;
  PVector velocity;
  PVector acceleration;
  // Maximum steering force
  float max_force;
  // Size of vehicle
  float r = 4;
  // Fitness
  float health = 1;
  
  // Genetic Info
  float[] dna = {random(-2, 2) , random(-2, 2),
                 random(10, 75), random(10, 75)};
  
  // Constructor
  Vehicle(float x, float y) {
    // Send x,y location
    position = new PVector(x, y);
    // Random velocity to start
    velocity = PVector.random2D();
    velocity.mult(random(1, 3));
    // No acceleration to start
    acceleration = new PVector();
    
    max_force = 0.1;
  }
  
  // Returns a mutated copy of the vehicle
  Vehicle clone() {
    Vehicle copy = new Vehicle(position.x, position.y);
    copy.dna = dna.clone();
    // Mutate!
    copy.mutate(0.01);
    return copy;
  }
  
  // Returns a non-mutated copy of the vehicle
  Vehicle fixedClone() {
    Vehicle copy = new Vehicle(position.x, position.y);
    copy.dna = dna.clone();
    return copy;
  }
  
  // Mutate function
  void mutate(float mr) {
    // Loop through all of my genes
    for (int i = 0; i < dna.length; i++) {
      if (random(1) < mr) {
        // Tune weights by a tiny bit but
        // Tune perception radii by a big value
        if (i >= 2) {
          dna[i] += random(-5, 5);
        } else {
          dna[i] += random(-0.05, 0.05);
        }
      }
    }
  }
  
  void highlight() {
    if (game.debug) {
      pushStyle();
      fill(127, 50);
      noStroke();
      ellipse(position.x, position.y, dna[3]*2, dna[3]*2);
      popStyle();
    }
  }
  
  // Move vehicle
  void update() {
    // Let health go down
    health -= 0.0035;
    //health = constrain(health, 0, 1);
    
    // Do all of our physics stuff...
    velocity.add(acceleration);
    velocity.limit(game.eat_threshold);
    position.add(velocity);
    acceleration.mult(0);
  }
  
  // Add a force
  void applyForce(PVector force) {
    acceleration.add(force);
  }
  
  // Let vehicles eat something by
  // seeking or repelling it
  PVector eat(ArrayList<PVector> list, float nutrition, float perception) {
    float record = 10000;
    int closestIndex = -1;
    for (int i = 0; i < list.size(); i++) {
      PVector item = list.get(i);
      float d = PVector.dist(position, item);
      if (d < record && d < perception) {
        record = d;
        closestIndex = i;
      }
    }
    
    if (record < game.eat_threshold) {
      list.remove(closestIndex);
      health += nutrition;
    } else if (closestIndex > -1) {
      return seek(list.get(closestIndex));
    }
    return new PVector();
  }
  
  PVector eat(ArrayList<Food> list, float perception) {
    float record = 10000;
    int closestIndex = -1;
    for (int i = 0; i < list.size(); i++) {
      Food item = list.get(i);
      float d = PVector.dist(position, item.position);
      if (d < record && d < perception) {
        record = d;
        closestIndex = i;
      }
    }
    
    if (record < game.eat_threshold) {
      list.remove(closestIndex);  
      health += 0.3;
    } else if (closestIndex > -1) {
      return seek(list.get(closestIndex).position);
    }
    return new PVector();
  }
  
  boolean isDead() {
    return health < 0;
  }
  
  // Seek or Repel algorithm
  PVector seek(PVector target) {
    // Calculate my desired velocity
    PVector desired = PVector.sub(target, position);
    
    // Scale desired velocity to max speed (eat threshold is maxspeed)
    desired.normalize();
    desired.mult(game.eat_threshold);
    
    // Now that we have our desired velocity,
    // calculate steering force
    PVector steer = PVector.sub(desired, velocity);
    steer.limit(max_force); // Limit by maxforce so things don't go crazy!
    
    return steer;
  }
  
  // Draw it!
  void draw() {
    // Red is dying and Green is healthy
    color red = color(255, 0, 0);
    color green = color(0, 255, 0);
    color colour = lerpColor(red, green, health);
    
    pushStyle();
    pushMatrix();
    
    // Use color
    fill(colour);
    stroke(colour);
    strokeWeight(1);
    
    // Transform to location
    translate(position.x, position.y);
    rotate(velocity.heading() + PI/2);
    
    // Draw it as a triangle
    beginShape();
    vertex(0, -r*2);
    vertex(-r, r*2);
    vertex(r, r*2);
    endShape(CLOSE);
    
    if (game.debug) {
      // Draw food weight and perception
      strokeWeight(3);
      noFill();
      stroke(0, 255, 0);
      line(0, 0, 0, -dna[0]*20);
      strokeWeight(2);
      ellipse(0, 0, dna[2]*2, dna[2]*2);
      
      // Draw poison weight and perception
      stroke(255, 0, 0);
      line(0, 0, 0, -dna[1]*20);
      ellipse(0, 0, dna[3]*2, dna[3]*2);
    }
    popMatrix();
    popStyle();
  }
  
  // Keep it in the screen
  PVector checkBounds(float buffer) {
    
    PVector desired = null;
    
    if (position.x < buffer) {
      desired = new PVector(game.eat_threshold, velocity.y);
    } else if (position.x > width - buffer) {
      desired = new PVector(-game.eat_threshold, velocity.y);
    }
    
    if (position.y < buffer) {
      desired = new PVector(velocity.x, game.eat_threshold);
    } else if (position.y > height - buffer) {
      desired = new PVector(velocity.x, -game.eat_threshold);
    }
    
    if (desired != null) {
      desired.normalize();
      desired.mult(game.eat_threshold);
      PVector steer = PVector.sub(desired, velocity);
      steer.limit(max_force);
      return steer;
    }
    
    return new PVector();
  }
}