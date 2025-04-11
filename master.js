let size = 600,
  userSelection = {
    s: new Vector(),
    e: new Vector()
  },
  ratio = 4 / 3,
  values = [],
  img,
  WIDTH,
  HEIGHT;

const MAX_ITER = 120;
// const MAX_ITER = 80;

let RE_START = -2,
  RE_END = 1,
  IM_START = -1.2,
  IM_END = 1.2;

function mandelbrot(c) {
  let z = { x: 0, y: 0 },
    n = 0,
    d = 0,
    p;

  while (d <= 2 && n < MAX_ITER) {
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

  if (ctx.setContextAttributes) {
    const attributes = ctx.getContextAttributes();
    log(JSON.stringify(attributes));
  } else {
    log("CanvasRenderingContext2D.getContextAttributes() is not supported");
  }

  if (HEIGHT > WIDTH / ratio) {
    HEIGHT = WIDTH / ratio;
    b;
  }
  if (WIDTH > HEIGHT * ratio) {
    WIDTH = HEIGHT * ratio;
  }

  canvas.addEventListener("mousedown", e => {
    let m0 = new Vector(e.layerX, e.layerY);
    userSelection.s = m0;
    userSelection.e = m0;

    canvas.onmousemove = e => {
      let m1 = new Vector(e.layerX, e.layerY);

      userSelection.e = m1;
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

  getMandelbrot();

  ani();
};

ani = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.putImageData(img, 0, 0);

  // 16 Random hexadecimal colors
  // const colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`);

  let s = userSelection.s;
  let e = userSelection.e;
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

function getMandelbrot() {
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      let complex = {
        x: RE_START + (i / WIDTH) * (RE_END - RE_START),
        y: IM_START + (j / HEIGHT) * (IM_END - IM_START)
      };

      const [m, isPartOfSet] = mandelbrot(complex);

      let c = isPartOfSet ? 0 : scale(Math.log(m + 1), 0, 4.5, 0, 255);
      c != 0 ? (c = 255 - c) : null;

      values.push(c);

      ctx.fillStyle = rgb(c, c, c);
      // colors[isMandelbrotSet ? 0 : (m % colors.length - 1) + 1];
      ctx.fillRect(i, j, 1, 1);
    }
  }

  img = ctx.getImageData(0, 0, WIDTH, HEIGHT);
}

function handleUp() {
  document.getElementById("resetBtn").classList.add("active");

  let rs = userSelection.s.x,
    re = userSelection.e.x,
    is = userSelection.s.y,
    ie = userSelection.e.y;

  let temps = RE_START;
  RE_START = scale(rs, 0, WIDTH, RE_START, RE_END);
  RE_END = scale(re, 0, WIDTH, temps, RE_END);

  temps = IM_START;
  IM_START = scale(is, 0, HEIGHT, IM_START, IM_END);
  IM_END = scale(ie, 0, HEIGHT, temps, IM_END);

  log(RE_START);
  log(RE_END);
  log(IM_START);
  log(IM_END);

  userSelection.s = new Vector();
  userSelection.e = new Vector();

  let w = re - rs,
    h = ie - is;

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

  getMandelbrot();
}

function resetCanvas() {
  document.getElementById("resetBtn").classList.remove("active");

  RE_START = -2;
  RE_END = 1;
  IM_START = -1.2;
  IM_END = 1.2;

  ratio = 4 / 3;

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

  getMandelbrot();
}

init();
