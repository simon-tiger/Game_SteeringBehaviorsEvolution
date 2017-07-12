var createLegend = function() {
  var legendsketch = function(p) {
    p.setup = function() {
      var canvas = p.createCanvas(270, 600);
      canvas.style("position", "relative");
      canvas.style("right", "15px");
    }

    p.draw = function() {
      p.background(51);

      // Food
      p.push();
      p.fill(0, 255, 0);
      p.noStroke();
      p.ellipse(40, 45, 5, 5);
      p.fill(255);
      p.text("Food (health + 0.3)", 80, 50);
      p.pop();

      // Poison
      p.push();
      p.fill(255, 0, 0);
      p.noStroke();
      p.ellipse(40, 75, 5, 5);
      p.fill(255);
      p.text("Poison (health - 0.65)", 80, 80);
      p.pop();

      // Food Invader
      p.push();
      p.fill(51);
      p.stroke(255);
      p.strokeWeight(2);
      p.drawTriangle(40, 105);
      p.fill(255);
      p.noStroke();
      p.text("Food Invader", 80, 110);
      p.pop();

      // Poison Invader
      p.push();
      p.fill(51);
      p.stroke(255);
      p.strokeWeight(3);
      p.ellipse(40, 135, 12, 12);
      p.fill(255);
      p.noStroke();
      p.text("Poison Invader", 80, 140);
      p.pop();

      // Healthy Vehicle
      p.push();
      p.fill(0, 255, 0);
      p.noStroke();
      p.drawTriangle(40, 165);
      p.fill(255);
      p.text("Healthy Vehicle", 80, 170);
      p.pop();

      // Dying Vehicle
      p.push();
      p.fill(255, 0, 0);
      p.noStroke();
      p.drawTriangle(40, 195);
      p.fill(255);
      p.text("Dying Vehicle", 80, 200);
      p.pop();

      // Food Perception
      p.push();
      p.noFill();
      p.stroke(0, 255, 0);
      p.ellipse(40, 225, 18, 18);
      p.fill(255);
      p.noStroke();
      p.text("Food Perception", 80, 230);
      p.pop();

      // Poison Perception
      p.push();
      p.noFill();
      p.stroke(255, 0, 0);
      p.ellipse(40, 255, 18, 18);
      p.fill(255);
      p.noStroke();
      p.text("Poison Perception", 80, 260);
      p.pop();

      // Food Weight
      p.push();
      p.noFill();
      p.stroke(0, 255, 0);
      p.line(40, 276, 40, 294);
      p.fill(255);
      p.noStroke();
      p.text("Food Weight", 80, 290);
      p.pop();

      // Poison Weight
      p.push();
      p.noFill();
      p.stroke(255, 0, 0);
      p.line(40, 306, 40, 324);
      p.fill(255);
      p.noStroke();
      p.text("Poison Weight", 80, 320);
      p.pop();

      p.fill(255);
      p.noStroke();
      p.text("Every frame the vehicles health\ndecreases by 0.0035.", 20, 400);
      p.text("Feed the Vehicles!", 20, 440);
    }

    p.drawTriangle = function(x, y) {
      p.beginShape();
      p.vertex(x-8, y-5);
      p.vertex(x-8, y+5);
      p.vertex(x+8, y);
      p.endShape(p.CLOSE);
    }
  }

  var legendp5 = new p5(legendsketch);
  return legendp5;
}

var legend = createLegend();
