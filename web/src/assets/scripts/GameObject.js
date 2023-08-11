const GAME_OBJECTS = [];

//Game Object class - base class for all game objects
export class GameObject {
  constructor() {
    GAME_OBJECTS.push(this);
    this.timeDelta = 0; //  time between frames to be used for velocity, Unit: Millisecond， 1s = 1000ms
    this.hasStarted = false;
  }

  start() {
    //Only run once
    this.hasStarted = true;
  }

  update() {
    //Run every frame except the first
    if (!this.hasStarted) return;
  }

  onDestroy() {
    //Run before the game object is destroyed
  }

  destroy() {
    this.onDestroy();

    //Remove from the array
    if (GAME_OBJECTS.includes(this)) {
      GAME_OBJECTS.splice(GAME_OBJECTS.indexOf(this), 1);
    }
  }
}

//Definite Game loop - runs every frame
let lastTimeStamp; //last time stamp of the last frame
const step = timeStamp => {
  GAME_OBJECTS.forEach(gameObject => {
    //Run start() on the first frame
    if (!gameObject.hasStarted) {
      gameObject.hasStarted = true;
      gameObject.start();
    } else {
      //Run update() on every frame except the first
      gameObject.timeDelta = timeStamp - lastTimeStamp;
      gameObject.update();
    }
  });

  lastTimeStamp = timeStamp;
  //Run for the next frame
  requestAnimationFrame(step);
};

requestAnimationFrame(step); //Start the Game loop
