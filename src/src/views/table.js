import { icons } from ".";
import { q } from "../api";
import router from "../router";
import { body, Val, z } from "../z/z3.9";
import Button from "./button";
import { Dropdown } from "./dropdown";


const iconButton = (icon, onclick, { disabled }={}) =>
    z({
        classes: {
            'cursor-pointer hover:text-gray-700 active:text-gray-900': !disabled,
            'text-gray-300': disabled
        },
        onclick(e) { if (!disabled) onclick(e); }
    }, icon);

export default function Table(columns, options={}) {
    const filters = { rowsPerPage: 10, skip: 0, count: 0 };
    let aggrData = Val({}), data = Val([]), loading = Val(false), loadingError = Val('');
    let attrs = columns.map(c => c.attr);
    if (options.pk) {
        attrs = attrs.concat([options.pk]).join(',');
        options.pk = options.pk.split('.').pop();
    }
    const join = options.join || '';
    const where = options.filter ? 'where '+options.filter[0] : '';
    const cq = `select count(*) from ${options.table} ${join} ${where}`;
    const qs = `select ${attrs} from ${options.table} ${join} ${where}`;
    let aggr = columns.filter(i => i.aggr).map(i => i.aggr+'('+i.attr+')').join(',');
    if (aggr.length) aggr = `select ${aggr} from ${options.table} ${where}`;
    function load() {
        aggrData({});
        data([]);
        loadingError('');
        loading(true);
        Promise.all([
            q(qs + ` limit ${filters.rowsPerPage} offset ${filters.skip}`, options.filter?.[1] || []).then(data),
            q(cq, options.filter?.[1] || []).then(r => (filters.count = r[0]['count(*)'], body.update())),
            aggr ? q(aggr, options.filter?.[1] || []).then(i=>aggrData(i[0])) : ''
        ]).catch(loadingError).finally(i => loading(false));
    }
    load();
    return Object.assign(z['shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'](
        z.Table['min-w-full divide-y divide-gray-200'](
            z.Thead['bg-gray-50'](z.Tr(columns.map(
                c => z.Th['px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'](c.name)
            ))),
            z.Tbody['bg-white divide-y divide-gray-200'](
                _=>data().map(r => z.Tr({
                    onclick() { 
                        if (options.onclick) {
                            options.onclick(options.pk ? r[options.pk] : r);
                        }
                        if (options.link) {
                            console.log(options.pk, r[options.pk])
                            router.navigate(options.link+'/'+(options.pk ? r[options.pk] : ''), r)
                        }
                    }
                }, columns.map(v => z.Td['px-6 py-4 whitespace-nowrap'](r[v.attr])))),
                _ => aggr.length === 0 || loading() || loadingError() || data().length === 0 ? '' :
                    z.Tr(columns.map(v => z.Td['px-6 py-4 whitespace-nowrap text-gray-500 bg-gray-50'](
                        v.aggr ? aggrData()[`${v.aggr}(${v.attr})`] : ''
                    )))
            ),
        ),
        _=> loading() ? z['flex justify-center px-6 py-4'](icons.loading) :
            loadingError() ? z['flex justify-center px-6 py-4'](z(z('Ошибка загрузки данных'), Button('Повторить', load))) :
            data().length === 0 ? z['flex justify-center px-6 py-4']('Пусто') : '',
        z['flex justify-center px-6 py-4 w-full bg-gray-50 text-gray-500'](z['flex-1'],
            'Количество на странице',
            z['ml-2'],
            Dropdown(z['flex'](_ => filters.rowsPerPage, icons.chevronDown), close => [10, 20, 50].map(i => z['text-lg cursor-pointer text-gray-500']({ onclick() {
                filters.rowsPerPage = i;
                load();
                close();
            } }, i))),
            z['ml-4'],
            _ => `${filters.skip}-${Math.min(filters.count, filters.skip+filters.rowsPerPage)} из ${filters.count}`,
            z['ml-4'],
            _ => [
                iconButton(icons.chevronDoubleLeft, _ => { filters.skip = 0; load(); }, {
                    disabled: filters.rowsPerPage > filters.count
                }),
                iconButton(icons.chevronLeft, _ => { filters.skip -= filters.rowsPerPage; load(); }, {
                    disabled: filters.skip - filters.rowsPerPage < 0
                }),
                iconButton(icons.chevronRight, _ => { filters.skip += filters.rowsPerPage; load(); }, {
                    disabled: filters.skip + filters.rowsPerPage >= filters.count
                }),
                iconButton(icons.chevronDoubleRight, _ => { filters.skip = filters.count - filters.rowsPerPage; load(); }, {
                    disabled: filters.rowsPerPage > filters.count
                })
            ]
        )
    ), {
        load
    });
}