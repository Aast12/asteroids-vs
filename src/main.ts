import { Bounds, Container, DisplayObject, Graphics, Rectangle } from 'pixi.js';
import { IScene, ParentScene, SceneManager } from './manager';
import { Player } from './player';
import { Station } from './Scenario/Station';

export default class Scene extends ParentScene implements IScene {
    private player: Player;
    private station: Station;

    public constructor() {
        super();
        // Draw play field  
        this.buildFieldGraphics();

        this.station = new Station(window.screen.width / 2 - 50, window.screen.height / 2 - 50, 10)
        this.station.subscribe(this.subscribeObject);


        this.player = new Player(10, 10);
        this.getBounds()
        this.player.setBounds(this._bounds);
        this.player.activate();
        this.player.subscribe(this.subscribeObject);

    }

    private buildFieldGraphics() {
        const width = window.screen.width / 2;
        const height = window.screen.height / 2;
        const scene = new Graphics();
        scene.beginFill(0xff0000);
        scene.drawRect(
            window.screen.width / 2 - width / 2,
            window.screen.height / 2 - height / 2,
            width,
            height
        );
        scene.endFill();
        this.addChild(scene);
    }

    update(deltaTime: number): void {
        this.player.update(deltaTime);
    }
}
