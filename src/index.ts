import { SceneManager } from './manager';

const setup = () => {
    SceneManager.initialize(500, 500, 0xff0000);
};

window.onload = setup;
