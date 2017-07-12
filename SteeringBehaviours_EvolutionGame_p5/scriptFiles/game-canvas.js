var createGameArea = function() {
  var gamesketch = function(p) {
    // Game class
    p.Game = function() {
      // Variables for our game
      this.eat_threshold = 5;
      this.stepSize = 3;
      this.xoff = 0;
      this.cloningChance = 0.01;
      this.debug = false;
      this.timer = 300;
    }

    p.Game.prototype.reset = function() {
      // Reset everything
      console.log(this.isTimer.checked());
      if (this.isTimer.checked()) {
        this.timer = Number(this.timeLeft.value() * 60);
      } else {
        this.timer = null;
      }

      this.xoff = 0;
      this.cloningChance = 0.01;
      this.debug = false;

      this.food = [];
      this.poison = [];
      this.vehicles = [];
      this.invader = new p.Invader(50, p.height/2);
      this.poisonInvader = p.createVector(p.width/2, p.height/2);
      for (var i = 0; i < 35; i++) {
        this.food.push(new p.Food(p.random(p.width/4, p.width), p.random(0, p.height), true));
      }
      for (var i = 0; i < 10; i++) {
        this.vehicles.push(new p.Vehicle(p.random(p.width/4, p.width), p.random(0, p.height)));
      }
    }

    p.Game.prototype.setup = function() {
      // Create Arrays
      this.food = [];
      this.poison = [];
      this.vehicles = [];
      // Create the invaders
      this.invader = new p.Invader(50, p.height/2);
      this.poisonInvader = p.createVector(p.width/2, p.height/2);
      // Put some food into the world
      for (var i = 0; i < 35; i++) {
        this.food.push(new p.Food(p.random(p.width/4, p.width), p.random(0, p.height), true));
      }
      // Put some vehicles into the world
      for (var i = 0; i < 10; i++) {
        this.vehicles.push(new p.Vehicle(p.random(p.width/4, p.width), p.random(0, p.height)));
      }

      // Timer on/off
      this.isTimer = p.select('#is-timer');
      this.timerElt = p.select('#timer');
      this.timeLeft = p.select('#time-left');
      this.resetBtn = p.select('#new-game');
      this.resetBtn.mousePressed(this.reset.bind(this));
    }

    p.Game.prototype.draw = function() {
      p.background(51);

      if (this.timer !== 0 && this.vehicles.length > 0) {
        p.push();
        p.noStroke();

        // Display all of the food
        for (var i = 0; i < this.food.length; i++) {
          this.food[i].draw();
        }
      }

      // Hide and show timer
      if (this.isTimer.checked()) {
        this.timerElt.show();
      } else {
        this.timerElt.hide();
      }

      if (this.timer !== 0 && this.vehicles.length > 0) {
        // Display all of the poison
        for (var i = 0; i < this.poison.length; i++) {
          p.fill(255, 0, 0);
          p.ellipse(this.poison[i].x, this.poison[i].y, this.eat_threshold, this.eat_threshold);
        }
        p.pop();

        // Display the food invader and
        // move all of the food
        this.invader.draw();
        for (var i = this.food.length-1; i >= 0; i--) {
          var f = this.food[i];
          if (!f.isStatic) {
            f.update();
            if (f.isDead()) {
              this.food.splice(i, 1);
            }
          }
        }

        // Display the poison invader as a circle
        // and move it according to perlin noise
        p.push();
        p.fill(51);
        p.stroke(255);
        p.strokeWeight(5);
        p.ellipse(this.poisonInvader.x, this.poisonInvader.y, 30, 30);
        p.pop();
        this.poisonInvader.x = p.map(p.noise(this.xoff), 0, 1, 0, p.width);
        this.poisonInvader.y = p.map(p.noise(this.xoff + 10000), 0, 1, 0, p.height);
        this.poisonInvader.x = p.constrain(this.poisonInvader.x, 0, p.width);
        this.poisonInvader.y = p.constrain(this.poisonInvader.y, 0, p.height);
        this.xoff += 0.01;

        // Let the poison invader add poison!
        if (p.random(1) < 0.03) {
          this.poison.push(this.poisonInvader.copy());
        }
        // Add some food randomly
        if (p.random(1) < 0.06) {
          this.food.push(new p.Food(p.random(p.width/4, p.width), p.random(0, p.height), true));
        }

        // If there is too many poison, delete some
        if (this.poison.length > 25) {
          this.poison.splice(0, 1);
        }
        // If there is too many food, delete some
        if (this.food.length > 75) {
          this.food.splice(0, 1);
        }
      }

      // Draw a timer
      if (this.timer && this.vehicles.length > 0) {
        p.push();
        p.stroke(255);
        p.noFill();
        p.rect(50, 7, 300, 7);
        p.fill(255);
        var maxTime = Number(this.timeLeft.value() * 60) || 300;
        p.rect(50, 7, p.constrain(p.map(this.timer, 0, maxTime, 0, 300), 0, 300), 7);
        p.noStroke();
        p.text(p.floor(this.timer / 60) + ':' + p.nf(p.floor(this.timer % 60), 2), 5, 14);
        p.pop();
      }

      if (this.timer !== 0 && this.vehicles.length > 0) {
        // Do everything to the vehicles:
        var record = 0;
        var fitest;
        for (var i = this.vehicles.length-1; i >= 0; i--) {
          var v = this.vehicles[i];
          // Move it
          v.update();
          // Display it
          v.draw();
          // Apply steering forces to it
          v.applyForce(p5.Vector.mult(v.eat(this.food, 0.3, v.dna[2]), v.dna[0]));
          v.applyForce(p5.Vector.mult(v.eat(this.poison, -0.65, v.dna[3]), v.dna[1]));
          v.applyForce(v.checkBounds(25));
          // Evolve!
          var clone = v.clone();
          if (p.random(1) < this.cloningChance) {
            this.vehicles.push(clone);
          }
          if (v.health > record) {
            record = v.health;
            fitest = v.fixedClone();
          }
          if (v.isDead()) {
            // Die
            this.food.push(new p.Food(v.position.x, v.position.y, true));
            this.vehicles.splice(i, 1);
          }
        }
        // Highlight the best one (if a best one exists)
        if (fitest) {
          fitest.highlight();
        }
        this.cloningChance *= 0.997;
        this.timer -= 1/60;
        if (this.timer < 0) {
          this.timer = 0;
        }
      }

      if (this.timer === 0 || this.vehicles.length <= 0) {
        p.push();
        p.fill(255);
        p.textAlign(p.CENTER);
        p.textSize(48);
        p.text("Game over!", p.width/2, p.height/2);
        p.pop();
      }
    }

    p.Game.prototype.keyReleased = function() {
      // Stop moving
      if (p.key !== ' ' && p.key !== 'D') {
        this.invader.setSteps(0);
      }
    }

    p.Game.prototype.keyPressed = function() {
      // If we are pressing the up arrow key
      if (p.keyCode === p.UP_ARROW) {
        // Move up
        this.invader.setSteps(-this.stepSize);
      // If we are pressing the down arrow key
      } else if (p.keyCode === p.DOWN_ARROW) {
        // Move down
        this.invader.setSteps(this.stepSize);
      // If we are pressing the space bar
      } else if (p.key === ' ') {
        // Let the invader add some food!
        this.food.push(new p.Food(this.invader.position.x + 30, this.invader.position.y, false));
      // If we are pressing the 'd' on our keyboard
      } else if (p.key === 'D') {
        this.debug = !this.debug;
      }
    }


    // Vehicle class
    p.Vehicle = function(x, y) {
      // All of our physics stuff...
      this.position = p.createVector(x, y);
      this.velocity = p5.Vector.random2D();
      this.velocity.mult(p.random(1, 3));
      this.acceleration = p.createVector();
      // Maximum steering force
      this.max_force = 0.1;
      // Size of vehicle
      this.r = 8;
      // Fitness
      this.health = 1;

      // Genetic Info
      this.dna = [p.random(-2, 2) , p.random(-2, 2),
                  p.random(10, 75), p.random(10, 75)];
    }

    // Returns a mutated copy of the vehicle
    p.Vehicle.prototype.clone = function() {
      var clone = new p.Vehicle(this.position.x, this.position.y);
      clone.dna = this.dna.slice();
      // Mutate!
      clone.mutate(0.01);
      return clone;
    }

    // Returns a non-mutated copy of the vehicle
    p.Vehicle.prototype.fixedClone = function() {
      var clone = new p.Vehicle(this.position.x, this.position.y);
      clone.dna = this.dna.slice();
      return clone;
    }

    // Mutate function
    p.Vehicle.prototype.mutate = function(mr) {
      // Loop through all of my genes
      for (var i = 0; i < this.dna.length; i++) {
        if (p.random(1) < mr) {
          // Tune weights by a tiny bit but
          // Tune perception radii by a big value
          if (i >= 2) {
            this.dna[i] += p.random(-5, 5);
          } else {
            this.dna[i] += p.random(-0.05, 0.05);
          }
        }
      }
    }

    p.Vehicle.prototype.highlight = function() {
      if (p.game.debug) {
        p.push();
        p.noStroke();
        p.fill(127, 50);
        p.ellipse(this.position.x, this.position.y, this.dna[3]*2);
        p.pop();
      }
    }

    // Add a force
    p.Vehicle.prototype.applyForce = function(force) {
      this.acceleration.add(force);
    }

    // Move vehicle
    p.Vehicle.prototype.update = function() {
      this.health -= 0.0035;
      //this.health = constrain(this.health, 0, 1);

      // Do all of our physics stuff...
      this.velocity.add(this.acceleration);
      this.velocity.limit(p.game.eat_threshold);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
    }

    // Let vehicles eat something by
    // seeking it or repelling it
    p.Vehicle.prototype.eat = function(list, nutrition, perception) {
      var record = Infinity;
      var closestIndex = -1;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var d;
        if (item instanceof p.Food) {
          d = p5.Vector.dist(this.position, item.position);
        } else if (item instanceof p5.Vector) {
          d = p5.Vector.dist(this.position, item);
        }
        if (d < record && d < perception) {
          record = d;
          closestIndex = i;
        }
      }

      if (record < p.game.eat_threshold) {
        list.splice(closestIndex, 1);
        this.health += nutrition;
      } else if (closestIndex > -1) {
        var item = list[closestIndex];
        if (item instanceof p.Food) {
          return this.seek(list[closestIndex].position);
        } else if (item instanceof p5.Vector) {
          return this.seek(list[closestIndex]);
        }
      }
      return p.createVector();
    }

    p.Vehicle.prototype.isDead = function() {
      return this.health < 0;
    }

    // Seek or Repel algorithm
    p.Vehicle.prototype.seek = function(target) {
      // Calculate my desired velocity
      var desired = p5.Vector.sub(target, this.position);

      // Scale desired velocity to max speed (eat threshold is maxspeed)
      desired.normalize();
      desired.mult(p.game.eat_threshold);

      // Now that we have our desired velocity,
      // calculate steering force
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.max_force); // Limit by maxforce so things don't go crazy!

      return steer;
    }

    // Draw it!
    p.Vehicle.prototype.draw = function() {
      // Red is dying and Green is healthy
      var redColor = p.color(255, 0, 0);
      var greenColor = p.color(0, 255, 0);
      var actualColor = p.lerpColor(redColor, greenColor, this.health);

      p.push();

      // Use colour
      p.fill(actualColor);
      p.stroke(actualColor);
      p.strokeWeight(1);

      // Transform to location
      p.translate(this.position.x, this.position.y);
      p.rotate(this.velocity.heading() + p.PI/2);

      // Draw it as a triangle
      p.beginShape();
      p.vertex(0, -this.r*2);
      p.vertex(-this.r, this.r*2);
      p.vertex(this.r, this.r*2);
      p.endShape(p.CLOSE);

      if (p.game.debug) {
        // Draw food weight and perception
        p.strokeWeight(3);
        p.noFill();
        p.stroke(0, 255, 0);
        p.line(0, 0, 0, -this.dna[0]*20);
        p.strokeWeight(2);
        p.ellipse(0, 0, this.dna[2]*2);

        // Draw poison weight and perception
        p.stroke(255, 0, 0);
        p.line(0, 0, 0, -this.dna[1]*20);
        p.ellipse(0, 0, this.dna[3]*2);
      }

      p.pop();
    }

    // Keep it in the screen
    p.Vehicle.prototype.checkBounds = function(buffer) {

      var desired = null;

      if (this.position.x < buffer) {
        desired = p.createVector(p.game.eat_threshold, this.velocity.y);
      } else if (this.position.x > p.width - buffer) {
        desired = p.createVector(-p.game.eat_threshold, this.velocity.y);
      }

      if (this.position.y < buffer) {
        desired = p.createVector(this.velocity.x, p.game.eat_threshold);
      } else if (this.position.y > p.height - buffer) {
        desired = p.createVector(this.velocity.x, -p.game.eat_threshold);
      }

      if (desired != null) {
        desired.normalize();
        desired.mult(p.game.eat_threshold);
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.max_force);
        return steer;
      }

      return p.createVector();
    }


    // Invader class
    p.Invader = function(x, y) {
      // Position
      this.position = p.createVector(x, y);
      // Step size (negative if moving up)
      this.steps = 0;
    }

    // This function sets the step size
    p.Invader.prototype.setSteps = function(steps) {
      this.steps = steps;
    }

    // Move the invader
    p.Invader.prototype.update = function() {
      this.position.y += this.steps;
    }

    // Draw the invader
    p.Invader.prototype.draw = function() {
      this.update();
      p.push();
      p.translate(this.position.x, this.position.y);
      p.stroke(255);
      p.fill(51);
      p.strokeWeight(5);
      p.beginShape();
      p.vertex(-30, -20);
      p.vertex(-30, 20);
      p.vertex(30, 0);
      p.endShape(p.CLOSE);
      p.pop();
    }


    p.Food = function(x, y, locked) {
      this.position = p.createVector(x, y);
      this.lifespan = 300;
      this.isStatic = locked;
    }

    p.Food.prototype.update = function() {
      this.position.x += p.game.stepSize;
      this.lifespan--;
    }

    p.Food.prototype.isDead = function() {
      return this.lifespan < 0;
    }

    p.Food.prototype.draw = function() {
      p.fill(0, 255, 0);
      p.ellipse(this.position.x, this.position.y, p.game.eat_threshold, p.game.eat_threshold);
    }










    p.setup = function() {
      p.canvas = p.createCanvas(p.windowWidth - 360, 600);
      p.game = new p.Game();
      p.game.setup();
    }

    p.draw = function() {
      p.game.draw();
    }

    p.keyReleased = function() {
      p.game.keyReleased();
    }

    p.keyPressed = function() {
      p.game.keyPressed();
    }
  }

  var gamep5 = new p5(gamesketch);
  return gamep5;
}

var game = createGameArea();
