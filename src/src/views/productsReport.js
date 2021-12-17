import router from "../router";
import { Val, z } from "../z/z3.9";
import Button from "./button";
import { NamedInput } from "./input";

export default function ProductsReport() {
    return z['flex items-center justify-center h-full'](
        z['w-[400px]'](
            z['text-4xl']('Отчет спрос на товары'),
            z['text-lg text-gray-700']('Введите критерии отбора'),
            z['mt-8'],
            NamedInput('Дата формирования с', Val(''), { type: 'date' }),
            z['mt-4'],
            NamedInput('Дата формирования по', Val(''), { type: 'date' }),
            z['mt-8'],
            z.flex(z['flex-1'], Button('Отмена', _ => router.navigate('/reports')), z['ml-4'], Button('Сформировать отчет'))
        )
    );
}