import { Container, Graphics } from 'pixi.js';
import { Context } from '../Context';
import { IScene } from '../Manager';
import { Vector } from '../math/Vector';
import { Enemy } from '../objects/Enemy';
import { Player } from '../objects/Player';

export default class GameScene extends Container implements IScene {
    private player: Player;
    private enemies: Array<Enemy> = [];
    private currentRound: number = 0;
    private static maxEnemies: number = 10;
    private fieldGraphics: Graphics = new Graphics();

    public constructor() {
        super();
        this.fieldGraphics = this.buildFieldGraphics();

        this.addChild(this.fieldGraphics);
        this.getBounds();

        this.player = new Player(10, 10);
        this.player.activate();

        // Render graphic layers
        this.buildMask();
        this.addChild(Context.globalContainer);

        this.startRound();
    }

    private startRound() {
        const enemyCount = Math.min(
            Math.max(
                1,
                Math.ceil(this.currentRound / 5) + Math.round(Math.random())
            ),
            GameScene.maxEnemies
        );

        const { left, top, width, height } = Context.bounds;
        const padding = 50;
        this.enemies = new Array(enemyCount).fill(null).map((_) => {
            const nx = Math.random() * (width - 2 * padding) + left + padding;
            const ny = Math.random() * (height - 2 * padding) + top + padding;

            return new Enemy(new Vector(nx, ny), this.player);
        });
    }

    private endRound() {
        this.currentRound++;
        Context.roundCleanup();
    }

    private buildMask() {
        this.mask = this.buildFieldGraphics();
    }

    private buildFieldGraphics() {
        const width = Context.fieldWidth;
        const height = Context.fieldHeight;

        return new Graphics()
            .beginFill(0)
            .drawRect(0, 0, width, height)
            .endFill();
    }

    update(deltaTime: number): void {
        Context.update(deltaTime);

        this.enemies = this.enemies.filter((enemy) => enemy.health > 0);
        if (this.enemies.length == 0) {
            console.log('AaAAAAA');
            this.endRound();
            this.startRound();
        }
    }
}
