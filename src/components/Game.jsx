import { useState, useEffect, useRef } from 'react';
import { GameCanvas } from './GameCanvas';
import { GameCanvas3D } from './GameCanvas3D';
import { MetricsPanel } from './MetricsPanel';
import { ActivityLog } from './ActivityLog';
import { Controls } from './Controls';
import { PhysicsEngine } from '../engine/PhysicsEngine';
import { Character } from '../engine/Character';
import { Obstacle } from '../engine/Obstacle';
import { LegSystem } from '../engine/LegSystem';
import { GeneticAlgorithm } from '../ai/GeneticAlgorithm';
import { FitnessEvaluator } from '../ai/FitnessEvaluator';
import { Logger } from '../utils/Logger';
import { MetricsTracker } from '../utils/MetricsTracker';

export function Game() {
  const [character, setCharacter] = useState(new Character());
  const [obstacles, setObstacles] = useState([]);
  const [legs, setLegs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState({
    generation: 0,
    currentDistance: 0,
    bestDistance: 0,
    totalAttempts: 0,
    currentFitness: 0,
    progress: 0
  });
  const [logs, setLogs] = useState([]);

  // Game engine instances (using refs to persist across renders)
  const physicsRef = useRef(new PhysicsEngine());
  const gaRef = useRef(new GeneticAlgorithm());
  const fitnessRef = useRef(new FitnessEvaluator());
  const loggerRef = useRef(new Logger());
  const metricsTrackerRef = useRef(new MetricsTracker());
  const attemptStartTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const legSystemRef = useRef(null); // Store leg system

  // Initialize game
  useEffect(() => {
    loggerRef.current.gameInit();
    setLogs([...loggerRef.current.getLogs()]);

    const newObstacles = Obstacle.generateObstacles();
    setObstacles(newObstacles);

    gaRef.current.initialize();

    loggerRef.current.gameReady();
    setLogs([...loggerRef.current.getLogs()]);
  }, []);

  // Game loop
  useEffect(() => {
    if (!isRunning) return;

    const gameLoop = () => {
      const physics = physicsRef.current;
      const ga = gaRef.current;
      const fitness = fitnessRef.current;
      const logger = loggerRef.current;
      const tracker = metricsTrackerRef.current;
      const legSystem = legSystemRef.current;

      // Update leg rotation
      if (legSystem) {
        legSystem.update(character);
        setLegs(legSystem.getLegs());
      }

      // Update physics
      const updatedCharacter = physics.update(character, obstacles);
      setCharacter({ ...updatedCharacter });

      // Check termination conditions
      const timeElapsed = tracker.getElapsedTime();
      const fellOff = physics.checkFailure(updatedCharacter);
      const stuck = physics.checkStuck(updatedCharacter, 100, timeElapsed);

      // Update metrics
      tracker.updateDistance(updatedCharacter.getDistance());
      const currentFitness = fitness.calculateFitness(updatedCharacter, fellOff);
      tracker.updateFitness(currentFitness);
      setMetrics({ ...tracker.getMetrics() });

      // Check if attempt should end
      if (fitness.shouldTerminate(updatedCharacter, attemptStartTimeRef.current, fellOff, stuck)) {
        // Record fitness
        const finalFitness = fitness.calculateFitness(updatedCharacter, fellOff);
        ga.recordFitness(finalFitness);

        // Log result
        if (fellOff) {
          logger.fellOff();
        } else if (stuck) {
          logger.stuck();
        }

        if (finalFitness > tracker.bestDistance) {
          logger.newRecord(finalFitness);
        }

        setLogs([...logger.getLogs()]);

        // Move to next genome
        const newGen = ga.nextGenome();
        if (newGen) {
          logger.generationComplete(ga.generation - 1);
          setLogs([...logger.getLogs()]);
        }

        tracker.updateGeneration(ga.generation);

        // Start next attempt
        startNewAttempt();
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    const startNewAttempt = () => {
      const ga = gaRef.current;
      const logger = loggerRef.current;
      const tracker = metricsTrackerRef.current;

      // Reset character
      const newCharacter = new Character();
      setCharacter(newCharacter);

      // Apply current genome
      const currentGenome = ga.getCurrentGenome();
      const legSystem = new LegSystem(currentGenome);
      legSystemRef.current = legSystem; // Store in ref
      setLegs(legSystem.getLegs());

      // Log
      logger.testing(ga.currentIndex + 1, ga.population.length);
      setLogs([...logger.getLogs()]);

      // Track
      tracker.startAttempt();
      attemptStartTimeRef.current = Date.now();
    };

    // Start first attempt
    startNewAttempt();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, obstacles]);

  const handleStart = () => {
    if (!isRunning) {
      loggerRef.current.aiStarted();
      setLogs([...loggerRef.current.getLogs()]);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    if (isRunning) {
      loggerRef.current.paused();
      setLogs([...loggerRef.current.getLogs()]);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);

    // Reset all systems
    const newCharacter = new Character();
    setCharacter(newCharacter);
    setLegs([]);

    const newObstacles = Obstacle.generateObstacles();
    setObstacles(newObstacles);

    gaRef.current.initialize();
    metricsTrackerRef.current.reset();
    loggerRef.current.clear();
    loggerRef.current.reset();

    setLogs([...loggerRef.current.getLogs()]);
    setMetrics({ ...metricsTrackerRef.current.getMetrics() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🧬 Draw Climber AI - Genetic Algorithm Demo
        </h1>

        <div className="mb-8 flex justify-center">
          <Controls
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-center">
              <GameCanvas3D
                character={character}
                obstacles={obstacles}
                legs={legs}
              />
            </div>
          </div>

          <div className="space-y-6">
            <MetricsPanel metrics={metrics} />
            <ActivityLog logs={logs} />
          </div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
          <h3 className="text-lg font-bold text-cyan-400 mb-2">About This Demo</h3>
          <p className="text-gray-300 text-sm">
            Watch as a genetic algorithm learns to design optimal "legs" for climbing obstacles.
            The AI tests different leg configurations, keeps the best performers, and evolves new
            designs through crossover and mutation. Over time, you'll see the character improve
            at navigating the obstacle course!
          </p>
        </div>
      </div>
    </div>
  );
}
