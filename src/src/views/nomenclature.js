import { z } from "../z/z3.9";
import Table from "./table";

export default function Nomenclature() {
    const table = Table([
        { name: 'Наименование' },
        { name: 'Цена' },
    ]);
    return z['p-4'](
        z['text-2xl']('Номенклатура'),
        z['mt-4'],
        table
    )
}