import { Keyboard } from './keyboard';
import { SceneManager } from './Manager';
import MainScene from './Game';

const mainScene = new MainScene();

const setup = () => {
	Keyboard.initialize()
    SceneManager.initialize(window.screen.width, window.screen.height, 0);
	SceneManager.changeScene(mainScene);
};

window.onload = setup;