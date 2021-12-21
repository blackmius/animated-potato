import { z } from "../z/z3.9";
import { Link } from "./link";

export default function Reports() {
    document.title = 'Отчеты';
    return z['flex items-center justify-center h-full'](
        z['w-96'](
            z['text-4xl']('Выберите отчет'),
            z['mt-8'],
            z['text-lg'](
                Link('Производительность сотрудников', '/reports/employees'),
                z['mt-1'],
                Link('Спрос на товары', '/reports/products'),
                z['mt-1'],
                Link('Складской учет', '/reports/warehouse'),
            )
        )
    );
}