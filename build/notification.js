import notifier from 'node-notifier';

export default function notification({ title, message }) {
    notifier.notify({
        title: title,
        message: message,
        icon: 'https://user-images.githubusercontent.com/4596862/54868065-c2aea200-4d5e-11e9-9ce3-e0013c15f48c.png'
    });
}
