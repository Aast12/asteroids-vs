import { DisplayObject, Graphics } from 'pixi.js';
import { Context } from './Context';
import { ICollidable, ISceneObject } from './Manager';
import { Vector } from './math/Vector';
import { VirtualObject } from './VirtualObject';

export class Bullet implements ISceneObject, ICollidable {
    position!: Vector;
    private direction!: Vector;
    private size: number = 10;
    private context!: Context;
    private virtualObject!: VirtualObject;

    alive = false;

    constructor(
        position: Vector,
        direction: Vector,
        speed: number = 10,
        context: Context
    ) {
        this.init(position, direction, speed, context);
    }

    onCollide = (_: ICollidable): void => {
        this.deactivate();
    };

    getVirtualObject(): VirtualObject {
        return this.virtualObject;
    }

    init(
        position: Vector,
        direction: Vector,
        speed: number = 2,
        context: Context
    ) {
        this.alive = true;
        this.position = position;
        this.direction = direction.normalize().multiplyScalar(speed);
        this.buildGraphics();
        this.context = context;
        this.virtualObject = new VirtualObject(this, this.position, context);

        this.context.subscribeSceneObject(this);
        this.context.subscribeCollidable(this);
    }

    buildGraphics() {
        const graphics = new Graphics();
        graphics.beginFill(0xffffff);
        graphics.drawCircle(0, 0, this.size);
        graphics.endFill();

        return graphics;
    }

    deactivate() {
        this.alive = false;
        this.context.unsubscribeSceneObject(this);
        this.context.unsubscribeCollidable(this);
        this.virtualObject.release();
    }

    update(deltaTime: number): void {
        const deltaPos = this.direction.clone().multiplyScalar(deltaTime);
        this.position.addVector(deltaPos);
        this.virtualObject.move(deltaPos);

        this.virtualObject.update();
    }
}
