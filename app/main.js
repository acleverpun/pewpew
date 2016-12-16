import game from './services/game';
import { StateManager } from './state-manager';

window.PEW = {};
const manager = new StateManager(game);
manager.start();
