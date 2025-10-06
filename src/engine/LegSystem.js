export class LegSystem {
  constructor(genome) {
    this.genome = genome;
    this.legs = this.createLegs(genome);
    this.armLength = 40; // Length of the arm from cube center to arm tip
  }

  createLegs(genome) {
    if (!genome || !genome.points || genome.points.length < 2) {
      return [];
    }

    const legs = [];
    for (let i = 0; i < genome.points.length - 1; i++) {
      legs.push({
        x1: genome.points[i].x,
        y1: genome.points[i].y,
        x2: genome.points[i + 1].x,
        y2: genome.points[i + 1].y
      });
    }

    return legs;
  }

  update(character) {
    // Update ARM rotation based on genome's rotation speed
    character.armRotation += this.genome.rotationSpeed;
    character.armAngularVelocity = this.genome.rotationSpeed;
  }

  getArmPosition(character) {
    // Arm tip position relative to character center
    return {
      x: Math.cos(character.armRotation) * this.armLength,
      y: Math.sin(character.armRotation) * this.armLength
    };
  }

  getRotatedLegs(character) {
    // Get arm tip position
    const armTip = this.getArmPosition(character);

    // Legs are attached to the arm tip and rotate with it
    return this.legs.map(leg => {
      const cos = Math.cos(character.armRotation);
      const sin = Math.sin(character.armRotation);

      return {
        // Leg start point is at arm tip
        x1: armTip.x + (leg.x1 * cos - leg.y1 * sin),
        y1: armTip.y + (leg.x1 * sin + leg.y1 * cos),
        // Leg end point is relative to arm tip
        x2: armTip.x + (leg.x2 * cos - leg.y2 * sin),
        y2: armTip.y + (leg.x2 * sin + leg.y2 * cos)
      };
    });
  }

  getLegs(character) {
    return this.getRotatedLegs(character);
  }

  getArmEndpoints(character) {
    const armTip = this.getArmPosition(character);
    return {
      start: { x: 0, y: 0 }, // Arm starts at cube center
      end: armTip // Arm ends at tip
    };
  }

  // Leg physics - legs push against ground/obstacles
  applyForces(character, physics) {
    const rotatedLegs = this.getRotatedLegs(character);

    // For each leg endpoint, check if it's touching ground/obstacles
    // If touching, apply force perpendicular to the leg
    // This creates the "walking" motion

    // TODO: Implement full leg physics
    return character;
  }
}
