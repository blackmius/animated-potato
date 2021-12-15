import { z } from "../z/z3.9";
import Table from "./table";

export default function Employees() {
    const table = Table([
        { name: 'ФИО' },
        { name: 'Телефон' },
        { name: 'Должность' }
    ]);
    return z['p-4'](
        z['text-2xl']('Сотрудники'),
        z['mt-4'],
        table
    )
}