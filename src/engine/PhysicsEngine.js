export class PhysicsEngine {
  constructor() {
    this.gravity = 0.5;
    this.friction = 0.98;
    this.groundY = 530;
    this.bounceVelocity = -2;
  }

  update(character, obstacles, legs = []) {
    // Apply gravity
    character.vy += this.gravity;

    // Check leg-ground contact and apply forces
    let groundContact = false;
    if (legs && legs.length > 0) {
      legs.forEach(leg => {
        // Leg positions are RELATIVE to character, convert to world coords
        const legTipX = character.x + leg.x2;
        const legTipY = character.y + leg.y2;

        // Ground contact (with more tolerance)
        if (legTipY >= this.groundY - 10) {
          groundContact = true;

          // Apply rotational force - legs push cube forward when rotating
          const pushForce = Math.abs(character.armAngularVelocity) * 10;

          // When leg touches ground and is rotating backward, push cube forward
          const legVelocityX = -leg.y2 * character.armAngularVelocity; // tangential velocity
          if (legVelocityX < 0) { // Leg moving backward relative to cube
            character.vx += pushForce;
          }
        }

        // Obstacle contact
        obstacles.forEach(obstacle => {
          const obsTop = obstacle.y;
          const obsLeft = obstacle.x;
          const obsRight = obstacle.x + obstacle.width;

          // Check if leg tip is touching obstacle top surface
          if (legTipX >= obsLeft && legTipX <= obsRight &&
              legTipY >= obsTop - 10 && legTipY <= obsTop + 10) {
            groundContact = true;

            const pushForce = Math.abs(character.armAngularVelocity) * 10;
            const legVelocityX = -leg.y2 * character.armAngularVelocity;

            if (legVelocityX < 0) {
              character.vx += pushForce;
              // Also push up slightly to help climb
              character.vy -= pushForce * 0.2;
            }
          }
        });
      });
    }

    // Always apply small forward force to ensure movement
    character.vx += 0.5;

    // Apply friction
    character.vx *= this.friction;
    character.vy *= this.friction;

    // Update position
    character.x += character.vx;
    character.y += character.vy;

    // Use half-size for collision (cube)
    const halfSize = character.size / 2;

    // Ground collision for cube body
    if (character.y + halfSize >= this.groundY) {
      character.y = this.groundY - halfSize;
      character.vy = 0;
    }

    // Obstacle collisions for cube body
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
          character.vy = 0;
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
