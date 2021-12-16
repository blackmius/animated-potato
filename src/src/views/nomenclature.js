import { z , Val} from "../z/z3.9";
import Table from "./table";
import { icons } from ".";
import router from "../router";
import { Check, NamedInput, NamedSelect } from "./input";
import Breadcrumbs from "./breadcrumbs";

export function NomenclatureTable() {
    const table = Table([
        { name: 'Наименование' },
        { name: 'Цена в продаже' },
    ]);
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
        name: '',
        surname: '',
        patronymic: '',
        phone: ''
    };

    return z['p-4'](
        Breadcrumbs(['/nomenclature', 'Номенклатура'], id === 'new' ? 'Новая номенклатура' : 'Редактирование номенклатуры #'+id),
        z['text-4xl mt-8']('Общая информация'),
        z['flex mt-8'](
            NamedInput('Наименование', Val(data['name'], v=>data['name']=v)),
            z['ml-4'],
            NamedInput('Цена в продаже', Val(data['price'], v=>data['price']=v), { type: 'number' })
        ),
        z['flex mt-4'](
            Check(Val(data['recipe'], v=>data['recipe']=v), 'Продается по рецепту')
        ),
        z['mt-4'],
        z['w-full p-4 bg-[#dd88c1] transition text-white sticky bottom-4 rounded text-center font-medium cursor-pointer hover:bg-[#d874b6] active:bg-[#d260ac]']('Сохранить'),
    )
}