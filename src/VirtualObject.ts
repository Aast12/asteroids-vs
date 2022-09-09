import { Bounds, DisplayObject, Sprite } from 'pixi.js';
import { Context } from './Context';
import { ISceneObject } from './manager';
import { Vector } from './math/Vector';

export class VirtualObject {
    public static areColliding(objA: VirtualObject, objB: VirtualObject) {}

    private position: Vector;
    private sourceObject: ISceneObject;
    private worldBounds: Bounds;
    private virtualCopies: Array<DisplayObject> = [];
    private virtualPositions: Array<Vector> = [];
    private context: Context;

    constructor(sourceObject: ISceneObject, position: Vector, bounds: Bounds, context: Context) {
        this.sourceObject = sourceObject;
        this.position = position;
        this.worldBounds = bounds;
        this.context = context;
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

    buildGraphics() {
        this.virtualCopies = this.virtualPositions.map((spritePosition) => {
            const tmpSprite = this.sourceObject.buildGraphics();
            this.context.subscribeGraphics(this.sourceObject.sceneObjectId, tmpSprite);
            return tmpSprite;
        });
    }

    get truePosition() {
        return 1;
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

    isWithinBounds(position: Vector) {
        if (!this.worldBounds) return true;
        const { minX, maxX, minY, maxY } = this.worldBounds;
        return (
            position.x >= minX &&
            position.x <= maxX &&
            position.y >= minY &&
            position.y <= maxY
        );
    }

    render() {
        this.virtualCopies.forEach((object, index) => {
            const position = this.position
                .clone()
                .addVector(this.virtualPositions[index]);

            object.position.set(...position);
            if (this.isWithinBounds(position)) {
                this.position.set(position.x, position.y);
            }
        });
    }

    update() {
        this.render();
    }
}
