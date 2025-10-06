export class MetricsTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.generation = 0;
    this.currentDistance = 0;
    this.bestDistance = 0;
    this.totalAttempts = 0;
    this.currentFitness = 0;
    this.attemptStartTime = 0;
  }

  startAttempt() {
    this.attemptStartTime = Date.now();
    this.totalAttempts++;
  }

  updateDistance(distance) {
    this.currentDistance = distance;
  }

  updateFitness(fitness) {
    this.currentFitness = fitness;
    if (fitness > this.bestDistance) {
      this.bestDistance = fitness;
    }
  }

  updateGeneration(gen) {
    this.generation = gen;
  }

  getMetrics() {
    return {
      generation: this.generation,
      currentDistance: Math.floor(this.currentDistance),
      bestDistance: Math.floor(this.bestDistance),
      totalAttempts: this.totalAttempts,
      currentFitness: Math.floor(this.currentFitness),
      progress: this.bestDistance > 0 ? (this.currentDistance / this.bestDistance) : 0
    };
  }

  getElapsedTime() {
    return Date.now() - this.attemptStartTime;
  }
}
