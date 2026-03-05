class Pill {
    constructor(x, y, c1, c2) {
        this.rotation = 0;
        this.c1 = c1;
        this.c2 = c2;
        this.x = x;
        this.y = y;
    }
}
class Game {
    constructor() {
        this.ROWS = 16;
        this.COLS = 10;
        this.CELL_SIZE = 40;
        this.colors = ["#f03a22", "#22a8f0", "#fccc47"];
        this.pill = new Pill(3, 1, this.getRandomColor(), this.getRandomColor());
        this.isPillFalling = true;
        this.pillsArr = [];
        this.interval = setInterval(() => {
            this.clearPill(this.pill);
            this.movePill(this.pill, 0, 1);
            this.drawPill(this.pill);
        }, 300);
        this.board = document.getElementById("board");
        this.ctx = this.board.getContext("2d");
        this.gameLoop();
        this.handleKeyDown();
    }
    drawBoard() {
        for (let x = 0; x <= this.COLS; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.CELL_SIZE, 0);
            this.ctx.lineTo(x * this.CELL_SIZE, this.ROWS * this.CELL_SIZE);
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.ROWS; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.CELL_SIZE);
            this.ctx.lineTo(this.COLS * this.CELL_SIZE, y * this.CELL_SIZE);
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
        }
    }
    drawPill(pill) {
        this.ctx.beginPath();
        this.ctx.fillStyle = pill.c1;
        this.ctx.fillRect(pill.x * this.CELL_SIZE, pill.y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
        this.ctx.fillStyle = pill.c2;
        if (pill.rotation === 0 || pill.rotation === 180) {
            this.ctx.fillRect(pill.x * this.CELL_SIZE + this.CELL_SIZE, pill.y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
        }
        else {
            this.ctx.fillRect(pill.x * this.CELL_SIZE, pill.y * this.CELL_SIZE + this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
        }
    }
    movePill(pill, dx, dy) {
        pill.x += dx;
        pill.y += dy;
        if (pill.y > this.ROWS - 1) {
            pill.y = this.ROWS - 1;
            this.isPillFalling = false;
            this.drawPill(this.pill);
            this.pillsArr.push(this.pill);
            console.log(this.pillsArr);
            this.pill = new Pill(3, 1, this.getRandomColor(), this.getRandomColor());
        }
        this.checkColission();
    }
    clearPill(pill) {
        this.ctx.clearRect(pill.x * this.CELL_SIZE, pill.y * this.CELL_SIZE, this.CELL_SIZE * 2, this.CELL_SIZE);
    }
    handleKeyDown() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                this.clearPill(this.pill);
                this.movePill(this.pill, -1, 0);
            }
            else if (event.key === "ArrowRight") {
                this.clearPill(this.pill);
                this.movePill(this.pill, 1, 0);
            }
            else if (event.key === "ArrowDown") {
                this.clearPill(this.pill);
                this.movePill(this.pill, 0, 1);
            }
            else if (event.key === "ArrowUp") {
                this.clearPill(this.pill);
                this.rotatePill(this.pill);
            }
        });
    }
    checkColission() {
        for (let i = 0; i < this.pillsArr.length; i++) {
            let otherPill = this.pillsArr[i];
            if (!otherPill)
                continue;
            const blocks = [
                { x: this.pill.x, y: this.pill.y },
                { x: this.pill.x + 1, y: this.pill.y },
            ];
            for (let block of blocks) {
                const otherBlocks = [
                    { x: otherPill.x, y: otherPill.y },
                    { x: otherPill.x + 1, y: otherPill.y },
                ];
                for (let otherBlock of otherBlocks) {
                    if (block.x === otherBlock.x && block.y === otherBlock.y) {
                        this.pill.y = otherPill.y - 1;
                        this.isPillFalling = false;
                        this.drawPill(this.pill);
                        this.pillsArr.push(this.pill);
                        this.pill = new Pill(3, 1, this.getRandomColor(), this.getRandomColor());
                        return;
                    }
                }
            }
        }
    }
    rotatePill(pill) {
        pill.rotation = (pill.rotation + 90) % 360;
        this.drawPill(pill);
    }
    getRandomColor() {
        const randomIndex = Math.floor(Math.random() * this.colors.length);
        return this.colors[randomIndex];
    }
    gameLoop() {
        this.drawBoard();
        this.drawPill(this.pill);
        requestAnimationFrame(() => this.gameLoop());
    }
}
new Game();
export {};
//# sourceMappingURL=script2.js.map