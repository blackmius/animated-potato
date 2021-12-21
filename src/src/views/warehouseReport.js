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
        { name: 'Номенклатура', attr: 'nazvanie' },
        { name: 'Остатки', attr: '(IFNULL((select sum(kolichestvo) from nakladnaya n where n.kod_preparata = pp.kod_preparata), 0) - IFNULL((select sum(kolichestvo_upakovok) from prodazha pr where pr.kod_preparata = pp.kod_preparata), 0))' },
    ], {
        table: 'preparat pp'
    });
    Promise.all([
        q(`select nazvanie as l,
            IFNULL((select sum(kolichestvo) from nakladnaya n where n.kod_preparata = pp.kod_preparata), 0) as p,
            IFNULL((select sum(kolichestvo_upakovok) from prodazha pr where pr.kod_preparata = pp.kod_preparata), 0) as s
            from preparat pp`).then(i => {
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
                    height: data.length < 15 ? '500px' : (data.length * 24 + 'px'),
                    width: 1580,
                    on$created(e) {
                        new Chart(e.target, {
                            data: {
                                labels: data.map(i => i.l),
                                datasets:[{
                                    label: 'Продажи',
                                    data: data.map(i => -i.s),
                                    backgroundColor: 'rgb(255, 99, 132)',
                                },
                                {
                                    label: 'Поступления',
                                    data: data.map(i => i.p),
                                    backgroundColor: 'rgb(54, 162, 235)',
                                }],
                            },
                            options: {
                                indexAxis: 'y',
                                scales: {
                                    y: { stacked: true }
                                },
                                responsive: false,
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