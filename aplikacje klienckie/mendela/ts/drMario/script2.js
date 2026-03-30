var Pill = /** @class */ (function () {
    function Pill(x, y, c1, c2) {
        this.rotation = 0;
        this.c1 = c1;
        this.c2 = c2;
        this.x = x;
        this.y = y;
    }
    return Pill;
}());
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.ROWS = 16;
        this.COLS = 10;
        this.CELL_SIZE = 40;
        this.colors = ["#f03a22", "#22a8f0", "#fccc47"];
        this.pill = new Pill(3, 1, this.getRandomColor(), this.getRandomColor());
        this.isPillFalling = true;
        this.pillsArr = [];
        this.interval = setInterval(function () {
            _this.movePill(_this.pill, 0, 1);
        }, 300);
        this.board = document.getElementById("board");
        this.ctx = this.board.getContext("2d");
        this.gameLoop();
        this.handleKeyDown();
    }
    Game.prototype.drawBoard = function () {
        this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        for (var x = 0; x <= this.COLS; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.CELL_SIZE, 0);
            this.ctx.lineTo(x * this.CELL_SIZE, this.ROWS * this.CELL_SIZE);
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
        }
        for (var y = 0; y <= this.ROWS; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.CELL_SIZE);
            this.ctx.lineTo(this.COLS * this.CELL_SIZE, y * this.CELL_SIZE);
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
        }
    };
    Game.prototype.drawPlacedPills = function () {
        for (var _i = 0, _a = this.pillsArr; _i < _a.length; _i++) {
            var block = _a[_i];
            this.drawBlock3D(block.x, block.y, block.color);
        }
    };
    Game.prototype.drawBlock3D = function (x, y, color) {
        var px = x * this.CELL_SIZE;
        var py = y * this.CELL_SIZE;
        var size = this.CELL_SIZE;
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
    };
    Game.prototype.drawPill = function (pill) {
        this.drawBlock3D(pill.x, pill.y, pill.c1);
        var offset = this.getSecondBlockOffset(pill);
        this.drawBlock3D(pill.x + offset.x, pill.y + offset.y, pill.c2);
    };
    Game.prototype.normalizeRotation = function (rotation) {
        return ((rotation % 360) + 360) % 360;
    };
    Game.prototype.getSecondBlockOffset = function (pill) {
        var rotation = this.normalizeRotation(pill.rotation);
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
    };
    Game.prototype.getBlocks = function (pill) {
        var offset = this.getSecondBlockOffset(pill);
        return [
            { x: pill.x, y: pill.y },
            { x: pill.x + offset.x, y: pill.y + offset.y },
        ];
    };
    Game.prototype.isOutOfBounds = function (blocks) {
        var _this = this;
        return blocks.some(function (block) {
            return block.x < 0 ||
                block.x >= _this.COLS ||
                block.y < 0 ||
                block.y >= _this.ROWS;
        });
    };
    Game.prototype.isCollidingWithPlacedPills = function (blocks) {
        for (var _i = 0, _a = this.pillsArr; _i < _a.length; _i++) {
            var otherBlock = _a[_i];
            for (var _b = 0, blocks_1 = blocks; _b < blocks_1.length; _b++) {
                var block = blocks_1[_b];
                if (block.x === otherBlock.x && block.y === otherBlock.y) {
                    return true;
                }
            }
        }
        return false;
    };
    Game.prototype.getCoordKey = function (x, y) {
        return "".concat(x, ":").concat(y);
    };
    Game.prototype.findMatches = function () {
        var colorAt = new Map();
        for (var _i = 0, _a = this.pillsArr; _i < _a.length; _i++) {
            var block = _a[_i];
            colorAt.set(this.getCoordKey(block.x, block.y), block.color);
        }
        var matched = new Set();
        for (var _b = 0, _c = this.pillsArr; _b < _c.length; _b++) {
            var block = _c[_b];
            var x = block.x, y = block.y, color = block.color;
            var leftColor = colorAt.get(this.getCoordKey(x - 1, y));
            if (leftColor !== color) {
                var runX = x;
                var horizontalRun = [];
                while (colorAt.get(this.getCoordKey(runX, y)) === color) {
                    horizontalRun.push(this.getCoordKey(runX, y));
                    runX += 1;
                }
                if (horizontalRun.length >= 4) {
                    for (var _d = 0, horizontalRun_1 = horizontalRun; _d < horizontalRun_1.length; _d++) {
                        var coord = horizontalRun_1[_d];
                        matched.add(coord);
                    }
                }
            }
            var topColor = colorAt.get(this.getCoordKey(x, y - 1));
            if (topColor !== color) {
                var runY = y;
                var verticalRun = [];
                while (colorAt.get(this.getCoordKey(x, runY)) === color) {
                    verticalRun.push(this.getCoordKey(x, runY));
                    runY += 1;
                }
                if (verticalRun.length >= 4) {
                    for (var _e = 0, verticalRun_1 = verticalRun; _e < verticalRun_1.length; _e++) {
                        var coord = verticalRun_1[_e];
                        matched.add(coord);
                    }
                }
            }
        }
        return matched;
    };
    Game.prototype.removeMatchedBlocks = function (matched) {
        var _this = this;
        this.pillsArr = this.pillsArr.filter(function (block) { return !matched.has(_this.getCoordKey(block.x, block.y)); });
    };
    Game.prototype.resolveMatches = function () {
        var matched = this.findMatches();
        if (matched.size > 0) {
            this.removeMatchedBlocks(matched);
        }
    };
    Game.prototype.lockCurrentPill = function () {
        this.isPillFalling = false;
        var currentBlocks = this.getBlocks(this.pill);
        var firstBlock = currentBlocks[0];
        var secondBlock = currentBlocks[1];
        if (!firstBlock || !secondBlock) {
            return;
        }
        this.pillsArr.push({ x: firstBlock.x, y: firstBlock.y, color: this.pill.c1 }, { x: secondBlock.x, y: secondBlock.y, color: this.pill.c2 });
        this.resolveMatches();
        this.pill = new Pill(3, 1, this.getRandomColor(), this.getRandomColor());
        var spawnedBlocks = this.getBlocks(this.pill);
        if (this.isCollidingWithPlacedPills(spawnedBlocks)) {
            clearInterval(this.interval);
            console.log("Game Over");
        }
    };
    Game.prototype.movePill = function (pill, dx, dy) {
        var prevX = pill.x;
        var prevY = pill.y;
        pill.x += dx;
        pill.y += dy;
        var blocks = this.getBlocks(pill);
        var hasCollision = this.isOutOfBounds(blocks) || this.isCollidingWithPlacedPills(blocks);
        if (!hasCollision) {
            return;
        }
        pill.x = prevX;
        pill.y = prevY;
        if (dy > 0) {
            this.lockCurrentPill();
        }
    };
    Game.prototype.clearPill = function (pill) {
        var blocks = this.getBlocks(pill);
        for (var _i = 0, blocks_2 = blocks; _i < blocks_2.length; _i++) {
            var block = blocks_2[_i];
            this.ctx.clearRect(block.x * this.CELL_SIZE, block.y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
        }
    };
    Game.prototype.handleKeyDown = function () {
        var _this = this;
        document.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                _this.movePill(_this.pill, -1, 0);
            }
            else if (event.key === "ArrowRight") {
                _this.movePill(_this.pill, 1, 0);
            }
            else if (event.key === "ArrowDown") {
                _this.movePill(_this.pill, 0, 1);
            }
            else if (event.key === "ArrowUp") {
                _this.rotatePill(_this.pill, "left");
            }
            else if (event.key === "Shift") {
                _this.rotatePill(_this.pill, "right");
            }
        });
    };
    Game.prototype.rotatePill = function (pill, direction) {
        var prevRotation = pill.rotation;
        pill.rotation = this.normalizeRotation(pill.rotation + (direction === "left" ? -90 : 90));
        var blocks = this.getBlocks(pill);
        var hasCollision = this.isOutOfBounds(blocks) || this.isCollidingWithPlacedPills(blocks);
        if (hasCollision) {
            pill.rotation = prevRotation;
        }
    };
    Game.prototype.getRandomColor = function () {
        var randomIndex = Math.floor(Math.random() * this.colors.length);
        return this.colors[randomIndex];
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.drawBoard();
        this.drawPlacedPills();
        this.drawPill(this.pill);
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    return Game;
}());
new Game();
