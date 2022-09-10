import { Container, Graphics, Text } from 'pixi.js';
import { Context } from 'src/Context';
import { IScene } from 'src/Manager';

export default class GameOverScene extends Container implements IScene {
    private context: Context;

    constructor(context: Context) {
        super();
        this.context = context;
        this.buildGraphics();
    }

    buildGraphics() {
        const bg = new Graphics()
            .beginFill(0x000000)
            .drawRect(0, 0, this.context.fieldWidth, this.context.fieldHeight)
            .endFill();

        this.addChild(bg);

        const endGameText = new Text('Game Over', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xffffff,
            fontWeight: 'bold',
        });

        endGameText.anchor.set(0.5, 0.5);

        endGameText.position.x = this.context.fieldWidth / 2;
        endGameText.position.y = this.context.fieldHeight / 2;

        const retryText = new Text('Start Over', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            fontWeight: 'bold',
        });

        retryText.anchor.set(0.5, 0.5);

        retryText.position.x = endGameText.position.x;
        retryText.position.y = endGameText.position.y + endGameText.height;

        retryText.interactive = true;

        retryText.on('pointerover', () => (retryText.alpha = 0.7));
        retryText.on('pointerout', () => (retryText.alpha = 1));
        retryText.on('pointerdown', () => this.context.restartGame());

        this.addChild(endGameText);
        this.addChild(retryText);
    }

    update(deltaTime: number): void {}
}
