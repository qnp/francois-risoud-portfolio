/*
 * small stack of "actions" (e.g. animations)
 * that can be incremented manually inside a RequestAnimationFrame loop
 * attempt to reinvent the wheel because I don't need a big library, just
 * small features :-)
 */

import uniqueID from '@/assets/js/utils/unique-ID.js';

const m_abs = Math.abs;

export default class ActionStack {
  constructor() {
    this.stack = [];
  }

  add(settings) {
    this.stack.push(new Action(settings));
    return this; // chaining
  }

  has(actionName) {
    var hasIt = false;
    var i = this.stack.length;
    while (i--) {
      if (this.stack[i].name === actionName) hasIt = true;
    }
    return hasIt;
  }

  remove(actionNames) {
    var i = this.stack.length;
    while (i--) {
      const action = this.stack[i];
      actionNames.forEach(name => {
        if (action.name === name) {
          this.stack.splice(i, 1);
        }
      });
    }
    return this; // chaining
  }

  increment() {
    var i = this.stack.length;
    while (i--) {
      const action = this.stack[i];
      if (!action.complete) action.increment();
      else {
        this.stack.splice(i, 1);
      }
    }
    return this; // chaining
  }
}

class Action {
  constructor(settings) {
    this.name = settings.name || uniqueID();
    this.object = settings.object;
    this.ref = settings.ref;
    this.to = settings.to;
    this.easing = settings.easing;
    this.completePercent = settings.completePercent;
    this.done = settings.done;

    if (
      settings.checkCompletion &&
      typeof settings.checkCompletion === 'function'
    ) {
      this.checkCompletion = settings.checkCompletion;
    } else {
      this.checkCompletion = function () {
        var val = 0;
        var to = 0;
        if (this.isArray) {
          for (let i = 0; i < this.to.length; i++) {
            val += m_abs(this.object[this.ref][i] - this.to[i]);
            to += this.to[i];
          }
          val /= this.to.length;
          to /= this.to.length;
        } else {
          val = m_abs(this.object[this.ref] - this.to);
          to = this.to;
        }
        return val <= (1 - this.completePercent) * to;
      };
    }

    this.isArray = this.to instanceof Array;
    this.complete = false;
  }

  increment() {
    if (!this.complete) {
      if (this.isArray) {
        for (let i = 0; i < this.to.length; i++) {
          this.object[this.ref][i] +=
            (this.to[i] - this.object[this.ref][i]) * this.easing;
        }
      } else {
        this.object[this.ref] +=
          (this.to - this.object[this.ref]) * this.easing;
      }
    }

    if (this.checkCompletion()) {
      this.complete = true;
      if (this.done && typeof this.done === 'function') {
        this.done();
      }
    }
  }

  get isComplete() {
    return this.complete;
  }
}
