import { body } from './src/z/z3.9.js';
import Router from './src/router.js';

const app = Router
    // .register('^/$', MyStores)
    // .register('^/create$', CreateStore)
    // .register('^/([a-zA-z-]+)$', Store)
    // .register('^/([a-zA-z-]+)/edit$', StoreSettings)
    // .register('^/([a-zA-z-]+)/create$', CreateProduct)
    // .unknown(NotFound);

body(app);