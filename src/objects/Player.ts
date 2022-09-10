import { Bounds, Container, Rectangle, Sprite } from 'pixi.js';
import { Keyboard } from '../Keyboard';
import { ICollidable, ISceneObject } from '../Manager';
import { Vector } from '../math/Vector';
import { Key } from 'ts-key-enum';
import { Bullet } from './Bullet';
import { Context } from '../Context';
import { VirtualObject } from '../utils/VirtualObject';

export type PlayerConfig = {
    speed: number;
    health: number;
    width: number;
    height: number;
    minSpeed: number;
    maxSpeed: number;
    degDelta: number;
    maxBullets: number;
    frictionFactor: number;
    shootDelay: number;
};

export const defaultPlayerConfig: PlayerConfig = {
    speed: 5,
    health: 3,
    width: 70,
    height: 50,
    minSpeed: 0.1,
    degDelta: (2 * Math.PI) / 100,
    maxBullets: 1,
    maxSpeed: 5,
    frictionFactor: 0.02,
    shootDelay: 500,
};

const keyPress = (key: Key | string) => () => Keyboard.isPressed(key);

export class Player implements ISceneObject, ICollidable {
    private isInteractive: boolean = false;
    private config: PlayerConfig = { ...defaultPlayerConfig };

    private spriteSource: string = 'nightraiderfixed.png';
    private container: Container;

    private minVelocity = new Vector(1, 1).multiplyScalar(this.config.minSpeed);
    private bullets: Array<Bullet> = [];

    private virtualObject: VirtualObject;

    sceneObjectId = 'player';
    velocity: Vector;
    direction: Vector;
    position: Vector;
    speed: number;
    lastShoot?: number;
    health: number;

    get healthTint() {
        switch (this.health) {
            case 3:
                return 0xe8cd31;
            case 2:
                return 0xe88d31;
            case 1:
                return 0xff0000;
        }

        return null;
    }

    Input = {
        MOVE_FORWARD: keyPress(Key.ArrowUp),
        MOVE_BACKWARDS: keyPress(Key.ArrowDown),
        ROTATE_LEFT: keyPress(Key.ArrowLeft),
        ROTATE_RIGHT: keyPress(Key.ArrowRight),
        SHOOT: keyPress(Key.Enter),
    };

    constructor(x: number, y: number) {
        this.position = new Vector(x, y);
        this.velocity = this.minVelocity.clone();
        this.direction = new Vector(1, 1);
        this.speed = 0;
        this.health = this.config.health;
        this.container = new Container();
        
        this.setBounds(Context.bounds);

        this.virtualObject = new VirtualObject(this, this.position);

        Context.subscribeSceneObject(this);
        Context.subscribeGraphics(this.container);
        Context.subscribeCollidable(this);
    }

    onCollide(_: ICollidable): void {
        if (this.health <= 0) Context.endGame();

        this.virtualObject.updateGraphics((sprite: Sprite) => {
            if (this.healthTint) sprite.tint = this.healthTint;
        });

        this.health--;
    }

    getVirtualObject(): VirtualObject {
        return this.virtualObject;
    }

    setBounds(bounds: Rectangle) {
        console.log('BOUNDS', bounds);
        this.position.set(
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2
        );
    }

    buildGraphics = () => {
        const tmpSprite = Sprite.from(this.spriteSource);
        tmpSprite.width = this.config.width;
        tmpSprite.height = this.config.height;

        return tmpSprite;
    };

    activate() {
        this.isInteractive = true;
    }

    deactivate() {
        this.isInteractive = false;
    }

    private get unitaryDirection() {
        return this.direction.clone().normalize();
    }

    handleInput(deltaTime: number) {
        const { Input } = this;
        let degs = 0;
        if (Input.ROTATE_LEFT()) degs -= this.config.degDelta;
        if (Input.ROTATE_RIGHT()) degs += this.config.degDelta;

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
        if (Input.SHOOT()) {
            if (
                !this.lastShoot ||
                Date.now() - this.lastShoot > this.config.shootDelay
                //this.bullets.length != this.config.maxBullets
            ) {
                const newBullet = new Bullet(
                    this.position
                        .clone()
                        .addVector(this.direction.clone().multiplyScalar(50)),
                    this.direction.clone(),
                    Math.max(this.velocity.length, this.config.speed)
                );

                this.bullets.push(newBullet);
                this.lastShoot = Date.now();
            }
        }
    }

    private bulletValidation() {
        this.bullets = this.bullets.filter((bullet) => bullet.alive);
    }

    update(deltaTime: number): void {
        if (!this.isInteractive) return;

        if (this.velocity.length == 0) {
            this.velocity = this.direction
                .clone()
                .normalize()
                .multiplyScalar(this.config.minSpeed);
        }

        this.handleInput(deltaTime);

        if (this.velocity.length > this.config.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.config.maxSpeed);
        }

        this.position.addVector(this.velocity);
        this.virtualObject.move(this.velocity);

        this.velocity.addVector(
            this.velocity
                .clone()
                .negate()
                .multiplyScalar(this.config.frictionFactor)
        );

        this.virtualObject.setRotation(this.direction.angle());
        this.virtualObject.update();
        this.bulletValidation();
    }
}
