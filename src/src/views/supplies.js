import { z } from "../z/z3.9";
import Table from "./table";
import { icons } from ".";
import router from "../router";
import Breadcrumbs from "./breadcrumbs";

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

export function SuppliesForm(id, state) {
    const data = {
        kod_postavschika: '',
        data_postavki: '',
        summa: ''
    };

    const options = {
        kod_postavschika: {},
        data_postavki: {},
    };

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
        invoice = Table([
            { name: 'Номенклатура', attr: 'nazvanie' },
            { name: 'Дата производства', attr: 'data_proizvodstva' },
            { name: 'Цена закупки', attr: 'cena_zakupki' },
            { name: 'Количество', attr: 'kolichestvo' },
            { name: 'Сумма', attr: 'summa' }
        ], {
            table: 'nakladnaya n',
            join: 'inner join preparat p on p.kod_preparata = n.kod_preparata',
            filter: ['kod_postavki = ?', [id]],
            onclick(e) { console.log(e) }
        });
    }
    return z['p-4'](
        Breadcrumbs(['/supplies', 'Поставки'], id === 'new' ? 'Новая поставка' : 'Редактирование поставки #'+id),
        z['mt-4'],
        z['flex items-center'](
            z['text-4xl']('Накладная'),
            z['flex-1'],
            z['flex text-xl items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { } },
                icons.plus, z['ml-4'], 'Добавить'
            ),
            z['ml-4']
        ),
        z['mt-4'],
        invoice,
        z['mt-4'],
        z['w-full p-4 bg-[#dd88c1] transition text-white sticky bottom-4 rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']('Сохранить'),
    )
}