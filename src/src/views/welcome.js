import { z } from "../z/z3.9";
import { employee } from "./auth";
import { Link } from "./link";

export default function Welcome(frag) {
    document.title = 'Главная страница';
    return z['flex items-center justify-center h-full'](
        z['w-96'](
            z['text-4xl']('Добро пожаловать'),
            z['mt-8'],
            z['text-lg'](
                Link('Открыть чек', '/cheques/new'),
                employee()?.kod_dolzhnosti === 2 || employee()?.kod_dolzhnosti === 3 ? z(
                    z['mt-1'],
                    Link('Добавить сотрудника', '/employees/new'),
                    z['mt-1'],
                    Link('Добавить поставку', '/supplies/new'),
                    z['mt-1'],
                    Link('Добавить поставщика', '/suppliers/new'),
                    z['mt-1'],
                    Link('Добавить номенклатуру', '/nomenclature/new'),
                    z['mt-4'],
                    Link('Производительность сотрудников', '/reports/employees'),
                    z['mt-1'],
                    Link('Спрос на товары', '/reports/products'),
                    z['mt-1'],
                    Link('Складской учет', '/reports/warehouse'),
                ) : '',
            )
        )
    );
}