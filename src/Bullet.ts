import { DisplayObject, Graphics } from 'pixi.js';
import { Context } from './Context';
import { ISceneObject } from './manager';
import { Vector } from './math/Vector';

export class Bullet implements ISceneObject {
    private position: Vector;
    private direction: Vector;
    private speed: number;
    private graphics: Graphics = new Graphics();
    private size: number = 10;
    private context: Context;


    // sceneObjectId: string;

    constructor(position: Vector, direction: Vector, speed: number = 10, context: Context) {
        this.position = position;
        // this.position = new Vector(0, 0);
        this.direction = direction.normalize().multiplyScalar(speed);
        this.speed = speed;
        this.buildGraphics();
        this.context = context;

        this.context.subscribeGraphics(this.graphics);
    }

    buildGraphics() {
        this.graphics.clear();
        this.graphics.beginFill(0xffffff);
        this.graphics.drawCircle(0, 0, this.size);
        this.graphics.endFill();

        return this.graphics;
    }

    update(deltaTime: number): void {
        this.position.addVector(this.direction.multiplyScalar(deltaTime));
        this.graphics.position.set(...this.position);
    }

    subscribe(subscribeCb: (object: DisplayObject) => void): void {
        subscribeCb(this.graphics);
    }
}
