import { Context } from '@app/Context';
import { Keyboard } from '@app/Keyboard';
import { SceneManager } from '@app/Manager';
import GameScene from '@app/scenes/Game';

const setup = () => {
    Keyboard.initialize();
    Context.initialize(window.screen.width, window.screen.height);
    SceneManager.initialize(window.screen.width, window.screen.height, 0);
    SceneManager.changeScene(new GameScene());
};

window.onload = setup;
