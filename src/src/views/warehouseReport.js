import { icons } from ".";
import { q } from "../api";
import router from "../router";
import { body, Val, z } from "../z/z3.9";
import Breadcrumbs from "./breadcrumbs";
import Button from "./button";
import { NamedInput } from "./input";

import Chart from 'chart.js/auto';
import Table from "./table";

export default function WarehouseReport() {
    document.title = 'Отчет остатков на складе';
    let data = [], loading = true;
    const table = Table([
        { name: 'Номенклатура', attr: 'nazvanie'  },
        { name: 'Остатки', attr: 'sum(kolichestvo) - sum(kolichestvo_upakovok)' },
    ], {
        table: 'prodazha',
        join: 'inner join preparat on preparat.kod_preparata = prodazha.kod_preparata join nakladnaya on nakladnaya.kod_preparata = prodazha.kod_preparata',
        group: 'nazvanie'
    });
    Promise.all([
        q(`select nazvanie as l, sum(kolichestvo_upakovok) as s, sum(kolichestvo) as p from prodazha
           inner join preparat on preparat.kod_preparata = prodazha.kod_preparata
           join nakladnaya on nakladnaya.kod_preparata = prodazha.kod_preparata
           group by nazvanie`).then(i => {
            data = i;
        })
    ]).then(_ => {
        loading = false;
        body.update();
    })
    return z['p-4'](
        Breadcrumbs(['/reports', 'Отчеты'], 'Отчет по остаткам'),
        _ => loading ? z['flex items-center justify-center h-full w-full fixed'](icons.loading, z['ml-4'], 'Формирование') : z(
            z['w-full mt-8'](
                z.Canvas({
                    on$created(e) {
                        new Chart(e.target, {
                            data: {
                                labels: data.map(i => i.l),
                                datasets:[{
                                    label: 'Продажи',
                                    data: data.map(i => -i.s),
                                    backgroundColor: 'rgb(255, 99, 132)'
                                },
                                {
                                    label: 'Поступления',
                                    data: data.map(i => i.p),
                                    backgroundColor: 'rgb(54, 162, 235)'
                                }],
                            },
                            options: {
                                indexAxis: 'y',
                                scales: {
                                    y: { stacked: true }
                                },
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                    },
                                }
                            },
                            type: 'bar'
                        })
                    }
                })
            ),
            z['mt-4'],
            table
        )
    );
}