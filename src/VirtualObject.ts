import { Bounds, Container, DisplayObject, Sprite } from 'pixi.js';
import { Bullet } from './Bullet';
import { Context } from './Context';
import { ISceneObject } from './Manager';
import { Vector } from './math/Vector';
import { Player } from './player';
import { isThereCollision } from './utils';

type TestT = Bullet | Player;
export class VirtualObject {
    private position: Vector;
    private sourceObject: ISceneObject;
    private worldBounds!: Bounds;
    virtualCopies: Array<DisplayObject> = [];
    private virtualPositions: Array<Vector> = [];
    private context: Context;
    private container: Container = new Container();
    released = false;

    constructor(
        sourceObject: ISceneObject,
        position: Vector,
        context: Context
    ) {
        this.sourceObject = sourceObject;
        this.position = position;
        this.context = context;

        this.setBounds(this.context.bounds);
        this.buildGraphics();
    }

    public static areColliding(objA: VirtualObject, objB: VirtualObject) {
        const posA = new Vector(objA.truePosition.x, objA.truePosition.y);
        const posB = new Vector(objB.truePosition.x, objB.truePosition.y);
        const trueA = objA.virtualCopies.find((obj) =>
            new Vector(obj.x, obj.y).equals(posA)
        );
        const trueB = objB.virtualCopies.find((obj) =>
            new Vector(obj.x, obj.y).equals(posB)
        );

        if (!trueA || !trueB) return false;
        return isThereCollision(trueA, trueB);
    }

    setBounds(bounds: Bounds) {
        this.worldBounds = bounds;
        const boundsRect = bounds.getRectangle();
        const fieldWidht = boundsRect.width;
        const fieldHeight = boundsRect.height;

        this.virtualPositions = [
            new Vector(0, 0),
            new Vector(fieldWidht, 0),
            new Vector(-fieldWidht, 0),
            new Vector(0, fieldHeight),
            new Vector(0, -fieldHeight),
        ];
    }

    updateGraphics(updateFn: (obj: any) => void) {
        this.virtualCopies.forEach(updateFn);
    }

    buildGraphics() {
        this.virtualCopies = this.virtualPositions.map((_) => {
            const tmpGraphics = this.sourceObject.buildGraphics();
            this.container.addChild(tmpGraphics);
            return tmpGraphics;
        });
        this.context.subscribeGraphics(this.container);
    }

    release() {
        this.released = true;
        this.context.unsubscribeGraphics(this.container);
    }

    get truePosition() {
        return this.position;
    }

    setRotation(radians: number) {
        this.virtualCopies.forEach((object) => {
            if (object instanceof Sprite) {
                object.anchor.set(0.5, 0.5);
                object.rotation = radians;
            }
        });
    }

    setPosition(position: Vector) {
        this.position.set(position.x, position.y);
    }

    move(movement: Vector) {
        this.position.addVector(movement);
    }

    render() {
        this.virtualCopies.forEach((object, index) => {
            const position = this.position
                .clone()
                .addVector(this.virtualPositions[index]);

            object.position.set(...position);
        });

        if (this.position.x < this.worldBounds.minX)
            this.position.setX(this.worldBounds.maxX);

        if (this.position.y < this.worldBounds.minY)
            this.position.setY(this.worldBounds.maxY);

        if (this.position.x > this.worldBounds.maxX)
            this.position.setX(this.worldBounds.minX);

        if (this.position.y > this.worldBounds.maxY)
            this.position.setY(this.worldBounds.minY);
    }

    update() {
        this.render();
    }
}
