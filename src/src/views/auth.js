import { q } from "../api";
import router from "../router";
import { Val } from "../z/z3.9";

export const employee = Val(null);

if (localStorage.employee) {
    employee(JSON.parse(localStorage.employee))
}

export async function login(token) {
    const r = await q('select * from sotrudnik where kod_avtorizacii = ?', [ token ]);
    employee(r[0]);
    router.redraw();
    localStorage.employee = JSON.stringify(r[0]);
    return r[0];
}

export function logout() {
    delete localStorage.employee;
    employee(null);
    router.redraw();
}