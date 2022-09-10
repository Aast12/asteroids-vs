import { Bounds, Container, DisplayObject, Graphics, Rectangle } from 'pixi.js';
import { Context } from './Context';
import { IScene, ParentScene, SceneManager } from './Manager';
import { Player } from './player';

export default class GameScene extends Container implements IScene {
    private player: Player;
    private fieldGraphics: Graphics = new Graphics();
    private context: Context = new Context();

    public constructor() {
        super();
        this.fieldGraphics = this.buildFieldGraphics();

        this.addChild(this.fieldGraphics);
        this.getBounds();
        this.context.setBounds(this._bounds);

        this.player = new Player(10, 10, this.context);
        this.player.activate();

        // Render graphic layers
        this.buildMask();
        this.addChild(this.context.parentContainer);
    }

    private buildMask() {
        this.mask = this.buildFieldGraphics();
    }

    private buildFieldGraphics() {
        const width = this.context.fieldWidth;
        const height = this.context.fieldHeight;

        return new Graphics()
            .beginFill(0xff0000)
            .drawRect(0, 0, width, height)
            .endFill();
    }

    update(deltaTime: number): void {
        // this.player.update(deltaTime);
        this.context.update(deltaTime);
    }
}
