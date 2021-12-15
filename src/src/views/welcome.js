import { z } from "../z/z3.9";
import { Link } from "./link";

export default function Welcome(frag) {
    return z['flex items-center justify-center h-full'](
        z['w-96'](
            z['text-4xl']('Добро пожаловать'),
            z['mt-8'],
            z['text-lg'](
                Link('Открыть чек', '/cheques/new'),
                z['mt-1'],
                Link('Добавить сотрудника', '/employees/new'),
                z['mt-1'],
                Link('Добавить поставку', '/suppliers/new'),
                z['mt-4'],
                Link('Производительность сотрудников', '/reports/employees'),
                z['mt-1'],
                Link('Спрос на товары', '/reports/products'),
                z['mt-1'],
                Link('Складской учет', '/reports/warehouse'),
            )
        )
    );
}