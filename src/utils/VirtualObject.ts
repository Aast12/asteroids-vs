import { Container, DisplayObject, Rectangle, Sprite } from 'pixi.js';
import { Context } from '../Context';
import { ISceneObject } from '../Manager';
import { Vector } from '../math/Vector';
import { isThereCollision } from './utils';

export class VirtualObject {
    private position: Vector;
    private sourceObject: ISceneObject;
    private worldBounds!: Rectangle;
    virtualCopies: Array<DisplayObject> = [];
    private virtualPositions: Array<Vector> = [];

    private container: Container = new Container();
    released = false;

    constructor(sourceObject: ISceneObject, position: Vector) {
        this.sourceObject = sourceObject;
        this.position = position;

        this.setBounds(Context.bounds);
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

    setBounds(bounds: Rectangle) {
        this.worldBounds = bounds;

        const { fieldWidth, fieldHeight } = Context;

        this.virtualPositions = [
            new Vector(0, 0),
            new Vector(fieldWidth, 0),
            new Vector(-fieldWidth, 0),
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
        Context.subscribeGraphics(this.container);
    }

    release() {
        this.released = true;
        Context.unsubscribeGraphics(this.container);
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

        const { top, right, left, bottom } = this.worldBounds;

        if (this.position.x < left) this.position.setX(right);
        if (this.position.y > bottom) this.position.setY(top);
        if (this.position.x > right) this.position.setX(left);
        if (this.position.y < top) this.position.setY(bottom);
    }

    update() {
        this.render();
    }
}
