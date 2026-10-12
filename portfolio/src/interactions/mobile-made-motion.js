export const mobileMadeMotion = {
  idleSpeed: 12,
  dragSensitivity: 1,
  friction: .94,
  velocitySmoothing: .35,
  idleBlendRate: 8,
  gestureThreshold: 6,
  velocityLimit: 1800,
  sampleMinSeconds: .004,
  wheelVelocityGain: 5,
};

export class MobileMadeInertia {
  constructor(config = mobileMadeMotion) {
    this.config = config; this.velocity = 0; this.dragging = false; this.baseBlend = 1; this.lastMove = 0;
  }
  get decayRate() { return -Math.log(this.config.friction) * 60; }
  start(time) { this.dragging = true; this.velocity = 0; this.lastMove = time; }
  drag(delta, time) {
    const travel = delta * this.config.dragSensitivity;
    const elapsed = Math.max(this.config.sampleMinSeconds, (time - this.lastMove) / 1000);
    const sample = Math.max(-this.config.velocityLimit, Math.min(this.config.velocityLimit, travel / elapsed));
    this.velocity += (sample - this.velocity) * this.config.velocitySmoothing;
    this.lastMove = time;
    return travel;
  }
  end(time) {
    if (!this.dragging) return;
    this.velocity *= Math.exp(-this.decayRate * Math.max(0, time - this.lastMove) / 1000);
    this.dragging = false;
  }
  addVelocity(delta) { this.velocity += delta * this.config.wheelVelocityGain; }
  step(elapsed) {
    const target = this.dragging ? 0 : 1;
    this.baseBlend += (target - this.baseBlend) * (1 - Math.exp(-this.config.idleBlendRate * elapsed));
    const decay = Math.exp(-this.decayRate * elapsed);
    const extra = this.dragging ? 0 : this.velocity * (1 - decay) / this.decayRate;
    if (!this.dragging) this.velocity *= decay;
    return this.config.idleSpeed * this.baseBlend * elapsed + extra;
  }
}
