import { Sprite, Rectangle } from 'pixi.js';
import { Context } from '../Context';
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
    shootDelay: number;
    precisionFail: number;
};

export const defaultEnemyConfig: EnemyConfig = {
    speed: 5,
    health: 3,
    width: 60,
    height: 40,
    minSpeed: 3,
    degDelta: (2 * Math.PI) / 100,
    maxBullets: 1,
    maxSpeed: 5,
    shootDelay: 800,
    precisionFail: Math.PI / 4,
};

export class Enemy implements ISceneObject, ICollidable {
    private config: EnemyConfig = { ...defaultEnemyConfig };

    private spriteSource: string = 'warrior2.png';

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

        this.virtualObject = new VirtualObject(this, this.position);

        Context.subscribeCollidableSceneObject(this);
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
                this.direction
                    .clone()
                    .rotate(this.config.precisionFail * (Math.random() - 0.5)),
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
