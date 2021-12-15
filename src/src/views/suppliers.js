import { z } from "../z/z3.9";
import Table from "./table";

export default function Suppliers() {
    const table = Table([
        { name: 'Наименование организации' },
        { name: 'Контакты' },
        { name: 'Адрес' }
    ]);
    return z['p-4'](
        z['text-2xl']('Поставщики'),
        z['mt-4'],
        table
    )
}