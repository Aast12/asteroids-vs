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
    speed: 1,
    health: 10,
    width: 70,
    height: 50,
};

export class Player implements ISceneObject {
    private graphics = new Graphics();
    private isInteractive: boolean = false;
    private config: PlayerConfig = { ...defaultPlayerConfig };
    private worldBounds?: Bounds;
    private obstacles: Array<DisplayObject | Bounds> = [];
    private sprites = new Array(5)
        .fill(null)
        .map((_) => Sprite.from('nightraiderfixed.png'));
    private container: Container;

    velocity: Vector;
    direction: Vector;
    position: Vector;
    speed: number;

    constructor(x: number, y: number) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(1, 1);
        this.direction = new Vector(1, 1);
        this.speed = 0;
        this.container = new Container();
        this.sprites.forEach((sprite) => {
            sprite.width = this.config.width;
            sprite.height = this.config.height;
            this.container.addChild(sprite);
        });

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
        // this.container.addChild(mask);

        this.container.mask = mask;
        this.position.set(boundsRect.x, boundsRect.y);
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

    update(deltaTime: number): void {
        this.graphics.position.set(...this.position);
        if (!this.isInteractive) return;

        let traslation = new Vector(0, 0);
        let degs = 0;
        let magChange = 0;
        const degDelta = (2 * Math.PI) / 100;
        if (Keyboard.isPressed(Key.ArrowLeft)) {
            degs -= degDelta;

            // traslation.setX(-this.config.speed * deltaTime);
        }
        if (Keyboard.isPressed(Key.ArrowRight)) {
            degs += degDelta;
            // traslation.setX(this.config.speed * deltaTime);
        }
        if (Keyboard.isPressed(Key.ArrowDown)) {
            this.speed -= this.config.speed * deltaTime;
            // traslation.setY(this.config.speed * deltaTime);
        }
        if (Keyboard.isPressed(Key.ArrowUp)) {
            this.speed += this.config.speed * deltaTime;
            // traslation.setY(-this.config.speed * deltaTime);
        }

        const c = Math.cos(degs),
            s = Math.sin(degs);
        // console.log('COS', c, s);
        // console.log('VELOCITY PRE', this.velocity);
        const vX = this.direction.x * c - this.direction.y * s;
        const vY = this.direction.x * s + this.direction.y * c;
        this.direction.set(vX, vY);

        // console.log('VELOCITY', this.velocity);
        // console.log(this.graphics)

        this.sprites.forEach((sprite) => {
            sprite.anchor.set(0.5, 0.5);
            sprite.rotation = Math.atan2(this.direction.y, this.direction.x);
        });

        const speed_dir = this.speed / Math.max(1, Math.abs(this.speed));
        // console.log(speed_dir);

        this.speed = speed_dir * Math.min(Math.abs(this.speed), 5);

        // console.log(this.speed);
        this.velocity = this.direction
            .clone()
            .normalize()
            .multiplyScalar(this.speed);

        // this.graphics.position.set(this.position.x, this.position.y)
        // this.velocity.addVector(traslation);
        // this.velocity.multiplyScalar(0.5)
        this.position.addVector(this.velocity);

        if (this.worldBounds) {
            // console.log(this.worldBounds)
            // this.position.clamp(
            //     new Vector(this.worldBounds.minX, this.worldBounds.minY),
            //     new Vector(
            //         this.worldBounds.maxX - this.config.width,
            //         this.worldBounds.maxY - this.config.height
            //     )
            // );
        }
        const mainSpritePos = new Vector(
            this.position.x + this.config.width / 2,
            this.position.y + this.config.height / 2
        );
        const fieldWidht =
            (this.worldBounds?.maxX ?? 0) - (this.worldBounds?.minX ?? 0);
        const fieldHeight =
            (this.worldBounds?.maxY ?? 0) - (this.worldBounds?.minY ?? 0);
        const spritePositions = [
            new Vector(0, 0),
            new Vector(fieldWidht, 0),
            new Vector(-fieldWidht, 0),
            new Vector(0, fieldHeight),
            new Vector(0, -fieldHeight),
        ];
        this.sprites.forEach((sprite, index) => {
            const position = this.position
                .clone()
                .addVector(spritePositions[index]);
            sprite.position.set(...position);
            if (this.isWithinBounds(position))  {
                this.position.set(position.x, position.y);
            }
        });

        this.velocity.addVector(
            this.velocity.clone().negate().multiplyScalar(0.2)
        );
        this.speed = this.velocity.length;
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
    }
}
