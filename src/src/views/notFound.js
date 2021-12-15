import { z } from "../z/z3.9";

export default function NotFound(frag) {
    return z['flex items-center justify-center h-full'](
        z['w-96'](
            z['text-4xl']('Страница не найдена'),
            z['mt-3'],
            z['text-lg'](`Запрошенная вами страница ${frag} не была найдена, увы`)
        )
    );
}