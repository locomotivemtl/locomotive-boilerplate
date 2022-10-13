/**
 * @file Provides simple user configuration options.
 */

import loconfig from '../../loconfig.json' assert { type: 'json' };
import { merge } from '../utils/index.js';

let usrconfig;

try {
    usrconfig = await import('../../loconfig.local.json', {
        assert: { type: 'json' },
    });
    usrconfig = usrconfig.default;

    merge(loconfig, usrconfig);
} catch (err) {
    // do nothing
}

loconfig.data  = (loconfig.data ?? {});
loconfig.paths = (loconfig.paths ?? {});
loconfig.tasks = (loconfig.tasks ?? {});

export default loconfig;

export {
    loconfig,
};
