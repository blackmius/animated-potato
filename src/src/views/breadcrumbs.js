import router from "../router";
import { z } from "../z/z3.9";

export default function Breadcrumbs(...items) {
    const last = items.pop();
    return z['flex items-center text-2xl text-black'](items.map(([link, val]) => [
        z['hover:text-[#dd88c1] cursor-pointer']({ 
            onclick() { router.navigate(link); }
        }, val),
        z['mx-4']('/')
    ]), last)
}