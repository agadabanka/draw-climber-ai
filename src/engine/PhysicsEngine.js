export class PhysicsEngine {
  constructor() {
    this.gravity = 0.5;
    this.friction = 0.98;
    this.groundY = 530;
    this.bounceVelocity = -2;
  }

  update(character, obstacles) {
    // Apply gravity
    character.vy += this.gravity;

    // Apply forward force from arm rotation (simple model)
    // Arm+legs rotating creates forward momentum
    if (character.armAngularVelocity) {
      character.vx += character.armAngularVelocity * 5; // Convert rotation to forward movement
    }

    // Apply forward force
    character.vx += 0.3;

    // Apply friction
    character.vx *= this.friction;
    character.vy *= this.friction;

    // Update position
    character.x += character.vx;
    character.y += character.vy;

    // Use half-size for collision (cube)
    const halfSize = character.size / 2;

    // Ground collision
    if (character.y + halfSize >= this.groundY) {
      character.y = this.groundY - halfSize;
      character.vy = this.bounceVelocity;
    }

    // Obstacle collisions
    obstacles.forEach(obstacle => {
      if (this.checkObstacleCollision(character, obstacle)) {
        // Land on top of obstacle
        if (character.vy > 0 && character.y + halfSize <= obstacle.y + 10) {
          character.y = obstacle.y - halfSize;
          character.vy = this.bounceVelocity;
        }
      }
    });

    return character;
  }

  checkObstacleCollision(character, obstacle) {
    const halfSize = character.size / 2;

    // AABB collision detection for cube
    const closestX = Math.max(obstacle.x, Math.min(character.x, obstacle.x + obstacle.width));
    const closestY = Math.max(obstacle.y, Math.min(character.y, obstacle.y + obstacle.height));

    const distanceX = character.x - closestX;
    const distanceY = character.y - closestY;

    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (halfSize * halfSize);
  }

  checkFailure(character) {
    // Check if fell off screen
    return character.y > 580;
  }

  checkStuck(character, startX, timeElapsed) {
    // Check if stuck (not moving after 2 seconds)
    const distance = character.x - startX;
    return distance < 20 && timeElapsed > 2000;
  }
}
