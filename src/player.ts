import { Bounds, Container, DisplayObject, Graphics, Sprite } from 'pixi.js';
import { Keyboard, KeyState } from './keyboard';
import { IScene, ISceneObject } from './manager';
import { Vector } from './math/Vector';
import { Key } from 'ts-key-enum';

export type PlayerConfig = {
    speed: number;
    health: number;
    width: number;
    height: number;
};

export const defaultPlayerConfig: PlayerConfig = {
    speed: 5,
    health: 10,
    width: 70,
    height: 50,
};

const keyPress = (key: Key | string) => () => Keyboard.isPressed(key);

export class Player implements ISceneObject {
    private graphics = new Graphics();
    private isInteractive: boolean = false;
    private config: PlayerConfig = { ...defaultPlayerConfig };
    private worldBounds?: Bounds;
    private spriteSource: string = 'nightraiderfixed.png';
    private sprites: Array<Sprite> = [];
    private container: Container;
    private fieldWidht: number = 0;
    private fieldHeight: number = 0;
    private virtualPositions: Array<Vector> = [];
    private minSpeed = 0.01;
    private maxSpeed = 30;
    private minVelocity = new Vector(1, 1).multiplyScalar(this.minSpeed);
    private degDelta = (2 * Math.PI) / 100;
    private subscribeCb: (obj: any) => void = () => {};

    velocity: Vector;
    direction: Vector;
    position: Vector;
    speed: number;

    Input = {
        MOVE_FORWARD: keyPress(Key.ArrowUp),
        MOVE_BACKWARDS: keyPress(Key.ArrowDown),
        ROTATE_LEFT: keyPress(Key.ArrowLeft),
        ROTATE_RIGHT: keyPress(Key.ArrowRight),
        SHOOT: keyPress(Key.ArrowDown),
    };

    constructor(x: number, y: number, worldBounds: Bounds) {
        this.position = new Vector(x, y);
        this.velocity = this.minVelocity.clone();
        this.direction = new Vector(1, 1);
        this.speed = 0;
        this.container = new Container();
        this.setBounds(worldBounds);
        // this.buildGraphics();
    }

    setBounds(bounds: Bounds) {
        this.worldBounds = bounds;

        const mask = new Graphics();
        mask.beginFill(0x00ff00, 0.2);
        const boundsRect = bounds.getRectangle();
        mask.drawRect(
            boundsRect.x,
            boundsRect.y,
            boundsRect.width,
            boundsRect.height
        );
        mask.endFill();

        this.container.mask = mask;
        this.position.set(boundsRect.x, boundsRect.y);

        this.fieldWidht = bounds.maxX - bounds?.minX;
        this.fieldHeight = bounds.maxY - bounds?.minY;

        this.virtualPositions = [
            new Vector(0, 0),
            new Vector(this.fieldWidht, 0),
            new Vector(-this.fieldWidht, 0),
            new Vector(0, this.fieldHeight),
            new Vector(0, -this.fieldHeight),
        ];

        this.sprites = this.virtualPositions.map((spritePosition) => {
            const tmpSprite = Sprite.from(this.spriteSource);
            tmpSprite.width = this.config.width;
            tmpSprite.height = this.config.height;
            this.container.addChild(tmpSprite);

            return tmpSprite;
        });
    }

    activate() {
        this.isInteractive = true;
    }

    deactivate() {
        this.isInteractive = false;
    }

    buildGraphics() {
        this.graphics.beginFill(0x00ff00);
        this.graphics.drawRect(
            this.position.x,
            this.position.y,
            this.config.width,
            this.config.height
        );
        this.graphics.endFill();
    }

    private get unitaryDirection() {
        return this.direction.clone().normalize();
    }

    handleInput(deltaTime: number) {
        const { Input } = this;
        let degs = 0;
        if (Input.ROTATE_LEFT()) degs -= this.degDelta;
        if (Input.ROTATE_RIGHT()) degs += this.degDelta;

        this.direction.rotate(degs);
        this.velocity.rotate(degs);

        if (Input.MOVE_BACKWARDS()) {
            this.velocity.addVector(
                this.unitaryDirection.multiplyScalar(
                    -this.config.speed * deltaTime
                )
            );
        }
        if (Input.MOVE_FORWARD()) {
            this.velocity.addVector(
                this.unitaryDirection.multiplyScalar(
                    +this.config.speed * deltaTime
                )
            );
        }
    }

    update(deltaTime: number): void {
        this.graphics.position.set(...this.position);
        if (!this.isInteractive) return;

        if (this.velocity.length == 0) {
            this.velocity = this.direction
                .clone()
                .normalize()
                .multiplyScalar(this.minSpeed);
        }

        this.handleInput(deltaTime);

        if (this.velocity.length > this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }

        this.position.addVector(this.velocity);

        this.sprites.forEach((sprite) => {
            sprite.anchor.set(0.5, 0.5);
            sprite.rotation = this.direction.angle();
        });

        this.sprites.forEach((sprite, index) => {
            const position = this.position
                .clone()
                .addVector(this.virtualPositions[index]);
            sprite.position.set(...position);
            if (this.isWithinBounds(position)) {
                this.position.set(position.x, position.y);
            }
        });

        this.velocity.addVector(
            this.velocity.clone().negate().multiplyScalar(0.05)
        );
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

    subscribe(subscribeCb: (object: DisplayObject) => void): void {
        // this.sprites.forEach(sprite => subscribeCb(sprite));
        subscribeCb(this.container);
        this.subscribeCb = subscribeCb;
    }
}
