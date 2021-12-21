import { z, Val, Ref, body, throttle } from "../z/z3.9";
import Table from "./table";
import { icons } from ".";
import router from "../router";
import { NamedSelect, NamedInput } from "./input";
import Modal from "./modal";
import Breadcrumbs from "./breadcrumbs";
import { q } from "../api";
import Button from "./button";

export function SuppliersTable() {
    document.title = 'Поставщики';

    const table = Table([
        { name: 'Наименование организации', attr: 'naimenovanie' },
    ], {
        table: 'postavschik',
        pk: 'kod_postavschika',
        link: '/suppliers'
    });

    return z['p-4'](
        z['flex items-center'](
            z['text-2xl']('Поставщики'),
            z['flex-1'],
            z['flex items-center cursor-pointer transition hover:text-[#dd88c1]'](
                { onclick() { router.navigate('/suppliers/new') }},
                icons.plus, z['ml-4'], 'Добавить поставщика'
            )
        ),
        z['mt-4'],
        table
    )
}

/*
  `kod_postavschika` int NOT NULL AUTO_INCREMENT,
  `naimenovanie` varchar(256) NOT NULL,
  `inn` char(11) NOT NULL,
  `kladr` char(20) DEFAULT NULL,
  */
export function SuppliersForm(id) {
    document.title = (id !== 'new' ? 'Редактирование' : 'Добавление') + ' поставщика';

    const data = {
        naimenovanie: '',
        inn: '',
        kladr: ''
    };

    const options = {
        naimenovanie: {},
        inn: { imask: { mask: '00000000000' } },
        kladr: { disabled: true }
    };

    const addressModal = Modal(_ => {
        const _data = {
            kladr: data.kladr,
            region: '',
            gorod: '',
            raion: '',
            ulitsa: '',
            dom: '',
            stroenie: '',
            korpus: '',
            ofis: '',
        }
        const options = {
            kladr: {
                imask: {
                    // СС РРР ГГГ ППП УУУУ АА,
                    mask: '00 000 000 000 0000 00',
                    lazy: false
                }
            },
            region: {},
            gorod: {},
            raion: {},
            ulitsa: {},
            dom: {},
            stroenie: {},
            korpus: {},
            ofis: {},
        }
        const load = throttle(100, _ =>
            q('select * from adresa where kladr = ?', [_data.kladr]).then(i => {
                if (i.length > 0) Object.assign(_data, i[0]);
                body.update();
            }));
        load();
        return z['p-2 w-[500px]'](
            z['text-2xl']('Редактирование адреса'),
            z['mt-8'],
            NamedInput('Номер КЛАДР', Ref(_data, 'kladr', load), options.kladr),
            z['flex mt-4'](
                z['w-1/2'](NamedInput('Регион', Ref(_data, 'region'), options.region)),
                z['ml-4 w-1/2'](NamedInput('Город', Ref(_data, 'gorod'), options.gorod)),
            ),
            z['flex mt-4'](
                z['w-1/2'](NamedInput('Район', Ref(_data, 'raion'), options.raion)),
                z['ml-4 w-1/2'](NamedInput('Улица', Ref(_data, 'ulitsa'), options.ulitsa)),
            ),
            z['flex mt-4'](
                z['w-1/4'](NamedInput('Дом', Ref(_data, 'dom'), options.dom)),
                z['ml-4 w-1/4'](NamedInput('Строение', Ref(_data, 'stroenie'), options.stroenie)),
                z['ml-4 w-1/4'](NamedInput('Корпус', Ref(_data, 'korpus'), options.korpus)),
                z['ml-4 w-1/4'](NamedInput('Офис', Ref(_data, 'ofis'), options.ofis)),
            ),
            z['flex mt-4'](
                z['flex-1'],
                Button('Отмена', addressModal.close),
                Button('Сохранить', async () => {
                    const entries = Object.entries(_data);
                    await q(`replace into adresa(${entries.map(v=>v[0]).join(',')}) values (${entries.map(_=>'?').join(',')})`, entries.map(v=>v[1]));
                    data.kladr = _data.kladr;
                    if (id !== 'new') create();
                    addressModal.close();
                })
            )
        );
    });

    const contactModal = Modal((contactId) => {
        const data = {
            kod_tipa_kontakta: 1,
            znachenie: '',
            kod_postavschika: id
        }
        const options = {
            kod_tipa_kontakta: { values: [] },
            znachenie: {
                imask: {
                    mask: [
                        { mask: '+{7}(000)000-00-00' },
                        { mask: /^\S*@?\S*$/ }
                    ]
                }
            }
        }
        q('select kod_tipa_kontakta as value, naimenovanie as name from tip_kontakta').then(r => {
            options.kod_tipa_kontakta.values = r;
            body.update();
        })

        if (contactId !== 'new') {
            q(`select ${Object.keys(data).join(',')} from konakti_postavschika where kod_kontakta_postavschika=?`, [contactId])
            .then(r=>{
                Object.assign(data, r[0]);
                body.update()
            });
        }
        return z['p-2'](
            z['text-2xl']((contactId === 'new' ? 'Создание' : 'Редактирование' ) + ' контакта'),
            z['mt-8'],
            NamedSelect('Тип контакта', Ref(data, 'kod_tipa_kontakta'), options.kod_tipa_kontakta),
            z['mt-4'],
            NamedInput('Значение', Ref(data, 'znachenie'), options.znachenie),
            z['flex mt-4'](
                z['flex-1'],
                contactId === 'new' ? '' :
                    Button('Удалить', async () => {
                        await q('delete from konakti_postavschika where kod_kontakta_postavschika=?', [contactId]);
                        contactModal.close();
                        contactTable.load();
                    }),
                Button(contactId === 'new' ? 'Добавить' : 'Сохранить', async () => {
                    if (data.znachenie.length === 0) {
                        options.znachenie.error = 'Значение не может быть пустым';
                        body.update();
                        return;
                    }
                    const values = Object.entries(data)
                    if (contactId === 'new') {
                        await q(`insert into konakti_postavschika(${values.map(v=>v[0]).join(',')}) values (${values.map(i=>'?').join(',')})`, values.map(v=>v[1]));
                    } else {
                        await q(`update konakti_postavschika set ${values.map(v=>v[0]+'=?').join(',')} where kod_kontakta_postavschika=?`, values.map(v=>v[1]).concat([contactId]));
                    }
                    contactModal.close();
                    contactTable.load();
                })
            )
        )
    });

    const deleteModal = Modal(_ => z['p-2 w-[500px]'](
        z['text-2xl']('Вы уверены что хотите удалить Поставщика'),
        z['mt-4'],
        z['text-lg']('После нажатия удалить, данные о поставщике навсегда будут стерты из системы, включая поступления, и восстановить записи не получится, даже если очень надо'),
        z['mt-4 flex'](
            z['flex-1'],
            Button('отмена', deleteModal.close),
            Button('удалить', _ => {
                q(`delete from postavschik where kod_postavschika=?`, [id])
                    .then(i => router.navigate('/suppliers'));
            })
        )
    ));

    let suppliesTable, contactTable;
    if (id !== 'new') {
        q(`select ${Object.keys(data).join(',')} from postavschik where kod_postavschika=?`, [id])
        .then(r=>{
            Object.assign(data, r[0]);
            body.update()
        });

        contactTable = Table([
            { name: 'Тип', attr: 'naimenovanie' },
            { name: 'Значение', attr: 'znachenie' }
        ], {
            table: 'konakti_postavschika kp',
            join: 'inner join tip_kontakta tk on tk.kod_tipa_kontakta = kp.kod_tipa_kontakta',
            filter: ['kod_postavschika = ?', [id]],
            pk: 'kod_kontakta_postavschika',
            onclick: contactModal.open
        });

        suppliesTable = Table([
            { name: 'Дата', attr: 'data_postavki' },
            { name: 'Сумма', attr: 'summa' }
        ], {
            table: 'postavka',
            filter: ['kod_postavschika = ?', [id]],
            pk: 'kod_postavki',
            link: '/supplies'
        });
    }

    async function create(open_new) {
        let cancel;
        if (data.naimenovanie.trim() === '') {
            options.naimenovanie.error = 'Поле Наименование не может быть пустым';
            cancel = true;
        } else {
            const r = await q('select 1 from postavschik where naimenovanie = ? and kod_postavschika != ?',
                [data.naimenovanie, id]
            );
            if (r.length) {
                options.naimenovanie.error = 'Наименование совпадает с другим поставщиком';
                cancel = true;
            }
        }
        if (data.inn.trim() === '') {
            options.inn.error = 'Поле ИНН не может быть пустым';
            cancel = true;
        }
        if (data.kladr.trim() === '') {
            options.kladr.error = 'Поле КЛАДР не может быть пустым';
            cancel = true;
        }
        if (cancel) {
            body.update();
            return;
        }
        const values = Object.entries(data)
        if (id === 'new') {
            q(`insert into postavschik(${values.map(v=>v[0]).join(',')}) values (${values.map(i=>'?').join(',')})`, values.map(v=>v[1])).then(i => {
                router.navigate('/suppliers/'+ (open_new ? 'new' : i.insertId))
            })
        } else {
            q(`update postavschik set ${values.map(v=>v[0]+'=?').join(',')} where kod_postavschika=?`, values.map(v=>v[1]).concat([id]))
        }
    }

    return z['p-4'](
        Breadcrumbs(['/suppliers', 'Поставщики'], id === 'new' ? 'Новый поставщик' : 'Редактирование поставщика #'+id),
        z['text-4xl mt-8']('Общая информация'),
        z['flex mt-8'](
            NamedInput('Наименование', Ref(data, 'naimenovanie'), options.naimenovanie),
            z['ml-4'],
            NamedInput('инн', Ref(data, 'inn'), options.inn),
        ),
        z['flex mt-4'](
            z['cursor-pointer']({
                onclick() { addressModal.open() }
            }, z['pointer-events-none'](NamedInput('Адрес', Ref(data, 'kladr'), options.kladr))),
        ),
        id !== 'new' ? z(
            z['flex items-center mt-8'](
                z['text-4xl']('Контакты поставщика'),
                z['flex-1'],
                z['flex text-xl items-center cursor-pointer transition hover:text-[#dd88c1]'](
                    { onclick() {
                        contactModal.open();
                    } },
                    icons.plus, z['ml-4'], 'Добавить'
                ),
                z['ml-4']
            ),
            z['mt-4'],
            contactTable,
            z['flex items-center mt-8'](
                z['text-4xl']('Поставки'),
                z['flex-1'],
                z['flex text-xl items-center cursor-pointer transition hover:text-[#dd88c1]'](
                    { onclick() { router.navigate('/supplies/new', { supplier: id }) } },
                    icons.plus, z['ml-4'], 'Добавить'
                ),
                z['ml-4']
            ),
            z['mt-4'],
            suppliesTable,
        ) : '',
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
                    deleteModal.open();
                }
            }, 'Удалить') : ''
        ),
        contactModal,
        addressModal,
        deleteModal
    )
}