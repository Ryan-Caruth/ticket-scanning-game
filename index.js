//add a load event that will wait for all assests to be fully loaded before it executes code in it's callback function
window.addEventListener("load", function () {
  const canvas = document.getElementById("mycanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  //Create a class to manage user inputs
  class UserInputs {
    constructor() {
      //Adding and removing keys in array
      this.keys = [];
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowLeft" && this.keys.indexOf(e.key) === -1) ||
          (e.key === "ArrowRight" && this.keys.indexOf(e.key) === -1)
        ) {
          this.keys.push(e.key);
        }
        // console.log(e.key, this.keys);
      });
      window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
        // console.log(e.key, this.keys);
      });
    }
  }

  //Create a class to manage the barcode image properties
  class Player {
    //Don't want object to run off screen so input gameWidth and gameHeight as params
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
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
    update(e) {
      this.position.x += this.scrollingSpeed;
      //Stop player from moving offscreen
      if (this.position.x < 0) {
        this.position.x = 0;
      }
      if (this.position.x > this.gameWidth - this.width) {
        this.position.x = this.gameWidth - this.width
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
    }
  }
  const player = new Player(canvas.width, canvas.height);
  const scrollingKeys = new UserInputs();

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    player.update(scrollingKeys);
    requestAnimationFrame(animate);
  };
  animate();
});
