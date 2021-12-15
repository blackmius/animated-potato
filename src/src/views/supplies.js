import { z } from "../z/z3.9";
import Table from "./table";

export default function Supplies() {
    const table = Table([
        { name: 'Дата' },
        { name: 'Поставщик' },
        { name: 'Сумма' }
    ]);
    return z['p-4'](
        z['text-2xl']('Поставки'),
        z['mt-4'],
        table
    )
}