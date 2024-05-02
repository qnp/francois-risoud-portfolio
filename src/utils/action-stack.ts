import uniqueId from '@/utils/unique-id';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InputObject = Record<string, any>;

interface ActionConfig<T extends InputObject = InputObject> {
  /**
   * Name of the action
   */
  name?: string;
  /**
   * Object to be modified
   */
  object: T;
  /**
   * Property name of the object to be modified
   */
  ref: keyof T;
  /**
   * Target value to reach
   */
  to: number | number[];
  /**
   * Easing factor
   */
  easing: number;
  /**
   * Percentage of completion to consider the action done
   */
  completePercent?: number;
  /**
   * Callback to be called when the action is done
   */
  done?: () => void;
  /**
   * Function to check if the action is done
   */
  checkCompletion?: () => boolean;
}

/**
 * Action class representing an incremental change to an object property
 */
class Action<T extends InputObject = InputObject> {
  private actionName: string;
  private object: T;
  private ref: keyof T;
  private to: number | number[];
  private easing: number;
  private completePercent?: number;
  private done?: () => void;
  private checkCompletion: () => boolean;
  private complete: boolean;

  constructor(config: ActionConfig<T>) {
    this.actionName = config.name || uniqueId();
    this.object = config.object;
    this.ref = config.ref;
    this.to = config.to;
    this.easing = config.easing;
    this.completePercent = config.completePercent;
    this.done = config.done;

    this.complete = false;

    if (
      config.checkCompletion &&
      typeof config.checkCompletion === 'function'
    ) {
      this.checkCompletion = config.checkCompletion;
    } else {
      this.checkCompletion = function () {
        let val = 0;
        let to = 0;
        if (Array.isArray(this.to)) {
          for (let i = 0; i < this.to.length; i++) {
            val += Math.abs(
              (this.object[this.ref] as number[])[i] - this.to[i]
            );
            to += this.to[i];
          }
          val /= this.to.length;
          to /= this.to.length;
        } else {
          val = Math.abs((this.object[this.ref] as number) - this.to);
          to = this.to;
        }
        return val <= (1 - (this.completePercent ?? 0)) * to;
      };
    }
  }

  increment(): void {
    if (!this.complete) {
      if (Array.isArray(this.to)) {
        for (let i = 0; i < this.to.length; i++) {
          (this.object[this.ref] as number[])[i] +=
            (this.to[i] - (this.object[this.ref] as number[])[i]) * this.easing;
        }
      } else {
        (this.object[this.ref] as number) +=
          (this.to - (this.object[this.ref] as number)) * this.easing;
      }
    }

    if (this.checkCompletion()) {
      this.complete = true;
      if (this.done && typeof this.done === 'function') {
        this.done();
      }
    }
  }

  get isComplete(): boolean {
    return this.complete;
  }

  get name(): string {
    return this.actionName;
  }
}

/**
 * Stack of "actions" (_e.g._ used for animations) that can be triggered
 * incrementally manually such as inside a RequestAnimationFrame loop.
 */
export default class ActionStack {
  private stack: Action<InputObject>[];

  constructor() {
    this.stack = [];
  }

  add(action: ActionConfig<InputObject>): ActionStack {
    this.stack.push(new Action(action));
    return this;
  }

  has(name: string): boolean {
    let hasIt = false;
    let i = this.stack.length;
    while (i--) {
      if (this.stack[i].name === name) {
        hasIt = true;
        break;
      }
    }
    return hasIt;
  }

  remove(names: string[]): ActionStack {
    let i = this.stack.length;
    while (i--) {
      const action = this.stack[i];
      names.forEach(name => {
        if (action.name === name) {
          this.stack.splice(i, 1);
        }
      });
    }
    return this;
  }

  increment(): ActionStack {
    let i = this.stack.length;
    while (i--) {
      const action = this.stack[i];
      if (!action.isComplete) {
        action.increment();
      } else {
        this.stack.splice(i, 1);
      }
    }
    return this;
  }
}
