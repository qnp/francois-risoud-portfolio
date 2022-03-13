/*
 * marching-square algorithm, with segments weighting.
 * not used anymore in the current project (WebGL render)
 */

// for debug
// import Two from 'two.js';

// cache
const ceil = Math.ceil;
const max = Math.max;

class MarchingSquare {
  constructor(settings) {
    // required format

    const model = {
      fn: 'Function',
      threshold: 'Number',
      steps: 'Number',
      width: 'Number',
      height: 'Number',
      join: 'Boolean',
      more: 'Number',
    };

    // check
    /* eslint-disable quotes, valid-typeof */

    var errorStr =
      "[MarchingSquare] constructor must accept a valid 'settings' object: {\n";
    Object.entries(model).forEach(function (entry) {
      errorStr += '\t' + entry[0] + ': ' + entry[1] + ',\n';
    });
    errorStr += '}\n';

    if (settings === undefined || !Object.keys(settings).length) {
      throw new Error(errorStr);
    } else {
      Object.entries(model).forEach(function (entry) {
        if (settings[entry[0]] === undefined) {
          errorStr += "=> '" + entry[0] + "' is undefined \n";
          throw new Error(errorStr);
        } else if (typeof settings[entry[0]] !== entry[1].toLowerCase()) {
          errorStr +=
            "=> typeof '" +
            entry[0] +
            "' was found to be '" +
            typeof settings[entry[0]] +
            "'\n";
          throw new Error(errorStr);
        }
      });
    }

    /* eslint-enable quotes, valid-typeof */

    // set

    this.fn = settings.fn;
    this.threshold = settings.threshold;
    this.steps = settings.steps | 0;
    this.width = settings.width | 0;
    this.height = settings.height | 0;
    this.join = settings.join;
    this.more = settings.more | 0;

    // debugg

    // this.debug = settings.debug;
    // this.two = settings.two;
    // this.view = settings.view;
    // this.color1 = '#f00';
    // this.color2 = 'rgba(255, 0, 0, 0.1)';

    // output

    this.points = [];
  }

  finePos(Zin, Zout, ValIn, ValOut) {
    // average balanced regression
    const a = (ValOut - ValIn) / (Zout - Zin);
    const b = (ValIn * Zout - ValOut * Zin) / (Zout - Zin);
    return (this.threshold - b) / a;
  }

  finePosOpt(p, l, val1, val2) {
    return (
      ((l * (this.threshold - val1 * (p + 1) + val2 * p)) / (val2 - val1)) | 0
    );
  }

