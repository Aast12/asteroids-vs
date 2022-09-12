import { Context } from '@app/Context';
import { IScene } from '@app/Manager';
import { Vector } from '@app/math/Vector';
import { Enemy } from '@app/objects/Enemy';
import { Player } from '@app/objects/Player';
import { Container, Graphics } from 'pixi.js';

export default class GameScene extends Container implements IScene {
    private player: Player;
    // private enemies: Array<Enemy>;
    private fieldGraphics: Graphics = new Graphics();

    public constructor() {
        super();
        this.fieldGraphics = this.buildFieldGraphics();

        this.addChild(this.fieldGraphics);
        this.getBounds();

        // this.context.setBounds(this._bounds);

        this.player = new Player(10, 10);
        this.player.activate();

        new Enemy(new Vector(200, 300), this.player);

        // Render graphic layers
        this.buildMask();
        this.addChild(Context.globalContainer);
    }

    private buildMask() {
        this.mask = this.buildFieldGraphics();
    }

    private buildFieldGraphics() {
        const width = Context.fieldWidth;
        const height = Context.fieldHeight;

        return new Graphics()
            .beginFill(0xff0000)
            .drawRect(0, 0, width, height)
            .endFill();
    }

    update(deltaTime: number): void {
        Context.update(deltaTime);
    }
}
