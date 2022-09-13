import {
    Application,
    IApplicationOptions,
    Ticker,
    DisplayObject,
} from 'pixi.js';
import { VirtualObject } from './utils/VirtualObject';

/**
 * Manejador de escenas del juego, permite cambiar escenas y actualizar su estado.
 */
export class SceneManager {
    private constructor() {}

    private static app: Application;
    private static currentScene: IScene;

    private static _width: number;
    private static _height: number;

    static get width(): number {
        return SceneManager._width;
    }

    static get height(): number {
        return SceneManager._height;
    }

    static initialize(
        width: number,
        height: number,
        background: number,
        customOptions?: IApplicationOptions
    ): void {
        SceneManager._width = width;
        SceneManager._height = height;

        SceneManager.app = new Application({
            view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: background,
            width: width,
            height: height,
            ...customOptions,
        });

        SceneManager.app.ticker = Ticker.shared;
        SceneManager.app.ticker.add(SceneManager.update);
    }

    static changeScene(newScene: IScene): void {
        if (SceneManager.currentScene) {
            SceneManager.app.stage.removeChild(SceneManager.currentScene);
            SceneManager.currentScene.destroy();
        }

        SceneManager.currentScene = newScene;
        SceneManager.app.stage.addChild(SceneManager.currentScene);
    }

    private static update(deltaTime: number): void {
        if (SceneManager.currentScene) {
            SceneManager.currentScene.update(deltaTime);
        }
    }
}

/**
 * Interfaz de escena, como único atributo es una función que actualiza
 * la información de los objetos de la escena.
 */
export interface IScene extends DisplayObject {
    update(deltaTime: number): void;
}

/**
 * Interfaz para objetos de la escena, fuerza metodos para actualizar su
 * estado y eliminarse apropiadamente.
 * 
 * Tiene la intención de utilizarse en conjunto con VirtualObject.
 * buildGraphics define como se construyen los gráficos para un objeto
 * y estos puedan ser generados por la clase de VirtualObject.
 */
export interface ISceneObject {
    buildGraphics(): DisplayObject;
    destroy(): void;
    update(deltaTime: number): void;
}


/**
 * Interfaz para definir los objetos que se utilizarán en la detección de
 * colisiones.
 */
export interface ICollidable {
    onCollide(source: ICollidable): void;
    getVirtualObject(): VirtualObject;
}
