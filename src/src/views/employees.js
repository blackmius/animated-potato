import { body, Ref, Val, z } from "../z/z3.9";
import Table from "./table";
import { icons } from ".";
import router from "../router";
import { NamedInput, NamedSelect } from "./input";
import Breadcrumbs from "./breadcrumbs";
import Button from "./button";
import { q } from "../api";
import { employee } from "./auth";

export function EmployeesTable() {
    const table = Table([
        { name: 'ФИО', attr: 'Concat(familya," ",imya," ",otchestvo)' },
        { name: 'Телефон', attr: 'telefon' },
        { name: 'Должность', attr: 'naimenovanie' }
    ], {
        table: 'sotrudnik',
        join: 'inner join dolzhnost d on d.kod_dolzhnosti = sotrudnik.kod_dolzhnosti',
        pk: 'kod_sotrudnika',
        link: '/employees'
    });
    return z['p-4'](
        z['flex items-center'](
            z['text-2xl']('Сотрудники'),
            z['flex-1'],
            z['flex items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { router.navigate('/employees/new') }},
                icons.plus, z['ml-4'], 'Добавить сотрудника'
            )
        ),
        z['mt-4'],
        table
    )
}

/*
`kod_sotrudnika` int NOT NULL AUTO_INCREMENT,
  `familya` varchar(256) NOT NULL,
  `imya` varchar(256) NOT NULL,
  `otchestvo` varchar(256) NOT NULL,
  `telefon` char(11) NOT NULL,
  `seriya_pasporta` char(4) NOT NULL,
  `nomer_pasporta` char(6) NOT NULL,
  `data_rozhdeniya` date NOT NULL,
  `pol` tinyint NOT NULL,
  `kod_dolzhnosti` int NOT NULL,
  `zarplata` decimal(15,2) NOT NULL,
  `data_naima` date NOT NULL,
  `data_uvolneniya` date DEFAULT NULL,
  `kod_avtorizacii` varchar(32) NOT NULL,
*/

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export function EmployeesForm(id) {
    const data = {
        familya: '',
        imya: '',
        otchestvo: '',
        telefon: '',
        seriya_pasporta: '0000',
        nomer_pasporta: '000000',
        data_rozhdeniya: '',
        pol: 0,
        kod_dolzhnosti: 1,
        zarplata: 9900,
        data_naima: '',
        data_uvolneniya: ''
    };
    if (employee().kod_dolzhnosti === 3) data.kod_avtorizacii = makeid(32);
    const options = {
        familya: { maxlength: 256 },
        imya: { maxlength: 256 },
        otchestvo: { maxlength: 256 },
        telefon: { imask: { mask: '+{7}(000)000-00-00' } },
        data_rozhdeniya: { type: 'date' },
        seriya_pasporta: { imask: { mask: '0000', overwrite: true } },
        nomer_pasporta: { imask: { mask: '000000', overwrite: true }},
        pol: { values: [{ value: 1, name: 'Мужской' }, { value: 0, name: 'Женский' }] },
        kod_dolzhnosti: { values: [ ] },
        zarplata: {
            imask: {
                mask: Number,
                min: 0,
                max: 1000000000000,
                thousandsSeparator: ' '
            }
        },
        data_naima: { type: 'date' },
        data_uvolneniya: { type: 'date' },
        kod_avtorizacii: { maxlength: 32 }
    };
    
    if (employee().kod_dolzhnosti === 1) {
        for (const key in options) options[key].disabled = true;
    }

    q('select kod_dolzhnosti, naimenovanie from dolzhnost').then(r => {
        options.kod_dolzhnosti.values = r.map(v => ({ value: v.kod_dolzhnosti, name: v.naimenovanie }));
        body.update();
    })

    let chequesTable;
    if (id !== 'new') {
        q(`select ${Object.keys(data).join(',')} from sotrudnik where kod_sotrudnika=?`, [id])
        .then(r=>{
            Object.assign(data, r[0]);
            data.data_naima = data.data_naima?.split('T')[0]
            data.data_uvolneniya = data.data_uvolneniya?.split('T')[0]
            data.data_rozhdeniya = data.data_rozhdeniya?.split('T')[0]
            body.update()
        });
        chequesTable = Table([
            { name: 'Дата', attr: 'data_prodazhi'  },
            { name: 'Сумма', attr: 'summa_checka' }
        ], {
            table: '`check`',
            filter: ['kod_sotrudnika = ?', [id]],
            pk: 'kod_checka',
            link: '/cheques'
        });
    }

    function create(open_new) {
        let cancel;
        if (data.familya.trim() === '') {
            options.familya.error = 'Поле Фамилия не может быть пустым';
            cancel = true;
        }
        if (data.imya.trim() === '') {
            options.imya.error = 'Поле Имя не может быть пустым';
            cancel = true;
        }
        if (data.seriya_pasporta.trim() === '' || data.seriya_pasporta === '0000') {
            options.seriya_pasporta.error = 'Поле Серия паспорта не может быть пустым';
            cancel = true;
        }
        if (data.nomer_pasporta.trim() === '' || data.seriya_pasporta === '000000') {
            options.nomer_pasporta.error = 'Поле Номер паспорта не может быть пустым';
            cancel = true;
        }
        if (data.data_rozhdeniya.trim() === '') {
            options.data_rozhdeniya.error = 'Поле Дата рождения не может быть пустым';
            cancel = true;
        }
        if (data.zarplata < 0) {
            options.zarplata.error = 'Поле Зарплата не может быть отрицательным';
            cancel = true;
        }
        if (data.data_uvolneniya && new Date(data.data_naima) > new Date(data.data_uvolneniya)) {
            options.data_naima.error = 'Дата найма не может быть больше даты увольнения';
            cancel = true;
        }
        if (data.data_naima >= 0) {
            options.data_naima.error = 'Поле Дата найма не может быть пустым';
            cancel = true;
        }
        if (employee().kod_dolzhnosti === 3 && data.kod_avtorizacii.length == 0) {
            options.kod_avtorizacii.error = 'Поле Код авторизации не может быть пустым';
            cancel = true;
        }
        if (cancel) {
            body.update();
            return;
        }
        if (data.data_uvolneniya == '') data.data_uvolneniya = null;
        const values = Object.entries(data)
        if (id === 'new') {
            q(`insert into sotrudnik(${values.map(v=>v[0]).join(',')}) values (${values.map(i=>'?').join(',')})`, values.map(v=>v[1])).then(i => {
                router.navigate('/employees/'+ (open_new ? 'new' : i.insertId))
            })
        } else {
            q(`update sotrudnik set ${values.map(v=>v[0]+'=?').join(',')} where kod_sotrudnika=?`, values.map(v=>v[1]).concat([id]))
        }
    }

    return z['p-4'](
        Breadcrumbs(['/employees', 'Сотрудники'], id === 'new' ? 'Новый сотрудник' : 'Редактирование сотрудника #'+id),
        z['text-4xl mt-8']('Общая информация'),
        z['flex mt-8'](
            NamedInput('Фамилия *', Ref(data, 'familya'), options.familya),
            z['ml-4'],
            NamedInput('Имя *', Ref(data, 'imya'), options.imya),
            z['ml-4'],
            NamedInput('Отчество', Ref(data, 'otchestvo'), options.otchestvo),
        ),
        z['flex mt-4'](
            NamedInput('Дата рождения *', Ref(data, 'data_rozhdeniya'), options.data_rozhdeniya),
            z['ml-4'],
            NamedSelect('Пол', Ref(data, 'pol'), options.pol),
        ),
        z['flex mt-4'](
            NamedInput('Телефон', Ref(data, 'telefon'), options.telefon),
        ),
        z['text-4xl mt-8']('Информация трудоустройства'),
        z['flex mt-8'](
            NamedInput('Серия паспорта *', Ref(data, 'seriya_pasporta'), options.seriya_pasporta),
            z['ml-4'],
            NamedInput('Номер паспорта *', Ref(data, 'nomer_pasporta'), options.nomer_pasporta),
        ),
        z['flex mt-4'](
            NamedSelect('Должность', Ref(data, 'kod_dolzhnosti'), options.kod_dolzhnosti),
            z['ml-4'],
            NamedInput('Зарплата *', Ref(data, 'zarplata'), options.zarplata),
        ),
        z['flex mt-4'](
            NamedInput('Дата найма *', Ref(data, 'data_naima'), options.data_naima),
            z['ml-4'],
            NamedInput('Дата увольнения', Ref(data, 'data_uvolneniya'), options.data_uvolneniya),
        ),
        employee().kod_dolzhnosti === 3 ? z(
            z['text-4xl mt-8']('Учетные данные пользователя системы'),
            z['w-96 mt-4'](
                NamedInput('Ключ авторизации *', Ref(data, 'kod_avtorizacii'), options.kod_avtorizacii),
            ),
        ) : '',
        id !== 'new' ? z(
            z['flex items-center mt-8'](
                z['text-4xl']('Продажи сотрудника'),
                z['flex-1'],
                employee().kod_dolzhnosti === 2 || employee().kod_dolzhnosti === 3 ?
                    z['flex text-xl items-center cursor-pointer transition hover:text-[#dd88c1]'](
                        { onclick() { router.navigate('/cheques/new', { employee: id }) } },
                        icons.plus, z['ml-4'], 'Добавить'
                    )
                    : '',
                z['ml-4']
            ),
            z['mt-4'],
            chequesTable
        ) : '',
        z['mt-8'],
        employee().kod_dolzhnosti === 2 || employee().kod_dolzhnosti === 3 ? z['sticky bottom-4'](
            z['w-full p-4 bg-[#dd88c1] transition text-white rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']({
                onclick() { create(); }
            }, id === 'new' ? 'Создать' : 'Сохранить'),

            id === 'new' ? z['w-full mt-4 p-4 bg-[#dd88c1] transition text-white rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']({
                onclick() { create(true); }
            }, 'Создать и открыть новую форму') : '',

            id !== 'new' ? z['w-full mt-4 p-4 bg-[#dd88c1] transition text-white rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']({
                onclick() {
                    q(`delete from sotrudnik where kod_sotrudnika=?`, [id])
                    .then(i => router.navigate('/employees'));
                }
            }, 'Удалить') : ''
        ) : ''
    )
}