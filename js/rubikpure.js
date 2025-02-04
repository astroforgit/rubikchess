class Face {
    static SIZE = 60;

    constructor(cube, type) {
        this.cube = cube;
        this.type = type;
        this.node = document.createElement('div');
        this.node.className = `face ${['left', 'right', 'top', 'bottom', 'front', 'back'][type]}`;
        this.applyTransform();
    }

    applyTransform() {
        const size = Face.SIZE;
        const transforms = {
            0: () => `translateX(-${size}px) rotateY(-90deg)`,    // Left
            1: () => `translateX(${size}px) rotateY(90deg)`,      // Right
            2: () => `translateY(-${size}px) rotateX(90deg)`,     // Top
            3: () => `translateY(${size}px) rotateX(-90deg)`,     // Bottom
            4: () => `translateZ(${size}px)`,                     // Front
            5: () => `translateZ(-${size}px) rotateY(180deg)`     // Back
        };
        
        this.node.style.transformOrigin = this.getTransformOrigin();
        this.node.style.transform = transforms[this.type]();
    }

    getTransformOrigin() {
        return {
            0: 'right',
            1: 'left',
            2: 'bottom',
            3: 'top'
        }[this.type] || 'center';
    }
}

class Cube {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.node = document.createElement('div');
        this.node.className = 'cube';
        this.createFaces();
        this.updatePosition();
    }

    createFaces() {
        // Only create faces on cube surfaces
        if (this.x === 0) this.addFace(0); // Left
        if (this.x === 2) this.addFace(1); // Right
        if (this.y === 0) this.addFace(2); // Top
        if (this.y === 2) this.addFace(3); // Bottom
        if (this.z === 0) this.addFace(4); // Front
        if (this.z === 2) this.addFace(5); // Back
    }

    addFace(type) {
        const face = new Face(this, type);
        this.node.appendChild(face.node);
    }

    updatePosition() {
        const offset = 60; // (3-1)*60/2
        this.node.style.transform = `translate3d(
            ${this.x * 60 - offset}px,
            ${this.y * 60 - offset}px,
            ${this.z * 60 - offset}px
        )`;
    }
}

class RubiksCube {
    constructor(container) {
        this.SIZE = 3;
        this.cubes = [];
        this.rotation = Quaternion.fromRotation([1, 0, 0], -35)
                          .multiply(Quaternion.fromRotation([0, 1, 0], 45));
        this.container = container;
        this.init();
    }

    init() {        
        for (let z = 0; z < this.SIZE; z++) {
            for (let y = 0; y < this.SIZE; y++) {
                for (let x = 0; x < this.SIZE; x++) {
                    const cube = new Cube(x, y, z);
                    this.container.appendChild(cube.node);
                    this.cubes.push(cube);
                }
            }
        }
        
        this.updateRotation();
        this.addEventListeners();
    }

    updateRotation() {
        this.container.style.transform = `
            translateZ(300px)
            ${this.rotation.toRotation()}
        `;
    }

    addEventListeners() {
        let isDragging = false;
        let startX, startY;
        
        document.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            const rotY = Quaternion.fromRotation([0, 1, 0], dx * 0.5);
            const rotX = Quaternion.fromRotation([1, 0, 0], dy * 0.5);
            this.rotation = rotX.multiply(rotY).multiply(this.rotation);
            this.updateRotation();
            
            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener('mouseup', () => isDragging = false);
    }
}
window.addEventListener("load", (event) => {
    debugger; 
    const container = document.querySelector('.cube-container');
    new RubiksCube(container); 
  });
