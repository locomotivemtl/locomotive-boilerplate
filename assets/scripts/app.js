import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';

const app = new modular({
    modules: modules
});

app.init(app);
globals();
