var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");
canvas.width = 1600;
canvas.height = 720;
var wCooldown = 1000;
var jump = false;
var attackOne = false;
var attackOneTimer = 100;
var duck = false;
var duckTimer = 0;
var enemies = [];
var enemyInterval = 0;
var playerMoveRight = false;
var shoot = 0;
var arrows = [];
var gameOver = false;
var score = 0;

class Player {
  // Create the player
  constructor(gameWidth, gameHeight) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.height = 80;
    this.width = 120;
    this.x = -180;
    this.y = this.gameHeight - this.height - 30;
    this.frameX = 0;
    this.frameY = 0;
    this.image = document.getElementById("playerImageIdle");
    this.frameTimer = 0;
    this.frameStagger = 10;
    this.vy = 0;
    this.jumpFrame = 0;
  }

  restart() {
    // Reset player position on game restart
    this.x = -180;
    this.y = this.gameHeight - this.height - 30;
    this.image = document.getElementById("playerImageIdle");
    this.frameX = 0;
    jump = false;
  }

  draw(context) {
    // Draw the player on the canvas
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width + 500,
      this.height - 500
    );
  }

  update() {
    // Change player position / animation based on user inputs
    if (!gameOver) {
      // horizontal movement animation
      if (
        (input.keys.indexOf("d") != -1 || input.keys.indexOf("a") != -1) &&
        !attackOne &&
        !duck
      ) {
        if (input.keys.indexOf("d") != -1) {
          this.image = document.getElementById("playerImageRun");
          playerMoveRight = true;
          background.update();
          enemyInterval++;
          if (this.x < 400) {
            this.x += 3;
          }
        } else if (input.keys.indexOf("a") != -1 && this.x > -180) {
          this.image = document.getElementById("playerImageRunBack");
          this.x -= 3;
          playerMoveRight = false;
        }
        if (this.frameTimer % this.frameStagger == 0) {
          if (this.frameX <= 8) this.frameX++;
          else this.frameX = 0;
          this.frameTimer++;
        } else this.frameTimer++;
      } else {
        if (player.onGround())
          this.image = document.getElementById("playerImageIdle");
        if (this.frameTimer % this.frameStagger == 0) {
          if (this.frameX <= 8) this.frameX++;
          else this.frameX = 0;
          this.frameTimer++;
        } else this.frameTimer++;
        playerMoveRight = false;
      }

      // vertical movement animation
      if (jump && this.y > 290 && !attackOne) {
        this.vy = -10;
        this.y += this.vy;
        this.frameX = 0;
        this.image = document.getElementById("jumpUpImage");
        if (this.y === 290) jump = false;
      } else if (!this.onGround()) {
        this.frameX = 0;
        this.image = document.getElementById("jumpDownImage");
        this.vy = +10;
        this.y += this.vy;
      }

      // attack animation
      if (attackOne) {
        jump = false;
        this.image = document.getElementById("attackOneImage");
        if (this.frameTimer % this.frameStagger == 0) {
          if (this.frameX <= 2) this.frameX++;
          else this.frameX = 0;
          this.frameTimer++;
        } else this.frameTimer++;
        if (this.frameX > 2) (attackOne = false), (this.frameStagger = 10);
      }

      if (duck) {
        this.image = document.getElementById("crouchImage");
        if (this.frameTimer % this.frameStagger == 0) {
          if (this.frameX <= 2) this.frameX++;
          else this.frameX = 0;
          this.frameTimer++;
        } else this.frameTimer++;
        if (this.frameX > 2) (duck = false), (this.frameStagger = 10);
      }
    } else {
      if (this.frameTimer % 30 == 0) {
        if (this.frameX <= 8) this.frameX++;
        this.frameTimer++;
      } else this.frameTimer++;
    }
  }
  onGround() {
    return this.y === 610;
  }
}

class InputHandler {
  // listen for keyboard inputs from user
  constructor() {
    // listen for movement inputs
    this.keys = [];
    window.addEventListener("keydown", (e) => {
      if (e.key === "a" || e.key === "s" || e.key === "d") {
        this.keys.push(e.key);
      } else if (e.key === "Enter" && gameOver) restartGame();
    });
    window.addEventListener("keyup", (e) => {
      if (this.keys.indexOf(e.key) != -1) {
        this.keys.splice(this.keys.indexOf(e.key));
      }
    });

    // listen for jump input
    window.addEventListener("keydown", (e) => {
      if (e.key === "w" && player.onGround() && wCooldown > 75) {
        jump = true;
        wCooldown = 0;
      } else if (e.key === "q") {
        if (attackOneTimer > 300) {
          attackOneTimer = 0;
          attackOne = true;
          player.frameX = 0;
          player.frameStagger = 30;
        }
      }
    });

    // listen for crouch input
    window.addEventListener("keydown", (e) => {
      if (e.key === "s" && duckTimer > 100) {
        duck = true;
        duckTimer = 0;
        player.frameX = 0;
        player.frameStagger = 30;
      }
    });

    // add touch control functionality
    window.addEventListener("touchstart", (e) => {
      console.log("start");
    });
    window.addEventListener("touchmove", (e) => {
      console.log("moving");
    });
    window.addEventListener("touchend", (e) => {
      console.log("end");
    });
  }
}

class Background {
  // create the background that scrolls as player moves left
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.image = document.getElementById("backgroundImage");
    this.x = 0;
    this.y = 0;
    this.width = 580;
    this.height = 290;
    this.speed = 7;
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.x,
      this.y,
      this.gameWidth,
      this.gameHeight
    );
    context.drawImage(
      this.image,
      this.x + this.gameWidth,
      this.y,
      this.gameWidth,
      this.gameHeight
    );
  }
  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.gameWidth) this.x = 0;
  }
  restart() {
    this.x = 0;
  }
}

