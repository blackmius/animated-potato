import { icons } from ".";
import { q } from "../api";
import router from "../router";
import { Ref, Val, z, body } from "../z/z3.9";
import Breadcrumbs from "./breadcrumbs";
import Button from "./button";
import { NamedInput, NamedSelect } from "./input";
import Table from "./table";
import Chart from 'chart.js/auto';

function reportModal(data, options, open) {
    return z['flex items-center justify-center h-full'](
        z['w-[400px]'](
            z['text-4xl']('Отчет спрос на товары'),
            z['text-lg text-gray-700']('Введите критерии отбора'),
            z['mt-8'],
            NamedInput('Дата формирования с', Ref(data, 'start'), options.start),
            z['mt-4'],
            NamedInput('Дата формирования по', Ref(data, 'end'), options.end),
            z['mt-4'],
            NamedSelect('Фармако-терапевтическая группа', Ref(data, 'type'), options.type),
            z['mt-8'],
            z.flex(z['flex-1'], Button('Отмена', _ => router.navigate('/reports')), z['ml-4'], Button('Сформировать отчет', _ => {
                let cancel = false;
                if (new Date(data.start) > new Date(data.end)) {
                    options.start.error = 'Дата начала не может быть больше даты конца';
                    cancel = true;
                }
                if (data.start == '') {
                    options.start.error = 'Введите дату начала формирования отчета';
                    cancel = true;
                }
                if (data.end == '') {
                    options.end.error = 'Введите дату окончания формирования отчета';
                    cancel = true;
                }
                if (data.employee == '') {
                    options.type.error = 'Введите вид , по которому будет сформирован отчет';
                    cancel = true;
                }
                if (cancel) {
                    body.update();
                    return;
                }
                open();
            }))
        )
    );
}

const COLORS = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
];

function report(data, options) {
    let loading = true;
    const table = Table([
        { name: 'Номенклатура', attr: 'nazvanie'  },
        { name: 'Количество', attr: 'count(*)' },
        { name: 'Сумма', attr: 'sum(summa)' }
    ], {
        table: 'prodazha',
        join: 'inner join preparat on preparat.kod_preparata = prodazha.kod_preparata inner join `check` on `check`.kod_checka = prodazha.kod_checka',
        filter: ['vid = ? and date(data_prodazhi) >= date(?) and date(data_prodazhi) <= date(?)', [data.type, data.start, data.end]],
        group: 'preparat.nazvanie'
    });
    Promise.all([
        q(`select nazvanie, count(*) as c, sum(summa) as s from prodazha
           inner join preparat on preparat.kod_preparata = prodazha.kod_preparata
           inner join \`check\` on \`check\`.kod_checka = prodazha.kod_checka
           where vid = ? and date(data_prodazhi) >= date(?) and date(data_prodazhi) <= date(?)
           group by nazvanie`, [data.type, data.start, data.end]).then(i => {
            data.values = i;
            data.values.forEach(d => d.s = Number(d.s));
        }),
        q(`select DATE_FORMAT(data_prodazhi,'%Y-%m-%d') as d, nazvanie as l, sum(summa) as s from prodazha
           inner join preparat on preparat.kod_preparata = prodazha.kod_preparata
           inner join \`check\` on \`check\`.kod_checka = prodazha.kod_checka
           where vid = ? and date(data_prodazhi) >= date(?) and date(data_prodazhi) <= date(?)
           group by DATE_FORMAT(data_prodazhi,'%Y-%m-%d'), nazvanie`, [data.type, data.start, data.end]).then(i => {
            data.days = {}
            i.forEach(d => {
                if (!data.days[d.l]) data.days[d.l] = [];
                data.days[d.l].push({x: d.d, y: Number(d.s)})
            });
        }),
    ]).then(i => {
        loading = false;
        body.update();
    })
    return z['p-4'](
        Breadcrumbs(['/reports', 'Отчеты'], 'Спрос на товары'),
        z['mt-8'],
        _ => loading ? z['flex items-center justify-center h-full w-full fixed'](icons.loading, z['ml-4'], 'Формирование') : z(
            z['mt-8'],
            z['text-2xl']('Отчет с ' + (new Date(data.start)).toISOString().split('T')[0] + ' по ' + (new Date(data.end)).toISOString().split('T')[0]),
            z['w-full h-96'](
                z.Canvas({
                    on$created(e) {
                        new Chart(e.target, {
                            data: {
                                datasets: Object.entries(data.days).map(([k, v], i) => ({
                                    label: k,
                                    data: v,
                                    backgroundColor: COLORS[i]
                                }))
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        type: 'time',
                                        time: { unit: 'day', min: new Date(data.start), max: new Date(data.end) }
                                    }
                                }
                            },
                            type: 'line'
                        })
                    }
                }),
            ),
            z['mt-4'],
            z.flex(
                z['w-1/2'](
                    z.Canvas({
                        on$created(e) {
                            new Chart(e.target, {
                                data: {
                                    labels: data.values.map(i => i.nazvanie),
                                    datasets:[{
                                        label: 'Количество продаж',
                                        data: data.values.map(i => i.c),
                                        backgroundColor: 'rgb(75, 192, 192)'
                                    }],
                                },
                                type: 'bar'
                            })
                        }
                    })
                ),
                z['w-1/2'](
                    z.Canvas({on$created(e) { new Chart(e.target, {
                        data: {
                            labels: data.values.map(i => i.nazvanie),
                            datasets:[{
                                label: 'Сумма продаж',
                                data: data.values.map(i => i.s),
                                backgroundColor: 'rgb(75, 192, 192)'
                            }],
                        },
                        type: 'bar'
                    }) }})
                ),
            ),
            z['mt-4'],
            table
        )
    );
}

export default function ProductsReport() {
    const data = {
        start: '',
        end: '',
        type: ''
    };
    const options  = {
        start: { type: 'date' },
        end: { type: 'date' },
        type: { values: [] }
    };
    q('select kod_vida as value, nazvanie as name from vid_preparata').then(r => {
        options.type.values = r;
        body.update();
    });
    const p = Val(reportModal(data, options, _ => {
        p(report(data, options));
    }));
    return p
}