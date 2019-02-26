# Game_SteeringBehaviorsEvolution
I made my Evolutionary Steering Behaviors project (link in the README) a game, so you can save the vehicles by adding food.

## Description and Details
### You interact with the keyboard:
<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>What it does</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>up-arrow</td>
      <td>Move invader up</td>
    </tr>
    <tr>
      <td>down-arrow</td>
      <td>Move invader down</td>
    </tr>
    <tr>
      <td>space bar</td>
      <td>Shoot food</td>
    </tr>
    <tr>
      <td>'d'</td>
      <td>Toggle debugging info</td>
    </tr>
  </tbody>
</table>

### Other details are:
 - I am now highlighting the best vehicle
 - Another invader is moving around with perlin noise spreading poison (instead of just adding new poison randomly, without using perlin noise)
 
### Links:
<table>
  <tr>
    <td>Original code</td>
    <td>https://github.com/simon-tiger/steering-behaviors-evolution</td>
  </tr>
  <tr>
    <td>p5.js version</td>
    <td>https://simon-tiger.github.io/Game_SteeringBehaviorsEvolution/SteeringBehaviours_EvolutionGame_p5/</td>
  </tr>
</table>

<hr/>

More information is in the code.

## NEW: 'The Everlasting Vehicle'!!
The last time I ran the program is a couple of hours ago. Everything died out, except for one vehicle.

### Stats
I have programmed this with a genetic algorithm. They have a DNA with 4 genes.

- Attraction/Repulsion to food
- Attraction/Repulsion to poison
- How far it can see food
- How far it can see poison

They also have a health, which goes down over time. If they eat food, then their health goes up, if they eat poison, then their health suddenly goes down. A good health is 1, and a bad one is 0.

So what was The Everlasting Vehicle's DNA and health?

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Attraction/Repulsion to food</td>
      <td>1.9958444373034823</td>
    </tr>
    <tr>
      <td>Attraction/Repulsion to poison</td>
      <td>1.3554737395594456</td>
    </tr>
    <tr>
      <td>How far it can see food</td>
      <td>53.31017416626768</td>
    </tr>
    <tr>
      <td>How far it can see poison</td>
      <td>23.33902221893798</td>
    </tr>
    <tr>
      <td>Average health</td>
      <td>~397</td>
    </tr>
  </tbody>
</table>

So it attracts to poison, yet its health is approximately 397 times bigger than a very good health! And better yet, it even lasted for a couple of hours so far!!!

### Update
I've restarted the computer, so it died now.

- Updated average health (right berfore its death): ~435

<hr/>

## Credits:
Inspired by Daniel Shiffman's Evolutionary Steering Behaviors Coding Challenge<br/>
Link to the Challenge: https://www.youtube.com/watch?v=flxOkx0yLrY
