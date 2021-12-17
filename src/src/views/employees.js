import { Val, z } from "../z/z3.9";
import Table from "./table";
import { icons } from ".";
import router from "../router";
import { NamedInput, NamedSelect } from "./input";
import Breadcrumbs from "./breadcrumbs";
import Button from "./button";

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

export function EmployeesForm(id) {
    const chequesTable = Table([
        { name: 'Дата' },
        { name: 'Сумма' }
    ]);

    const data = {
        name: '',
        surname: '',
        patronymic: '',
        phone: ''
    };

    return z['p-4'](
        Breadcrumbs(['/employees', 'Сотрудники'], id === 'new' ? 'Новый сотрудник' : 'Редактирование сотрудника #'+id),
        z['text-4xl mt-8']('Общая информация'),
        z['flex mt-8'](
            NamedInput('Фамилия', Val(data['surname'], v=>data['surname']=v)),
            z['ml-4'],
            NamedInput('Имя', Val(data['name'], v=>data['name']=v)),
            z['ml-4'],
            NamedInput('Отчество', Val(data['patronymic'], v=>data['patronymic']=v)),
        ),
        z['flex mt-4'](
            NamedInput('Дата рождения', Val(data['dob'], v=>data['dob']=v), { type: 'date' }),
            z['ml-4'],
            NamedSelect('Пол', Val(data['sex'], v=>data['sex']=v), {
                values: [{ value: 0, name: 'Мужской' }, { value: 1, name: 'Женский' }]
            }),
        ),
        z['flex mt-4'](
            NamedInput('Телефон', Val(data['phone'], v=>data['phone']=v), { type: 'phone' }),
        ),
        z['text-4xl mt-8']('Информация трудоустройства'),
        z['flex mt-8'](
            NamedInput('Код паспорта', Val(data['passport_code'], v=>data['passport_code']=v), { type: 'number' }),
            z['ml-4'],
            NamedInput('Номер паспорта', Val(data['pasport_number'], v=>data['pasport_number']=v), { type: 'number' }),
        ),
        z['flex mt-4'](
            NamedSelect('Должность', Val(data['position'], v=>data['position']=v), {
                values: [{value: 1, name: 'Уборщик'}]
            }),
            z['ml-4'],
            NamedInput('Зарплата', Val(data['salary'], v=>data['salary']=v), { type: 'number' }),
        ),
        z['flex mt-4'](
            NamedInput('Дата найма', Val(data['hiring_date'], v=>data['hiring_date']=v), { type: 'date' }),
            z['ml-4'],
            NamedInput('Дата увольнения', Val(data['fire_date'], v=>data['fire_date']=v), { type: 'date' }),
        ),
        z['text-4xl mt-8']('Учетные данные пользователя системы'),
        z['flex mt-4'](
            NamedInput('Ключ авторизации', Val('', v=>data['hiring_date']=v)),
        ),

        z['flex items-center mt-8'](
            z['text-4xl']('Продажи сотрудника'),
            z['flex-1'],
            z['flex text-xl items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { } },
                icons.plus, z['ml-4'], 'Добавить'
            ),
            z['ml-4']
        ),
        z['mt-4'],
        chequesTable,
        z['mt-4'],
        z['w-full p-4 bg-[#dd88c1] transition text-white sticky bottom-4 rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']('Сохранить'),
    )
}