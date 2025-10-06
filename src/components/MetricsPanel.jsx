export function MetricsPanel({ metrics }) {
  const { generation, currentDistance, bestDistance, totalAttempts, currentFitness, progress } = metrics;

  return (
    <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">Metrics</h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Generation:</span>
          <span className="text-white font-bold text-lg">{generation}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">Current Distance:</span>
          <span className="text-cyan-400 font-bold">{currentDistance}px</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">Best Distance:</span>
          <span className="text-green-400 font-bold text-lg">{bestDistance}px</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">Total Attempts:</span>
          <span className="text-white font-bold">{totalAttempts}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">Current Fitness:</span>
          <span className="text-purple-400 font-bold">{currentFitness}</span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.floor(progress * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-green-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
