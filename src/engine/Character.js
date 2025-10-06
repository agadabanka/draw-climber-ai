export class Character {
  constructor(x = 100, y = 450) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = 30; // Cube size (was radius for sphere)
    this.startX = x;
    this.rotation = 0; // Rotation angle of the cube
    this.angularVelocity = 0; // Rotation speed
  }

  reset(x = 100, y = 450) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.rotation = 0;
    this.angularVelocity = 0;
    this.startX = x;
  }

  getDistance() {
    return this.x - this.startX;
  }

  clone() {
    const char = new Character(this.x, this.y);
    char.vx = this.vx;
    char.vy = this.vy;
    char.rotation = this.rotation;
    char.angularVelocity = this.angularVelocity;
    char.startX = this.startX;
    return char;
  }
}
