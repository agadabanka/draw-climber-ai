import { Play, Pause, RotateCcw } from 'lucide-react';

export function Controls({ isRunning, onStart, onPause, onReset }) {
  return (
    <div className="flex gap-4">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          <Play size={20} />
          Start AI
        </button>
      ) : (
        <button
          onClick={onPause}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          <Pause size={20} />
          Pause AI
        </button>
      )}

      <button
        onClick={onReset}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
      >
        <RotateCcw size={20} />
        Reset
      </button>
    </div>
  );
}
