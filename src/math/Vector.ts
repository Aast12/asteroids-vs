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
        if (isNaN(this.x) || isNaN(this.y)) throw "FUCKED UP AT SET";
        return this;
    }

    setX(x: number): Vector {
        this.x = x;
        if (isNaN(this.x) || isNaN(this.y)) throw "FUCKED UP AT SET X";
        return this;
    }

    setY(y: number): Vector {
        this.y = y;

        if (isNaN(this.x) || isNaN(this.y)) throw "FUCKED UP AT SET Y";
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
        if (isNaN(this.x) || isNaN(this.y)) throw "FUCKED UP AT SETLEN";
    }


    normalize(): Vector {
        const currentMag = this.length;
        if (currentMag == 0) return this;

        this.x /= currentMag;
        this.y /= currentMag;

        if (isNaN(this.x) || isNaN(this.y)) throw "FUCKED UP AT NORMALIZE";
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
        if (isNaN(this.x) || isNaN(this.y)) throw "FUCKED UP AT MULT";
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

    *[ Symbol.iterator ]() {
		yield this.x;
		yield this.y;
	}

}

export { Vector };