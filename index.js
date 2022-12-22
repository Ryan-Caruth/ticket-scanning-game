//add a load event that will wait for all assests to be fully loaded before it executes code in it's callback function
window.addEventListener("load", function () {
  const canvas = document.getElementById("mycanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(canvas.height);

  //Create a class to manage user inputs
  class UserInputs {
    constructor() {
      //Adding and removing keys in array
      this.keys = [];
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowLeft" && this.keys.indexOf(e.key) === -1) ||
          (e.key === "ArrowRight" && this.keys.indexOf(e.key) === -1) ||
          (e.key === " " && this.keys.indexOf(e.key))
        ) {
          this.keys.push(e.key);
        }
        console.log(e.key, this.keys);
      });
      window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ") {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
        console.log(e.key, this.keys);
      });
    }
  }

  //Create a class to manage the barcode image properties
  class Player {
    //Don't want object to run off screen so input gameWidth and gameHeight as params
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      console.log(gameHeight);
      this.width = 200;
      this.height = 200;
      this.position = {
        x: 0,
        y: this.gameHeight - this.height,
      };
      this.scrollingSpeed = 0;
      this.image = document.getElementById("barcode");
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
    update(e, enemy) {
      this.position.x += this.scrollingSpeed;
      //Stop player from moving offscreen
      if (this.position.x < 0) {
        this.position.x = 0;
      }
      if (this.position.x > this.gameWidth - this.width) {
        this.position.x = this.gameWidth - this.width;
      }
      // console.log(this.position.x)
      if (e.keys.indexOf("ArrowRight") > -1) {
        this.scrollingSpeed = 2;
      } else if (e.keys.indexOf("ArrowLeft") > -1) {
        this.scrollingSpeed = -2;
      } else {
        this.scrollingSpeed = 0;
      }
      //If both keys are pressed at the same time then player does not move
      if (e.keys.includes("ArrowRight") && e.keys.includes("ArrowLeft")) {
        this.scrollingSpeed = 0;
        // console.log('Error, you are pressing to many keys')
      }
      //When spacebar is pressed on laser, barcode will disappear
      if (
        e.keys.indexOf(" ") > -1 &&
        enemy.position.y >= canvas.height - 194 &&
        enemy.position.y <= canvas.height - 144
      ) {
        enemy.status = 0;
      }
    }
  }

  //Create a class to manage the enemies
  class Enemy {
    constructor() {
      this.width = 200;
      this.height = 60;
      this.status = 1;
      this.position = {
        x: 0,
        y: 0,
      };
      this.velocity = {
        x: 0,
        y: 0,
      };
    }
    draw(context) {
      if (this.status === 1) {
        context.beginPath();
        context.rect(this.position.x, this.position.y, this.width, this.height);
        context.fillStyle = "green";
        context.fill();
        context.closePath();
      }
    }
    update(context) {
      if (this.status === 1) {
        this.position.y++;
        if (this.position.y > canvas.height - 144) {
          context.fillStyle = "red";
          context.fill();
        }
      }
    }
  }

  const enemy = new Enemy();
  const player = new Player(canvas.width, canvas.height);
  const scrollingKeys = new UserInputs();

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemy.draw(ctx);
    enemy.update(ctx);
    player.draw(ctx);
    player.update(scrollingKeys, enemy);
    requestAnimationFrame(animate);
  };
  animate();
});
