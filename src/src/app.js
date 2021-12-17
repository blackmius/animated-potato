import './tailwindcss.js';

import { body, z } from './z/z3.9.js';
import Router from './router.js';

import {
    icons,
    NotFound, Welcome, Reports, ChequesTable, ChequesForm,
    EmployeesTable, EmployeesForm, SuppliersTable, SuppliersForm, SuppliesTable,
    SuppliesForm, NomenclatureTable, NomenclatureForm, EmployeesReport, ProductsReport,
    WarehouseReport
} from './views/index.js';

import './scaleApp.js';

const router = Router
    .register('^/$', Welcome)
    .register('^/reports$', Reports)
    .register('^/reports/employees$', EmployeesReport)
    .register('^/reports/products$', ProductsReport)
    .register('^/reports/warehouse$', WarehouseReport)
    .register('^/cheques$', ChequesTable)
    .register('^/cheques/([a-z0-9]+)$', ChequesForm)
    .register('^/employees$', EmployeesTable)
    .register('^/employees/([a-z0-9]+)$', EmployeesForm)
    .register('^/suppliers$', SuppliersTable)
    .register('^/suppliers/([a-z0-9]+)$', SuppliersForm)
    .register('^/supplies$', SuppliesTable)
    .register('^/supplies/([a-z0-9]+)$', SuppliesForm)
    .register('^/nomenclature$', NomenclatureTable)
    .register('^/nomenclature/([a-z0-9]+)$', NomenclatureForm)
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
    ].map(([link, icon, name]) => z['p-3 w-full transition text-[#e9b0d6] rounded flex items-center cursor-pointer']({
        key: link+name,
        classes: {
            'active:bg-[#0b1628] hover:bg-[#0e1b2f]': router.getFragment() !== link,
            'bg-[#0b1628]': router.getFragment() === link
        },
        onclick() { router.navigate(link); }
    }, icon, z['ml-4'], name))),
    z['bg-gray-100 flex-1 overflow-auto'](router)
);
    
body(app);