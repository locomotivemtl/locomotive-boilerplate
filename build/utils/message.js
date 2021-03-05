import kleur from 'kleur';

export default function message(text, type, timerId) {
    if (type === 'success') {
        console.log(kleur.bgGreen().black(`${text} ✅`));

        if (timerId !== undefined) {
            console.timeEnd(timerId)
        }
    } else if (type === 'error') {
        console.log(kleur.red().underline(`${text} ❌`));
    } else if (type === 'waiting') {
        console.log(kleur.blue().italic(`${text} ⏱`));
    } else {
        console.log(text);
    }

    console.log('');
}
