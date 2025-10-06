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
        const halfSize = character.size / 2;
        const charBottom = character.y + halfSize;
        const charTop = character.y - halfSize;
        const charLeft = character.x - halfSize;
        const charRight = character.x + halfSize;

        // Determine collision side and resolve
        if (character.vy > 0 && charBottom <= obstacle.y + 20) {
          // Landing on top
          character.y = obstacle.y - halfSize;
          character.vy = this.bounceVelocity;
        } else if (character.vy < 0 && charTop >= obstacle.y + obstacle.height - 20) {
          // Hitting bottom
          character.y = obstacle.y + obstacle.height + halfSize;
          character.vy = 0;
        } else if (charRight > obstacle.x && character.vx > 0) {
          // Hitting from left
          character.x = obstacle.x - halfSize;
          character.vx = 0;
        } else if (charLeft < obstacle.x + obstacle.width && character.vx < 0) {
          // Hitting from right
          character.x = obstacle.x + obstacle.width + halfSize;
          character.vx = 0;
        }
      }
    });

    return character;
  }

  checkObstacleCollision(character, obstacle) {
    const halfSize = character.size / 2;

    // Proper AABB (box-box) collision detection
    const charLeft = character.x - halfSize;
    const charRight = character.x + halfSize;
    const charTop = character.y - halfSize;
    const charBottom = character.y + halfSize;

    const obsLeft = obstacle.x;
    const obsRight = obstacle.x + obstacle.width;
    const obsTop = obstacle.y;
    const obsBottom = obstacle.y + obstacle.height;

    // Check if boxes overlap
    return charRight > obsLeft &&
           charLeft < obsRight &&
           charBottom > obsTop &&
           charTop < obsBottom;
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
