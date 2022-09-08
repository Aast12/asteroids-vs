import { Bounds, Container, DisplayObject, Graphics, Rectangle } from 'pixi.js';
import { IScene, ParentScene, SceneManager } from './manager';
import { Player } from './player';
import { Station } from './Scenario/Station';

export default class Scene extends ParentScene implements IScene {
    private player: Player;
    private station: Station;
    private fieldGraphics: Graphics = new Graphics;

    public constructor() {
        super();
        // Draw play field  
        this.buildFieldGraphics();

        this.station = new Station(window.screen.width / 2 - 50, window.screen.height / 2 - 50, 10)
        this.station.subscribe(this.subscribeObject);

        this.addChild(this.fieldGraphics);
        this.getBounds()

        this.player = new Player(10, 10, this._bounds);
        this.player.activate();

        // Render graphic layers 
        
        this.player.subscribe(this.subscribeObject);
    }

    private buildFieldGraphics() {
        const width = window.screen.width / 2;
        const height = window.screen.height / 2;
        this.fieldGraphics.clear();
        this.fieldGraphics.beginFill(0xff0000);
        this.fieldGraphics.drawRect(
            window.screen.width / 2 - width / 2,
            window.screen.height / 2 - height / 2,
            width,
            height
        );
        this.fieldGraphics.endFill();
    }

    update(deltaTime: number): void {
        this.player.update(deltaTime);
    }
}
