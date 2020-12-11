import notifier from 'node-notifier';

export default function notification({title, message}) {
    notifier.notify({
        title: title,
        message: message
    });
}
