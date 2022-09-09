import { Container, DisplayObject } from 'pixi.js';
import { ISceneObject } from './manager';

export class Context {
    parentContainer: Container;
    private sceneObjects: Array<ISceneObject> = [];
    // private sceneObjects: Map<string, ISceneObject> = new Map();
    // private sceneObjectGraphics: Map<string, Array<string>> = new Map();

    constructor() {
        this.parentContainer = new Container();
    }

    subscribeSceneObject(sceneObject: ISceneObject) {
        // if (this.sceneObjects.has(id))
        //     throw new Error(`Scene with id ${id} already subscribed`);

        // this.sceneObjects.set(id, sceneObject);

    }

    subscribeGraphics = (graphics: DisplayObject) => {
        // graphics.name = `${id}.${Date.now()}` // unique graphics id with sceneobj id
        // const prev = this.sceneObjectGraphics.get(id) ?? []
        // this.sceneObjectGraphics.set(id, [...prev, graphics.name]);
        this.parentContainer.addChild(graphics);
    };

    update(deltaTime: number) {
        this.sceneObjects.forEach((object) => object.update(deltaTime));
    }

    // unsubscribeAndDestroy = (id: string) => {
    //     this.sceneObjectGraphics.get(id)?.forEach(graphicsName => {
    //         const graphicsObj = this.parentContainer.getChildByName(graphicsName);
    //         const childIdx = this.parentContainer.getChildIndex(graphicsObj);
    //         this.parentContainer.removeChildAt(childIdx);
    //     })
    // };
}
