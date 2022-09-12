import { Bounds, Container, DisplayObject, Rectangle } from 'pixi.js';
import GameScene from './scenes/Game';
import { ICollidable, ISceneObject, SceneManager } from './Manager';
import { Vector } from './math/Vector';
import GameOverScene from './scenes/GameOver';
import { VirtualObject } from './utils/VirtualObject';

export class Context {
    static globalContainer: Container;
    static bounds: Rectangle;
    private static sceneObjects: Array<ISceneObject> = [];
    private static collidables: Array<ICollidable> = [];

    static fieldWidth = window.screen.width;
    static fieldHeight = window.screen.height;

    private constructor() {}

    static initialize(width: number, height: number): void {
        Context.fieldWidth = width;
        Context.fieldHeight = height;
        Context.globalContainer = new Container();

        Context.bounds = new Rectangle(0, 0, width, height);
    }

    private static cleanup() {
        Context.globalContainer.removeAllListeners();
        Context.globalContainer.destroy({ children: true });

        Context.sceneObjects = [];
        Context.collidables = [];
    }

    public static setBounds(bounds: Rectangle) {
        Context.bounds = bounds;
        bounds.contains;
    }

    public static isWithinBounds(position: Vector) {
        if (!Context.bounds) return true;

        return Context.bounds.contains(position.x, position.y);
    }

    public static detectCollisions() {
        Context.collidables.forEach((collidableA, index) => {
            Context.collidables.slice(index + 1).forEach((collidableB) => {
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

    public static endGame() {
        SceneManager.changeScene(new GameOverScene());
    }

    public static restartGame() {
        Context.cleanup();
        Context.initialize(Context.fieldWidth, Context.fieldHeight);
        SceneManager.changeScene(new GameScene());
    }

    public static update(deltaTime: number) {
        Context.sceneObjects.forEach((object) => {
            object.update(deltaTime);
        });
        Context.detectCollisions();
    }

    public static subscribeCollidable = (collidable: ICollidable) => {
        Context.collidables.push(collidable);
    };

    public static subscribeSceneObject = (sceneObject: ISceneObject) => {
        Context.sceneObjects.push(sceneObject);
    };

    public static subscribeGraphics = (graphics: DisplayObject) => {
        Context.globalContainer.addChild(graphics);
    };

    public static unsubscribeCollidable = (collidable: ICollidable) => {
        const objIndex = Context.collidables.indexOf(collidable);
        if (objIndex > -1) {
            Context.collidables.splice(objIndex, 1);
        }
    };

    public static unsubscribeSceneObject = (sceneObject: ISceneObject) => {
        const objIndex = Context.sceneObjects.indexOf(sceneObject);
        if (objIndex > -1) {
            Context.sceneObjects.splice(objIndex, 1);
        }
    };

    public static unsubscribeGraphics = (graphics: DisplayObject) => {
        const graphicsIndex = Context.globalContainer.getChildIndex(graphics);
        Context.globalContainer.removeChildAt(graphicsIndex);
    };
}
