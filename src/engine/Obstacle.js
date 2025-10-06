export class Obstacle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  static generateObstacles() {
    // Generate obstacles spread across a much larger distance
    const obstacles = [];
    const groundY = 530;
    const spacing = 180; // Space between obstacles
    const count = 50; // Generate many obstacles

    for (let i = 0; i < count; i++) {
      const x = 250 + (i * spacing);
      const height = Math.floor(Math.random() * 60) + 30; // 30-90px
      const y = groundY - height;
      const width = 100;
      obstacles.push(new Obstacle(x, y, width, height));
    }

    return obstacles;
  }
}
