<template lang="pug">
.physical-bubble
</template>

<style lang="stylus">

  $circle-radius = 75px
  $line-length = 1.4*$circle-radius
  $text-line-spacing = 10px
  $line45deg-length = 50px
  $line45deg-translate = (- ($circle-radius + $line45deg-length/2)*cos(45deg))
  $show-color = $theme-color-pink

  $particle-project-circle-radius = 27px

  .physical-bubble
    display block
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    opacity 1
    transition opacity 0.3s linear
    &.hide
      opacity 0

    .isolated-particle-view
      width 2*$circle-radius
      height 2*$circle-radius
      // background-color rgba(155,155,0,0.2)
      position fixed
      top 0
      left 0
      opacity 0
      transition opacity 0.7s linear
      &.show
        opacity 1
      .text
        width (2*$circle-radius - 40px)
        font-size 0.7em
        line-height 1.4
        font-family 'Raleway', sans-serif
        font-weight 500
        color $show-color
        // text-align center
        text-align right
        position absolute
        top 50%
        left 50%
        // transform translate(-50%,-50%)
        transform translateY(-50%)
        margin-left (- @width - $line-length - $text-line-spacing)
      .line
          width $line-length
          height 1px
          background-color $show-color
          position absolute
          top 50%
          left 50%
          margin-left (- $line-length)

    .project-particle-view
      width 2*$circle-radius
      height 2*$circle-radius
      position fixed
      top 0
      left 0
      opacity 0
      transition opacity 0.3s linear
      &.show
        opacity 1
      .circle
        width 2*$particle-project-circle-radius
        height 2*$particle-project-circle-radius
        position absolute
        top 50%
        left 50%
        margin-top (- $particle-project-circle-radius)
        margin-left (- $particle-project-circle-radius)
        background-color alpha($theme-color-pink, 0.6)
        transition background-color 0.5s linear
        border-radius $particle-project-circle-radius

  body:not(.has-touch)
    .physical-bubble
      .project-particle-view
        .circle:hover
          background-color alpha($theme-color-dark-teal, 0.6)

  body.has-touch
    .physical-bubble
      .project-particle-view
        .circle.hover
          transition all 0.2s linear
          background-color alpha($theme-color-pink, 0.6)
          border 5px solid $theme-color-pink
          margin-top -32px
          margin-left -32px
          border-radius 32px

  .dg.ac
    transition width 0.3s ease
    ul
      background-color #000
    .close-button
      transition width 0.3s ease

</style>

<script>

import Matter from 'matter-js';
import MatterAttractors from 'matter-attractors';
// import MatterWrap from 'matter-wrap';
import raf from 'raf';

// import Action from '@/assets/js/utils/action-helper';
import ActionStack from '@/assets/js/utils/action-helper';
import hexToArray from '@/assets/js/utils/hex-to-array';
import randomArrayElement from '@/assets/js/utils/random-array-element';
import uniqueID from '@/assets/js/utils/unique-ID.js';

// import dat from 'dat.gui';
// import Stats from 'stats-js';

class ParticleView {

  constructor(domElem, duration) {

    this.w = 150;
    this.h = 150;

    this.id = uniqueID();

    this.domElem = domElem;
    this.view = document.createElement('div');

    this.hiding = false;
    this.hidingTimeout = null;

    this.hidingDuration = duration;

  }

  show() {

    this.domElem.appendChild(this.view);
    this.view.classList.add('show');
    if (this.hiding) {
      clearTimeout(this.hidingTimeout);
      this.hiding = false;
    }

  }

  hide(callback) {

    this.hiding = true;
    this.view.classList.remove('show');
    if (this.hidingTimeout) clearTimeout(this.hidingTimeout);
    this.hidingTimeout = setTimeout(() => {
      this.hiding = false;
      this.domElem.removeChild(this.view);
      callback();
    }, this.hidingDuration);

  }

  setPosition(pos) {

    this.view.setAttribute('style', `transform: translate(${pos.x-this.w/2}px,${pos.y-this.h/2}px);`);

    const updateOriginnEvent = new CustomEvent('updateorigin', {
      detail: {
        id: this.id,
        newPos: {
          x: pos.x,
          y: pos.y
        }
      }
    });

    window.dispatchEvent(updateOriginnEvent);

  }

}

class IsolatedParticleView extends ParticleView {

