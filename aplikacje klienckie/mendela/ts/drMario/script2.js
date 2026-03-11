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
            _this.clearPill(_this.pill);
            _this.movePill(_this.pill, 0, 1);
            _this.drawPill(_this.pill);
        }, 300);
        this.board = document.getElementById("board");
        this.ctx = this.board.getContext("2d");
        this.gameLoop();
        this.handleKeyDown();
    }
    Game.prototype.drawBoard = function () {
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
    Game.prototype.drawPill = function (pill) {
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
    };
    Game.prototype.getBlocks = function (pill) {
        if (pill.rotation === 0 || pill.rotation === 180) {
            return [
                { x: pill.x, y: pill.y },
                { x: pill.x + 1, y: pill.y },
            ];
        }
        else {
            return [
                { x: pill.x, y: pill.y },
                { x: pill.x, y: pill.y + 1 },
            ];
        }
    };
    Game.prototype.movePill = function (pill, dx, dy) {
        pill.x += dx;
        pill.y += dy;
        var blocks = this.getBlocks(pill);
        var maxY = Math.max.apply(Math, blocks.map(function (b) { return b.y; }));
        if (maxY > this.ROWS - 1) {
            pill.y -= 1;
            this.isPillFalling = false;
            this.drawPill(this.pill);
            this.pillsArr.push(this.pill);
            console.log(this.pillsArr);
            this.pill = new Pill(3, 1, this.getRandomColor(), this.getRandomColor());
        }
        this.checkColission();
    };
    Game.prototype.clearPill = function (pill) {
        if (this.pill.rotation === 0 || this.pill.rotation === 180) {
            this.ctx.clearRect(pill.x * this.CELL_SIZE, pill.y * this.CELL_SIZE, this.CELL_SIZE * 2, this.CELL_SIZE);
        }
        else {
            this.ctx.clearRect(pill.x * this.CELL_SIZE, pill.y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE * 2);
        }
    };
    Game.prototype.handleKeyDown = function () {
        var _this = this;
        document.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                _this.clearPill(_this.pill);
                _this.movePill(_this.pill, -1, 0);
            }
            else if (event.key === "ArrowRight") {
                _this.clearPill(_this.pill);
                _this.movePill(_this.pill, 1, 0);
            }
            else if (event.key === "ArrowDown") {
                _this.clearPill(_this.pill);
                _this.movePill(_this.pill, 0, 1);
            }
            else if (event.key === "ArrowUp") {
                _this.clearPill(_this.pill);
                _this.rotatePill(_this.pill);
            }
        });
    };
    Game.prototype.checkColission = function () {
        for (var i = 0; i < this.pillsArr.length; i++) {
            var otherPill = this.pillsArr[i];
            if (!otherPill)
                continue;
            var blocks = this.getBlocks(this.pill);
            for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
                var block = blocks_1[_i];
                var otherBlocks = this.getBlocks(otherPill);
                for (var _a = 0, otherBlocks_1 = otherBlocks; _a < otherBlocks_1.length; _a++) {
                    var otherBlock = otherBlocks_1[_a];
                    if (block.x === otherBlock.x && block.y === otherBlock.y) {
                        this.pill.y -= 1;
                        this.isPillFalling = false;
                        this.drawPill(this.pill);
                        this.pillsArr.push(this.pill);
                        this.pill = new Pill(3, 1, this.getRandomColor(), this.getRandomColor());
                        return;
                    }
                }
            }
        }
    };
    Game.prototype.rotatePill = function (pill) {
        this.clearPill(pill);
        pill.rotation = (pill.rotation + 90) % 360;
        this.drawPill(pill);
    };
    Game.prototype.getRandomColor = function () {
        var randomIndex = Math.floor(Math.random() * this.colors.length);
        return this.colors[randomIndex];
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.drawBoard();
        this.drawPill(this.pill);
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    return Game;
}());
new Game();
