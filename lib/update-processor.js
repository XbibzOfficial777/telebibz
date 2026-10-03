'use strict';

/**
 * Execute independent updates concurrently while keeping a session key ordered.
 * A Promise returned by process() resolves only after that update is complete.
 */
class UpdateProcessor {
  constructor(maxConcurrentUpdates = 256) {
    this.maxConcurrentUpdates = maxConcurrentUpdates;
    this.active = 0;
    this.pending = [];
    this.activeKeys = new Set();
  }

  process(key, handler) {
    return new Promise((resolve, reject) => {
      this.pending.push({ key: normalizeKey(key), handler, resolve, reject });
      this._drain();
    });
  }

  _drain() {
    while (this.active < this.maxConcurrentUpdates) {
      // Preserve FIFO ordering for the same session, but skip a busy key so
      // updates from other users can continue through the queue.
      const index = this.pending.findIndex((task) => task.key === undefined || !this.activeKeys.has(task.key));
      if (index === -1) return;

      const [task] = this.pending.splice(index, 1);
      if (task.key !== undefined) this.activeKeys.add(task.key);
      this.active++;

      Promise.resolve()
        .then(task.handler)
        .then(
          (value) => task.resolve(value),
          (error) => task.reject(error),
        )
        .then(() => {
          this.active--;
          if (task.key !== undefined) this.activeKeys.delete(task.key);
          this._drain();
        });
    }
  }
}

function normalizeKey(key) {
  if (key === undefined) return undefined;
  if (key === null) return 'null:null';
  const type = typeof key;
  if (!['string', 'number', 'bigint', 'boolean'].includes(type)) return undefined;
  return `${type}:${String(key)}`;
}

module.exports = { UpdateProcessor };
