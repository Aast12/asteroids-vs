import { Context } from '@app/Context';
import { ISceneObject, ICollidable } from '@app/Manager';
import { Vector } from '@app/math/Vector';
import { VirtualObject } from '@app/utils/VirtualObject';
import { Graphics } from 'pixi.js';

export class Bullet implements ISceneObject, ICollidable {
    position!: Vector;
    private direction!: Vector;
    private size: number = 10;
    private virtualObject!: VirtualObject;

    alive = false;

    constructor(position: Vector, direction: Vector, speed: number = 10) {
        this.init(position, direction, speed);
    }

    onCollide = (_: ICollidable): void => {
        this.deactivate();
    };

    getVirtualObject(): VirtualObject {
        return this.virtualObject;
    }

    init(position: Vector, direction: Vector, speed: number = 2) {
        this.alive = true;
        this.position = position;
        this.direction = direction.normalize().multiplyScalar(speed);
        this.buildGraphics();
        this.virtualObject = new VirtualObject(this, this.position);

        Context.subscribeSceneObject(this);
        Context.subscribeCollidable(this);
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
        Context.unsubscribeSceneObject(this);
        Context.unsubscribeCollidable(this);
        this.virtualObject.release();
    }

    update(deltaTime: number): void {
        const deltaPos = this.direction.clone().multiplyScalar(deltaTime);
        this.position.addVector(deltaPos);
        this.virtualObject.move(deltaPos);

        this.virtualObject.update();
    }
}
