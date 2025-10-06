export class Character {
  constructor(x = 100, y = 450) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = 30; // Cube size
    this.startX = x;
    this.armRotation = 0; // Rotation angle of the ARM (not the cube!)
    this.armAngularVelocity = 0; // Rotation speed of the arm
  }

  reset(x = 100, y = 450) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.armRotation = 0;
    this.armAngularVelocity = 0;
    this.startX = x;
  }

  getDistance() {
    return this.x - this.startX;
  }

  clone() {
    const char = new Character(this.x, this.y);
    char.vx = this.vx;
    char.vy = this.vy;
    char.armRotation = this.armRotation;
    char.armAngularVelocity = this.armAngularVelocity;
    char.startX = this.startX;
    return char;
  }
}
