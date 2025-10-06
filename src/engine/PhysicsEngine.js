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

        // Ground contact (increased tolerance)
        if (legTipY >= this.groundY - 15) {
          groundContact = true;

          // Calculate tangential velocity of leg tip (how fast it's moving horizontally)
          // For a rotating point: v = r × ω (velocity = radius × angular velocity)
          const legTipVelocityX = -leg.y2 * character.armAngularVelocity;
          const legTipVelocityY = leg.x2 * character.armAngularVelocity;

          // When leg tip is moving backward relative to ground (pushing), cube moves forward
          if (legTipVelocityX < 0) {
            const pushForce = Math.abs(legTipVelocityX) * 20;
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
              legTipY >= obsTop - 15 && legTipY <= obsTop + 15) {
            groundContact = true;

            const legTipVelocityX = -leg.y2 * character.armAngularVelocity;

            if (legTipVelocityX < 0) {
              const pushForce = Math.abs(legTipVelocityX) * 20;
              character.vx += pushForce;
              // Push up to help climb
              character.vy -= pushForce * 0.4;
            }
          }
        });
      });
    }

    // Base forward movement (always active)
    character.vx += 1.0;

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
