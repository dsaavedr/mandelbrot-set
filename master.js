let size = 600,
  userSelection = {
    start: new Vector(),
    end: new Vector()
  },
  values = [],
  img,
  WIDTH,
  HEIGHT;

const MAX_ITERATIONS = 120;
const INITIAL_REAL = [-2, 1];
const INTIAL_IMAGINARY = [-1.5, 1.5];
const INITIAL_RATIO = 4 / 3;
// const MAX_ITER = 80;

let ratio = INITIAL_RATIO;
let [realStart, realEnd] = INITIAL_REAL;
let [imaginaryStart, imaginaryEnd] = INTIAL_IMAGINARY;

function mandelbrot(c) {
  let z = { x: 0, y: 0 },
    n = 0,
    d = 0,
    p;

  while (d <= 2 && n < MAX_ITERATIONS) {
    p = {
      x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
      y: 2 * z.x * z.y
    };
    z = {
      x: p.x + c.x,
      y: p.y + c.y
    };

    d = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2));
    n++;
  }

  return [n, d <= 2];
}

let canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d", { willReadFrequently: true });

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

init = () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  if (HEIGHT > WIDTH / ratio) {
    HEIGHT = WIDTH / ratio;
    b;
  }
  if (WIDTH > HEIGHT * ratio) {
    WIDTH = HEIGHT * ratio;
  }

  canvas.addEventListener("mousedown", e => {
    let m0 = new Vector(e.layerX, e.layerY);
    userSelection.start = m0;
    userSelection.end = m0;

    canvas.onmousemove = e => {
      let m1 = new Vector(e.layerX, e.layerY);

      userSelection.end = m1;
    };
  });

  canvas.addEventListener("mouseup", () => {
    handleUp();
    canvas.onmousemove = null;
  });

  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);

  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.closePath();

  getMandelbrotSet();

  ani();
};

ani = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.putImageData(img, 0, 0);

  // 16 Random hexadecimal colors
  // const colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`);

  let s = userSelection.start;
  let e = userSelection.end;
  let d = Vector.sub(e, s);

  if (s.x !== e.x && s.y !== e.y) {
    ctx.save();
    ctx.fillStyle = "rgba(100, 100, 255, 0.6)";
    ctx.strokeStyle = "rgba(0, 0, 255, 1)";
    ctx.fillRect(s.x, s.y, d.x, d.y);
    ctx.stroke();
    ctx.restore();
  }

  requestAnimationFrame(ani);
};

function openNav() {
  var inputs = document.getElementById("inputs");
  inputs.style.width = "250px";
  inputs.style.paddingLeft = "25px";
}

function closeNav() {
  var inputs = document.getElementById("inputs");
  inputs.style.width = "0";
  inputs.style.paddingLeft = "0";
}

function getMandelbrotSet() {
  let max = 0;
  values = [];

  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      let complex = {
        x: realStart + (i / WIDTH) * (realEnd - realStart),
        y: imaginaryStart + (j / HEIGHT) * (imaginaryEnd - imaginaryStart)
      };

      const [m, isPartOfSet] = mandelbrot(complex);

      let c = isPartOfSet ? 0 : scale(Math.log(m + 1), 0, Math.log(MAX_ITERATIONS), 0, 255);

      if (c != 0) {
        c = 255 - c;
      }

      if (c > max) {
        max = c;
      }

      values.push(c);
    }
  }

  let idx = 0;
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      const c = scale(values[idx], 0, max, 0, 255);
      ctx.fillStyle = rgb(c, c, c);
      ctx.fillRect(i, j, 1, 1);
      idx++;
    }
  }

  img = ctx.getImageData(0, 0, WIDTH, HEIGHT);
}

function handleUp() {
  document.getElementById("resetBtn").classList.add("active");

  const userRealStart = userSelection.start.x,
    userRealEnd = userSelection.end.x,
    userImaginaryStart = userSelection.start.y,
    userImaginaryEnd = userSelection.end.y;

  let temps = realStart;
  realStart = scale(userRealStart, 0, WIDTH, realStart, realEnd);
  realEnd = scale(userRealEnd, 0, WIDTH, temps, realEnd);

  temps = imaginaryStart;
  imaginaryStart = scale(userImaginaryStart, 0, HEIGHT, imaginaryStart, imaginaryEnd);
  imaginaryEnd = scale(userImaginaryEnd, 0, HEIGHT, temps, imaginaryEnd);

  userSelection.start = new Vector();
  userSelection.end = new Vector();

  let w = userRealEnd - userRealStart,
    h = userImaginaryEnd - userImaginaryStart;

  ratio = w / h;

  if (HEIGHT > WIDTH / ratio) {
    WIDTH = window.innerWidth;
    HEIGHT = WIDTH / ratio;
  }
  if (WIDTH > HEIGHT * ratio) {
    HEIGHT = window.innerHeight;
    WIDTH = HEIGHT * ratio;
  }

  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);

  getMandelbrotSet();
}

function resetCanvas() {
  document.getElementById("resetBtn").classList.remove("active");

  [realStart, realEnd] = INITIAL_REAL;
  [imaginaryStart, imaginaryEnd] = INTIAL_IMAGINARY;

  ratio = INITIAL_RATIO;

  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  if (HEIGHT > WIDTH / ratio) {
    HEIGHT = WIDTH / ratio;
  }
  if (WIDTH > HEIGHT * ratio) {
    WIDTH = HEIGHT * ratio;
  }

  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);

  getMandelbrotSet();
}

init();
