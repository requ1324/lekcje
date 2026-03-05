class Pill {
    constructor(y, x, c1, c2) {
        this.rotation = 0;
        this.c1 = c1;
        this.c2 = c2;
        this.x = x;
        this.y = y;
    }
}
let board = document.getElementById("board");
const ctx = board.getContext("2d");
const COLS = 8;
const ROWS = 16;
const CELL_SIZE = 40;
function drawGrid() {
    ctx.strokeStyle = "gray";
    for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, ROWS * CELL_SIZE);
        ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(COLS * CELL_SIZE, y * CELL_SIZE);
        ctx.stroke();
    }
}
function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}
function drawPill(pill) {
    if (pill.rotation === 0) {
        drawCell(pill.x, pill.y, pill.c1);
        drawCell(pill.x + 1, pill.y, pill.c2);
    }
    else {
        drawCell(pill.x, pill.y, pill.c1);
        drawCell(pill.x, pill.y + 1, pill.c2);
    }
}
function gameLoop() {
    ctx.clearRect(0, 0, board.width, board.height);
    drawGrid();
    drawPill(new Pill(5, 3, "red", "blue"));
    requestAnimationFrame(gameLoop);
}
gameLoop();
export {};
//# sourceMappingURL=script.js.map