  constructor(domElem, label, duplicate) {

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

class ProjectParticleView extends ParticleView {

  constructor(domElem, project, centerPosition) {

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

    this.circle.addEventListener('mouseenter', (e) => { this.mouseenterHandler(e); });
    this.circle.addEventListener('mouseleave', this.mouseleaveHandler);

    const self = this;

    this.circle.addEventListener('touchstart', (e) => {
      if (!self.open) {
        setTimeout(() => {
          domElem.addEventListener('touchstart', function handleOut() {
            self.mouseleaveHandler();
            self.circle.classList.remove('hover');
            domElem.removeEventListener('touchstart', handleOut);
          });
        }, 50);
        self.mouseenterHandler(e);
        self.circle.classList.add('hover');
      }
    });

  }

  mouseenterHandler(e) {
    this.open = true;
    const showProjectEvent = new CustomEvent('showproject', {
      detail: {
        id: this.id,
        project: this.project,
        centerPosition: this.centerPosition,
        origin: {
          x: e.clientX,
          y: e.clientY
        }
      }
    });
    window.dispatchEvent(showProjectEvent);
  }

  mouseleaveHandler() {
    this.open = false;
    window.dispatchEvent(new Event('hideproject'));
  }

  off() {
    this.circle.removeEventListener('mouseenter', (e) => { this.mouseenterHandler(e); });
    this.circle.removeEventListener('mouseleave', this.mouseleaveHandler);
    window.dispatchEvent(new Event('hideproject'));
  }

}

function PhysicalBubble(settings, domElem) {

  return (function(window, Math) { // encapsulation

    var started = false;

    // Math aliases
    const m_random = Math.random;
    const m_floor = Math.floor;
    const m_sqrt = Math.sqrt;
    const m_min = Math.min;
    const m_max = Math.max;
    const m_cos = Math.cos;
    const m_sin = Math.sin;
    const m_abs = Math.abs;
    const PI = Math.PI;

    // fit to window
    var domElemRect = domElem.getBoundingClientRect();
    var WIDTH = domElemRect.width;
    var HEIGHT = domElemRect.height;

    /*************
     * renderers *
     *************/

    const renderFactor = 1;
    var renderGPU = true;
    var canvas;
    var gl, glW, glH;

    function setCanvasSize() {

      glW = WIDTH * renderFactor;
      glH = HEIGHT * renderFactor;

      canvas.setAttribute('width', glW);
      canvas.setAttribute('height', glH);
      canvas.setAttribute('style', `width: ${WIDTH}px; height: ${HEIGHT}px`);

    }

    function createRenderer() {

      // webgl canvas renderer
      canvas = document.createElement('canvas');
      setCanvasSize();
      domElem.appendChild(canvas);
      gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});

    }

    function removeRenderer() {

      domElem.removeChild(canvas);
      canvas = null;
      gl = null;

    }

    // uniform handles
    var metaballsHandle;
    var soothingFactorHandle;
    var particleAuraRadiusHandle;
    var auraTypeMixHandle;
    var thresholdHandle;
    var randomRadiusFactorHandle;
    var blobColorHandle;
    var bgColorHandle;

    /************
     * settings *
     ************/

    settings.particleAuraRadius *= renderFactor;

    var numParticles = settings.numParticles || 8;
    const mouseRadius = settings.mouseRadius || 10;
    const mouseEasingFactor = settings.mouseEasingFactor || 0.5;
    // const startRadius = settings.startRadius;
    // const repelExponent = settings.repelExponent || 24;
    // const initialParticleRadius = settings.particleRadius;
    const initialParticleAuraRadius = settings.particleAuraRadius;
    const effectiveCheckRadius = settings.effectiveCheckRadius;
    const effectiveCheckRadiusPow2 = effectiveCheckRadius * effectiveCheckRadius;
    const maxNeighbours = settings.maxNeighbours;
    // const particleAuraRatio = settings.particleAuraRatio || '1.0';
    const particleMass = settings.particleMass || 50;
    // const blobColor = settings.blobColor || '#000';
    // const soothingFactor = settings.soothingFactor || 0.9;

    // const attarctiveness = (settings.attarctiveness || 1) * 10**7;
    // const equilibriumDistance = settings.equilibriumDistance || 10;
    const viscosity = settings.viscosity || 0;
    // const longRangeTail = (settings.longRangeTail || 0) * 10**(-9);

    // const equilibriumDistancePow6 = equilibriumDistance**6;
    // const particleAuraRadiusPow2 = particleAuraRadius * particleAuraRadius;
    // const threshold = (settings.threshold || 0.01) * particleAuraRatio;
    // const steps = settings.steps || 20;

    const bloatedEvent = new Event('bloated-'+settings.name);

    // show labels
    var leftLabels = settings.isolatedLabels.slice(0);
    var preventCheckIsolated = false;

    // project mode
    const savedCenterAttractExponent = settings.centerAttractExponent;
    const savedLongRangeCenterAttract = settings.longRangeCenterAttract;
    const projectsParticleRadius = 20;
    var projectParticles = [];
    var mouseRepelFactor = 1;
    var mouseTouchFactor = 1;
    var projectsOn = false;

    // curriculum
    const initialSoothingFactor = settings.soothingFactor;

    // const max = 1 * (5 * attarctiveness / (6*equilibriumDistancePow6));
    const maxBreath = settings.maxBreath;
    const minBreath = settings.minBreath;

    // set body bg to prevent white blink on resize
    function setBodyBg(color) {
      const formattedBgStr = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
      document.body.style['background-color'] = formattedBgStr;
    }

    /*******
     * gui *
     *******/

    var gui;

    /******************
     * actions stack *
     ******************/

    const actionStack = new ActionStack();

    /***********
     * physics *
     ***********/

    // Matter.use(MatterWrap);
    Matter.use(MatterAttractors);

    // module aliases
    const Engine = Matter.Engine;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Body = Matter.Body;
    const Events = Matter.Events;
    const Constraint = Matter.Constraint;

    // engine and world
    var engine;
    var world;

    // particles stack
    const particles = [];
    var isolatedParticles = [];
    var centerBody;

    // boundaries
    var boundaries = [];
    const boundaryThickness = 500;
    var checkBoundaries = true;

    const bubble = {

      showGui: function() {

        /*******************
         * lazy loaded gui *
         *******************/

        import(/* webpackChunkName: "dat.gui" */'dat.gui').then(function(dat) {

          settings.random = function() {
            settings.repelExponent = 2 + m_floor(m_random()*23);
            settings.centerAttractExponent = 2 + m_floor(m_random()*23);
            settings.centerAttractFactor = m_random();
            settings.longRangeCenterAttract = m_random()*20;
            settings.equilibriumDistance = 10 + m_random()*35;
            settings.attarctiveness = m_random()*50;
            settings.longRangeTail = m_random()*20;

            settings.soothingFactor = m_random();
            settings.particleAuraRadius = m_random()*80;
            settings.randomRadiusFactor = m_random();
            settings.auraTypeMix = m_random();
            settings.threshold = m_random() * 5/numParticles;
            settings.blobColor = [m_random()*255, m_random()*255, m_random()*255];
            settings.bgColor = [m_random()*255, m_random()*255, m_random()*255];
          };

          gui = new dat.default.GUI({ autoPlace: settings.showGui });
          gui.add(settings, 'playPhysics');
          gui.add(settings, 'random');

          const physicsGui = gui.addFolder('Physics');
          physicsGui.add(settings, 'repelExponent').min(2).step(2).max(24).listen();
          physicsGui.add(settings, 'centerAttractExponent').min(2).step(2).max(24).listen();
          physicsGui.add(settings, 'centerAttractFactor', 0, 1).listen();
          physicsGui.add(settings, 'longRangeCenterAttract', 0, 20).listen();
          physicsGui.add(settings, 'equilibriumDistance', 10, 45).listen();
          physicsGui.add(settings, 'attarctiveness', 0, 50).listen();
          // const particleRadiusController = physicsGui.add(settings, 'particleRadius', 0.001, 100);
          physicsGui.add(settings, 'longRangeTail', 0, 20).listen();
          // physicsGui.add(settings, 'timeScale', 0, 1.5);
          physicsGui.open();

          const renderGui = gui.addFolder('Render');
          renderGui.add(settings, 'soothingFactor', 0, 1).listen();
          renderGui.add(settings, 'particleAuraRadius', 0, 80).listen();
          renderGui.add(settings, 'randomRadiusFactor', 0, 1).listen();
          renderGui.add(settings, 'auraTypeMix', 0, 1).listen();
          renderGui.add(settings, 'threshold', 0, 5/numParticles).listen();
          renderGui.addColor(settings, 'blobColor').listen();
          const bgColorController = renderGui.addColor(settings, 'bgColor').listen();
          bgColorController.onChange(setBodyBg);
          renderGui.open();

          document.body.appendChild(gui.domElement);
          gui.domElement.classList.add('ac');
          const closeBtnElem = gui.domElement.querySelector('.close-button');

          setTimeout(function() {
            closeBtnElem.style = 'width: 340px;';
            gui.domElement.style = 'width: 340px;';
          }, 1000);

          closeBtnElem.addEventListener('click', () => {
            closeBtnElem.style = 'width: 340px;';
          });

          window.addEventListener('resize', () => {
            closeBtnElem.style = 'width: 340px;';
          });

        }).catch(function(err) { throw err; });

      },

      hideGui: function() {
        document.body.removeChild(gui.domElement);
      },

      setHasTouch: function() {
        // mouseTouchFactor = 0;
      },

      init: function() {

        // create an engine
        engine = Engine.create();
        world = engine.world;

        createRenderer();
        bubble.setupPhysics();
        bubble.setupWebGLmetaballs();

      },

      setupPhysics: function() {

        // zero gravity world
        world.gravity.x = 0;
        world.gravity.y = 0;

        engine.timing.timeScale = settings.timeScale;

        // infinite world
        // world.bounds.min.x = 200;
        // world.bounds.min.y = 200;
        // world.bounds.max.x = WIDTH - 200;
        // world.bounds.max.y = HEIGHT - 200;

        var i = numParticles;
        while (i--) {

          var ax;
          var ay;

          const startRadius = settings.startRadius + m_random()*10;
          if (settings.startPosMode === 'circle') {
            ax = settings.center.xRatio * WIDTH + startRadius * m_cos(i / numParticles * 2 * PI);
            ay = settings.center.yRatio * HEIGHT + startRadius * m_sin(i / numParticles * 2 * PI);
          } else if (settings.startPosMode === 'far') {
            ax = settings.center.xRatio * WIDTH + startRadius * m_cos((-1 - i / numParticles) * PI/2);
            ay = settings.center.yRatio * HEIGHT + startRadius * m_sin((-1 - i / numParticles) * PI/2);
          }

          const particle = Bodies.circle(ax, ay, settings.particleRadius, {

            mass: particleMass,
            additionalRadiusFactor: 0.5+m_random()*2.5,
            restitution: 0,
            frictionAir: viscosity,

            plugin: {

              attractors: [ // Van der Waals + Pauli

                function(bodyA, bodyB) {

                  const vecBToA = Matter.Vector.sub(bodyB.position, bodyA.position);
                  const vecNormal = Matter.Vector.normalise(vecBToA);
                  const bToA = m_max(Matter.Vector.magnitude(vecBToA), 1);
                  const bToAPow6 = bToA**6;
                  const attarctiveness = settings.attarctiveness*10**7;
                  const equilibriumDistance = settings.equilibriumDistance;
                  const equilibriumDistancePow6 = equilibriumDistance**6;
                  const longRangeTail = settings.longRangeTail*10**(-9);
                  const repelExponent = settings.repelExponent;
                  const centerAttractExponent = settings.centerAttractExponent;
                  const longRangeCenterAttract = settings.longRangeCenterAttract*10**(-7);
                  const max = 1 * (5 * attarctiveness / (6*equilibriumDistancePow6));

                  let magnitude = (6 * attarctiveness / (bToA * bToAPow6)) * (equilibriumDistancePow6 / bToAPow6 - 1) - longRangeTail * (bToA - equilibriumDistance)**2;
                  if (bodyA.preventOtherAttractions) magnitude = 0;

                  let force = Matter.Vector.mult(vecNormal, m_min(magnitude, max));

                  if (bodyB.isMouse) {

                    magnitude = attarctiveness * (equilibriumDistance / bToA)**repelExponent;

                    if (bodyA.preventOtherAttractions) magnitude = 0;

                    force = Matter.Vector.mult(vecNormal, mouseTouchFactor * mouseRepelFactor * m_min(magnitude, max));

                  } else if (bodyB.isCenter) {

                    magnitude = settings.centerAttractFactor * attarctiveness * (equilibriumDistance / bToA)**centerAttractExponent + longRangeCenterAttract * (bToA - equilibriumDistance)**2;

                    if (bodyA.preventOtherAttractions) magnitude = 0;

                    force = Matter.Vector.mult(vecNormal, -m_min(magnitude, max));

                  }

                  Matter.Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
                  Matter.Body.applyForce(bodyB, bodyB.position, force);

                }

              ],

            }

          });

          // stock it
          particles.push(particle);

          // add particle to the physical world
          World.add(world, particle);

        }

        // attactive fixed particle in the center
        const centerRadius = 10;
        centerBody = Bodies.circle(settings.center.xRatio * WIDTH, settings.center.yRatio * HEIGHT, centerRadius, {isStatic: true, isCenter: true});

        // add the center to the world
        World.add(world, centerBody);

        // create a body for the mouse
        const mouseBody = Bodies.circle(0, 0, mouseRadius, {isStatic: true, isMouse: true});

        // add the mouse body to the world
        World.add(world, mouseBody);

        // add mouse control
        Events.on(engine, 'afterUpdate', function() {
          if (!mouse.position.x) return;
          Body.translate(mouseBody, {
            x: (mouse.position.x - mouseBody.position.x) * mouseEasingFactor,
            y: (mouse.position.y - mouseBody.position.y) * mouseEasingFactor
          });
        });

        const boundsOpt = { isStatic: true, angle: 0 };

        if (settings.hasBoundaries) {

          const k = 100;

          boundaries.push(Bodies.rectangle(settings.boundaries.right.wRatio*WIDTH + settings.boundaries.right.offset, 0, boundaryThickness, 2*HEIGHT, boundsOpt));
          boundaries.push(Bodies.rectangle(0, settings.boundaries.bottom.hRatio*HEIGHT + settings.boundaries.bottom.offset, 2*WIDTH, boundaryThickness, boundsOpt));
          boundaries.push(Bodies.rectangle(settings.boundaries.right.wRatio*WIDTH + settings.boundaries.right.offset - k, settings.boundaries.bottom.hRatio*HEIGHT + settings.boundaries.bottom.offset - k, 4*k, boundaryThickness, boundsOpt));

          World.add(world, boundaries);

        }

      },

      setParticleRadius: function(radiusValue) {

        var i = numParticles;
        while (i--) {
          const particle_i = particles[i];
          Body.scale(particle_i, radiusValue/particle_i.circleRadius, radiusValue/particle_i.circleRadius);
        }

      },

      updatePhysics: function() {

        Engine.update(engine);

        if (settings.hasBoundaries && checkBoundaries) {

          var i = numParticles;
          while (i--) {
            const particle_i = particles[i];
            if (particle_i.position.x >= settings.boundaries.right.wRatio*WIDTH + settings.boundaries.right.offset + boundaryThickness
            || particle_i.position.y >= settings.boundaries.bottom.hRatio*HEIGHT + settings.boundaries.bottom.offset + boundaryThickness) {
              Body.translate(particle_i, {
                x: -boundaryThickness - settings.boundaries.right.offset/2,
                y: -boundaryThickness - settings.boundaries.bottom.offset/2,
              });
            }
          }

        }

      },

      updateTwo: function() {

        particles.forEach(function(particle) {

          particle.position = particle.shape.translation;

        });

      },

      resizeWorld: function(oldW, oldH) {
        Body.translate(centerBody, {
          x: centerBody.position.x * (WIDTH/oldW-1),
          y: centerBody.position.y * (HEIGHT/oldH-1),
        });
        particles.forEach(function(particle) {
          Body.translate(particle, {
            x: particle.position.x * (WIDTH/oldW-1),
            y: particle.position.y * (HEIGHT/oldH-1),
          });
        });
        if (settings.hasBoundaries) {
          boundaries.forEach(function(boundary) {
            Body.translate(boundary, {
              x: boundary.position.x * (WIDTH/oldW-1),
              y: boundary.position.y * (HEIGHT/oldH-1)
            });
          });
        }
      },

      setupWebGLmetaballs: function() {

        /***********
         * Shaders *
         ***********/

        // Utility to fail loudly on shader compilation failure
        function compileShader(shaderSource, shaderType) {
          var shader = gl.createShader(shaderType);
          gl.shaderSource(shader, shaderSource);
          gl.compileShader(shader);

          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(`${gl.getShaderInfoLog(shader)}`);
          }

          return shader;
        }

        var vertexShader = compileShader(`//glsl
          attribute vec2 position;
          void main() {
              // position specifies only x and y. We set z to be 0.0, and w to be 1.0
              gl_Position = vec4(position, 0.0, 1.0);
          }
        `, gl.VERTEX_SHADER);

        try {

          var fragmentShader = compileShader(`//glsl

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
                  // float k = {particleAuraRatio};
                  // v += h*h/(dx*dx + dy*dy);
                  // v += 0.03*h/r;
                  v += (1.0-mix) * 0.03*h/r + mix * h*h/(dx*dx + dy*dy)*exp(-(r-h)*(r-h)/(h*h));
                  // v += (0.0<r && r<h ? 1.0-r/h : 0.0);
                  // v += exp(-(dx*dx+dy*dy)/(h*h));
                  // v += (r<h ? 1.0 : 0.02*h/r + h*h/(dx*dx + dy*dy)*exp(-(r-h)*(r-h)/(h*h)));
                  // v += (r<h ? ((k-1.0)*r/h+1.0) : ((k-1.0)*r/h+1.0)*exp(-(r-h)*(r-h)/(h*h)));
                }

                v /= ${numParticles}.0;

                if (v >= threshold) f = 1.0;
                else if (v < threshold && v >= (1.0-sooth)*threshold) f = (v-(1.0-sooth)*threshold)/(sooth*threshold);
                else f = 0.0;

                gl_FragColor = vec4((1.0-f)*bgcolor[0]+f*color[0], (1.0-f)*bgcolor[1]+f*color[1], (1.0-f)*bgcolor[2]+f*color[2], 1.0);
            }
          `, gl.FRAGMENT_SHADER);

        } catch (err) {

          if (err.message.indexOf('too many uniforms') !== -1) bubble.removeParticles(10);
          return;

        }

        var program = gl.createProgram();
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
        var vertexData = new Float32Array([
          -1.0,  1.0, // top left (A)
          -1.0, -1.0, // bottom left (B)
           1.0,  1.0, // top right (C)
           1.0, -1.0, // bottom right (D)
        ]);
        /* eslint-enable indent, no-multi-spaces */
        var vertexDataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

        /*******************
         * Attribute setup *
         *******************/

        // Utility to complain loudly if we fail to find the attribute
        function getAttribLocation(program, name) {
          var attributeLocation = gl.getAttribLocation(program, name);
          if (attributeLocation === -1) {
            throw new Error(`Can not find attribute ${name}.`);
          }
          return attributeLocation;
        }

        // To make the geometry information available in the shader as attributes, we
        // need to tell WebGL what the layout of our data in the vertex buffer is.
        var positionHandle = getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionHandle);
        gl.vertexAttribPointer(
          positionHandle,
          2, // position is a vec2
          gl.FLOAT, // each component is a float
          gl.FALSE, // don't normalize values
          2 * 4, // two 4 byte float components per vertex
          0 // offset into each span of vertex data
        );

        /*****************
         * Uniform setup *
         *****************/

        // Utility to complain loudly if we fail to find the uniform
        function getUniformLocation(program, name) {
          var uniformLocation = gl.getUniformLocation(program, name);
          if (uniformLocation === -1) {
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

      transferToGPU: function() {
        // To send the data to the GPU, we first need to flatten our data into a single array.
        const dataToSendToGPU = new Float32Array(3 * numParticles);
        for (var i=0; i < numParticles; i++) {
          var baseIndex = 3 * i;
          var particle = particles[i];
          dataToSendToGPU[baseIndex + 0] = renderFactor * particle.position.x;
          dataToSendToGPU[baseIndex + 1] = renderFactor * (HEIGHT-particle.position.y);
          dataToSendToGPU[baseIndex + 2] = particle.additionalRadiusFactor;
        }

        const colorData = new Float32Array(3);
        const bgcolorData = new Float32Array(3);
        for (i=0; i<3; i++) {
          colorData[i] = settings.blobColor[i]/255;
          bgcolorData[i] = settings.bgColor[i]/255;
        }

        gl.uniform3fv(metaballsHandle, dataToSendToGPU);
        gl.uniform1f(soothingFactorHandle, settings.soothingFactor);
        gl.uniform1f(particleAuraRadiusHandle, settings.particleAuraRadius);
        gl.uniform1f(auraTypeMixHandle, settings.auraTypeMix);
        gl.uniform1f(thresholdHandle, settings.threshold);
        gl.uniform1f(randomRadiusFactorHandle, settings.randomRadiusFactor);
        gl.uniform3fv(blobColorHandle, colorData);
        gl.uniform3fv(bgColorHandle, bgcolorData);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      },

      removeViewHelper: function(particle, specialCallback) {
        if (particle.view) {
          particle.view.hide(function() {
            if (!particle.view.duplicate) leftLabels.push(particle.view.label);
            particle.view = null;
            if (specialCallback && typeof specialCallback === 'function') specialCallback();
          });
        }
      },

      checkIsolatedParticles: function() {

        // only 'settings.maxNeighbours' neighbours is an isolated particle

        isolatedParticles = [];

        var i = numParticles;
        while (i--) {

          const particle_i = particles[i];
          const x_i = particle_i.position.x;
          const y_i = particle_i.position.y;

          // particle must be in viewport (takinng into account its mean viewRadius), otherwise no need to check it
          if (x_i < WIDTH+4*effectiveCheckRadius && y_i < HEIGHT+2*effectiveCheckRadius) {
            var neighbours = 0;

            var j = numParticles;
            while (j--) {

              if (j !== i) {
                const particle_j = particles[j];
                const d2_ij = (x_i - particle_j.position.x)**2 + (y_i - particle_j.position.y)**2;
                if (d2_ij < 4*effectiveCheckRadiusPow2) {
                  neighbours += 1;
                }
              }
            }

            if (neighbours <= maxNeighbours || (particle_i.view && particle_i.view.hiding)) isolatedParticles.push(particle_i);
            else bubble.removeViewHelper(particle_i);

          } else {

            bubble.removeViewHelper(particle_i);

          }
        }

        return isolatedParticles;

      },

      showIsolatedParticles: function() {

        var i = isolatedParticles.length;
        while (i--) {

          const isolatedParticle = isolatedParticles[i];

          if (!isolatedParticle.view) {

            if (!isolatedParticle.preventNewView) {

              const rdm = randomArrayElement(leftLabels, true);
              var label = rdm.element;
              var duplicate = false;
              leftLabels = rdm.left;
              if (!label) {
                const newRdm = randomArrayElement(settings.isolatedLabels);
                label = newRdm.element;
                duplicate = true;
              }

              const view = new IsolatedParticleView(domElem, label, duplicate);
              view.show();
              view.setPosition({x: isolatedParticle.position.x, y: isolatedParticle.position.y});
              isolatedParticle.view = view;

            }

          } else {

            isolatedParticle.view.setPosition({x: isolatedParticle.position.x, y: isolatedParticle.position.y});

          }

        }

      },

      open: function(callback) {

        actionStack.remove(['close', 'close-2', 'breath']).add({
          name: 'open',
          object: settings,
          ref: 'particleAuraRadius',
          to: m_max(WIDTH, HEIGHT)/4,
          easing: 0.02,

          checkCompletion: function() {

            var complete = true;
            const theColor = settings.blobColor;

            var pixelTL = new Uint8Array(4);
            gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelTL);

            var pixelTR = new Uint8Array(4);
            gl.readPixels(gl.drawingBufferWidth-1, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelTR);

            var pixelBL = new Uint8Array(4);
            gl.readPixels(0, gl.drawingBufferHeight-1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelBL);

            var pixelBR = new Uint8Array(4);
            gl.readPixels(gl.drawingBufferWidth-1, gl.drawingBufferHeight-1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelBR);

            for (let i=0; i<3; i++) {
              if (pixelTL[i] !== theColor[i] || pixelTR[i] !== theColor[i] || pixelBL[i] !== theColor[i] || pixelBR[i] !== theColor[i]) {
                complete = false;
              }
            }

            return complete;

          },

          done: function() {
            bubble.stop();
            setBodyBg(settings.blobColor);
            if (callback && typeof callback === 'function') callback();
          }
        }).add({
          name: 'open-2',
          object: settings,
          ref: 'soothingFactor',
          to: 1,
          easing: 0.1,
        });

      },

      close: function(callback) {

        actionStack.remove(['open', 'open-2', 'breath']).add({
          name: 'close',
          object: settings,
          ref: 'particleAuraRadius',
          to: initialParticleAuraRadius,
          easing: 0.1,
          completePercent: 0.99,
          done: callback
        }).add({
          name: 'close-2',
          object: settings,
          ref: 'soothingFactor',
          to: initialSoothingFactor,
          easing: 0.05,
        });

        bubble.start({ appear: false });

      },

      start: function(options) {

        if (options.appear) {

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
        raf(tick);

      },

      stop: function() {

        started = false;

      },

      breath: function(value) {

        const to = projectsOn
          ? projectsParticleRadius + 0.5*((maxBreath + 40)*value + (maxBreath - 40))*value
          : initialParticleAuraRadius + 0.5*((maxBreath + minBreath)*value + (maxBreath - minBreath))*value;

        actionStack.remove(['breath']).add({
          name: 'breath',
          object: settings,
          ref: 'particleAuraRadius',
          to: to,
          easing: 0.05,
          completePercent: 0.99,
        });

      },

      changeColor: function(ref, newColor) {

        var colorArray;

        if (typeof newColor === 'string') colorArray = hexToArray(newColor);
        else if (newColor instanceof Array) colorArray = newColor;
        else throw new Error('changeBgColor needs a hex color or an rgb array');

        actionStack.remove(['change-'+ref+'-color']).add({
          name: 'change-'+ref+'-color',
          object: settings,
          ref: ref,
          to: colorArray,
          easing: 0.1,
          completePercent: 0.99,
        });

      },

      removeAllIsolatedHelper: function() {
        // remove all isolated label view and prevent new view
        preventCheckIsolated = true;
        const numIsolatedParticles = isolatedParticles.length;
        if (numIsolatedParticles === 0) settings.showIsolated = false;
        var count = 0;
        isolatedParticles.forEach(function(isolatedParticle) {
          if (isolatedParticle.view) {
            isolatedParticle.preventNewView = true;
            bubble.removeViewHelper(isolatedParticle, function() {
              count++;
              if (count === numIsolatedParticles-1) settings.showIsolated = false;
            });
          }
        });
      },

      projectsModeOn: function() {

        mouse.position.x = -100;
        mouse.position.y = -100;

        const numProjects = settings.projects.length;
        projectParticles = [];

        // select numProjects particles to be projects, and select them in the viewport if any
        var i;
        // Isolated ones AND in viewport are of first choice. Maybe its not set ?
        if (!settings.showIsolated) bubble.checkIsolatedParticles();
        i = numParticles;
        while (projectParticles.length < numProjects && i--) {
          const particle_i = particles[i];
          if (particle_i.view && particle_i.position.x <= WIDTH && particle_i.position.y <= HEIGHT) {
            particle_i.isProject = true;
            projectParticles.push(particle_i);
          }
        }
        // If not enough, the ones in the viewport
        i = numParticles;
        while (projectParticles.length < numProjects && i--) {
          const particle_i = particles[i];
          if (!particle_i.isProject && particle_i.position.x <= WIDTH && particle_i.position.y <= HEIGHT) {
            particle_i.isProject = true;
            projectParticles.push(particle_i);
          }
        }
        // If not enough, isolated ones not in viewport
        if (!settings.showIsolated) bubble.checkIsolatedParticles();
        i = numParticles;
        while (projectParticles.length < numProjects && i--) {
          const particle_i = particles[i];
          if (!particle_i.isProject && particle_i.view && particle_i.position.x > WIDTH && particle_i.position.y > HEIGHT) {
            particle_i.isProject = true;
            projectParticles.push(particle_i);
          }
        }
        // If not enough, anyone
        i = numParticles;
        while (projectParticles.length < numProjects && i--) {
          const particle_i = particles[i];
          if (!particle_i.isProject) {
            particle_i.isProject = true;
            projectParticles.push(particle_i);
          }
        }

        // translate boundaries
        checkBoundaries = false;
        if (settings.hasBoundaries) {
          boundaries.forEach(function(boundary) {
            Body.translate(boundary, {
              x: 2*WIDTH,
              y: 2*HEIGHT
            });
          });
        }

        actionStack.remove(['center-go-back-x', 'center-go-back-y']).add({
          name: 'center-go-far-x',
          object: centerBody.position,
          ref: 'x',
          to: 2*WIDTH,
          easing: 0.05,
          completePercent: 0.9,
        }).add({
          name: 'center-go-far-y',
          object: centerBody.position,
          ref: 'y',
          to: 2*HEIGHT,
          easing: 0.05,
          completePercent: 0.9,
        });

        settings.centerAttractExponent = 2;
        settings.longRangeCenterAttract = 10;

        bubble.removeAllIsolatedHelper();

        projectParticles.forEach(function(particle, i) {

          // attach a project
          particle.project = settings.projects[i];

          // prevent big center attractor
          particle.preventOtherAttractions = true;

          // set it a constraint attractor at required position
          const pos = bubble.hexagonCenterPosition(i);

          const attachedCenter = Bodies.circle(pos.x, pos.y, 0.1, {isStatic: true});

          particle.itsAttachedCenter = attachedCenter;

          World.add(world, particle.itsAttachedCenter);

          const constraint = Constraint.create({
            bodyA: particle,
            bodyB: attachedCenter,
            pointA: {x: 0, y: 0},
            pointB: {x: 0, y: 0},
            length: 0,
            stiffness: 0.01,
            damping: 0.001
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

      hexagonCenterPosition: function(i) {

        const numProjects = settings.projects.length;
        const marginLR = WIDTH > 400 ? 80 : 40;
        const marginTop = WIDTH > 400 ? 120 : WIDTH <= 340 ? 60 : 80;
        const marginBot = WIDTH > 400 ? 150: 60;
        const rawNumLines = m_sqrt(((HEIGHT-marginTop-marginBot)/m_sin(PI/3))/(WIDTH-2*marginLR)*numProjects);
        const rawNumCols = numProjects/rawNumLines;
        var numLines = m_floor(rawNumLines);
        var numCols = m_floor(rawNumCols);
        var distance;

        while (numLines * numCols < numProjects) {
          if (m_abs(numLines * (numCols+1) - numProjects) < m_abs((numLines+1) * numCols - numProjects)) {
            numCols++;
            distance = (WIDTH-2*marginLR)/numCols;
          } else {
            numLines++;
            distance = ((HEIGHT-marginTop-marginBot)/numLines);
          }
        }

        if (numLines === 1) {
          numLines++;
          numCols--;
        }

        const extraMarginLeft = ((WIDTH - 2*marginLR) - (numCols - 0.5) * distance) / 2;
        const extraMarginTop = ((HEIGHT-marginTop-marginBot) - (numLines - 1) * distance * m_sin(PI/3))/2;

        const iLine = m_floor(i/numCols);

        const x = extraMarginLeft + marginLR + (i%numCols + iLine%2/2) * distance;
        const y = extraMarginTop + marginTop + iLine * distance*m_sin(PI/3);

        return {
          x: x,
          y: y
        };

      },

      updateHexagonCenterPositions: function() {


        projectParticles.forEach(function(particle, i) {

          try {

            const pos = bubble.hexagonCenterPosition(i);
            particle.itsConstraint.damping = 0;
            particle.itsAttachedCenter.position.x = pos.x;
            particle.itsAttachedCenter.position.y = pos.y;

          } catch (e) {

            // silence is golden

          }

        });

      },

      showPojectsParticles: function() {

        var i = projectParticles.length;
        while (i--) {

          try {

            const projectParticle = projectParticles[i];

            if (!projectParticle.projectView && projectParticle.itsAttachedCenter) {

              const projectView = new ProjectParticleView(domElem, projectParticle.project, projectParticle.itsAttachedCenter.position);
              projectView.show();
              projectView.setPosition({x: projectParticle.position.x, y: projectParticle.position.y});
              projectParticle.projectView = projectView;

            } else {

              projectParticle.projectView.setPosition({x: projectParticle.position.x, y: projectParticle.position.y});

            }

          } catch (e) {

            // silence is golden

          }

        }

      },

      projectsModeOff: function() {

        // renderGPU = true;

        preventCheckIsolated = false;
        settings.showIsolated = true;

        const numProjectParticles = projectParticles.length;
        var count = 0;

        particles.forEach(function(particle) {
          // reset big center attractor
          particle.preventOtherAttractions = false;
        });

        projectParticles.forEach(function(particle) {

          particle.isProject = false;

          // remove view
          if (particle.projectView) {
            particle.projectView.off();
            particle.projectView.hide(function() {
              particle.projectView = null;
              count++;
              if (count === numProjectParticles) projectsOn = false;
            });
          }

          // reset new view
          setTimeout(function() {
            particle.preventNewView = false;
          }, 1000);

          // remove constraints
          World.remove(world, particle.itsAttachedCenter);
          World.remove(world, particle.itsConstraint);
          particle.itsAttachedCenter = null;
          particle.itsConstraint = null;

          // reset mouse constraint
          mouseRepelFactor = 1;

        });

        actionStack.remove(['center-go-far-x', 'center-go-far-y']).add({
          name: 'center-go-back-x',
          object: centerBody.position,
          ref: 'x',
          to: settings.center.xRatio*WIDTH,
          easing: 0.05,
          completePercent: 0.99,
        }).add({
          name: 'center-go-back-y',
          object: centerBody.position,
          ref: 'y',
          to: settings.center.yRatio*HEIGHT,
          easing: 0.05,
          completePercent: 0.99,
          done: function() {
            settings.centerAttractExponent = savedCenterAttractExponent;
            settings.longRangeCenterAttract = savedLongRangeCenterAttract;
            // reset boundaries
            checkBoundaries = true;
            if (settings.hasBoundaries) {
              boundaries.forEach(function(boundary) {
                Body.translate(boundary, {
                  x: -2*WIDTH,
                  y: -2*HEIGHT
                });
              });
            }
          }
        });

        // reset particleAuraRadius
        actionStack.remove(['breath', 'fade-out']).add({
          name: 'fade-in',
          object: settings,
          ref: 'particleAuraRadius',
          to: initialParticleAuraRadius,
          easing: 0.1,
          completePercent: 0.99,
        });

      },

      kill: function() {
        started = false;
        World.clear(world);
        Engine.clear(engine);
        removeRenderer();
      },

      removeParticles: function(quantity, adjustThreshold) {


        var i = numParticles-1;
        var left = quantity-1;
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
        if (adjustThreshold) settings.threshold = 1/numParticles;

        const oldStyle = document.body.getAttribute('style');
        document.body.setAttribute('style', 'background-image: url('+canvas.toDataURL()+');');
        setTimeout(() => { document.body.setAttribute('style', oldStyle); }, 500);

        removeRenderer();
        createRenderer();
        bubble.setupWebGLmetaballs();
      }

    };

    /******************
     * animation loop *
     ******************/

    function tick() {

      if (started) {

        var t0 = performance.now();

        actionStack.increment();

        if (settings.playPhysics) bubble.updatePhysics();
        if (renderGPU) bubble.transferToGPU();

        if (settings.showIsolated) {
          if (!preventCheckIsolated) bubble.checkIsolatedParticles();
          bubble.showIsolatedParticles();
        }

        if (projectsOn) {
          bubble.showPojectsParticles();
        }

        var t1 = performance.now();

        if (t1-t0 > 1000/40) {
          // document.body.classList.add('bloated');
          window.dispatchEvent(bloatedEvent);
        }

        // stats.end();

        raf(tick);

      }

    }

    // raf(tick);


    // window resize
    window.addEventListener('resize', function(e) {

      const oldW = WIDTH;
      const oldH = HEIGHT;

      domElemRect = domElem.getBoundingClientRect();
      WIDTH = domElemRect.width;
      HEIGHT = domElemRect.height;

      bubble.resizeWorld(oldW, oldH);
      if (projectsOn) bubble.updateHexagonCenterPositions();
      if (!settings.playPhysics) bubble.updatePhysics();

      setCanvasSize();

      gl.viewport(0, 0, WIDTH, HEIGHT);
      gl.clear(gl.COLOR_BUFFER_BIT);

    });

    // mouse position stack
    const mouse = {
      position: {
        x: -100,
        y: -100
      }
    };

    window.addEventListener('mousemove', function(e) {
      mouse.position.x = e.clientX;
      mouse.position.y = e.clientY;
    });

    window.addEventListener('touchmove', function(e) {
      mouse.position.x = e.touches[0].clientX;
      mouse.position.y = e.touches[0].clientY;
    });

    window.addEventListener('touchend', function(e) {
      mouse.position.x = -100;
      mouse.position.y = -100;
    });

    return bubble;

  })(window, Math);

}

export default {

  name: 'physical-bubble',

  props: {
    hasTouch: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: false
    },
    start: {
      type: Boolean,
      default: true
    },
    hide: {
      type: Boolean,
      default: false
    },
    // hideBlob: {
    //   type: Boolean,
    //   default: false
    // },
    appear: {
      type: Boolean,
      default: true
    },
    breath: {
      type: Number,
      default: 0
    },
    projectsMode: {
      type: Boolean,
      default: false
    },
    // reduce: {
    //   type: Boolean,
    //   default: false
    // },
    changeBlobColor: {
      type: String,
      default: ''
    },
    numParticles: {
      type: Number,
      default: 100
    },
    removeParticles: {
      type: Object,
      default: null
    },
    settings: Object,
  },

  data() {
    return {
      bubble: null,
      isOpen: false
    };
  },

  mounted() {

    const defaultSettings = {
      name: '',
      timeScale: 1,
      numParticles: this.numParticles,
      particleRadius: 0.001,
      particleAuraRadius: 20,
      randomRadiusFactor: 0.8,
      soothingFactor: 0.8,
      auraTypeMix: 0.005,
      threshold: 1/this.numParticles,
      mouseRadius: 0.001,
      mouseEasingFactor: 1,
      repelExponent: 8,
      centerAttractExponent: 12,
      centerAttractFactor: 1,
      longRangeCenterAttract: 5,
      equilibriumDistance: 15,
      attarctiveness: 0.4,
      longRangeTail: 3,
      viscosity: 0.05,
      startRadius: 30,
      center: {
        xRatio: 0.5,
        yRatio: 0.5
      },
      hasBoundaries: false,
      boundaries: {
        top: null,
        right: null,
        left: null,
        bottom: null,
      },
      showIsolated: false,
      isolatedLabels: [],
      projects: [],
      effectiveCheckRadius: 80,
      maxNeighbours: 1,
      startPosMode: 'circle',
      blobColor: hexToArray('#001433'),
      bgColor: hexToArray('#1a33ff'),
      maxBreath: 15,
      minBreath: -5,
      playPhysics: true,
      showGui: false,
      showStats: false,
    };

    const settings = Object.assign({}, defaultSettings, this.settings);

    this.bubble = PhysicalBubble(settings, this.$el);
    this.bubble.init();
    if (settings.showGui) this.bubble.showGui();
    if (this.start) this.bubble.start({ appear: this.appear });

  },

  computed: {

    bgColor: function() {
      return this.settings.bgColor;
    },

    showGui: function() {
      return this.settings.showGui;
    }

  },

  watch: {

    hasTouch: function(newVal, oldVal) {
      if (newVal) {
        this.bubble.setHasTouch();
      }
    },

    open: function(newVal, oldVal) {
      if (newVal && !this.isOpen) {
        this.isOpen = true;
        this.bubble.open(() => {
          this.$emit('end-opening');
        });
      } else if (!newVal && this.isOpen) {
        this.isOpen = false;
        this.bubble.close(() => {
          this.$emit('end-closing');
        });
      }
    },

    start: function(newVal, oldVal) {
      if (newVal) {
        this.bubble.start({ appear: this.appear });
      } else {
        this.bubble.stop();
      }
    },

    hide: function(newVal, oldVal) {
      if (newVal) {
        this.$el.classList.add('hide');
      } else {
        this.$el.classList.remove('hide');
      }
    },

    breath: function(newVal, oldVal) {
      this.bubble.breath(newVal);
    },

    bgColor: function(newVal, oldVal) {
      this.bubble.changeColor('bgColor', newVal);
    },

    changeBlobColor: function(newVal, oldVal) {
      this.bubble.changeColor('blobColor', newVal);
    },

    projectsMode: function(newVal, oldVal) {
      if (newVal) {
        this.bubble.projectsModeOn();
      } else {
        this.bubble.projectsModeOff();
      }
    },

    showGui: function(newVal, oldVal) {
      if (newVal) {
        this.bubble.showGui();
      } else {
        this.bubble.hideGui();
      }
    },

    removeParticles: function(newVal, oldVal) {
      this.bubble.removeParticles(newVal.num, newVal.threshold);
    },

  }

};

</script>
