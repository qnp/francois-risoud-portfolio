import Matter from 'matter-js';
import MatterAttractors from 'matter-attractors';

import ActionStack from '@/utils/action-stack';
import hexToRgbArray from '@/utils/hex-to-rgb-array';
import randomArrayElement from '@/utils/random-array-element';
import uniqueId from '@/utils/unique-id';

import type { RgbColorArray } from '@/utils/hex-to-rgb-array';

/**
 * Normalize a color to an RGB array
 * @param color - The color to normalize
 */
function normalizeColor(color: string | RgbColorArray): RgbColorArray {
  if (typeof color === 'string') return hexToRgbArray(color);
  else if (Array.isArray(color)) return color;
  else throw new Error('normalizeColor needs a hex color or an rgb array');
}

/**
 * Class representing a particle view
 */
class ParticleView {
  private w: number;
  private h: number;
  private domElem: HTMLElement;
  private hidingTimeout: NodeJS.Timeout | null;
  private hidingDuration: number;

  public view: HTMLDivElement;
  public id: string;
  public hiding: boolean;

  /**
   * Construct a ParticleView instance
   * @param domElem - The DOM element on which to build the view.
   * @param hidingDuration - The hiding animation duration in milliseconds.
   */
  constructor(domElem: HTMLElement, hidingDuration: number) {
    this.w = 150;
    this.h = 150;

    this.id = uniqueId();

    this.domElem = domElem;
    this.view = document.createElement('div');

    this.hiding = false;
    this.hidingTimeout = null;

    this.hidingDuration = hidingDuration;
    this.hidingTimeout = null;
  }

  show(): void {
    this.domElem.appendChild(this.view);
    setTimeout(() => {
      this.view.classList.add('show');
    }, 0);
    if (this.hiding) {
      if (this.hidingTimeout) clearTimeout(this.hidingTimeout);
      this.hiding = false;
    }
  }

  hide(callback: () => void): void {
    this.hiding = true;
    this.view.classList.remove('show');
    if (this.hidingTimeout) clearTimeout(this.hidingTimeout);
    this.hidingTimeout = setTimeout(() => {
      this.hiding = false;
      this.domElem.removeChild(this.view);
      callback();
    }, this.hidingDuration);
  }

  setPosition(pos: Position): void {
    this.view.setAttribute(
      'style',
      `transform: translate(${pos.x - this.w / 2}px,${pos.y - this.h / 2}px);`
    );

    const updateOriginEvent = new CustomEvent('update-origin', {
      detail: {
        id: this.id,
        newPos: {
          x: pos.x,
          y: pos.y,
        },
      },
    });

    window.dispatchEvent(updateOriginEvent);
  }
}

/**
 * Class representing an isolated particle, for which a label is displayed
 */
class IsolatedParticleView extends ParticleView {
  public label?: string;
  public duplicate?: boolean;

  /**
   * Construct an IsolatedParticleView instance
   * @param domElem - The DOM element on which the view is built
   * @param label - Label to display on the isolated particle
   * @param duplicate - Whether the particle is a duplicate
   */
  constructor(domElem: HTMLElement, label?: string, duplicate?: boolean) {
    super(domElem, 710);

    this.label = label;
    this.duplicate = duplicate;
    this.view.classList.add('isolated-particle-view');

    const line = document.createElement('div');
    line.classList.add('line');
    this.view.appendChild(line);

    const text = document.createElement('div');
    if (label) text.textContent = label;
    text.classList.add('text');
    this.view.appendChild(text);
  }
}

let hasTouch = false;

/**
 * Class representing a project as a particle, that can be displayed on hover / touch
 */
class ProjectParticleView extends ParticleView {
  private project: Project;
  private centerPosition: Position;
  private circle: HTMLAnchorElement;
  private open: boolean;
  /**
   * Construct a ProjectParticleView instance
   * @param domElem - The DOM element on which the view is built
   * @param project - The name of the project to display
   * @param centerPosition - The center position of the particle
   */
  constructor(
    domElem: HTMLElement,
    project: Project,
    centerPosition: Position
  ) {
    super(domElem, 310);

    this.view.classList.add('project-particle-view');
    this.project = project;
    this.centerPosition = centerPosition;

    this.open = false;

    this.circle = document.createElement('a');
    this.circle.setAttribute('href', this.project.url);
    this.circle.setAttribute('target', '_blank');
    this.circle.classList.add('circle');
    this.view.appendChild(this.circle);

    this.circle.addEventListener('mouseenter', event => {
      this.mouseenterHandler(event);
    });
    this.circle.addEventListener('mouseleave', this.mouseleaveHandler);

    this.circle.addEventListener('click', event => {
      if (hasTouch) event.preventDefault();
    });

    this.circle.addEventListener(
      'touchstart',
      event => {
        if (!self.open) {
          setTimeout(() => {
            const handleOut = (): void => {
              this.mouseleaveHandler();
              this.circle.classList.remove('hover');
              domElem.removeEventListener('touchstart', handleOut);
            };
            domElem.addEventListener('touchstart', handleOut);
          }, 50);
          this.mouseenterHandler(event);
          this.circle.classList.add('hover');
        }
      },
      { passive: true }
    );
  }

  mouseenterHandler(event: MouseEvent | TouchEvent): void {
    this.open = true;
    const showProjectEvent = new CustomEvent('show-project', {
      detail: {
        id: this.id,
        project: this.project,
        centerPosition: this.centerPosition,
        origin: {
          x:
            (event as MouseEvent).clientX ??
            (event as TouchEvent).touches[0].clientX,
          y:
            (event as MouseEvent).clientY ??
            (event as TouchEvent).touches[0].clientY,
        },
      },
    });
    window.dispatchEvent(showProjectEvent);
  }

  mouseleaveHandler(): void {
    this.open = false;
    window.dispatchEvent(new CustomEvent('hide-project'));
  }

  off(): void {
    this.circle.removeEventListener('mouseenter', event => {
      this.mouseenterHandler(event);
    });
    this.circle.removeEventListener('mouseleave', this.mouseleaveHandler);
    window.dispatchEvent(new CustomEvent('hide-project'));
  }
}

declare global {
  interface WindowEventMap {
    'show-project': CustomEvent<{
      id: string;
      project: Project;
      centerPosition: Position;
      origin: Position;
    }>;
    'hide-project': CustomEvent<void>;
    'update-origin': CustomEvent<{
      id: string;
      newPos: Position;
    }>;
    [key: `bloated-${string}`]: CustomEvent<void>;
  }
}

