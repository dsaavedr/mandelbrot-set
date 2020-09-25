let size = 600,
    WIDTH, HEIGHT;

const MAX_ITER = 80,
    RE_START = -2,
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
        }
        z = {
            x: p.x + c.x,
            y: p.y + c.y
        }

        d = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2));
        n++;
    }

    return [n, d <= 2];
}

let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

const requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

init = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    if (HEIGHT > WIDTH / (4 / 3)) {
        HEIGHT = WIDTH / (4 / 3);
    }

    canvas.setAttribute('width', WIDTH);
    canvas.setAttribute('height', HEIGHT);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.closePath();

    ani();
}

ani = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // 16 Random hexadecimal colors
    // const colors = new Array(16).fill(0).map((_, i) => i === 0 ? '#000' : `#${((1 << 24) * Math.random() | 0).toString(16)}`);

    for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < HEIGHT; j++) {
            let complex = {
                x: RE_START + (i / WIDTH) * (RE_END - RE_START),
                y: IM_START + (j / HEIGHT) * (IM_END - IM_START)
            }

            const [m, isPartOfSet] = mandelbrot(complex);

            let c = isPartOfSet ? 0 : scale(Math.log(m + 1), 0, 4.5, 0, 255);
            c != 0 ? c = 255 - c : null;

            ctx.fillStyle = rgb(c, c, c);
            // colors[isMandelbrotSet ? 0 : (m % colors.length - 1) + 1];
            ctx.fillRect(i, j, 1, 1);
        }
    }

    // requestAnimationFrame(ani);
}

init();