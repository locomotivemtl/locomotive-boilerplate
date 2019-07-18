const APP_NAME     = 'Wirewerks';
const DATA_API_KEY = '.data-api';

const html         = document.documentElement;
const body         = document.body;
const isDebug      = !!$html.data('debug');

export { APP_NAME, DATA_API_KEY, html, body, isDebug };
