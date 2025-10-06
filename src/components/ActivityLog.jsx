export function ActivityLog({ logs }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">Activity Log</h2>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {logs.length === 0 && (
          <div className="text-gray-500 text-sm italic">No activity yet...</div>
        )}

        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-2 text-sm bg-gray-900 p-2 rounded"
          >
            <span className="text-lg">{log.emoji}</span>
            <div className="flex-1">
              <span className="text-gray-400 text-xs">{log.timestamp}</span>
              <span className="text-white ml-2">{log.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
