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

type PlacedBlock = {
  x: number;
  y: number;
  color: string;
};

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
  pillsArr: PlacedBlock[] = [];

  drawBoard() {
    this.ctx.clearRect(0, 0, this.board.width, this.board.height);

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

  drawPlacedPills() {
    for (const block of this.pillsArr) {
      this.drawBlock3D(block.x, block.y, block.color);
    }
  }

  drawBlock3D(x: number, y: number, color: string) {
    const px = x * this.CELL_SIZE;
    const py = y * this.CELL_SIZE;
    const size = this.CELL_SIZE;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(px, py, size, size);

    this.ctx.strokeStyle = "#141414";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(px + 1, py + 1, size - 2, size - 2);

    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(px + 3, py + size - 3);
    this.ctx.lineTo(px + 3, py + 3);
    this.ctx.lineTo(px + size - 3, py + 3);
    this.ctx.stroke();

    this.ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    this.ctx.beginPath();
    this.ctx.moveTo(px + size - 3, py + 3);
    this.ctx.lineTo(px + size - 3, py + size - 3);
    this.ctx.lineTo(px + 3, py + size - 3);
    this.ctx.stroke();

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    this.ctx.fillRect(px + 6, py + 6, size * 0.35, size * 0.2);
  }

  drawPill(pill: Pill) {
    this.drawBlock3D(pill.x, pill.y, pill.c1);

    const offset = this.getSecondBlockOffset(pill);
    this.drawBlock3D(pill.x + offset.x, pill.y + offset.y, pill.c2);
  }

  normalizeRotation(rotation: number) {
    return ((rotation % 360) + 360) % 360;
  }

  getSecondBlockOffset(pill: Pill) {
    const rotation = this.normalizeRotation(pill.rotation);
    if (rotation === 0) {
      return { x: 1, y: 0 };
    }
    if (rotation === 90) {
      return { x: 0, y: 1 };
    }
    if (rotation === 180) {
      return { x: -1, y: 0 };
    }
    return { x: 0, y: -1 };
  }

  getBlocks(pill: Pill) {
    const offset = this.getSecondBlockOffset(pill);
    return [
      { x: pill.x, y: pill.y },
      { x: pill.x + offset.x, y: pill.y + offset.y },
    ];
  }

  isOutOfBounds(blocks: { x: number; y: number }[]) {
    return blocks.some(
      (block) =>
        block.x < 0 ||
        block.x >= this.COLS ||
        block.y < 0 ||
        block.y >= this.ROWS,
    );
  }

  isCollidingWithPlacedPills(blocks: { x: number; y: number }[]) {
    for (const otherBlock of this.pillsArr) {
      for (const block of blocks) {
        if (block.x === otherBlock.x && block.y === otherBlock.y) {
          return true;
        }
      }
    }

    return false;
  }

  getCoordKey(x: number, y: number) {
    return `${x}:${y}`;
  }

  findMatches() {
    const colorAt = new Map<string, string>();
    for (const block of this.pillsArr) {
      colorAt.set(this.getCoordKey(block.x, block.y), block.color);
    }

    const matched = new Set<string>();

    for (const block of this.pillsArr) {
      const { x, y, color } = block;

      const leftColor = colorAt.get(this.getCoordKey(x - 1, y));
      if (leftColor !== color) {
        let runX = x;
        const horizontalRun: string[] = [];

        while (colorAt.get(this.getCoordKey(runX, y)) === color) {
          horizontalRun.push(this.getCoordKey(runX, y));
          runX += 1;
        }

        if (horizontalRun.length >= 4) {
          for (const coord of horizontalRun) {
            matched.add(coord);
          }
        }
      }

      const topColor = colorAt.get(this.getCoordKey(x, y - 1));
      if (topColor !== color) {
        let runY = y;
        const verticalRun: string[] = [];

        while (colorAt.get(this.getCoordKey(x, runY)) === color) {
          verticalRun.push(this.getCoordKey(x, runY));
          runY += 1;
        }

        if (verticalRun.length >= 4) {
          for (const coord of verticalRun) {
            matched.add(coord);
          }
        }
      }
    }

    return matched;
  }

  removeMatchedBlocks(matched: Set<string>) {
    this.pillsArr = this.pillsArr.filter(
      (block) => !matched.has(this.getCoordKey(block.x, block.y)),
    );
  }

  resolveMatches() {
    const matched = this.findMatches();
    if (matched.size > 0) {
      this.removeMatchedBlocks(matched);
    }
  }

  lockCurrentPill() {
    this.isPillFalling = false;
    const currentBlocks = this.getBlocks(this.pill);
    const firstBlock = currentBlocks[0];
    const secondBlock = currentBlocks[1];

    if (!firstBlock || !secondBlock) {
      return;
    }

    this.pillsArr.push(
      { x: firstBlock.x, y: firstBlock.y, color: this.pill.c1 },
      { x: secondBlock.x, y: secondBlock.y, color: this.pill.c2 },
    );
    this.resolveMatches();

    this.pill = new Pill(
      3,
      1,
      this.getRandomColor() as string,
      this.getRandomColor() as string,
    );

    const spawnedBlocks = this.getBlocks(this.pill);
    if (this.isCollidingWithPlacedPills(spawnedBlocks)) {
      clearInterval(this.interval);
      console.log("Game Over");
    }
  }

  movePill(pill: Pill, dx: number, dy: number) {
    const prevX = pill.x;
    const prevY = pill.y;

    pill.x += dx;
    pill.y += dy;
    const blocks = this.getBlocks(pill);

    const hasCollision =
      this.isOutOfBounds(blocks) || this.isCollidingWithPlacedPills(blocks);

    if (!hasCollision) {
      return;
    }

    pill.x = prevX;
    pill.y = prevY;

    if (dy > 0) {
      this.lockCurrentPill();
    }
  }

  clearPill(pill: Pill) {
    const blocks = this.getBlocks(pill);
    for (const block of blocks) {
      this.ctx.clearRect(
        block.x * this.CELL_SIZE,
        block.y * this.CELL_SIZE,
        this.CELL_SIZE,
        this.CELL_SIZE,
      );
    }
  }

  handleKeyDown() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        this.movePill(this.pill, -1, 0);
      } else if (event.key === "ArrowRight") {
        this.movePill(this.pill, 1, 0);
      } else if (event.key === "ArrowDown") {
        this.movePill(this.pill, 0, 1);
      } else if (event.key === "ArrowUp") {
        this.rotatePill(this.pill, "left");
      } else if (event.key === "Shift") {
        this.rotatePill(this.pill, "right");
      }
    });
  }

  interval = setInterval(() => {
    this.movePill(this.pill, 0, 1);
  }, 300);

  rotatePill(pill: Pill, direction: "left" | "right") {
    const prevRotation = pill.rotation;

    pill.rotation = this.normalizeRotation(
      pill.rotation + (direction === "left" ? -90 : 90),
    );

    const blocks = this.getBlocks(pill);
    const hasCollision =
      this.isOutOfBounds(blocks) || this.isCollidingWithPlacedPills(blocks);

    if (hasCollision) {
      pill.rotation = prevRotation;
    }
  }

  getRandomColor() {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  gameLoop() {
    this.drawBoard();
    this.drawPlacedPills();
    this.drawPill(this.pill);
    requestAnimationFrame(() => this.gameLoop());
  }
}

new Game();
