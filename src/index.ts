// @ts-nocheck
import { Context } from './Context';
import { Keyboard } from './Keyboard';
import { SceneManager } from './Manager';
import GameScene from './scenes/Game';

// Inicialización del juego
const setup = () => {
    // Inicialización de singleton para detectar inputs del teclado
    Keyboard.initialize();
    // Inicialización de singleton para guardar información global del juego (configuraciones y objetos)
    Context.initialize(window.screen.width, window.screen.height);
    // Inicialización de Manejador de escenas
    SceneManager.initialize(window.screen.width, window.screen.height, 0);
    // Iniciar la pantalla de juego
    SceneManager.changeScene(new GameScene());
};

// Configuración para fonts externas
window.WebFontConfig = {
    google: {
        families: ['VT323'],
    },

    // Callback al cargar las fonts
    active() {
        // Mostrar instrucciones antes de comenzar el juego
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
