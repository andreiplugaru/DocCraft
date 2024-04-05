const PRODUCTION = document.location.href.includes('appspot.com');

const BACKEND = PRODUCTION ? 'https://cloud-419006.lm.r.appspot.com' : 'http://localhost:8083';

const GET_FILES_URL = BACKEND + '/files'
const GET_FILE_CONTENT = BACKEND + '/contents'
const UPDATE_FILE_CONTENT = BACKEND + '/save'
const FILE_UPLOAD_URL = BACKEND + '/upload';
const LOGIN_URL = BACKEND + '/login'


export {
    PRODUCTION,
    FILE_UPLOAD_URL,
    GET_FILES_URL,
    GET_FILE_CONTENT,
    UPDATE_FILE_CONTENT,
    LOGIN_URL
};
