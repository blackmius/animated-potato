import { z } from "../z/z3.9";
import Table from "./table";

export default function Cheques() {
    const table = Table([
        { name: 'Дата' },
        { name: 'Сотрудник' },
        { name: 'Сумма' }
    ]);
    return z['p-4'](
        z['text-2xl']('Чеки'),
        z['mt-4'],
        table
    )
}