class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    set(x: number, y: number): Vector {
        this.x = x;
        this.y = y;

        return this;
    }

    setX(x: number): Vector {
        this.x = x;

        return this;
    }

    setY(y: number): Vector {
        this.y = y;

        return this;
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }

    negate(): Vector {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }


    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setLength(newLen: number): Vector {
        return this.normalize().multiplyScalar(newLen);
    }


    normalize(): Vector {
        const currentMag = this.length;
        if (currentMag == 0) return this;

        this.x /= currentMag;
        this.y /= currentMag;

        return this;
    }

    addScalar(scalar: number): Vector {
        this.x += scalar;
        this.y += scalar;

        return this;
    }

    multiplyScalar(scalar: number): Vector {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }
    
    divideScalar(scalar: number): Vector {
        return this.divideScalar(1 / scalar);
    }

    clamp(min: Vector, max: Vector ) {
		this.x = Math.max( min.x, Math.min( max.x, this.x ) );
		this.y = Math.max( min.y, Math.min( max.y, this.y ) );
		return this;
	}

    clampLen(minLen: number, maxLen: number): Vector {
        const len = this.length;

        return this.divideScalar(len || 1).multiplyScalar(
            Math.max(minLen, Math.min(maxLen, length))
        );
    }

    addVector(vector: Vector): Vector {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }

    subVector(vector: Vector): Vector {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }

    dot(vector: Vector): number {
        return this.x * vector.x + this.y * vector.y;
    }

    distanceTo(vector: Vector): number {
        const sqXDiff = Math.pow(this.x - vector.x, 2);
        const sqYDiff = Math.pow(this.y - vector.y, 2);

        return Math.sqrt(sqXDiff + sqYDiff);
    }

    rotate(radians: number): Vector {
        const c = Math.cos(radians), s = Math.sin(radians);
        
        const vX = this.x * c - this.y * s;
        const vY = this.x * s + this.y * c;
        
        return this.set(vX, vY);
    }

    equals(vector: Vector) {
        return this.x == vector.x && this.y == vector.y;
    }

    angle(): number {
     return Math.atan2(this.y, this.x);   
    }

    *[ Symbol.iterator ]() {
		yield this.x;
		yield this.y;
	}

}

export { Vector };