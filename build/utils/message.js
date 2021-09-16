import kleur from 'kleur';

export default function message(text, type, timerID) {
    switch (type) {
        case 'success':
            console.log(kleur.bgGreen().black(`✅ ${text}`));

            if (timerID !== undefined) {
                console.timeEnd(timerID);
            }
            break;

        case 'error':
            console.log(kleur.red().underline(`❌ ${text}`));
            break;

        case 'waiting':
            console.log(kleur.blue().italic(`⏱ ${text}`));

            if (timerID !== undefined) {
                console.timeLog(timerID);
            }
            break;

        default:
            console.log(text);
            break;
    }

    console.log('');
};
