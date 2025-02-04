class Quaternion {
    constructor(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
  
    static fromRotation(axis, angle) {
      const DEG2RAD = Math.PI / 180;
      const a = angle * DEG2RAD;
      const sin = Math.sin(a / 2);
      const cos = Math.cos(a / 2);
      
      return new this(
        axis[0] * sin,
        axis[1] * sin,
        axis[2] * sin,
        cos
      );
    }
  
    static fromUnit() {
      return new this(0, 0, 0, 1);
    }
  
    normalize() {
      const norm = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2 + this.w ** 2);
      return new this.constructor(
        this.x / norm,
        this.y / norm,
        this.z / norm,
        this.w / norm
      );
    }
  
    conjugate() {
      return new this.constructor(-this.x, -this.y, -this.z, this.w);
    }
  
    toString() {
      return [this.x, this.y, this.z, this.w].join(", ");
    }
  
    multiply(q) {
      const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
      const y = this.w * q.y + this.y * q.w + this.z * q.x - this.x * q.z;
      const z = this.w * q.z + this.z * q.w + this.x * q.y - this.y * q.x;
      const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
      
      return new this.constructor(x, y, z, w);
    }
  
    toAxis() {
      return [this.x, this.y, this.z];
    }
  
    toAngle() {
      const RAD2DEG = 180 / Math.PI;
      return RAD2DEG * 2 * Math.acos(this.w);
    }
  
    toRotation() {
      const axis = this.toAxis();
      const angle = this.toAngle();
      return `rotate3d(${axis[0].toFixed(10)},${axis[1].toFixed(10)},${axis[2].toFixed(10)},${angle.toFixed(10)}deg)`;
    }
  
    toRotations() {
      const RAD2DEG = 180 / Math.PI;
      const x = RAD2DEG * Math.atan2(2 * (this.w * this.x + this.y * this.z), 1 - 2 * (this.x ** 2 + this.y ** 2));
      const y = RAD2DEG * Math.asin(2 * (this.w * this.y - this.x * this.z));
      const z = RAD2DEG * Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y ** 2 + this.z ** 2));
  
      const format = (val) => (val < 0 ? val + 360 : val).toFixed(10);
      return `rotateX(${format(x)}deg) rotateY(${format(y)}deg) rotate(${format(z)}deg)`;
    }
  }