import './tailwindcss.js';

import { body, z } from './z/z3.9.js';
import Router from './router.js';

import { NotFound, icons, Welcome, Reports, Cheques, Employees, Suppliers, Supplies, Nomenclature } from './views/index.js';

import './scaleApp.js';

const router = Router
    .register('^/$', Welcome)
    .register('^/reports$', Reports)
    .register('^/cheques$', Cheques)
    .register('^/employees$', Employees)
    .register('^/suppliers$', Suppliers)
    .register('^/supplies$', Supplies)
    .register('^/nomenclature$', Nomenclature)
    // .register('^/([a-zA-z-]+)$', Store)
    // .register('^/([a-zA-z-]+)/edit$', StoreSettings)
    // .register('^/([a-zA-z-]+)/create$', CreateProduct)
    .unknown(NotFound);

const app = z['flex h-full absolute top-0 right-0 left-0 bottom-0 font-sans'](
    _ => z['w-72 bg-[#101f37] pt-8 px-3 flex flex-col']([
        ['/', icons.home, 'Главная'],
        ['/cheques', icons.cheque, 'Чеки'],
        ['/employees', icons.user, 'Сотрудники'],
        ['/suppliers', icons.supplier, 'Поставщики'],
        ['/supplies', icons.supply, 'Поставки'],
        ['/nomenclature', icons.nomenclature, 'Номенклатура'],
        ['/reports', icons.report, 'Отчеты']
    ].map(([link, icon, name]) => z['p-3 w-full text-[#e9b0d6] rounded flex items-center cursor-pointer']({
        key: link+name,
        classes: {
            'active:bg-[#0b1628] hover:bg-[#0e1b2f]': router.getFragment() !== link,
            'bg-[#0b1628]': router.getFragment() === link
        },
        onclick() { router.navigate(link); }
    }, icon, z['ml-4'], name))),
    z['bg-gray-100 flex-1'](router)
);
    
body(app);