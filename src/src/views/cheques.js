import { icons } from ".";
import { q } from "../api";
import router from "../router";
import { body, Ref, z } from "../z/z3.9";
import Breadcrumbs from "./breadcrumbs";
import Button from "./button";
import { NamedInput, NamedSelect } from "./input";
import Modal from "./modal";
import Table from "./table";

export function ChequesTable() {
    const table = Table([
        { name: 'Дата', attr: 'data_prodazhi' },
        { name: 'Сотрудник', attr: 'Concat(s.familya," ",s.imya," ",s.otchestvo)' },
        { name: 'Сумма', attr: 'summa_checka' }
    ], {
        table: '`check`',
        join: 'join sotrudnik s on s.kod_sotrudnika = check.kod_sotrudnika',
        pk: 'kod_checka',
        link: '/cheques'
    });
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
    const data = {
        kod_sotrudnika: +this.employee || '',
        data_prodazhi: new Date().toISOString().slice(0, -1),
        summa_checka: ''
    };

    const options = {
        kod_sotrudnika: { values: [] },
        data_prodazhi: { type: 'datetime-local' },
    };


    q('select kod_sotrudnika as value, Concat(familya," ",imya," ",otchestvo) as name from sotrudnik').then(r => {
        options.kod_sotrudnika.values = r;
        body.update();
    });

    const modal = Modal();

    let table;
    if (id !== 'new') {
        q(`select ${Object.keys(data).join(',')} from \`check\` where kod_checka=?`, [id])
        .then(r=>{
            Object.assign(data, r[0]);
            data.data_prodazhi = data.data_prodazhi.slice(0, -1);
            body.update()
        });
        table = Table([
            { name: 'Номенклатура', attr: 'nazvanie' },
            { name: 'Количество', attr: 'kolichestvo_upakovok' },
            { name: 'Сумма', attr: 'summa', aggr: 'sum' }
        ], {
            table: 'prodazha',
            pk: 'p.kod_preparata',
            join: 'inner join preparat p on p.kod_preparata = prodazha.kod_preparata',
            filter: ['kod_checka = ?', [id]],
            onclick: modal.open
        });
    }

    async function create(open_new) {
        let cancel;
        if (data.kod_sotrudnika === '') {
            options.kod_sotrudnika.error = 'Поле не может быть пустым';
            cancel = true;
        }
        if (data.data_prodazhi === '') {
            options.data_prodazhi.error = 'Поле не может быть пустым';
            cancel = true;
        }
        if (cancel) {
            body.update();
            return;
        }
        const r = await q('select sum(summa) from prodazha where kod_checka = ?', [id])
        data.summa_checka = r[0]['sum(summa)'] || 0;
        const values = Object.entries(data)
        if (id === 'new') {
            q(`insert into \`check\`(${values.map(v=>v[0]).join(',')}) values (${values.map(i=>'?').join(',')})`, values.map(v=>v[1])).then(i => {
                router.navigate('/cheques/'+ (open_new ? 'new' : i.insertId))
            })
        } else {
            q(`update \`check\` set ${values.map(v=>v[0]+'=?').join(',')} where kod_checka=?`, values.map(v=>v[1]).concat([id]))
        }
    }

    return z['p-4'](
        Breadcrumbs(['/cheques', 'Чеки'], id === 'new' ? 'Создание чека' : 'Редактирование чека #'+id),
        z['text-4xl mt-8']('Общая информация'),
        z['flex mt-8'](
            NamedSelect('Сотрудник', Ref(data, 'kod_sotrudnika'), options.kod_sotrudnika),
            z['ml-4'],
            NamedInput('Время', Ref(data, 'data_prodazhi'), options.data_prodazhi),
        ),
        id === 'new' ? '' : z(
            z['mt-4'],
            z['flex items-center'](
                z['text-4xl']('Позиции чека'),
                z['flex-1'],
                z['flex text-xl items-center cursor-pointer transition hover:text-[#dd88c1]'](
                    { onclick() { modal.open('new') } },
                    icons.plus, z['ml-4'], 'Добавить'
                ),
                z['ml-4']
            ),
            z['mt-4'],
            table,
        ),
        z['mt-8'],
        z['sticky bottom-4'](
            z['w-full p-4 bg-[#dd88c1] transition text-white rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']({
                onclick() { create(); }
            }, id === 'new' ? 'Создать' : 'Сохранить'),

            id === 'new' ? z['w-full mt-4 p-4 bg-[#dd88c1] transition text-white rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']({
                onclick() { create(true); }
            }, 'Создать и открыть новую форму') : '',

            id !== 'new' ? z['w-full mt-4 p-4 bg-[#dd88c1] transition text-white rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']({
                onclick() {
                    q('delete from `check` where kod_checka=?', [id])
                    .then(i => router.navigate('/cheques'));
                }
            }, 'Удалить') : ''
        ),
        modal
    )
}