import router from "../router";
import { Val, z } from "../z/z3.9";
import Button from "./button";
import { NamedInput, NamedSelect } from "./input";

export default function EmployeesReport() {
    return z['flex items-center justify-center h-full'](
        z['w-96'](
            z['text-4xl']('Отчет по сотрудникам'),
            z['text-lg text-gray-700']('Введите критерии отбора'),
            z['mt-8'],
            NamedInput('Дата формирования с', Val(''), { type: 'date' }),
            z['mt-4'],
            NamedInput('Дата формирования по', Val(''), { type: 'date' }),
            z['mt-4'],
            NamedSelect('Сотрудник', Val(), {
                values: []
            }),
            z['mt-8'],
            z.flex(z['flex-1'], Button('Отмена', _ => router.navigate('/reports')), z['ml-4'], Button('Сформировать отчет'))
        )
    );
}