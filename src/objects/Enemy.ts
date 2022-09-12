import { Container, Sprite, Rectangle } from 'pixi.js';
import { Key } from 'ts-key-enum';
import { Context } from '../Context';
import { Keyboard } from '../Keyboard';
import { ISceneObject, ICollidable } from '../Manager';
import { Vector } from '../math/Vector';
import { VirtualObject } from '../utils/VirtualObject';
import { Bullet } from './Bullet';
import { Player } from './Player';

export type EnemyConfig = {
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

export const defaultEnemyConfig: EnemyConfig = {
    speed: 5,
    health: 3,
    width: 70,
    height: 50,
    minSpeed: 3,
    degDelta: (2 * Math.PI) / 100,
    maxBullets: 1,
    maxSpeed: 5,
    frictionFactor: 0.02,
    shootDelay: 500,
};

const keyPress = (key: Key | string) => () => Keyboard.isPressed(key);

export class Enemy implements ISceneObject, ICollidable {
    private isInteractive: boolean = false;
    private config: EnemyConfig = { ...defaultEnemyConfig };

    private spriteSource: string = 'warrior2.png';
    private container: Container;

    private minVelocity = new Vector(1, 1).multiplyScalar(this.config.minSpeed);
    private bullets: Array<Bullet> = [];

    private virtualObject: VirtualObject;

    private target: Player;
    private targetDistance: number = Infinity;

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

    // dbg: Graphics;

    constructor(position: Vector, target: Player) {
        this.position = position.clone();
        this.velocity = this.minVelocity.clone();
        this.direction = new Vector(1, 1);
        this.speed = 0;
        this.health = this.config.health;
        this.target = target;
        this.container = new Container();

        // this.setBounds(Context.bounds);
        // this.dbg = new Graphics();

        this.virtualObject = new VirtualObject(this, this.position);

        // this.container.addChild(this.dbg)
        Context.subscribeCollidableSceneObject(this);
        // Context.subscribeGraphics(this.container);
        // Context.subscribeGraphics(this.dbg);
    }

    onCollide(source: ICollidable): void {
        if (!(source instanceof Bullet)) return;

        if (this.health <= 0) {
            this.virtualObject.release();
            Context.unsubscribeCollidableSceneObject(this);
            // Context.unsubscribeGraphics(this.container);
        }

        this.virtualObject.updateGraphics((sprite: Sprite) => {
            if (this.healthTint) sprite.tint = this.healthTint;
        });

        this.health--;
    }

    getVirtualObject(): VirtualObject {
        return this.virtualObject;
    }

    setBounds(bounds: Rectangle) {
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

    private computeDirection() {
        const closerCopy = this.target
            .getVirtualObject()
            .virtualCopies.sort((obja, objb) => {
                const distA = this.position
                    .clone()
                    .subVector(
                        new Vector(obja.position.x, obja.position.y)
                    ).length;
                const distB = this.position
                    .clone()
                    .subVector(
                        new Vector(objb.position.x, objb.position.y)
                    ).length;

                return distA - distB;
            })[0];

        const closerCopyPos = new Vector(
            closerCopy.position.x,
            closerCopy.position.y
        );

        this.direction = closerCopyPos.subVector(this.position);
        this.targetDistance = this.direction.length;
        this.direction.normalize();
    }

    private shoot() {
        if (
            !this.lastShoot ||
            Date.now() - this.lastShoot > this.config.shootDelay
        ) {
            const newBullet = new Bullet(
                this.virtualObject.truePosition
                    .clone()
                    .addVector(
                        this.direction
                            .clone()
                            .multiplyScalar(
                                Math.max(this.config.width, this.config.height)
                            )
                    ),
                this.direction.clone(),
                Math.max(this.velocity.length, this.config.speed)
            );

            this.bullets.push(newBullet);
            this.lastShoot = Date.now();
        }
    }

    update(deltaTime: number): void {
        this.computeDirection();

        this.virtualObject.setRotation(this.direction.angle());

        if (this.velocity.length == 0) {
            this.velocity = this.direction
                .clone()
                .normalize()
                .multiplyScalar(this.config.minSpeed)
                .multiplyScalar(deltaTime);
        }

        if (this.targetDistance < 400) {
            this.shoot();
        } else {
            const mov = this.direction.clone().normalize().multiplyScalar(2);
            this.position.addVector(mov);

            this.virtualObject.move(mov);
        }

        this.virtualObject.update();
    }
}