export interface BubbleSettings {
  name: string;
  numParticles?: number;
  mouseRadius?: number;
  mouseEasingFactor?: number;
  startRadius: number;
  repelExponent: number;
  particleRadius: number;
  particleAuraRadius: number;
  effectiveCheckRadius: number;
  maxNeighbours: number;
  particleMass?: number;
  bgColor: string | RgbColorArray;
  blobColor: string | RgbColorArray;
  soothingFactor: number;
  attractiveness: number;
  equilibriumDistance: number;
  viscosity?: number;
  longRangeTail: number;
  threshold: number;
  isolatedLabels: string[];
  showGui: boolean;
  centerAttractExponent: number;
  centerAttractFactor: number;
  longRangeCenterAttract: number;
  center: { xRatio: number; yRatio: number };
  hasBoundaries: boolean;
  boundaries?: {
    right: { wRatio: number; offset: number };
    bottom: { hRatio: number; offset: number };
  };
  timeScale: number;
  maxBreath: number;
  minBreath: number;
  random?: () => void;
  playPhysics: boolean;
  randomRadiusFactor: number;
  auraTypeMix: number;
  startPosMode: 'circle' | 'far';
  showIsolated?: boolean;
  projects: Project[];
}

export interface Bubble {
  showGui: () => void;
  hideGui: () => void;
  setHasTouch: () => void;
  init: () => void;
  setupPhysics: () => void;
  setParticleRadius: (radius: number) => void;
  updatePhysics: () => void;
  resizeWorld: (oldWidth: number, oldHeight: number) => void;
  setupWebGlMetaballs: () => void;
  removeParticles: (numParticles: number, adjustThreshold?: boolean) => void;
  kill: () => void;
  transferToGPU: () => void;
  checkIsolatedParticles: () => void;
  showIsolatedParticles: () => void;
  showProjectsParticles: () => void;
  projectsModeOn: () => void;
  removeViewHelper: (particle: Particle, callback?: () => void) => void;
  removeAllIsolatedHelper: () => void;
  changeColor: (ref: string, color: string | RgbColorArray) => void;
  breath: (value: number) => void;
  stop: (callback?: () => void) => void;
  start: (options?: { appear?: boolean }) => void;
  close: (callback?: () => void) => void;
  open: (callback?: () => void) => void;
  hexagonCenterPosition: (index: number) => Position;
  updateHexagonCenterPositions: () => void;
  projectsModeOff: () => void;
}

export interface AdditionalBodyDefinition {
  additionalRadiusFactor?: number;
  preventOtherAttractions?: boolean;
  isMouse?: boolean;
  isCenter?: boolean;
  isProject?: boolean;
  view?: IsolatedParticleView | null;
  preventNewView?: boolean;
  project?: Project | null;
  projectView?: ProjectParticleView | null;
  itsAttachedCenter?: Particle | null;
  itsConstraint?: Matter.Constraint | null;
}

declare module 'matter-js' {
  export interface IBodyDefinition extends AdditionalBodyDefinition {}
}

export interface Particle extends Matter.Body, AdditionalBodyDefinition {}

/**
 * Factory function to instantiate a {@link Bubble}
 * @param settings - The settings for the PhysicalBubble
 * @param domElem - The DOM element on which to build the view
 */
