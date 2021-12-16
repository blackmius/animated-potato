import { icons } from ".";
import router from "../router";
import { z } from "../z/z3.9";
import Breadcrumbs from "./breadcrumbs";
import Button from "./button";
import Table from "./table";

export function ChequesTable() {
    const table = Table([
        { name: 'Дата' },
        { name: 'Сотрудник' },
        { name: 'Сумма' }
    ]);
    return z['p-4'](
        z['flex items-center'](
            z['text-2xl']('Чеки'),
            z['flex-1'],
            z['flex items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { router.navigate('/cheques/new') }},
                icons.plus, z['ml-4'], 'Открыть новый чек'
            )
        ),
        z['mt-4'],
        table
    )
}

export function ChequesForm(id) {
    const table = Table([
        { name: 'Номенклатура' },
        { name: 'Количество' },
        { name: 'Сумма' }
    ]);
    return z['p-4'](
        Breadcrumbs(['/cheques', 'Чеки'], id === 'new' ? 'Создание чека' : 'Редактирование чека #'+id),
        z['mt-4'],
        z['flex items-center'](
            z['text-4xl']('Позиции чека'),
            z['flex-1'],
            z['flex text-xl items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { } },
                icons.plus, z['ml-4'], 'Добавить'
            ),
            z['ml-4']
        ),
        z['mt-4'],
        table,
        z['mt-4'],
        z['w-full p-4 bg-[#dd88c1] transition text-white sticky bottom-4 rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']('Сохранить'),
    )
}