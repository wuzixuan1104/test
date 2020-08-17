const Queue = function (...closures) {
  if (!(this instanceof Queue)) return new Queue(...closures);
  this.closures = [];
  this.isWork = false;
  closures.forEach(this.enqueue.bind(this));
};
Queue.prototype.size = function () { return this.closures.length; };
Queue.prototype.enqueue = function (closure) { return this.closures.push(closure), this.dequeue(this.prev), this; };
Queue.prototype.dequeue = function (prev) {
  if (this.isWork) return this;
  else this.isWork = true;

  return this.closures.length ?
    this.closures[0](prev => {
      this.closures.shift();
      this.isWork = false;
      this.dequeue(this.prev = prev);
    }, prev) :
    // eslint-disable-next-line no-sequences
    (this.isWork = false), this;
};

module.exports = Queue;
