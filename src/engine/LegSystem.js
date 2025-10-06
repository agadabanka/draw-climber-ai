export class LegSystem {
  constructor(genome) {
    this.genome = genome;
    this.legs = this.createLegs(genome);
    this.rotation = 0; // Current rotation angle
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
    // Update rotation based on genome's rotation speed
    this.rotation += this.genome.rotationSpeed;
    character.rotation = this.rotation;
    character.angularVelocity = this.genome.rotationSpeed;
  }

  getRotatedLegs() {
    // Return legs rotated by current angle
    return this.legs.map(leg => {
      const cos = Math.cos(this.rotation);
      const sin = Math.sin(this.rotation);

      return {
        x1: leg.x1 * cos - leg.y1 * sin,
        y1: leg.x1 * sin + leg.y1 * cos,
        x2: leg.x2 * cos - leg.y2 * sin,
        y2: leg.x2 * sin + leg.y2 * cos
      };
    });
  }

  getLegs() {
    return this.getRotatedLegs();
  }

  // Leg physics - legs push against ground/obstacles
  applyForces(character, physics) {
    const rotatedLegs = this.getRotatedLegs();

    // For each leg endpoint, check if it's touching ground/obstacles
    // If touching, apply force perpendicular to the leg
    // This creates the "walking" motion

    // TODO: Implement full leg physics
    return character;
  }
}
