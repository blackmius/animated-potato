import { z, Val } from "../z/z3.9";
import Table from "./table";
import { icons } from ".";
import router from "../router";
import { NamedSelect, NamedInput } from "./input";
import Breadcrumbs from "./breadcrumbs";

export function SuppliersTable() {
    const table = Table([
        { name: 'Наименование организации', attr: 'naimenovanie' },
    ], {
        table: 'postavschik',
        pk: 'kod_postavschika',
        link: '/suppliers'
    });

    return z['p-4'](
        z['flex items-center'](
            z['text-2xl']('Поставщики'),
            z['flex-1'],
            z['flex items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { router.navigate('/suppliers/new') }},
                icons.plus, z['ml-4'], 'Добавить поставщика'
            )
        ),
        z['mt-4'],
        table
    )
}

export function SuppliersForm(id) {
    const suppliesTable = Table([
        { name: 'Дата' },
        { name: 'Сумма' }
    ]);

    const contactTable = Table([
        { name: 'Тип' },
        { name: 'Значение' }
    ]);

    const data = {
        name: '',
        inn: ''
    };

    return z['p-4'](
        Breadcrumbs(['/suppliers', 'Поставщики'], id === 'new' ? 'Новый поставщик' : 'Редактирование поставщика #'+id),
        z['text-4xl mt-8']('Общая информация'),
        z['flex mt-8'](
            NamedInput('Наименование', Val(data['name'], v=>data['name']=v)),
            z['ml-4'],
            NamedInput('инн', Val(data['inn'], v=>data['inn']=v)),
        ),
        z['flex mt-4'](
            NamedSelect('Адрес', Val(data['address'], v=>data['address']=v), {
                values: []
            }),
        ),
        z['flex items-center mt-8'](
            z['text-4xl']('Контакты поставщика'),
            z['flex-1'],
            z['flex text-xl items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { } },
                icons.plus, z['ml-4'], 'Добавить'
            ),
            z['ml-4']
        ),
        z['mt-4'],
        contactTable,
        z['flex items-center mt-8'](
            z['text-4xl']('Поставки'),
            z['flex-1'],
            z['flex text-xl items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { } },
                icons.plus, z['ml-4'], 'Добавить'
            ),
            z['ml-4']
        ),
        z['mt-4'],
        suppliesTable,
        z['mt-4'],
        z['w-full p-4 bg-[#dd88c1] transition text-white sticky bottom-4 rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']('Сохранить'),
    )
}