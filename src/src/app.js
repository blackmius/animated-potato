import './tailwindcss.js';

import { body, Val, z } from './z/z3.9.js';
import Router from './router.js';

import {
    icons,
    NotFound, Welcome, Reports, ChequesTable, ChequesForm,
    EmployeesTable, EmployeesForm, SuppliersTable, SuppliersForm, SuppliesTable,
    SuppliesForm, NomenclatureTable, NomenclatureForm, EmployeesReport, ProductsReport,
    WarehouseReport
} from './views/index.js';

import './scaleApp.js';
import { employee, login, logout } from './views/auth.js';
import { NamedInput } from './views/input.js';
import Button from './views/button.js';
import { Link } from './views/link.js';

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

const menuItem = ([link, icon, name]) => z['p-3 w-full transition text-[#e9b0d6] rounded flex items-center cursor-pointer']({
    key: link+name,
    classes: {
        'active:bg-[#0b1628] hover:bg-[#0e1b2f]': router.getFragment() !== link,
        'bg-[#0b1628]': router.getFragment() === link
    },
    onclick() { router.navigate(link); }
}, icon, z['ml-4'], name);

const authToken = Val(''), authOptions = {};
const app = _ => employee() != null ? z['flex h-full absolute top-0 right-0 left-0 bottom-0 font-sans'](
    z['w-72 bg-[#101f37] pt-8 px-3 flex flex-col'](
        (
            employee()?.kod_dolzhnosti === 1 ? [
                ['/', icons.home, 'Главная'],
                ['/cheques', icons.cheque, 'Чеки'],
                ['/nomenclature', icons.nomenclature, 'Номенклатура'],
            ] : [
                ['/', icons.home, 'Главная'],
                ['/cheques', icons.cheque, 'Чеки'],
                ['/employees', icons.user, 'Сотрудники'],
                ['/suppliers', icons.supplier, 'Поставщики'],
                ['/supplies', icons.supply, 'Поставки'],
                ['/nomenclature', icons.nomenclature, 'Номенклатура'],
                ['/reports', icons.report, 'Отчеты']
            ]
        ).map(menuItem)
    ),
    z['bg-gray-100 flex-1 flex flex-col'](
        z['flex bg-white shadow px-4 py-2'](
            z['flex-1'],
            z['cursor-pointer transition hover:text-gray-700 active:text-gray-900'](
                {
                    onclick() {
                        router.navigate('/employees/'+employee().kod_sotrudnika);
                    }
                },
                employee().familya + ' ' + employee().imya + ' ' + employee().otchestvo,
            ),
            z['ml-4'],
            z['cursor-pointer transition hover:text-gray-700 active:text-gray-900']({
                onclick() { logout() }
            }, icons.logout)
        ),
        z['overflow-auto flex-1'](router)
    )
) : z['flex h-full bg-gray-100 absolute top-0 right-0 left-0 bottom-0 font-sans items-center justify-center'](
    z['w-[400px]'](
        z['text-2xl']('Вход в систему'),
        //z['text-md']('Введите код авторизации, полученный у администратора'),
        z['mt-8'],
        NamedInput('Код авторизации', authToken, authOptions),
        z['mt-4'],
        z['flex'](z['flex-1'], Button('Войти', async () => {
            const res = await login(authToken());
            if (res == null) {
                authOptions.error = 'Код авторизации не связан ни с одним пользователем, обратитесь к администратору для получения нового кода, если он был утерян'
            }
        }))
    )
);
    
body(app);