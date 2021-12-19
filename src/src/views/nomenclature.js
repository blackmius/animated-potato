import { z , Val, Ref, body} from "../z/z3.9";
import Table from "./table";
import { icons } from ".";
import router from "../router";
import { Check, NamedInput, NamedSelect } from "./input";
import Breadcrumbs from "./breadcrumbs";
import { q } from "../api";

export function NomenclatureTable() {
    const table = Table([
        { name: 'Наименование', attr: 'nazvanie' },
        { name: 'Цена в продаже', attr: 'cena_v_prodazhe' },
    ], {
        table: 'preparat',
        pk: 'kod_preparata',
        link: '/nomenclature'
    });
    return z['p-4'](
        z['flex items-center'](
            z['text-2xl']('Номенклатура'),
            z['flex-1'],
            z['flex items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { router.navigate('/nomenclature/new') }},
                icons.plus, z['ml-4'], 'Добавить номенклатуру'
            )
        ),
        z['mt-4'],
        table
    )
}

export function NomenclatureForm(id) {
    const data = {
        nazvanie: '',
        cena_v_prodazhe: 0,
        otpuskaetsa_po_receptu: false,
        kod_atx: '',
        vid: '',
        sezoniy: false
    };
    const options = {
        nazvanie: {},
        cena_v_prodazhe: { type: 'number' },
        otpuskaetsa_po_receptu: {},
        kod_atx: {
            imask: {
                mask: 'A00AA00',
                blocks: {
                    A: { mask: /^[A-V]$/ }
                }
            }
        },
        vid: { values: [] },
        sezoniy: {}
    };

    if (id !== 'new') {
        q(`select ${Object.keys(data).join(',')} from preparat where kod_preparata=?`, [id])
        .then(r=>{ Object.assign(data, r[0]); body.update() })
    }

    function create(open_new) {
        if (data.nazvanie.trim() === '') {
            options.nazvanie.error = 'Название не может быть пустым';
            body.update();
            return;
        }
        const values = Object.entries(data)
        if (id === 'new') {
            q(`insert into preparat(${values.map(v=>v[0]).join(',')}) values (${values.map(i=>'?').join(',')})`, values.map(v=>v[1])).then(i => {
                router.navigate('/nomenclature/'+ (open_new ? 'new' : i.insertId))
            })
        } else {
            q(`update preparat set ${values.map(v=>v[0]+'=?').join(',')} where kod_preparata=?`, values.map(v=>v[1]).concat([id]))
        }
    }

    return z['p-4'](
        Breadcrumbs(['/nomenclature', 'Номенклатура'], id === 'new' ? 'Новая номенклатура' : 'Редактирование номенклатуры #'+id),
        z['text-4xl mt-8']('Общая информация'),
        z['flex mt-8'](
            NamedInput('Наименование', Ref(data, 'nazvanie'), options.nazvanie),
            z['ml-4'],
            NamedInput('Цена в продаже', Ref(data, 'cena_v_prodazhe'), options.cena_v_prodazhe)
        ),
        z['flex mt-4'](
            z['w-96'](NamedSelect('Фармако-терапевтическая группа', Ref(data, 'vid'), options.vid)),
            z['ml-4'],
            NamedInput('Код АТХ', Ref(data, 'kod_atx'), options.kod_atx)
        ),
        z['flex mt-4'](
            Check(Ref(data, 'otpuskaetsa_po_receptu'), 'Продается по рецепту'),
            z['ml-4'],
            Check(Ref(data, 'sezoniy'), 'Сезонный')
        ),
        z['mt-4'],
        z['sticky bottom-4'](
            z['w-full p-4 bg-[#dd88c1] transition text-white rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']({
                onclick() { create(); }
            }, id === 'new' ? 'Создать' : 'Сохранить'),

            id === 'new' ? z['w-full mt-4 p-4 bg-[#dd88c1] transition text-white rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']({
                onclick() { create(true); }
            }, 'Создать и открыть новую форму') : '',

            id !== 'new' ? z['w-full mt-4 p-4 bg-[#dd88c1] transition text-white rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']({
                onclick() {
                    q(`delete from preparat where kod_preparata=?`, [id])
                    .then(i => router.navigate('/nomenclature'));
                }
            }, 'Удалить') : ''
        )
    )
}