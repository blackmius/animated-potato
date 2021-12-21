import { z, Val } from "../z/z3.9"

export default function Modal(fn) {
    const c = Val('');
    let overlay;
    return Object.assign(c, {
        open(...args) {
            c(
                z['fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 flex items-center justify-center']({
                        key: Math.random(),
                        on$created(e) { overlay = e.target; },
                        onclick(e) { if (e.target !== overlay) return; c(''); }
                    },
                    z['p-2 rounded-md shadow-lg bg-white']({
                        onclick(e) { }
                    }, fn(...args))
                ) 
            );
        },
        close() { c(''); }
    })
}