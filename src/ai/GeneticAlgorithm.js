import { Genome } from './Genome.js';

export class GeneticAlgorithm {
  constructor(config = {}) {
    this.populationSize = config.populationSize || 6;
    this.survivalRate = config.survivalRate || 0.33;
    this.mutationRate = config.mutationRate || 0.4;
    this.mutationAmount = config.mutationAmount || 20;
    this.maxGenerations = config.maxGenerations || 1000;

    this.population = [];
    this.generation = 0;
    this.currentIndex = 0;
    this.bestGenome = null;
    this.bestFitness = 0;
  }

  initialize() {
    this.population = [];
    for (let i = 0; i < this.populationSize; i++) {
      this.population.push(new Genome());
    }
    this.generation = 0;
    this.currentIndex = 0;
  }

  getCurrentGenome() {
    return this.population[this.currentIndex];
  }

  recordFitness(fitness) {
    const genome = this.population[this.currentIndex];
    genome.fitness = fitness;
    genome.tested = true;

    // Update best
    if (fitness > this.bestFitness) {
      this.bestFitness = fitness;
      this.bestGenome = genome.clone();
    }
  }

  nextGenome() {
    this.currentIndex++;

    // Check if generation is complete
    if (this.currentIndex >= this.population.length) {
      this.evolve();
      return true; // New generation started
    }

    return false; // Same generation
  }

  evolve() {
    // Sort by fitness
    this.population.sort((a, b) => b.fitness - a.fitness);

    // Select survivors
    const numSurvivors = Math.max(2, Math.floor(this.population.length * this.survivalRate));
    const survivors = this.population.slice(0, numSurvivors);

    // Create offspring
    const offspring = [];
    while (offspring.length < this.population.length - numSurvivors) {
      const parent1 = survivors[Math.floor(Math.random() * survivors.length)];
      const parent2 = survivors[Math.floor(Math.random() * survivors.length)];

      const child = Genome.crossover(parent1, parent2);
      child.points = child.mutate(this.mutationRate, this.mutationAmount);
      child.tested = false;
      child.fitness = 0;

      offspring.push(child);
    }

    // New population
    this.population = [...survivors, ...offspring];
    this.generation++;
    this.currentIndex = 0;
  }

  getStats() {
    return {
      generation: this.generation,
      currentIndex: this.currentIndex,
      populationSize: this.population.length,
      bestFitness: this.bestFitness,
      currentFitness: this.population[this.currentIndex]?.fitness || 0
    };
  }

  isComplete() {
    return this.generation >= this.maxGenerations;
  }
}
