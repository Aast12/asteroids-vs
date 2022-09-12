import { Context } from "./Context";
import { Keyboard } from "./Keyboard";
import { SceneManager } from "./Manager";
import GameScene from "./scenes/Game";

const setup = () => {
    Keyboard.initialize();
    Context.initialize(window.screen.width, window.screen.height);
    SceneManager.initialize(window.screen.width, window.screen.height, 0);
    SceneManager.changeScene(new GameScene());
};

window.onload = setup;
