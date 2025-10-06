export class LegSystem {
  constructor(genome) {
    this.genome = genome;
    this.attachmentOffset = 15; // Distance below cube center for leg attachment
  }

  update(character) {
    // Update ARM rotation based on genome's rotation speed
    character.armRotation += this.genome.rotationSpeed;
    character.armAngularVelocity = this.genome.rotationSpeed;
  }

  // Get attachment points at bottom of cube (left and right)
  getAttachmentPoints(character) {
    const halfSize = character.size / 2;
    const bottomY = halfSize; // Bottom of cube

    return {
      left: {
        x: -8,  // Left side of bottom
        y: bottomY
      },
      right: {
        x: 8,   // Right side of bottom
        y: bottomY
      }
    };
  }

  // Get legs attached at bottom of cube
  getLegs(character) {
    const attachments = this.getAttachmentPoints(character);
    const cos = Math.cos(character.armRotation);
    const sin = Math.sin(character.armRotation);

    const legs = [];

    // Create legs from genome points
    // Left leg (attached to left bottom of cube)
    if (this.genome.points && this.genome.points.length >= 2) {
      for (let i = 0; i < this.genome.points.length - 1; i++) {
        const p1 = this.genome.points[i];
        const p2 = this.genome.points[i + 1];

        // Rotate points relative to arm rotation
        const x1 = attachments.left.x + (p1.x * cos - p1.y * sin);
        const y1 = attachments.left.y + (p1.x * sin + p1.y * cos);
        const x2 = attachments.left.x + (p2.x * cos - p2.y * sin);
        const y2 = attachments.left.y + (p2.x * sin + p2.y * cos);

        legs.push({ x1, y1, x2, y2, side: 'left' });
      }
    }

    // Right leg (attached to right bottom of cube, mirrored)
    if (this.genome.points && this.genome.points.length >= 2) {
      for (let i = 0; i < this.genome.points.length - 1; i++) {
        const p1 = this.genome.points[i];
        const p2 = this.genome.points[i + 1];

        // Mirror the leg on the right side
        const x1 = attachments.right.x + (-p1.x * cos - p1.y * sin);
        const y1 = attachments.right.y + (-p1.x * sin + p1.y * cos);
        const x2 = attachments.right.x + (-p2.x * cos - p2.y * sin);
        const y2 = attachments.right.y + (-p2.x * sin + p2.y * cos);

        legs.push({ x1, y1, x2, y2, side: 'right' });
      }
    }

    return legs;
  }

  getArmEndpoints(character) {
    const attachments = this.getAttachmentPoints(character);
    return {
      start: attachments.left,
      end: attachments.right
    };
  }

  // Leg physics - legs push against ground/obstacles
  applyForces(character, physics) {
    // TODO: Implement leg ground contact and force application
    return character;
  }
}