function displayStatusText(context) {
  if (!gameOver) {
    context.font = "40px Helvetica";
    context.fillStyle = "black";

    // display crouch cooldown text
    var crouchCooldown = "READY";
    if (duckTimer < 100) (crouchCooldown = "NOT READY"), (crouchColour = "red");
    else (crouchCooldown = "READY"), (crouchColour = "lime");
    context.fillText("Crouch: " + crouchCooldown, 20, 50);
    context.fillStyle = crouchColour;
    context.fillText("Crouch: " + crouchCooldown, 22, 52);

    // display attack cooldown text
    context.fillStyle = "black";
    var attackCooldown = "READY";
    if (attackOneTimer < 300)
      (attackCooldown = "NOT READY"), (attackColour = "red");
    else (attackCooldown = "READY"), (attackColour = "lime");
    context.fillText("Attack: " + attackCooldown, 500, 50);
    context.fillStyle = attackColour;
    context.fillText("Attack: " + attackCooldown, 502, 52);

    // display score
    context.fillStyle = "black";
    context.fillText("Score: " + score, 1000, 50);
    context.fillStyle = "white";
    context.fillText("Score: " + score, 1002, 52);
  } else {
    // display game over status message
    context.fillStyle = "black";
    context.fillText(
      "GAME OVER! Hit Enter to Restart.",
      canvas.width / 2 - 200,
      300
    );
    context.fillStyle = "white";
    context.fillText(
      "GAME OVER! Hit Enter to Restart.",
      canvas.width / 2 - 200 + 2,
      302
    );
    context.fillStyle = "black";
    context.fillText("Score: " + score, 1000, 50);
    context.fillStyle = "white";
    context.fillText("Score: " + score, 1002, 52);
  }
}

class Enemy {
  // create the enemy archers
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.width = 870 / 8;
    this.height = 512 / 4;
    this.image = document.getElementById("enemyArcherImage");
    this.x = this.gameWidth;
    this.y = this.gameHeight - this.height + 37;
    this.frameX = 0;
    this.frameY = 3;
    this.maxFrame = 6;
    this.frameTimer = 0;
    this.frameStagger = 20;
    this.speed = 3;
    this.markedForDeletion = false;
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width + 200,
      this.height - 500
    );
  }
  move() {
    this.x -= this.speed;
  }
  update() {
    if (this.frameTimer % this.frameStagger === 0) {
      if (this.frameX <= this.maxFrame) this.frameX++;
      else (this.frameX = 0), this.frameTimer++;
    }
    this.frameTimer++;

    // mark for deletion if hit
    if (this.x <= player.x + this.width + player.width + 250 && attackOne) {
      this.markedForDeletion = true;
    }

    // delete enemy
    if (this.markedForDeletion) {
      enemies.shift();
      score++;
    }

    // shoot arrow at last frame
    if (this.frameX === this.maxFrame) {
      shoot++;
      if (shoot === 20) {
        shoot = 0;
        arrows.push(new Arrow(this.x, this.y)); // create a new arrow
      }
    }
  }
}

class Arrow {
  // create arrows
  constructor(startX, startY) {
    this.image = document.getElementById("arrow");
    this.x = startX;
    this.y = startY;
    this.width = 329;
    this.height = 160;
  }
  draw(context) {
    context.drawImage(
      this.image,
      0,
      0,
      this.width - 30,
      this.height,
      this.x,
      this.y - 250,
      100,
      100
    );
  }
  update() {
    this.x -= 10;
  }
}

function handleArrows() {
  // Create new arrows and delete arrows as they exit the canvas
  arrows.forEach((arrow) => {
    arrow.draw(ctx);
    arrow.update();

    // delete arrow if it goes off screen
    if (arrow.x < 0) {
      arrows.shift();
    }
    // if arrow hits person, kill person
    if (
      arrow.x <= player.x + player.width + 150 &&
      arrow.x >= player.x + player.width + 100 &&
      !duck
    ) {
      gameOver = true;
    }
  });
}

function handleEnemies() {
  // Create new enemies at a random interval
  if (enemyInterval > Math.random() * 500 + 300) {
    enemies.push(new Enemy(canvas.width, canvas.height));
    enemyInterval = 0;
  }
  enemies.forEach((enemy) => {
    enemy.draw(ctx);
    enemy.update();
    if (playerMoveRight) {
      enemy.move();
    }
  });
}

function gameOverHandler() {
  // reset game when player dies
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  enemies.forEach((enemy) => {
    enemy.speed = 0;
    enemy.frameStagger = NaN;
  });
  background.draw(ctx);
  player.image = document.getElementById("deadImage");
  player.update();
  player.draw(ctx);
  player.update();
  handleEnemies();
  displayStatusText(ctx);
}

const player = new Player(canvas.width, canvas.height);
const input = new InputHandler();
const background = new Background(canvas.width, canvas.height);

function restartGame() {
  player.restart();
  background.restart();
  enemies = [];
  score = 0;
  arrows = [];
  gameOver = false;
}

function animate() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    displayStatusText(ctx);
    player.draw(ctx);
    player.update();
    handleEnemies();
    handleArrows();
    attackOneTimer++;
    wCooldown++;
    duckTimer++;
    requestAnimationFrame(animate);
  } else {
    gameOverHandler();
    requestAnimationFrame(animate);
  }
}
animate();
