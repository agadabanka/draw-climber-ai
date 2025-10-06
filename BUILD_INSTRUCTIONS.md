# Draw Climber - Step-by-Step Build Instructions

## Understanding the Core Mechanic

### What I Got Wrong
- ❌ Thought legs attach to the bottom of cube (like walking)
- ❌ Thought it was a "walking" motion with legs touching ground

### What It Actually Is
- ✅ **ARMS** (not legs) attach to the **SIDES** of the cube
- ✅ Like a **swimmer paddling** - arms rotate on the sides
- ✅ Cube moves forward by "swimming" with rotating arms
- ✅ The arms push against the ground/ramp like paddles

## Visual Reference
The reference image shows:
- A cube on a yellow/orange checkered ramp
- Two black curved arms on the **left and right SIDES** of the cube
- Arms rotate like a swimmer's arms doing freestyle stroke
- Arms push against the ramp surface to propel cube forward

## Build Plan - Step by Step

### Phase 1: Basic Physics Sim + Cube + Rotating Arms
**Goal:** Get a cube with two arms rotating on its sides. No movement yet, just rotation visualization.

**Tasks:**
1. Create a simple 3D scene with a stationary cube
2. Add two ARM attachment points on the LEFT and RIGHT sides of the cube
3. Arms should be curved/bent shapes (not straight lines)
4. Make arms rotate continuously around the attachment points
5. Visualize clearly: cube stays still, only arms rotate

**Success Criteria:**
- Cube is visible in 3D
- Two arms attached to left and right sides
- Arms rotate smoothly
- No other features yet

---

### Phase 2: Cube Movement with Arm-Ground Contact
**Goal:** Make the rotating arms actually push the cube forward when they touch the ground.

**Tasks:**
1. Add a flat ground plane
2. Implement physics: gravity pulls cube down to ground
3. Detect when arm tips touch the ground
4. When arm touches ground while rotating backward → push cube forward
5. When arm touches ground while rotating forward → no push (or slight drag)
6. Cube should bounce/slide realistically on ground

**Success Criteria:**
- Cube sits on ground due to gravity
- Rotating arms touch ground periodically
- Cube moves forward when arms push
- Movement looks like "swimming" on the ground
- Physics feels smooth and realistic

---

### Phase 3: Add Ramp with Collision
**Goal:** Replace flat ground with an angled ramp, maintain movement.

**Tasks:**
1. Create a sloped ramp (like in reference image)
2. Update collision detection for angled surface
3. Cube should slide down if not moving
4. Arms should still push cube up the ramp
5. Add checkered texture to ramp (yellow/orange pattern)

**Success Criteria:**
- Ramp is visible and angled
- Cube rests on ramp surface
- Arms push cube up the ramp
- No falling through ramp
- Looks like the reference image

---

### Phase 4: Add Obstacles
**Goal:** Add black box obstacles on the ramp for cube to climb over.

**Tasks:**
1. Place 3-5 black box obstacles on the ramp
2. Implement box-to-box collision detection
3. Cube should stop when hitting obstacle
4. Arms should be able to push cube OVER obstacles
5. Add proper collision resolution (top, sides, etc.)

**Success Criteria:**
- Obstacles visible on ramp
- Cube collides properly with obstacles
- Cube can climb over obstacles with arm pushing
- No glitches or falling through

---

### Phase 5: Polish and Refinement
**Goal:** Make it look and feel good.

**Tasks:**
1. Improve camera following
2. Add visual effects (trails, particles, etc.)
3. Tune physics parameters (arm rotation speed, push force, friction)
4. Add distance counter
5. Make it visually match reference image

---

## Current Code Structure to Remove/Simplify

### Remove These (Genetic Algorithm Parts):
- `src/ai/GeneticAlgorithm.js` - Remove entirely
- `src/ai/FitnessEvaluator.js` - Remove entirely
- `src/ai/Genome.js` - Remove entirely
- All GA-related code in `Game.jsx`
- Metrics tracking related to generations/fitness
- Population/evolution logic

