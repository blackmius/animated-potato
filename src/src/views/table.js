import { icons } from ".";
import { body, z } from "../z/z3.9";
import { Dropdown } from "./dropdown";


const iconButton = (icon, onclick, { disabled }={}) =>
    z({
        classes: {
            'cursor-pointer hover:text-gray-700 active:text-gray-900': !disabled,
            'text-gray-300': disabled
        },
        onclick(e) { if (!disabled) onclick(e); }
    }, icon);

export default function Table(columns, data=[]) {
    const filters = { rowsPerPage: 10, skip: 0, count: 0 };
    return z['shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'](
        z.Table['min-w-full divide-y divide-gray-200'](
            z.Thead['bg-gray-50'](z.Tr(columns.map(
                c => z.Th['px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'](c.name)
            ))),
            z.Tbody['bg-white divide-y divide-gray-200'](
                data.map(r => z.Tr(r.map(v => z.Td['px-6 py-4 whitespace-nowrap'](v))))
            ),
        ),
        data.length === 0 ? z['flex justify-center px-6 py-4']('Пока здесь нет записей'): '',
        z['flex justify-center px-6 py-4 w-full bg-gray-50 text-gray-500'](z['flex-1'],
            'Количество на странице',
            z['ml-2'],
            Dropdown(z['flex'](_ => filters.rowsPerPage, icons.chevronDown), close => [10, 20, 50].map(i => z['text-lg cursor-pointer text-gray-500']({ onclick() {
                filters.rowsPerPage = i;
                close();
            } }, i))),
            z['ml-4'],
            _ => `${filters.skip}-${Math.min(filters.count, filters.skip+filters.rowsPerPage)} из ${filters.count}`,
            z['ml-4'],
            _ => [
                iconButton(icons.chevronDoubleLeft, _ => { filters.skip = 0; body.update(); }, {
                    disabled: filters.rowsPerPage > filters.count
                }),
                iconButton(icons.chevronLeft, _ => { filters.skip -= filters.rowsPerPage; body.update(); }, {
                    disabled: filters.skip - filters.rowsPerPage < 0
                }),
                iconButton(icons.chevronRight, _ => { filters.skip += filters.rowsPerPage; body.update(); }, {
                    disabled: filters.skip + filters.rowsPerPage > filters.count
                }),
                iconButton(icons.chevronDoubleRight, _ => { filters.skip = filters.count - filters.rowsPerPage; body.update(); }, {
                    disabled: filters.rowsPerPage > filters.count
                })
            ]
        )
    );
}