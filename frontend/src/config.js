const PRODUCTION = document.location.href.endsWith('appspot.com/');

const BACKEND = PRODUCTION ? 'https://cloud-419006.lm.r.appspot.com' : 'http://localhost:8083';

const FILE_UPLOAD_URL = BACKEND + '/upload';
const LOGIN_URL = BACKEND + '/login'

export {
    PRODUCTION,
    FILE_UPLOAD_URL,
    LOGIN_URL
};
