import { icons } from ".";
import { z, body, Val, Ref } from "../z/z3.9";
import { Dropdown } from "./dropdown";
import IMask from '../imask.js';
import Button from "./button";

const InputEvents = (value, options) => ({
    on$created(e) {
        options.target = e.target;
        if (options.load) options.load().then(i => {
            options.values = i;
            body.update();
        });
        if (options.imask) {
            e.target.value = value();
            options._imask = IMask(e.target, options.imask);
            options._imask.on('complete', _ => value(options._imask.unmaskedValue))
        }
    },
    on$destroyed() {
        if (options._imask) options._imask.destroy();
    },
    onfocus() {
        options.focused = true;
        body.update();
    },
    onblur() {
        options.focused = false;
        body.update();
    },
    oninput(e) {
        options.error = '';
        if (!options._imask) value(e.target.value);
    }
})

export const Input = (value, options={}) => z.Input['w-full px-3 py-2 transition-colors border rounded-md outline-none']({
    classes: _=>({
        'border-red-700 hover:border-red-700 focus:border-red-700': !options.disabled && options.error,
        'border-gray-300 hover:border-gray-400 focus:border-[#dd88c1]': !options.disabled && !options.error,
        'border-gray-300 bg-gray-100': options.disabled,
    }),
    ...InputEvents(value, options),
    value: options.imask ? undefined : value,
    ...options
}, _ => {
    if (options._imask && options._imask.unmaskedValue != value()) {
        options._imask.value = value();
    }
})

const extend = t => t === ''
    ? ' '.repeat(15)
    : t + ' ';

export const Text = (value, options) =>
    z['w-full px-3 py-2 transition-colors border rounded-md']({
            onclick(e) {
                options.target.focus();
            },
            style: 'min-height: 128px',
            classes: _=>({
                'border-red-700 hover:border-red-700': !options.disabled && options.error,
                'border-[#dd88c1]': !options.disabled && options.focused && !options.error,
                'border-gray-300 hover:border-gray-400': !options.disabled && !options.focused && !options.error,
                'border-gray-300 bg-gray-100': options.disabled,
            }),
        },
        z.relative(
            z.U['whitespace-pre break-all color-transparent'](_ => extend(value())),
            z.Textarea['w-full h-full border-none bg-none outline-none resize-none absolute top-0 left-0 overflow-hidden']({
                ...InputEvents(value, options),
                value, spellcheck: 'false', ...options
            })
        )
    );

const Label = (name, val, options={}, off=9, on=-14) => _ => {
    const up = options.focused || (val() !== '' && val() !== undefined) || options.type === 'date';
    return [
    z['absolute select-none top-0 transition-transform duration-200 ease-in-out pointer-events-none']({
        style: {
            'transform': up ? `translateY(${on}px)` : `translateY(${off}px)`
        },
        classes: {
            'text-gray-500': !options.focused && !options.error,
            'text-[#dd88c1]': options.focused && !options.error,
            'text-red-700': options.error,
            'px-1': up,
            'mx-3': up,
            'mx-4': !up
        }
    }, z[`absolute bottom-[6px] w-full ${options.disabled ? 'bg-gray-100' : 'bg-white'} h-1 left-0`], z['relative'](name)),
    options.error && options.error !== true ? z['text-red-700.mx-4.text-sm.mt-2'](options.error): ''
    ]
}

export const Select = (value, options={}) =>
    Dropdown(
        z['flex items-center min-w-[260px] w-full px-3 py-2 transition-colors border rounded-md outline-none']({
            classes: _=>({
                'border-red-700 hover:border-red-700 focus:border-red-700': !options.disabled && options.error,
                'border-gray-300 hover:border-gray-400': !options.disabled && !options.error,
                'border-gray-300 bg-gray-100': options.disabled,
                'bg-white cursor-pointer': !options.disabled
            }),
            ...InputEvents(value, options),
        },
            _ => options.values.find(v => v.value === value())?.name || '',
            z['flex-1'],
            icons.chevronDown
        ),
        c => z({
                on$created(e) {
                    options.search = ''; body.update();
                    options.reload = _ => options.load().then(i => {
                        options.values = i;
                        body.update();
                    })
                }
            },
            options.create ? z(Input(Ref(options, 'search'), { placeholder: 'Поиск' }), z['mt-4']) : '',
            _ => {
                const values = options.values.filter(v => v.name.toLocaleLowerCase().includes(options.search?.toLocaleLowerCase() || ''));
                return values.length ?
                    values.map(v => z['cursor-pointer transition hover:bg-gray-200 p-1 rounded']({
                        onclick() {
                            options.error = '';
                            value(v.value);
                            c();
                        }
                    }, v.name))
                    : z['flex justify-center flex-col items-center'](
                        'Результатов не найдено',
                        options.create ? Button('Создать', async() => {
                            options.search = options.search.trim();
                            let name = options.search[0].toLocaleUpperCase() + options.search.slice(1).toLocaleLowerCase();
                            const id = (await options.create(name)).insertId;
                            options.values = await options.load();
                            value(id);
                            c();
                        }) : ''
                    );
            }
        ),
        options
    );

export const Check = (value, label) => z.Label['flex items-center'](
    {
        onkeydown(e) {
            if (e.keyCode === 32 || e.keyCode === 13) {
                e.preventDefault();
                value(!value());
            }
        }
    },
    z.Input['h-5 w-5 outline-[#dd88c1]']({
        onchange(e) { value(e.target.checked); },
        checked: value,
        type: 'checkbox'
    }),
    z['ml-4'],
    label
);

export const NamedSelect = (name, val, options={}) => z.relative(
    Select(val, options),
    Label(name, val, options)
)

export const NamedInput = (name, val, options={}) => z.relative(
    Input(val, options),
    Label(name, val, options)
);

export const NamedText = (name, val, options={}) => z.relative(
    Text(val, options),
    Label(name, val, options, 9, -16)
);