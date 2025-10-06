export class Logger {
  constructor(maxLogs = 50) {
    this.logs = [];
    this.maxLogs = maxLogs;
  }

  log(emoji, message) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp,
      emoji,
      message
    };

    this.logs.unshift(logEntry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    return logEntry;
  }

  clear() {
    this.logs = [];
  }

  getLogs() {
    return this.logs;
  }

  // Convenience methods
  gameInit() {
    return this.log('🎮', 'Initializing game...');
  }

  gameReady() {
    return this.log('✅', 'Game ready!');
  }

  aiStarted() {
    return this.log('🤖', 'AI learning started!');
  }

  testing(current, total) {
    return this.log('🧬', `Testing ${current}/${total}`);
  }

  fellOff() {
    return this.log('💀', 'Fell off');
  }

  stuck() {
    return this.log('🔒', 'Got stuck');
  }

  newRecord(distance) {
    return this.log('🎉', `New record: ${Math.floor(distance)}px!`);
  }

  generationComplete(gen) {
    return this.log('✨', `Gen ${gen} complete`);
  }

  paused() {
    return this.log('⏸', 'AI paused');
  }

  reset() {
    return this.log('🔄', 'Reset complete');
  }
}