export function createBubble(
  settings: BubbleSettings,
  domElem: HTMLElement
): Bubble {
  return (function (window, Math) {
    let started = false;

    // Math aliases
    const mRandom = Math.random;
    const mFloor = Math.floor;
    const mSqrt = Math.sqrt;
    const mMin = Math.min;
    const mMax = Math.max;
    const mCos = Math.cos;
    const mSin = Math.sin;
    const mAbs = Math.abs;
    const PI = Math.PI;

    // Fit to window
    let domElemRect = domElem.getBoundingClientRect();
    let WIDTH = domElemRect.width;
    let HEIGHT = domElemRect.height;

    /*************
     * renderers *
     *************/

    const renderFactor = 1;
    const renderGpu = true;
    let canvas: HTMLCanvasElement | null;
    let gl: WebGLRenderingContext | null;
    let glW: number;
    let glH: number;

    function setCanvasSize(): void {
      if (!canvas) return;

      glW = WIDTH * renderFactor;
      glH = HEIGHT * renderFactor;

      canvas.setAttribute('width', String(glW));
      canvas.setAttribute('height', String(glH));
      canvas.setAttribute('style', `width: ${WIDTH}px; height: ${HEIGHT}px`);
    }

    function createRenderer(): void {
      // webgl canvas renderer
      canvas = document.createElement('canvas');
      setCanvasSize();
      domElem.appendChild(canvas);
      gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    }

    function removeRenderer(): void {
      if (canvas) domElem.removeChild(canvas);
      canvas = null;
      gl = null;
    }

    // Uniform handlers
    let metaballsHandle: WebGLUniformLocation | null;
    let soothingFactorHandle: WebGLUniformLocation | null;
    let particleAuraRadiusHandle: WebGLUniformLocation | null;
    let auraTypeMixHandle: WebGLUniformLocation | null;
    let thresholdHandle: WebGLUniformLocation | null;
    let randomRadiusFactorHandle: WebGLUniformLocation | null;
    let blobColorHandle: WebGLUniformLocation | null;
    let bgColorHandle: WebGLUniformLocation | null;

    /************
     * settings *
     ************/

    settings.particleAuraRadius *= renderFactor;

    let numParticles = settings.numParticles ?? 8;
    const mouseRadius = settings.mouseRadius ?? 10;
    const mouseEasingFactor = settings.mouseEasingFactor ?? 0.5;
    const initialParticleAuraRadius = settings.particleAuraRadius;
    const effectiveCheckRadius = settings.effectiveCheckRadius;
    const effectiveCheckRadiusPow2 = effectiveCheckRadius ** 2;
    const maxNeighbours = settings.maxNeighbours;
    const particleMass = settings.particleMass ?? 50;
    const viscosity = settings.viscosity ?? 0;

    const bloatedEvent = new CustomEvent('bloated-' + settings.name);

    // Show labels
    let leftLabels = settings.isolatedLabels.slice(0);
    let preventCheckIsolated = false;

    // Project mode
    const savedCenterAttractExponent = settings.centerAttractExponent;
    const savedLongRangeCenterAttract = settings.longRangeCenterAttract;
    const projectsParticleRadius = 20;
    let projectParticles: Particle[] = [];
    let mouseRepelFactor = 1;
    let mouseTouchFactor = 1;
    let projectsOn = false;

    // Curriculum
    const initialSoothingFactor = settings.soothingFactor;

    const maxBreath = settings.maxBreath;
    const minBreath = settings.minBreath;

    // Set body background color to prevent white flashes on window resize
    function setBodyBg(color: string | RgbColorArray): void {
      const formattedBgStr =
        typeof color === 'string'
          ? color
          : 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
      document.body.style.setProperty('background-color', formattedBgStr);
    }

    // Normalize initial colors
    settings.bgColor = normalizeColor(settings.bgColor);
    settings.blobColor = normalizeColor(settings.blobColor);

    /*******
     * gui *
     *******/

    let gui: dat.GUI;

    /******************
     * actions stack *
     ******************/

    const actionStack = new ActionStack();

    /***********
     * physics *
     ***********/

    Matter.use(MatterAttractors);

    // Module aliases
    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Body = Matter.Body;
    const Events = Matter.Events;
    const Constraint = Matter.Constraint;

    // Engine and world instances
    let engine: Matter.Engine;
    let world: Matter.World;

    // particles stack
    const particles: Particle[] = [];
    let isolatedParticles: Particle[] = [];
    let centerBody: Particle;

    // boundaries
    const boundaries: Matter.Body[] = [];
    const boundaryThickness = 500;
    let checkBoundaries = true;

    const bubble: Bubble = {
      showGui() {
        /*******************
         * lazy loaded gui *
         *******************/

        import('dat.gui')
          .then(function (dat) {
            settings.random = function () {
              settings.repelExponent = 2 + mFloor(mRandom() * 23);
              settings.centerAttractExponent = 2 + mFloor(mRandom() * 23);
              settings.centerAttractFactor = mRandom();
              settings.longRangeCenterAttract = mRandom() * 20;
              settings.equilibriumDistance = 10 + mRandom() * 35;
              settings.attractiveness = mRandom() * 50;
              settings.longRangeTail = mRandom() * 20;

              settings.soothingFactor = mRandom();
              settings.particleAuraRadius = mRandom() * 80;
              settings.randomRadiusFactor = mRandom();
              settings.auraTypeMix = mRandom();
              settings.threshold = (mRandom() * 5) / numParticles;
              settings.blobColor = [
                mRandom() * 255,
                mRandom() * 255,
                mRandom() * 255,
              ];
              settings.bgColor = [
                mRandom() * 255,
                mRandom() * 255,
                mRandom() * 255,
              ];
            };

            gui = new dat.default.GUI({ autoPlace: settings.showGui });
            gui.add(settings, 'playPhysics');
            gui.add(settings, 'random');

            const physicsGui = gui.addFolder('Physics');
            physicsGui
              .add(settings, 'repelExponent')
              .min(2)
              .step(2)
              .max(24)
              .listen();
            physicsGui
              .add(settings, 'centerAttractExponent')
              .min(2)
              .step(2)
              .max(24)
              .listen();
            physicsGui.add(settings, 'centerAttractFactor', 0, 1).listen();
            physicsGui.add(settings, 'longRangeCenterAttract', 0, 20).listen();
            physicsGui.add(settings, 'equilibriumDistance', 10, 45).listen();
            physicsGui.add(settings, 'attractiveness', 0, 50).listen();
            // const particleRadiusController = physicsGui.add(settings, 'particleRadius', 0.001, 100);
            physicsGui.add(settings, 'longRangeTail', 0, 20).listen();
            // physicsGui.add(settings, 'timeScale', 0, 1.5);
            physicsGui.open();

            const renderGui = gui.addFolder('Render');
            renderGui.add(settings, 'soothingFactor', 0, 1).listen();
            renderGui.add(settings, 'particleAuraRadius', 0, 80).listen();
            renderGui.add(settings, 'randomRadiusFactor', 0, 1).listen();
            renderGui.add(settings, 'auraTypeMix', 0, 1).listen();
            renderGui.add(settings, 'threshold', 0, 5 / numParticles).listen();
            renderGui.addColor(settings, 'blobColor').listen();
            const bgColorController = renderGui
              .addColor(settings, 'bgColor')
              .listen();
            bgColorController.onChange(setBodyBg);
            renderGui.open();

            document.body.appendChild(gui.domElement);
            gui.domElement.classList.add('ac');
            const closeBtnElem = gui.domElement.querySelector(
              '.close-button'
            ) as HTMLElement | null;

            setTimeout(function () {
              closeBtnElem?.style.setProperty('width', '340px');
              gui.domElement.style.setProperty('width', '340px');
            }, 1000);

            closeBtnElem?.addEventListener('click', () => {
              closeBtnElem?.style.setProperty('width', '340px');
            });

            window.addEventListener('resize', () => {
              closeBtnElem?.style.setProperty('width', '340px');
            });
          })
          .catch(function (err) {
            throw err;
          });
      },

      hideGui() {
        document.body.removeChild(gui.domElement);
      },

      setHasTouch() {
        hasTouch = true;
        mouseTouchFactor = 1;
      },

      init() {
        // Create an engine
        engine = Engine.create();
        world = engine.world;

        createRenderer();
        bubble.setupPhysics();
        bubble.setupWebGlMetaballs();
      },

      setupPhysics() {
        // Zero gravity world
        world.gravity.x = 0;
        world.gravity.y = 0;

        engine.timing.timeScale = settings.timeScale;

        let i = numParticles;
        while (i--) {
          let ax;
          let ay;

          const startRadius = settings.startRadius + mRandom() * 10;
          if (settings.startPosMode === 'circle') {
            ax =
              settings.center.xRatio * WIDTH +
              startRadius * mCos((i / numParticles) * 2 * PI);
            ay =
              settings.center.yRatio * HEIGHT +
              startRadius * mSin((i / numParticles) * 2 * PI);
          } else {
            ax =
              settings.center.xRatio * WIDTH +
              startRadius * mCos(((-1 - i / numParticles) * PI) / 2);
            ay =
              settings.center.yRatio * HEIGHT +
              startRadius * mSin(((-1 - i / numParticles) * PI) / 2);
          }

          const additionalRadiusFactor = 0.5 + mRandom() * 2.5;

          const particle: Particle = Bodies.circle(
            ax,
            ay,
            settings.particleRadius,
            {
              mass: particleMass,
              restitution: 0,
              frictionAir: viscosity,
              additionalRadiusFactor,
              plugin: {
                attractors: [
                  // Van der Waals + Pauli
                  function (bodyA: Particle, bodyB: Particle) {
                    const vecBToA = Matter.Vector.sub(
                      bodyB.position,
                      bodyA.position
                    );
                    const vecNormal = Matter.Vector.normalise(vecBToA);
                    const bToA = mMax(Matter.Vector.magnitude(vecBToA), 1);
                    const bToAPow6 = bToA ** 6;
                    const attractiveness = settings.attractiveness * 10 ** 7;
                    const equilibriumDistance = settings.equilibriumDistance;
                    const equilibriumDistancePow6 = equilibriumDistance ** 6;
                    const longRangeTail = settings.longRangeTail * 10 ** -9;
                    const repelExponent = settings.repelExponent;
                    const centerAttractExponent =
                      settings.centerAttractExponent;
                    const longRangeCenterAttract =
                      settings.longRangeCenterAttract * 10 ** -7;
                    const max =
                      1 *
                      ((5 * attractiveness) / (6 * equilibriumDistancePow6));

                    let magnitude =
                      ((6 * attractiveness) / (bToA * bToAPow6)) *
                        (equilibriumDistancePow6 / bToAPow6 - 1) -
                      longRangeTail * (bToA - equilibriumDistance) ** 2;
                    if (bodyA.preventOtherAttractions) magnitude = 0;

                    let force = Matter.Vector.mult(
                      vecNormal,
                      mMin(magnitude, max)
                    );

                    if (bodyB.isMouse) {
                      magnitude =
                        attractiveness *
                        (equilibriumDistance / bToA) ** repelExponent;

                      if (bodyA.preventOtherAttractions) magnitude = 0;

                      force = Matter.Vector.mult(
                        vecNormal,
                        mouseTouchFactor *
                          mouseRepelFactor *
                          mMin(magnitude, max)
                      );
                    } else if (bodyB.isCenter) {
                      magnitude =
                        settings.centerAttractFactor *
                          attractiveness *
                          (equilibriumDistance / bToA) **
                            centerAttractExponent +
                        longRangeCenterAttract *
                          (bToA - equilibriumDistance) ** 2;

                      if (bodyA.preventOtherAttractions) magnitude = 0;

                      force = Matter.Vector.mult(
                        vecNormal,
                        -mMin(magnitude, max)
                      );
                    }

                    Matter.Body.applyForce(
                      bodyA,
                      bodyA.position,
                      Matter.Vector.neg(force)
                    );
                    Matter.Body.applyForce(bodyB, bodyB.position, force);
                  },
                ],
              },
            }
          );

          // Store it
          particles.push(particle);

          // Add particle to the physical world
          World.add(world, particle);
        }

        // Attractive fixed particle in the center
        const centerRadius = 10;
        centerBody = Bodies.circle(
          settings.center.xRatio * WIDTH,
          settings.center.yRatio * HEIGHT,
          centerRadius,
          { isStatic: true, isCenter: true }
        );

        // Add the center to the world
        World.add(world, centerBody);

        // Create a body for the mouse
        const mouseBody = Bodies.circle(0, 0, mouseRadius, {
          isStatic: true,
          isMouse: true,
        });

        // add the mouse body to the world
        World.add(world, mouseBody);

        // add mouse control
        Events.on(engine, 'afterUpdate', function () {
          if (!mouse.position.x) return;
          Body.translate(mouseBody, {
            x: (mouse.position.x - mouseBody.position.x) * mouseEasingFactor,
            y: (mouse.position.y - mouseBody.position.y) * mouseEasingFactor,
          });
        });

        const boundsOpt = { isStatic: true, angle: 0 };

        if (settings.hasBoundaries && settings.boundaries) {
          const k = 100;

          boundaries.push(
            Bodies.rectangle(
              settings.boundaries.right.wRatio * WIDTH +
                settings.boundaries.right.offset,
              0,
              boundaryThickness,
              2 * HEIGHT,
              boundsOpt
            )
          );
          boundaries.push(
            Bodies.rectangle(
              0,
              settings.boundaries.bottom.hRatio * HEIGHT +
                settings.boundaries.bottom.offset,
              2 * WIDTH,
              boundaryThickness,
              boundsOpt
            )
          );
          boundaries.push(
            Bodies.rectangle(
              settings.boundaries.right.wRatio * WIDTH +
                settings.boundaries.right.offset -
                k,
              settings.boundaries.bottom.hRatio * HEIGHT +
                settings.boundaries.bottom.offset -
                k,
              4 * k,
              boundaryThickness,
              boundsOpt
            )
          );

          World.add(world, boundaries);
        }
      },

      setParticleRadius(radiusValue) {
        let i = numParticles;
        while (i--) {
          const particleI = particles[i];
          if (!particleI.circleRadius) continue;
          Body.scale(
            particleI,
            radiusValue / particleI.circleRadius,
            radiusValue / particleI.circleRadius
          );
        }
      },

      updatePhysics() {
        Engine.update(engine);

        if (settings.hasBoundaries && settings.boundaries && checkBoundaries) {
          let i = numParticles;
          while (i--) {
            const particleI = particles[i];
            if (
              particleI.position.x >=
                settings.boundaries.right.wRatio * WIDTH +
                  settings.boundaries.right.offset +
                  boundaryThickness ||
              particleI.position.y >=
                settings.boundaries.bottom.hRatio * HEIGHT +
                  settings.boundaries.bottom.offset +
                  boundaryThickness
            ) {
              Body.translate(particleI, {
                x: -boundaryThickness - settings.boundaries.right.offset / 2,
                y: -boundaryThickness - settings.boundaries.bottom.offset / 2,
              });
            }
          }
        }
      },

      resizeWorld(oldW, oldH) {
        Body.translate(centerBody, {
          x: centerBody.position.x * (WIDTH / oldW - 1),
          y: centerBody.position.y * (HEIGHT / oldH - 1),
        });
        particles.forEach(function (particle) {
          Body.translate(particle, {
            x: particle.position.x * (WIDTH / oldW - 1),
            y: particle.position.y * (HEIGHT / oldH - 1),
          });
        });
        if (settings.hasBoundaries) {
          boundaries.forEach(function (boundary) {
            Body.translate(boundary, {
              x: boundary.position.x * (WIDTH / oldW - 1),
              y: boundary.position.y * (HEIGHT / oldH - 1),
            });
          });
        }
      },

      setupWebGlMetaballs() {
        if (!gl) return;
        /***********
         * Shaders *
         ***********/

        // Utility that fails loudly on shader compilation failure
        function compileShader(
          shaderSource: string,
          shaderType: GLenum
        ): WebGLShader {
          if (!gl) throw new Error('No WebGL context.');

          const shader = gl.createShader(shaderType);
          if (!shader) throw new Error('Failed to create WebGL shader.');

          gl.shaderSource(shader, shaderSource);
          gl.compileShader(shader);

          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(`${gl.getShaderInfoLog(shader)}`);
          }

          return shader;
        }

        const vertexShader = compileShader(
          `
          attribute vec2 position;
          void main() {
              // position specifies only x and y. We set z to be 0.0, and w to be 1.0
              gl_Position = vec4(position, 0.0, 1.0);
          }
        `,
          gl.VERTEX_SHADER
        );

        let fragmentShader: WebGLShader;
        try {
          fragmentShader = compileShader(
            `
            precision highp float;
            uniform vec3 metaballs[${numParticles}];
            uniform float sooth;
            uniform float radius;
            uniform float mix;
            uniform float threshold;
            uniform float rdmfactor;
            uniform vec3 color;
            uniform vec3 bgcolor;

            void main(){

                float x = gl_FragCoord.x;
                float y = gl_FragCoord.y;
                float v = 0.0;
                float f;

                for (int i = 0; i < ${numParticles}; i++) {
                  vec3 mb = metaballs[i];
                  float dx = mb.x - x;
                  float dy = mb.y - y;
                  float r = sqrt(dx*dx + dy*dy);
                  float h = radius * (rdmfactor*(mb.z-1.0)+1.0);
                  v += (1.0-mix) * 0.03*h/r + mix * h*h/(dx*dx + dy*dy)*exp(-(r-h)*(r-h)/(h*h));
                }

                v /= ${numParticles}.0;

                if (v >= threshold) f = 1.0;
                else if (v < threshold && v >= (1.0-sooth)*threshold) f = (v-(1.0-sooth)*threshold)/(sooth*threshold);
                else f = 0.0;

                gl_FragColor = vec4((1.0-f)*bgcolor[0]+f*color[0], (1.0-f)*bgcolor[1]+f*color[1], (1.0-f)*bgcolor[2]+f*color[2], 1.0);
            }
          `,
            gl.FRAGMENT_SHADER
          );
        } catch (err) {
          if ((err as Error).message.indexOf('too many uniforms') !== -1) {
            bubble.removeParticles(10);
          }
          return;
        }

        const program = gl.createProgram();
        if (!program) throw new Error('Failed to create WebGL program.');
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        /******************
         * Geometry setup *
         ******************/

        // Set up 4 vertices, which we'll draw as a rectangle
        // via 2 triangles
        //
        //   A---C
        //   |  /|
        //   | / |
        //   |/  |
        //   B---D
        //
        // We order them like so, so that when we draw with
        // gl.TRIANGLE_STRIP, we draw triangle ABC and BCD.
        /* eslint-disable indent, no-multi-spaces */
        const vertexData = new Float32Array([
          -1.0,
          1.0, // top left (A)
          -1.0,
          -1.0, // bottom left (B)
          1.0,
          1.0, // top right (C)
          1.0,
          -1.0, // bottom right (D)
        ]);
        /* eslint-enable indent, no-multi-spaces */
        const vertexDataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

        /*******************
         * Attribute setup *
         *******************/

        // Utility to complain loudly if we fail to find the attribute
        function getAttribLocation(
          program: WebGLProgram,
          name: string
        ): number {
          const attributeLocation = gl?.getAttribLocation(program, name);
          if (attributeLocation === undefined || attributeLocation === -1) {
            throw new Error(`Can not find attribute ${name}.`);
          }
          return attributeLocation;
        }

        // To make the geometry information available in the shader as attributes, we
        // need to tell WebGL what the layout of our data in the vertex buffer is.
        const positionHandle = getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionHandle);
        gl.vertexAttribPointer(
          positionHandle,
          2, // position is a vec2
          gl.FLOAT, // each component is a float
          false, // don't normalize values
          2 * 4, // two 4 byte float components per vertex
          0 // offset into each span of vertex data
        );

        /*****************
         * Uniform setup *
         *****************/

        // Utility to complain loudly if we fail to find the uniform
        function getUniformLocation(
          program: WebGLProgram,
          name: string
        ): WebGLUniformLocation {
          const uniformLocation = gl?.getUniformLocation(program, name);
          if (!uniformLocation || uniformLocation === -1) {
            throw new Error(`Can not find uniform ${name}.`);
          }
          return uniformLocation;
        }

        metaballsHandle = getUniformLocation(program, 'metaballs');
        soothingFactorHandle = getUniformLocation(program, 'sooth');
        particleAuraRadiusHandle = getUniformLocation(program, 'radius');
        auraTypeMixHandle = getUniformLocation(program, 'mix');
        thresholdHandle = getUniformLocation(program, 'threshold');
        randomRadiusFactorHandle = getUniformLocation(program, 'rdmfactor');
        blobColorHandle = getUniformLocation(program, 'color');
        bgColorHandle = getUniformLocation(program, 'bgcolor');
      },

      transferToGPU() {
        // To send the data to the GPU, we first need to flatten our data into a single array.
        const dataToSendToGPU = new Float32Array(3 * numParticles);
        for (let i = 0; i < numParticles; i++) {
          const baseIndex = 3 * i;
          const particle = particles[i];
          dataToSendToGPU[baseIndex + 0] = renderFactor * particle.position.x;
          dataToSendToGPU[baseIndex + 1] =
            renderFactor * (HEIGHT - particle.position.y);
          if (particle.additionalRadiusFactor) {
            dataToSendToGPU[baseIndex + 2] = particle.additionalRadiusFactor;
          }
        }

        const colorData = new Float32Array(3);
        const bgcolorData = new Float32Array(3);
        for (let i = 0; i < 3; i++) {
          colorData[i] = normalizeColor(settings.blobColor)[i] / 255;
          bgcolorData[i] = normalizeColor(settings.bgColor)[i] / 255;
        }

        gl?.uniform3fv(metaballsHandle, dataToSendToGPU);
        gl?.uniform1f(soothingFactorHandle, settings.soothingFactor);
        gl?.uniform1f(particleAuraRadiusHandle, settings.particleAuraRadius);
        gl?.uniform1f(auraTypeMixHandle, settings.auraTypeMix);
        gl?.uniform1f(thresholdHandle, settings.threshold);
        gl?.uniform1f(randomRadiusFactorHandle, settings.randomRadiusFactor);
        gl?.uniform3fv(blobColorHandle, colorData);
        gl?.uniform3fv(bgColorHandle, bgcolorData);

        gl?.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      },

      removeViewHelper(particle, callback) {
        if (particle.view) {
          particle.view.hide(function () {
            if (!particle.view?.duplicate && particle.view?.label) {
              leftLabels.push(particle.view.label);
            }
            particle.view = null;
            callback?.();
          });
        }
      },

      checkIsolatedParticles() {
        // Only 'settings.maxNeighbours' neighbour is an isolated particle
        isolatedParticles = [];

        let i = numParticles;
        while (i--) {
          const particleI = particles[i];
          const xI = particleI.position.x;
          const yI = particleI.position.y;

          // Particle must be in viewport (taking into account its mean viewRadius), otherwise no need to check it
          if (
            xI < WIDTH + 4 * effectiveCheckRadius &&
            yI < HEIGHT + 2 * effectiveCheckRadius
          ) {
            let neighbours = 0;

            let j = numParticles;
            while (j--) {
              if (j !== i) {
                const particleJ = particles[j];
                const d2Ij =
                  (xI - particleJ.position.x) ** 2 +
                  (yI - particleJ.position.y) ** 2;
                if (d2Ij < 4 * effectiveCheckRadiusPow2) {
                  neighbours += 1;
                }
              }
            }

            if (
              neighbours <= maxNeighbours ||
              (particleI.view && particleI.view.hiding)
            ) {
              isolatedParticles.push(particleI);
            } else {
              bubble.removeViewHelper(particleI);
            }
          } else {
            bubble.removeViewHelper(particleI);
          }
        }

        return isolatedParticles;
      },

      showIsolatedParticles() {
        let i = isolatedParticles.length;
        while (i--) {
          const isolatedParticle = isolatedParticles[i];

          if (!isolatedParticle.view) {
            if (!isolatedParticle.preventNewView) {
              const rdm = randomArrayElement(leftLabels, true);
              let label = rdm.element;
              let duplicate = false;
              leftLabels = rdm.left;
              if (!label) {
                const newRdm = randomArrayElement(settings.isolatedLabels);
                label = newRdm.element;
                duplicate = true;
              }

              const view = new IsolatedParticleView(domElem, label, duplicate);
              view.show();
              view.setPosition({
                x: isolatedParticle.position.x,
                y: isolatedParticle.position.y,
              });
              isolatedParticle.view = view;
            }
          } else {
            isolatedParticle.view.setPosition({
              x: isolatedParticle.position.x,
              y: isolatedParticle.position.y,
            });
          }
        }
      },

      open(callback) {
        actionStack
          .remove(['close', 'close-2', 'breath'])
          .add({
            name: 'open',
            object: settings,
            ref: 'particleAuraRadius',
            to: mMax(WIDTH, HEIGHT) / 4,
            easing: 0.02,

            checkCompletion() {
              let complete = true;
              const theColor = settings.blobColor;

              const pixelTopLeft = new Uint8Array(4);
              gl?.readPixels(
                0,
                0,
                1,
                1,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                pixelTopLeft
              );

              const pixelTopRight = new Uint8Array(4);
              gl?.readPixels(
                gl.drawingBufferWidth - 1,
                0,
                1,
                1,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                pixelTopRight
              );

              const pixelBottomLeft = new Uint8Array(4);
              gl?.readPixels(
                0,
                gl.drawingBufferHeight - 1,
                1,
                1,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                pixelBottomLeft
              );

              const pixelBottomRight = new Uint8Array(4);
              gl?.readPixels(
                gl.drawingBufferWidth - 1,
                gl.drawingBufferHeight - 1,
                1,
                1,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                pixelBottomRight
              );

              for (let i = 0; i < 3; i++) {
                if (
                  pixelTopLeft[i] !== theColor[i] ||
                  pixelTopRight[i] !== theColor[i] ||
                  pixelBottomLeft[i] !== theColor[i] ||
                  pixelBottomRight[i] !== theColor[i]
                ) {
                  complete = false;
                }
              }

              return complete;
            },

            done() {
              bubble.stop();
              setBodyBg(settings.blobColor);
              callback?.();
            },
          })
          .add({
            name: 'open-2',
            object: settings,
            ref: 'soothingFactor',
            to: 1,
            easing: 0.1,
          });
      },

      close(callback) {
        actionStack
          .remove(['open', 'open-2', 'breath'])
          .add({
            name: 'close',
            object: settings,
            ref: 'particleAuraRadius',
            to: initialParticleAuraRadius,
            easing: 0.1,
            completePercent: 0.99,
            done: callback,
          })
          .add({
            name: 'close-2',
            object: settings,
            ref: 'soothingFactor',
            to: initialSoothingFactor,
            easing: 0.05,
          });

        bubble.start({ appear: false });
      },

      start(options) {
        if (options?.appear) {
          settings.particleAuraRadius = 0;

          actionStack.add({
            name: 'appear',
            object: settings,
            ref: 'particleAuraRadius',
            to: initialParticleAuraRadius,
            easing: 0.1,
            completePercent: 0.99,
          });
        }

        started = true;
        requestAnimationFrame(tick);
      },

      stop() {
        started = false;
      },

      breath(value) {
        const to = projectsOn
          ? projectsParticleRadius +
            0.5 * ((maxBreath + 40) * value + (maxBreath - 40)) * value
          : initialParticleAuraRadius +
            0.5 *
              ((maxBreath + minBreath) * value + (maxBreath - minBreath)) *
              value;

        actionStack.remove(['breath']).add({
          name: 'breath',
          object: settings,
          ref: 'particleAuraRadius',
          to: to,
          easing: 0.05,
          completePercent: 0.99,
        });
      },

      changeColor(ref, newColor) {
        const colorArray = normalizeColor(newColor);

        actionStack.remove(['change-' + ref + '-color']).add({
          name: 'change-' + ref + '-color',
          object: settings,
          ref: ref,
          to: colorArray,
          easing: 0.1,
          completePercent: 0.99,
        });
      },

      removeAllIsolatedHelper() {
        // remove all isolated label view and prevent new view
        preventCheckIsolated = true;
        const numIsolatedParticles = isolatedParticles.length;
        if (numIsolatedParticles === 0) settings.showIsolated = false;
        let count = 0;
        isolatedParticles.forEach(function (isolatedParticle) {
          if (isolatedParticle.view) {
            isolatedParticle.preventNewView = true;
            bubble.removeViewHelper(isolatedParticle, function () {
              count++;
              if (count === numIsolatedParticles - 1) {
                settings.showIsolated = false;
              }
            });
          }
        });
      },

      projectsModeOn() {
        mouse.position.x = -100;
        mouse.position.y = -100;

        const numProjects = settings.projects.length;
        projectParticles = [];

        // select numProjects particles to be projects, and select them in the viewport if any
        let i: number;
        // Isolated ones AND in viewport are of first choice. Maybe its not set ?
        if (!settings.showIsolated) bubble.checkIsolatedParticles();
        i = numParticles;
        while (projectParticles.length < numProjects && i--) {
          const particleI = particles[i];
          if (
            particleI.view &&
            particleI.position.x <= WIDTH &&
            particleI.position.y <= HEIGHT
          ) {
            particleI.isProject = true;
            projectParticles.push(particleI);
          }
        }
        // If not enough, the ones in the viewport
        i = numParticles;
        while (projectParticles.length < numProjects && i--) {
          const particleI = particles[i];
          if (
            !particleI.isProject &&
            particleI.position.x <= WIDTH &&
            particleI.position.y <= HEIGHT
          ) {
            particleI.isProject = true;
            projectParticles.push(particleI);
          }
        }
        // If not enough, isolated ones not in viewport
        if (!settings.showIsolated) bubble.checkIsolatedParticles();
        i = numParticles;
        while (projectParticles.length < numProjects && i--) {
          const particleI = particles[i];
          if (
            !particleI.isProject &&
            particleI.view &&
            particleI.position.x > WIDTH &&
            particleI.position.y > HEIGHT
          ) {
            particleI.isProject = true;
            projectParticles.push(particleI);
          }
        }
        // If not enough, anyone
        i = numParticles;
        while (projectParticles.length < numProjects && i--) {
          const particleI = particles[i];
          if (!particleI.isProject) {
            particleI.isProject = true;
            projectParticles.push(particleI);
          }
        }

        // translate boundaries
        checkBoundaries = false;
        if (settings.hasBoundaries) {
          boundaries.forEach(function (boundary) {
            Body.translate(boundary, {
              x: 2 * WIDTH,
              y: 2 * HEIGHT,
            });
          });
        }

        actionStack
          .remove(['center-go-back-x', 'center-go-back-y'])
          .add({
            name: 'center-go-far-x',
            object: centerBody.position,
            ref: 'x',
            to: 2 * WIDTH,
            easing: 0.05,
            completePercent: 0.9,
          })
          .add({
            name: 'center-go-far-y',
            object: centerBody.position,
            ref: 'y',
            to: 2 * HEIGHT,
            easing: 0.05,
            completePercent: 0.9,
          });

        settings.centerAttractExponent = 2;
        settings.longRangeCenterAttract = 10;

        bubble.removeAllIsolatedHelper();

        projectParticles.forEach(function (particle, i) {
          // attach a project
          particle.project = settings.projects[i];

          // prevent big center attractor
          particle.preventOtherAttractions = true;

          // set it a constraint attractor at required position
          const pos = bubble.hexagonCenterPosition(i);

          const attachedCenter = Bodies.circle(pos.x, pos.y, 0.1, {
            isStatic: true,
          });

          particle.itsAttachedCenter = attachedCenter;

          World.add(world, particle.itsAttachedCenter);

          const constraint = Constraint.create({
            bodyA: particle,
            bodyB: attachedCenter,
            pointA: { x: 0, y: 0 },
            pointB: { x: 0, y: 0 },
            length: 0,
            stiffness: 0.01,
            damping: 0.001,
          });

          particle.itsConstraint = constraint;

          World.add(world, particle.itsConstraint);

          // reverse mouse constraint
          mouseRepelFactor = -0.1;
        });

        // change rendering of the particles
        actionStack.remove(['breath', 'appear', 'fade-in']).add({
          name: 'fade-out',
          object: settings,
          ref: 'particleAuraRadius',
          to: projectsParticleRadius,
          easing: 0.05,
          completePercent: 0.9,
        });

        projectsOn = true;
      },

      hexagonCenterPosition(i) {
        const numProjects = settings.projects.length;
        const marginLR = WIDTH > 400 ? 80 : 40;
        const marginTop = WIDTH > 400 ? 120 : WIDTH <= 340 ? 60 : 80;
        const marginBot = WIDTH > 400 ? 150 : 60;
        const rawNumLines = mSqrt(
          ((HEIGHT - marginTop - marginBot) /
            mSin(PI / 3) /
            (WIDTH - 2 * marginLR)) *
            numProjects
        );
        const rawNumCols = numProjects / rawNumLines;
        let numLines = mFloor(rawNumLines);
        let numCols = mFloor(rawNumCols);
        let distance = 0;

        while (numLines * numCols < numProjects) {
          if (
            mAbs(numLines * (numCols + 1) - numProjects) <
            mAbs((numLines + 1) * numCols - numProjects)
          ) {
            numCols++;
            distance = (WIDTH - 2 * marginLR) / numCols;
          } else {
            numLines++;
            distance = (HEIGHT - marginTop - marginBot) / numLines;
          }
        }

        if (numLines === 1) {
          numLines++;
          numCols--;
        }

        const extraMarginLeft =
          (WIDTH - 2 * marginLR - (numCols - 0.5) * distance) / 2;
        const extraMarginTop =
          (HEIGHT -
            marginTop -
            marginBot -
            (numLines - 1) * distance * mSin(PI / 3)) /
          2;

        const iLine = mFloor(i / numCols);

        const x =
          extraMarginLeft +
          marginLR +
          ((i % numCols) + (iLine % 2) / 2) * distance;
        const y = extraMarginTop + marginTop + iLine * distance * mSin(PI / 3);

        return {
          x: x,
          y: y,
        };
      },

      updateHexagonCenterPositions() {
        projectParticles.forEach(function (particle, i) {
          try {
            const pos = bubble.hexagonCenterPosition(i);
            if (particle.itsConstraint) particle.itsConstraint.damping = 0;
            if (particle.itsAttachedCenter) {
              particle.itsAttachedCenter.position.x = pos.x;
              particle.itsAttachedCenter.position.y = pos.y;
            }
          } catch (e) {
            // best effort
          }
        });
      },

      showProjectsParticles() {
        let i = projectParticles.length;
        while (i--) {
          try {
            const projectParticle = projectParticles[i];
            if (!projectParticle.project) continue;

            if (
              !projectParticle.projectView &&
              projectParticle.itsAttachedCenter
            ) {
              const projectView = new ProjectParticleView(
                domElem,
                projectParticle.project,
                projectParticle.itsAttachedCenter.position
              );
              projectView.show();
              projectView.setPosition({
                x: projectParticle.position.x,
                y: projectParticle.position.y,
              });
              projectParticle.projectView = projectView;
            } else {
              projectParticle.projectView?.setPosition({
                x: projectParticle.position.x,
                y: projectParticle.position.y,
              });
            }
          } catch (e) {
            // best effort
          }
        }
      },

      projectsModeOff() {
        preventCheckIsolated = false;
        settings.showIsolated = true;

        const numProjectParticles = projectParticles.length;
        let count = 0;

        particles.forEach(function (particle) {
          // Reset big center attractor
          particle.preventOtherAttractions = false;
        });

        projectParticles.forEach(function (particle) {
          particle.isProject = false;

          // Remove view
          if (particle.projectView) {
            particle.projectView.off();
            particle.projectView.hide(function () {
              particle.projectView = null;
              count++;
              if (count === numProjectParticles) projectsOn = false;
            });
          }

          // Reset new view
          setTimeout(function () {
            particle.preventNewView = false;
          }, 1000);

          // Remove constraints
          if (particle.itsAttachedCenter) {
            World.remove(world, particle.itsAttachedCenter);
          }
          if (particle.itsConstraint) {
            World.remove(world, particle.itsConstraint);
          }
          particle.itsAttachedCenter = null;
          particle.itsConstraint = null;

          // Reset mouse constraint
          mouseRepelFactor = 1;
        });

        actionStack
          .remove(['center-go-far-x', 'center-go-far-y'])
          .add({
            name: 'center-go-back-x',
            object: centerBody.position,
            ref: 'x',
            to: settings.center.xRatio * WIDTH,
            easing: 0.05,
            completePercent: 0.99,
          })
          .add({
            name: 'center-go-back-y',
            object: centerBody.position,
            ref: 'y',
            to: settings.center.yRatio * HEIGHT,
            easing: 0.05,
            completePercent: 0.99,
            done() {
              settings.centerAttractExponent = savedCenterAttractExponent;
              settings.longRangeCenterAttract = savedLongRangeCenterAttract;
              // Reset boundaries
              checkBoundaries = true;
              if (settings.hasBoundaries) {
                boundaries.forEach(function (boundary) {
                  Body.translate(boundary, {
                    x: -2 * WIDTH,
                    y: -2 * HEIGHT,
                  });
                });
              }
            },
          });

        // Reset particleAuraRadius
        actionStack.remove(['breath', 'fade-out']).add({
          name: 'fade-in',
          object: settings,
          ref: 'particleAuraRadius',
          to: initialParticleAuraRadius,
          easing: 0.1,
          completePercent: 0.99,
        });
      },

      kill() {
        started = false;
        World.clear(world, false);
        Engine.clear(engine);
        removeRenderer();
      },

      removeParticles(quantity, adjustThreshold) {
        let i = numParticles - 1;
        let left = quantity - 1;
        while (left && i) {
          if (!particles[i].isProject) {
            bubble.removeViewHelper(particles[i]);
            World.remove(world, particles[i]);
            particles.splice(i, 1);
            left--;
          }
          i--;
        }

        numParticles = numParticles - quantity;
        if (adjustThreshold) settings.threshold = 1 / numParticles;

        const oldStyle = document.body.getAttribute('style') ?? '';
        document.body.setAttribute(
          'style',
          'background-image: url(' + canvas?.toDataURL() + ');'
        );
        setTimeout(() => {
          document.body.setAttribute('style', oldStyle);
        }, 500);

        removeRenderer();
        createRenderer();
        bubble.setupWebGlMetaballs();
      },
    };

    /******************
     * animation loop *
     ******************/

    function tick(): void {
      if (started) {
        const t0 = performance.now();

        actionStack.increment();

        if (settings.playPhysics) bubble.updatePhysics();
        if (renderGpu) bubble.transferToGPU();

        if (settings.showIsolated) {
          if (!preventCheckIsolated) bubble.checkIsolatedParticles();
          bubble.showIsolatedParticles();
        }

        if (projectsOn) {
          bubble.showProjectsParticles();
        }

        const t1 = performance.now();

        if (t1 - t0 > 1000 / 40) {
          window.dispatchEvent(bloatedEvent);
        }

        requestAnimationFrame(tick);
      }
    }

    // Window resize
    window.addEventListener('resize', () => {
      const oldW = WIDTH;
      const oldH = HEIGHT;

      domElemRect = domElem.getBoundingClientRect();
      WIDTH = domElemRect.width;
      HEIGHT = domElemRect.height;

      bubble.resizeWorld(oldW, oldH);
      if (projectsOn) bubble.updateHexagonCenterPositions();
      if (!settings.playPhysics) bubble.updatePhysics();

      setCanvasSize();

      gl?.viewport(0, 0, WIDTH, HEIGHT);
      gl?.clear(gl.COLOR_BUFFER_BIT);
    });

    // mouse position stack
    const mouse = {
      position: {
        x: -100,
        y: -100,
      },
    };

    window.addEventListener(
      'mousemove',
      event => {
        mouse.position.x = event.clientX;
        mouse.position.y = event.clientY;
      },
      { passive: true }
    );

    window.addEventListener(
      'touchmove',
      event => {
        mouse.position.x = event.touches[0].clientX;
        mouse.position.y = event.touches[0].clientY;
      },
      { passive: true }
    );

    window.addEventListener(
      'touchend',
      () => {
        mouse.position.x = -100;
        mouse.position.y = -100;
      },
      { passive: true }
    );

    return bubble;
  })(window, Math);
}
