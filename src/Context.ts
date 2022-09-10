import { Bounds, Container, DisplayObject } from 'pixi.js';
import GameScene from './Game';
import { ICollidable, ISceneObject, SceneManager } from './Manager';
import { Vector } from './math/Vector';
import GameOverScene from './scenes/GameOver';
import { VirtualObject } from './VirtualObject';

export class Context {
    parentContainer: Container;
    bounds!: Bounds;
    private sceneObjects: Array<ISceneObject> = [];
    private collidables: Array<ICollidable> = [];

    fieldWidth = window.screen.width;
    fieldHeight = window.screen.height;

    constructor() {
        this.parentContainer = new Container();
    }

    setBounds(bounds: Bounds) {
        this.bounds = bounds;
    }

    isWithinBounds(position: Vector) {
        if (!this.bounds) return true;

        const { minX, maxX, minY, maxY } = this.bounds;
        return (
            position.x >= minX &&
            position.x <= maxX &&
            position.y >= minY &&
            position.y <= maxY
        );
    }

    detectCollisions() {
        this.collidables.forEach((collidableA, index) => {
            this.collidables.slice(index + 1).forEach((collidableB) => {
                const collision = VirtualObject.areColliding(
                    collidableA.getVirtualObject(),
                    collidableB.getVirtualObject()
                );

                if (collision) {
                    collidableA.onCollide(collidableB);
                    collidableB.onCollide(collidableA);
                }
            });
        });
    }

    endGame() {
        SceneManager.changeScene(new GameOverScene(this));
    }

    restartGame(){
        this.parentContainer.destroy();
        SceneManager.changeScene(new GameScene());
    }

    update(deltaTime: number) {
        this.sceneObjects.forEach((object) => {
            object.update(deltaTime);
        });
        this.detectCollisions();
    }

    subscribeCollidable = (collidable: ICollidable) => {
        this.collidables.push(collidable);
    };

    subscribeSceneObject = (sceneObject: ISceneObject) => {
        this.sceneObjects.push(sceneObject);
    };

    subscribeGraphics = (graphics: DisplayObject) => {
        this.parentContainer.addChild(graphics);
    };

    unsubscribeCollidable = (collidable: ICollidable) => {
        const objIndex = this.collidables.indexOf(collidable);
        if (objIndex > -1) {
            this.collidables.splice(objIndex, 1);
        }
    };

    unsubscribeSceneObject = (sceneObject: ISceneObject) => {
        const objIndex = this.sceneObjects.indexOf(sceneObject);
        if (objIndex > -1) {
            this.sceneObjects.splice(objIndex, 1);
        }
    };

    unsubscribeGraphics = (graphics: DisplayObject) => {
        const graphicsIndex = this.parentContainer.getChildIndex(graphics);
        this.parentContainer.removeChildAt(graphicsIndex);
    };
}
