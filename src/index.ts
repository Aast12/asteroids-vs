//@ts-nocheck
import { Context } from './Context';
import { Keyboard } from './Keyboard';
import { SceneManager } from './Manager';
import GameScene from './scenes/Game';

const setup = () => {
    Keyboard.initialize();
    Context.initialize(window.screen.width, window.screen.height);
    SceneManager.initialize(window.screen.width, window.screen.height, 0);
    SceneManager.changeScene(new GameScene());
};

window.WebFontConfig = {
    google: {
        families: ['VT323'],
    },

    active() {
        const instructionsContainer = document.getElementById('instructions');
        const startGameBtn = document.getElementById('start-game-btn');

        startGameBtn?.addEventListener('click', (_) => {
            setup();
            instructionsContainer.hidden = true;
        });
    },
};

// include the web-font loader script
(function () {
    const wf = document.createElement('script');
    wf.src = `${
        document.location.protocol === 'https:' ? 'https' : 'http'
    }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = 'true';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();
