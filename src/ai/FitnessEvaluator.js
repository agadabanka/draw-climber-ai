export class FitnessEvaluator {
  calculateFitness(character, fellOff) {
    const distance = character.getDistance();

    // Penalize if fell off
    const fitness = fellOff ? distance * 0.7 : distance;

    return Math.max(0, fitness);
  }

  shouldTerminate(character, startTime, fellOff, stuck) {
    const timeElapsed = Date.now() - startTime;
    const timeout = timeElapsed > 6000;

    return fellOff || stuck || timeout;
  }
}
