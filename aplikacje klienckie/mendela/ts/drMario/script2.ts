class Pill {
  constructor(x: number, y: number, c1: string, c2: string) {
    this.c1 = c1;
    this.c2 = c2;
    this.x = x;
    this.y = y;
  }
  rotation: number = 0;
  x: number;
  y: number;
  c1: string;
  c2: string;
}
class Game {
  constructor() {
    this.board = document.getElementById("board") as HTMLCanvasElement;
    this.ctx = this.board.getContext("2d")!;
    this.gameLoop();
    this.handleKeyDown();
  }
  board: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ROWS: number = 16;
  COLS: number = 10;
  CELL_SIZE: number = 40;
  colors: string[] = ["#f03a22", "#22a8f0", "#fccc47"];
  pill: Pill = new Pill(
    3,
    1,
    this.getRandomColor() as string,
    this.getRandomColor() as string,
  );
  isPillFalling: boolean = true;
  pillsArr: Pill[] = [];

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

  drawPill(pill: Pill) {
    this.ctx.beginPath();
    this.ctx.fillStyle = pill.c1;
    this.ctx.fillRect(
      pill.x * this.CELL_SIZE,
      pill.y * this.CELL_SIZE,
      this.CELL_SIZE,
      this.CELL_SIZE,
    );
    this.ctx.fillStyle = pill.c2;
    if (pill.rotation === 0 || pill.rotation === 180) {
      this.ctx.fillRect(
        pill.x * this.CELL_SIZE + this.CELL_SIZE,
        pill.y * this.CELL_SIZE,
        this.CELL_SIZE,
        this.CELL_SIZE,
      );
    } else {
      this.ctx.fillRect(
        pill.x * this.CELL_SIZE,
        pill.y * this.CELL_SIZE + this.CELL_SIZE,
        this.CELL_SIZE,
        this.CELL_SIZE,
      );
    }
  }

  getBlocks(pill: Pill) {
    if (pill.rotation === 0 || pill.rotation === 180) {
      return [
        { x: pill.x, y: pill.y },
        { x: pill.x + 1, y: pill.y },
      ];
    } else {
      return [
        { x: pill.x, y: pill.y },
        { x: pill.x, y: pill.y + 1 },
      ];
    }
  }

  movePill(pill: Pill, dx: number, dy: number) {
    pill.x += dx;
    pill.y += dy;
    const blocks = this.getBlocks(pill);
    let maxY = Math.max(...blocks.map((b) => b.y));

    if (maxY > this.ROWS - 1) {
      pill.y -= 1;
      this.isPillFalling = false;
      this.drawPill(this.pill);
      this.pillsArr.push(this.pill);
      console.log(this.pillsArr);
      this.pill = new Pill(
        3,
        1,
        this.getRandomColor() as string,
        this.getRandomColor() as string,
      );
    }
    this.checkColission();
  }

  clearPill(pill: Pill) {
    if (this.pill.rotation === 0 || this.pill.rotation === 180) {
      this.ctx.clearRect(
        pill.x * this.CELL_SIZE,
        pill.y * this.CELL_SIZE,
        this.CELL_SIZE * 2,
        this.CELL_SIZE,
      );
    } else {
      this.ctx.clearRect(
        pill.x * this.CELL_SIZE,
        pill.y * this.CELL_SIZE,
        this.CELL_SIZE,
        this.CELL_SIZE * 2,
      );
    }
  }

  handleKeyDown() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        this.clearPill(this.pill);
        this.movePill(this.pill, -1, 0);
      } else if (event.key === "ArrowRight") {
        this.clearPill(this.pill);
        this.movePill(this.pill, 1, 0);
      } else if (event.key === "ArrowDown") {
        this.clearPill(this.pill);
        this.movePill(this.pill, 0, 1);
      } else if (event.key === "ArrowUp") {
        this.clearPill(this.pill);
        this.rotatePill(this.pill);
      }
    });
  }

  interval = setInterval(() => {
    this.clearPill(this.pill);
    this.movePill(this.pill, 0, 1);
    this.drawPill(this.pill);
  }, 300);

  checkColission() {
    for (let i = 0; i < this.pillsArr.length; i++) {
      let otherPill = this.pillsArr[i];
      if (!otherPill) continue;
      const blocks = this.getBlocks(this.pill);

      for (let block of blocks) {
        const otherBlocks = this.getBlocks(otherPill);

        for (let otherBlock of otherBlocks) {
          if (block.x === otherBlock.x && block.y === otherBlock.y) {
            this.pill.y -= 1;
            this.isPillFalling = false;
            this.drawPill(this.pill);
            this.pillsArr.push(this.pill);
            this.pill = new Pill(
              3,
              1,
              this.getRandomColor() as string,
              this.getRandomColor() as string,
            );
            return;
          }
        }
      }
    }
  }

  rotatePill(pill: Pill) {
    this.clearPill(pill);
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
