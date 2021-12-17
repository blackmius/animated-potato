import { z, Val } from "../z/z3.9";
import Popper from '../popper.js';

function Panel(c, p) {
    let target;
    return Object.assign(
        z['absolute p-2 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none']({
                on$created(e) {
                    target = e.target;
                    Popper.createPopper(p, target, {
                        placement: 'bottom-start',
                        modifiers: [
                            {
                              name: 'offset',
                              options: {
                                offset: [0, 8],
                              },
                            },
                          ],
                    });
                    target.animate([
                        { opacity: 0, easing: 'ease-in' },
                        { opacity: 1 }
                    ], {
                        duration: 100,
                    });
                },
                onclick(e) { e.stopPropagation(); }
            },
            c
        ),
        {
            async close() {
                if (target)
                    await target.animate([
                        { opacity: 1, easing: 'ease-out' },
                        { opacity: 0 }
                    ], {
                        duration: 75,
                        fill: 'forwards'
                    }).finished;
            }
        });
}

export function Dropdown(anchor, dropdown, options={}) {
    let content = Val(''), target;
    async function remove(e) {
        if (e?.path.find(ee => ee == target)) return;
        window.removeEventListener('click', remove);
        await content()?.close?.();
        content('');
    }
    return [
        z({
            on$created(e) { target = e.target },
            onclick() {
                if (options.disabled) return;
                window.addEventListener('click', remove);
                content(Panel(dropdown(remove), target));
            }
        }, anchor),
        content
    ]
}