import { icons } from ".";
import { q } from "../api";
import router from "../router";
import { body, Ref, Val, z } from "../z/z3.9";
import Breadcrumbs from "./breadcrumbs";
import Button from "./button";
import { NamedInput, NamedSelect } from "./input";
import { Doughnut, Hist } from './chart';

function declOfNum(number, titles) {  
    const cases = [2, 0, 1, 1, 1, 2];  
    return number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];  
}

function timeDiff(date, a) {
    date = new Date(date);
    if (a == undefined) a = new Date();
    if (typeof a === 'string') a = new Date(a);
    return [
        a.getFullYear() - date.getFullYear(),
        a.getMonth() - date.getMonth(),
        a.getDate() - date.getDate()
    ];
}

function monthsDiff(data, a) {
    const diff = timeDiff(data, a);
    return diff[0]*12 + diff[1];
}

function diffStr(diff) {
    const res = [];
    if (diff[0] > 0) res.push(declOfNum(diff[0], ['год', 'года', 'лет']));
    if (diff[1] > 0) res.push(declOfNum(diff[1], ['месяц', 'месяца', 'месяцев']));
    if (diff[2] > 0) res.push(declOfNum(diff[2], ['день', 'дня', 'дней']));
    return res.join(' ');
}

function reportModal(data, options, open) {
    return z['flex items-center justify-center h-full'](
        z['w-96'](
            z['text-4xl']('Отчет по сотрудникам'),
            z['text-lg text-gray-700']('Введите критерии отбора'),
            z['mt-8'],
            NamedInput('Дата формирования с', Ref(data, 'start'), options.start),
            z['mt-4'],
            NamedInput('Дата формирования по', Ref(data, 'end'), options.end),
            z['mt-4'],
            NamedSelect('Сотрудник', Ref(data, 'employee'), options.employee),
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
                    options.employee.error = 'Введите cотрудника, по которому будет сформирован отчет';
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

const rubFormater = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format;

function report(data, options) {
    let employeeData = {}, loading = true;
    Promise.all([
        q('select * from sotrudnik where kod_sotrudnika = ?', [data.employee]).then(i => Object.assign(employeeData, i[0])),
        q('select data_prodazhi, summa_checka from `check` where kod_sotrudnika = ?', [data.employee]).then(i => {
            data.sales = i;
            data.totalSales = data.sales.reduce((a, b) => a + Number(b.summa_checka), 0);
        })
    ]).then(i => {
        data.reportStart = Math.max(new Date(employeeData.data_naima), new Date(data.start));
        data.reportEnd = employeeData.data_uvolneniya && new Date(employeeData.data_uvolneniya) < new Date(data.end) ? new Date(employeeData.data_uvolneniya) : new Date();
        data.totalSalary = monthsDiff(data.reportStart, data.reportEnd) * employeeData.zarplata;
        loading = false;
        body.update();
    })
    return z['p-4 h-full'](
        Breadcrumbs(['/reports', 'Отчеты'], 'Производительность сотрудника'),
        _ => loading ? z['flex items-center justify-center h-full'](icons.loading, z['ml-4'], 'Формирование') : z(
            z['mt-8'],
            z['text-2xl']('Отчет с ' + (new Date(data.reportStart)).toISOString().split('T')[0] + ' по ' + (new Date(data.reportEnd)).toISOString().split('T')[0]),
            z['text-2xl'](employeeData['familya'] + ' ' + employeeData['imya'] + ' ' + employeeData['otchestvo']),
            z['text-lg mt-2'](
                'Работает с ' + (new Date(employeeData.data_naima)).toISOString().split('T')[0] + ' ' + '(' +
                diffStr(timeDiff(employeeData.data_naima, employeeData.data_uvolneniya)) + ')'
            ),
            z['text-lg'](
                'Зарплата ' + rubFormater(employeeData.zarplata),
                ' c ' + (new Date(data.reportStart)).toISOString().split('T')[0] + ' по ' + (new Date(data.reportEnd)).toISOString().split('T')[0],
                ' (', rubFormater(data.totalSalary) + ' зараплаты отдано за это время)'
            ),
            z.flex(
                Doughnut(['Выплачено заработной платы', 'Сумма продаж'], [data.totalSalary, data.totalSales])
            ),
            z['mt-4'],
            Hist(data.sales, data.reportStart, data.reportEnd)
        )
    );
}

export default function EmployeesReport() {
    const data = {
        start: '',
        end: '',
        employee: ''
    };
    const options  = {
        start: { type: 'date' },
        end: { type: 'date' },
        employee: { values: [] }
    };
    q('select kod_sotrudnika as value, Concat(familya," ",imya," ",otchestvo) as name from sotrudnik').then(r => {
        options.employee.values = r;
        body.update();
    });
    const p = Val(reportModal(data, options, _ => {
        p(report(data, options));
    }));
    return p
}