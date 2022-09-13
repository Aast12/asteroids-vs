import { Container, Graphics, Text } from 'pixi.js';
import { Context } from '../Context';
import { IScene } from '../Manager';
import { Vector } from '../math/Vector';
import { Enemy } from '../objects/Enemy';
import { Player } from '../objects/Player';

/**
 * Escena principal del juego. Maneja las rondas y la creación del juego
 * y los enemigos.
 */
export default class GameScene extends Container implements IScene {
    private player: Player;
    private enemies: Array<Enemy> = [];
    private currentRound: number = 0;
    private endRoundTime: number = Date.now();
    private static maxEnemies: number = 10;
    private static roundWaitTime: number = 500;
    private fieldGraphics: Graphics = new Graphics();
    private inRound: boolean = false;
    private newRoundSign: Text = new Text(undefined, {
        fontFamily: Context.gameFont,
        fill: 0xffffff,
        fontSize: 48,
    });

    public constructor() {
        super();
        this.fieldGraphics = this.buildFieldGraphics();

        this.addChild(this.fieldGraphics);

        this.player = new Player(10, 10);
        this.player.activate();

        // Render graphic layers
        this.buildMask();
        this.addChild(Context.globalContainer);

        this.newRoundSign.anchor.set(0.5, 0.5);
        this.newRoundSign.position.set(
            Context.bounds.left + Context.fieldWidth / 2,
            Context.bounds.top + Context.fieldHeight / 4
        );

        this.addChild(this.newRoundSign);
    }

    private startRound() {
        this.inRound = true;
        this.newRoundSign.alpha = 1;
        this.newRoundSign.text = `Ronda ${this.currentRound}`;

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
        this.endRoundTime = Date.now();
        this.inRound = false;

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

        if (this.newRoundSign.alpha > 0) {
            this.newRoundSign.alpha -= 0.01 * deltaTime;
        }

        this.enemies = this.enemies.filter((enemy) => enemy.health > 0);
        if (
            !this.inRound &&
            Date.now() - this.endRoundTime > GameScene.roundWaitTime
        )
            this.startRound();

        if (this.enemies.length == 0 && this.inRound) this.endRound();
    }
}
