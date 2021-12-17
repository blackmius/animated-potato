import { body, Ref, z } from "../z/z3.9";
import Table from "./table";
import { icons } from ".";
import router from "../router";
import Breadcrumbs from "./breadcrumbs";
import { NamedInput, NamedSelect } from "./input";
import { q } from "../api";
import Modal from "./modal.js";
import Button from "./button";

export function SuppliesTable() {
    const table = Table([
        { name: 'Дата', attr: 'data_postavki' },
        { name: 'Поставщик', attr: 'naimenovanie' },
        { name: 'Сумма', attr: 'summa' }
    ], {
        table: 'postavka',
        join: 'inner join postavschik p on p.kod_postavschika = postavka.kod_postavschika',
        pk: 'kod_postavki',
        link: '/supplies'
    });

    return z['p-4'](
        z['flex items-center'](
            z['text-2xl']('Поставки'),
            z['flex-1'],
            z['flex items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { router.navigate('/supplies/new') }},
                icons.plus, z['ml-4'], 'Добавить поставку'
            )
        ),
        z['mt-4'],
        table
    )
}

export function SuppliesForm(id) {
    const data = {
        kod_postavschika: +this.supplier || '',
        data_postavki: new Date().toISOString().split('T')[0],
        summa: ''
    };

    const options = {
        kod_postavschika: { values: [] },
        data_postavki: { type: 'date' },
    };


    q('select kod_postavschika as value, naimenovanie as name from postavschik').then(r => {
        options.kod_postavschika.values = r;
        body.update();
    });

    /*
    `kod_preparata` int NOT NULL,
    `kod_postavki` int NOT NULL,
    `data_proizvodstva` date NOT NULL,
    `srok_godnosti` date NOT NULL,
    `cena_zakupki` decimal(15,2) NOT NULL,
    `kolichestvo` int NOT NULL,
    `summa` decimal(15,2) NOT NULL,
    */
    const invoiceModal = Modal(invoiceId => {
        const data = {
            kod_preparata: invoiceId,
            kod_postavki: id,
            data_proizvodstva: '',
            srok_godnosti: '',
            cena_zakupki: '',
            kolichestvo: '',
            summa: ''
        }
        const options = {
            kod_preparata: { values: [], disabled: invoiceId !== 'new' },
            data_proizvodstva: { type: 'date' },
            srok_godnosti: { type: 'date' },
            cena_zakupki: {
                imask: {
                    mask: Number,
                    min: 0,
                    max: 1000000000000,
                    thousandsSeparator: ' '
                }
            },
            kolichestvo: { type: 'number' },
        }
        
        let nomenclatureName;
        if (invoiceId === 'new') {
            q(`select kod_preparata as value, nazvanie as name from preparat p
               where not exists (
                   select 1 from nakladnaya n
                   where n.kod_preparata = p.kod_preparata
                     and n.kod_postavki = ?
            )`, [id]).then(r => {
                options.kod_preparata.values = r;
                data.kod_preparata = r[0].value;
                body.update();
            })
        } else {
            q('select nazvanie from preparat where kod_preparata = ?', [invoiceId])
            .then(r => {
                nomenclatureName = r[0]['nazvanie'];
                body.update();
            })
        }
        
        if (invoiceId !== 'new') {
            q(`select ${Object.keys(data).join(',')} from nakladnaya where kod_postavki=? and kod_preparata=?`, [id, invoiceId])
            .then(r=>{
                Object.assign(data, r[0]);
                data.data_proizvodstva = data.data_proizvodstva?.split('T')[0];
                data.srok_godnosti = data.srok_godnosti?.split('T')[0]
                body.update()
            });
        }
        return z['p-2'](
            z['text-2xl'](invoiceId === 'new' ? 'Добавить запись в накладную' : 'Редактировать запись накладной'),
            z['mt-8'],
            invoiceId === 'new'
                ? NamedSelect('Номенклатура', Ref(data, 'kod_preparata'), options.kod_preparata)
                : z['flex items-center min-w-[260px] w-full px-3 py-2 transition-colors border rounded-md outline-none bg-white'](
                    _ => nomenclatureName,
                    z['flex-1'],
                    icons.chevronDown
                ),
            z['mt-4 flex'](
                NamedInput('Дата производства', Ref(data, 'data_proizvodstva'), options.data_proizvodstva),
                z['ml-4'],
                NamedInput('Годен по', Ref(data, 'srok_godnosti'), options.srok_godnosti),
            ),
            z['mt-4 flex'](
                NamedInput('Цена закупки', Ref(data, 'cena_zakupki'), options.cena_zakupki),
                z['ml-4'],
                NamedInput('Количество', Ref(data, 'kolichestvo'), options.kolichestvo),
            ),
            z['flex mt-4'](
                z['flex-1'],
                invoiceId === 'new' ? '' :
                    Button('Удалить', async () => {
                        await q('delete from nakladnaya where kod_postavki=? and kod_preparata=?', [id, invoiceId])
                        invoiceModal.close();
                        invoice.load();
                    }),
                Button(invoiceId === 'new' ? 'Добавить' : 'Сохранить', async () => {
                    if (data.kod_preparata.length === 0) {
                        options.kod_preparata.error = 'Значение не может быть пустым';
                        body.update();
                        return;
                    }
                    if (data.data_proizvodstva.length === 0) {
                        options.data_proizvodstva.error = 'Значение не может быть пустым';
                        body.update();
                        return;
                    }
                    if (data.srok_godnosti.length === 0) {
                        options.srok_godnosti.error = 'Значение не может быть пустым';
                        body.update();
                        return;
                    }
                    if (data.cena_zakupki.length === 0) {
                        options.cena_zakupki.error = 'Значение не может быть пустым';
                        body.update();
                        return;
                    }
                    if (data.kolichestvo.length === 0) {
                        options.kolichestvo.error = 'Значение не может быть пустым';
                        body.update();
                        return;
                    }
                    data.summa = Number(data.cena_zakupki).toFixed(2) * Number(data.kolichestvo).toFixed(2);
                    const values = Object.entries(data)
                    if (invoiceId !== 'new') {
                        await q('delete from nakladnaya where kod_postavki=? and kod_preparata=?', [id, invoiceId])
                    }
                    await q(`insert into nakladnaya(${values.map(v=>v[0]).join(',')}) values (${values.map(i=>'?').join(',')})`, values.map(v=>v[1]));
                    invoiceModal.close();
                    invoice.load();
                })
            )
        )
    });

    let invoice;
    if (id !== 'new') {
        /*
        `kod_preparata` int NOT NULL,
        `kod_postavki` int NOT NULL,
        `data_proizvodstva` date NOT NULL,
        `srok_godnosti` date NOT NULL,
        `cena_zakupki` decimal(15,2) NOT NULL,
        `kolichestvo` int NOT NULL,
        `summa` decimal(15,2) NOT NULL,
        */
        q(`select ${Object.keys(data).join(',')} from postavka where kod_postavki=?`, [id])
        .then(r=>{
            Object.assign(data, r[0]);
            data.data_postavki = data.data_postavki?.split('T')[0]
            body.update()
        });
        invoice = Table([
            { name: 'Номенклатура', attr: 'nazvanie' },
            { name: 'Дата производства', attr: 'data_proizvodstva' },
            { name: 'Цена закупки', attr: 'cena_zakupki' },
            { name: 'Количество', attr: 'kolichestvo' },
            { name: 'Сумма', attr: 'summa', aggr: 'sum' }
        ], {
            table: 'nakladnaya n',
            pk: 'p.kod_preparata',
            join: 'inner join preparat p on p.kod_preparata = n.kod_preparata',
            filter: ['kod_postavki = ?', [id]],
            onclick: invoiceModal.open
        });
    }

    async function create(open_new) {
        let cancel;
        if (data.kod_postavschika === '') {
            options.kod_postavschika.error = 'Поле Поставщик не может быть пустым';
            cancel = true;
        }
        if (data.data_postavki === '') {
            options.data_postavki.error = 'Поле Дата не может быть пустым';
            cancel = true;
        }
        if (cancel) {
            body.update();
            return;
        }
        const r = await q('select sum(summa) from nakladnaya where kod_postavki = ?', [id])
        data.summa = r[0]['sum(summa)'];
        const values = Object.entries(data)
        if (id === 'new') {
            q(`insert into postavka(${values.map(v=>v[0]).join(',')}) values (${values.map(i=>'?').join(',')})`, values.map(v=>v[1])).then(i => {
                router.navigate('/supplies/'+ (open_new ? 'new' : i.insertId))
            })
        } else {
            q(`update postavka set ${values.map(v=>v[0]+'=?').join(',')} where kod_postavki=?`, values.map(v=>v[1]).concat([id]))
        }
    }

    return z['p-4'](
        Breadcrumbs(['/supplies', 'Поставки'], id === 'new' ? 'Новая поставка' : 'Редактирование поставки #'+id),
        z['text-4xl mt-8']('Общая информация'),
        z['flex mt-8'](
            NamedSelect('Поставщик', Ref(data, 'kod_postavschika'), options.kod_postavschika),
            z['ml-4'],
            NamedInput('Дата', Ref(data, 'data_postavki'), options.data_postavki),
        ),
        id === 'new' ? '' : z(
            z['flex items-center mt-8'](
                z['text-4xl']('Накладная'),
                z['flex-1'],
                z['flex text-xl items-center cursor-pointer transition hover:text-[#dd88c1]'](
                    { onclick() { invoiceModal.open('new') } },
                    icons.plus, z['ml-4'], 'Добавить'
                ),
                z['ml-4']
            ),
            z['mt-4'],
            invoice,
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
                    q(`delete from postavka where kod_postavki=?`, [id])
                    .then(i => router.navigate('/supplies'));
                }
            }, 'Удалить') : ''
        ),
        invoiceModal
    )
}