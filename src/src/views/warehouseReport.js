import router from "../router";
import { Val, z } from "../z/z3.9";
import Breadcrumbs from "./breadcrumbs";
import Button from "./button";
import { NamedInput } from "./input";

export default function WarehouseReport() {
    return z['p-4'](
        Breadcrumbs(['/reports', 'Отчеты'], 'Отчет по остаткам')
    );
}