### Keep These (Core Game Parts):
- `src/engine/Character.js` - But simplify (just x, y, vx, vy, armRotation)
- `src/engine/PhysicsEngine.js` - Core physics
- `src/engine/Obstacle.js` - For Phase 4
- `src/components/GameCanvas3D.jsx` - 3D rendering
- Basic controls (start/pause/reset)

### Simplify To:
```
src/
  components/
    Game.jsx              # Main game loop (no GA)
    GameCanvas3D.jsx      # 3D rendering
    Controls.jsx          # Start/Pause/Reset buttons
  engine/
    Character.js          # Cube + arm rotation state
    ArmSystem.js          # NEW: Arm geometry and rotation
    PhysicsEngine.js      # Gravity, collision, movement
    Obstacle.js           # Box obstacles (Phase 4)
```

## Key Technical Details

### Arm Attachment (Correct Understanding)
```javascript
// Arms attach to LEFT and RIGHT SIDES of cube
const armAttachmentPoints = {
  left: {
    x: -cubeSize/2,  // Left side of cube
    y: 0              // Center height
  },
  right: {
    x: cubeSize/2,   // Right side of cube
    y: 0             // Center height
  }
};
```

### Arm Rotation Mechanics
```javascript
// Arms rotate around attachment point
// Like a swimmer's freestyle stroke
armRotation += armRotationSpeed;  // Continuous rotation

// Arm shape: curved/bent, not straight
// When arm tip touches ground AND rotating backward → push cube forward
const armTipVelocity = calculateTangentialVelocity(armTip, armRotationSpeed);
if (armTipTouchingGround && armTipVelocity.x < 0) {
  // Push cube forward
  cube.vx += pushForce;
}
```

### Physics Forces
```javascript
// Gravity pulls cube down
cube.vy += gravity;

// Friction slows cube down
cube.vx *= frictionCoefficient;
cube.vy *= frictionCoefficient;

// Ground/ramp collision
if (cubeBottomTouchingGround) {
  cube.y = groundY - cubeSize/2;
  cube.vy = 0; // Stop falling
}

// Arm push force (when touching ground)
if (armTipTouchingGround && armMovingBackward) {
  cube.vx += armPushForce;
}
```

## Starting Fresh - Recommended Approach

1. **Create a new branch or new project** for the simplified version
2. **Start with Phase 1** - don't skip ahead
3. **Test each phase thoroughly** before moving to next
4. **No genetic algorithm** - just manual controls for arm rotation speed
5. **Focus on getting physics right** - the rest is easy after that

## Parameters to Tune (Eventually)

```javascript
const config = {
  // Cube
  cubeSize: 30,
  cubeMass: 1.0,

  // Arms
  armLength: 40,
  armRotationSpeed: 0.1,  // radians per frame
  armPushForce: 2.0,

  // Physics
  gravity: 0.5,
  friction: 0.98,
  groundFriction: 0.95,

  // Collision
  collisionTolerance: 5,  // pixels
};
```

## Key Files to Study

1. Reference image location: (provided by user - shows yellow ramp, cube with black arms)
2. Current working example: `http://localhost:5173/` (after `npm run dev`)
3. Three.js docs: https://threejs.org/docs/
4. React Three Fiber: https://docs.pmnd.rs/react-three-fiber/

## Common Pitfalls to Avoid

1. **Don't confuse arms with legs** - they're on the SIDES, not bottom
2. **Don't make arms straight** - they should be curved/bent like in reference
3. **Don't skip phases** - each builds on the previous
4. **Don't add complexity early** - keep it simple until basics work
5. **Don't forget coordinate systems** - screen Y is down, 3D Y is up

## Success Metrics (Per Phase)

- Phase 1: Can see cube with rotating arms
- Phase 2: Cube moves forward smoothly
- Phase 3: Cube climbs up ramp
- Phase 4: Cube climbs over obstacles
- Phase 5: Looks like reference image

## Next Session Starter

```bash
cd /Users/amithtudur/src/draw_climber/draw-climber-ai
git checkout -b simplified-build
# Remove GA files
rm -rf src/ai/
# Start fresh with Phase 1
npm run dev
```

---

**Remember:** The core mechanic is **SWIMMING WITH ARMS ON THE SIDES**, not walking with legs on the bottom. Think freestyle swimming stroke, but on a ramp instead of in water.
