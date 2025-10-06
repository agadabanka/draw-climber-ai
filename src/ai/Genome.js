export class Genome {
  constructor(points = null, rotationSpeed = null) {
    this.points = points || this.generateRandomPoints();
    this.rotationSpeed = rotationSpeed ?? (Math.random() * 0.2 - 0.1); // -0.1 to 0.1 rad/frame
    this.fitness = 0;
    this.tested = false;
  }

  generateRandomPoints() {
    const numPoints = Math.floor(Math.random() * 2) + 3; // 3-4 points
    const points = [{ x: 0, y: 0 }]; // First point is always origin

    for (let i = 1; i < numPoints; i++) {
      points.push({
        x: Math.random() * 50 - 25, // -25 to 25
        y: Math.random() * 45 + 15  // 15 to 60
      });
    }

    return points;
  }

  clone() {
    const clonedPoints = this.points.map(p => ({ x: p.x, y: p.y }));
    const genome = new Genome(clonedPoints, this.rotationSpeed);
    genome.fitness = this.fitness;
    genome.tested = this.tested;
    return genome;
  }

  mutate(mutationRate, mutationAmount) {
    const mutatedPoints = this.points.map((point, index) => {
      if (index === 0) return point; // Don't mutate origin

      if (Math.random() < mutationRate) {
        return {
          x: point.x + (Math.random() * mutationAmount * 2 - mutationAmount),
          y: point.y + (Math.random() * mutationAmount * 2 - mutationAmount)
        };
      }

      return { ...point };
    });

    // Mutate rotation speed
    let newRotationSpeed = this.rotationSpeed;
    if (Math.random() < mutationRate) {
      newRotationSpeed += (Math.random() * 0.04 - 0.02); // ±0.02 rad/frame
      newRotationSpeed = Math.max(-0.15, Math.min(0.15, newRotationSpeed));
    }

    // Ensure points stay within bounds
    const boundedPoints = mutatedPoints.map((point, index) => {
      if (index === 0) return point;

      return {
        x: Math.max(-25, Math.min(25, point.x)),
        y: Math.max(15, Math.min(60, point.y))
      };
    });

    this.rotationSpeed = newRotationSpeed;
    return boundedPoints;
  }

  static crossover(parent1, parent2) {
    const minLength = Math.min(parent1.points.length, parent2.points.length);
    const maxLength = Math.max(parent1.points.length, parent2.points.length);
    const childLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    const childPoints = [];
    for (let i = 0; i < childLength; i++) {
      if (i === 0) {
        childPoints.push({ x: 0, y: 0 });
      } else if (i < parent1.points.length && i < parent2.points.length) {
        // Blend genes from both parents
        childPoints.push({
          x: (parent1.points[i].x + parent2.points[i].x) / 2,
          y: (parent1.points[i].y + parent2.points[i].y) / 2
        });
      } else if (i < parent1.points.length) {
        childPoints.push({ ...parent1.points[i] });
      } else {
        childPoints.push({ ...parent2.points[i] });
      }
    }

    // Blend rotation speeds
    const childRotationSpeed = (parent1.rotationSpeed + parent2.rotationSpeed) / 2;

    return new Genome(childPoints, childRotationSpeed);
  }
}