  loop() {
    this.points = [];

    let i, j;

    const w = ceil(this.width / this.steps) | 0;
    const h = ceil(this.height / this.steps) | 0;
    const m = this.more;

    this.steps += 2 * m;

    const data = new Float32Array((this.steps + 1) * (this.steps + 1));
    i = (this.steps + 1) | 0;
    while (i--) {
      j = (this.steps + 1) | 0;
      while (j--) {
        const value = this.fn((i - m) * w, (j - m) * h);
        data[i + this.steps * j] = value;
      }
    }

    i = this.steps | 0;
    while (i--) {
      j = this.steps | 0;
      while (j--) {
        let x1;
        let y1;
        let x2;
        let y2;
        let x3;
        let y3;
        let x4;
        let y4;

        const data1 = data[i + this.steps * j];
        const data2 = data[i + 1 + this.steps * j];
        const data3 = data[i + 1 + this.steps * (j + 1)];
        const data4 = data[i + this.steps * (j + 1)];

        let cas = 0;

        cas += (max(ceil(data1 - this.threshold), 0) | 0) << 3;
        cas += (max(ceil(data2 - this.threshold), 0) | 0) << 2;
        cas += (max(ceil(data3 - this.threshold), 0) | 0) << 1;
        cas += (max(ceil(data4 - this.threshold), 0) | 0) << 0;

        let found = true;
        let ambiguous = false;

        // debug by passing the two.js view

        // let rect;
        // if (this.debug) {
        //   rect = this.two.makeRectangle(i*w + w/2, j*h + h/2, w, h);
        //   rect.noFill().stroke = this.color1;
        //   this.view.add(rect);
        //   const text = new Two.Text(cas, i*w + w/2, j*h + h/2);
        //   this.view.add(text);
        //   const dataShape1 = this.two.makeCircle(i*w, j*h, 10);
        //   const dataShape2 = this.two.makeCircle((i+1)*w, j*h, 10);
        //   const dataShape3 = this.two.makeCircle((i+1)*w, (j+1)*h, 10);
        //   const dataShape4 = this.two.makeCircle(i*w, (j+1)*h, 10);
        //   dataShape1.noFill().stroke = this.color1;
        //   dataShape2.noFill().stroke = this.color1;
        //   dataShape3.noFill().stroke = this.color1;
        //   dataShape4.noFill().stroke = this.color1;
        //   if (max(ceil(data1 - this.threshold),0)|0) dataShape1.fill = this.color2;
        //   if (max(ceil(data2 - this.threshold),0)|0) dataShape2.fill = this.color2;
        //   if (max(ceil(data3 - this.threshold),0)|0) dataShape3.fill = this.color2;
        //   if (max(ceil(data4 - this.threshold),0)|0) dataShape4.fill = this.color2;
        //   this.view.add(dataShape1);
        //   this.view.add(dataShape2);
        //   this.view.add(dataShape3);
        //   this.view.add(dataShape4);
        //   const dataText1 = new Two.Text(data1.toFixed(2), i*w, j*h);
        //   const dataText2 = new Two.Text(data2.toFixed(2), (i+1)*w, j*h);
        //   const dataText3 = new Two.Text(data3.toFixed(2), (i+1)*w, (j+1)*h);
        //   const dataText4 = new Two.Text(data4.toFixed(2), i*w, (j+1)*h);
        //   this.view.add(dataText1);
        //   this.view.add(dataText2);
        //   this.view.add(dataText3);
        //   this.view.add(dataText4);
        // }

        switch (cas) {
          case 1:
          case 14:
            x1 = i * w;
            y1 = this.finePosOpt(j, h, data1, data4);
            x2 = this.finePosOpt(i, w, data4, data3);
            y2 = (j + 1) * h;
            break;
          case 2:
          case 13:
            x1 = this.finePosOpt(i, w, data4, data3);
            y1 = (j + 1) * h;
            x2 = (i + 1) * w;
            y2 = this.finePosOpt(j, h, data2, data3);
            break;
          case 4:
          case 11:
            x1 = this.finePosOpt(i, w, data1, data2);
            y1 = j * h;
            x2 = (i + 1) * w;
            y2 = this.finePosOpt(j, h, data2, data3);
            break;
          case 7:
          case 8:
            x1 = this.finePosOpt(i, w, data1, data2);
            y1 = j * h;
            x2 = i * w;
            y2 = this.finePosOpt(j, h, data1, data4);
            break;
          case 3:
          case 12:
            x1 = i * w;
            y1 = this.finePosOpt(j, h, data1, data4);
            x2 = (i + 1) * w;
            y2 = this.finePosOpt(j, h, data2, data3);
            break;
          case 6:
          case 9:
            x1 = this.finePosOpt(i, w, data1, data2);
            y1 = j * h;
            x2 = this.finePosOpt(i, w, data4, data3);
            y2 = (j + 1) * h;
            break;
          case 5:
          case 10:
            ambiguous = true;
            x1 = i * w;
            y1 = this.finePosOpt(j, h, data1, data4);
            x2 = this.finePosOpt(i, w, data4, data3);
            y2 = (j + 1) * h;
            x3 = this.finePosOpt(i, w, data1, data2);
            y3 = j * h;
            x4 = (i + 1) * w;
            y4 = this.finePosOpt(j, h, data2, data3);
            break;
          case 0:
          case 15:
          default:
            found = false;
            break;
        }

        if (found && (x1 !== x2 || y1 !== y2))
          this.points = this.points.concat([
            { x: x1 - m * w, y: y1 - m * h, cas: cas },
            { x: x2 - m * w, y: y2 - m * h, cas: cas },
          ]);
        if (ambiguous && (x3 !== x4 || y3 !== y4))
          this.points = this.points.concat([
            { x: x3 - m * w, y: y3 - m * h, cas: cas },
            { x: x4 - m * w, y: y4 - m * h, cas: cas },
          ]);

        // if (this.debug && found) {
        //   rect.fill = this.color2;
        // }
      }
    }
  }
}

export default MarchingSquare;
