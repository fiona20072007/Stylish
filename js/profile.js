import { setFb, logout } from './fbProfile.js';

setFb(setProfileHtml, get);

function setProfileHtml(response) {
    console.log('res', response);
    let urlHtml = `<img src="${response.picture}" />`;
    document.querySelector('.user-name').innerHTML = response.name;
    document.querySelector('.user-email').innerHTML = response.email;
    document.querySelector('.user-img').innerHTML = urlHtml;
}
function get(response) {
    console.log('get', response);
    if (response.status === 'unknown') {
        document.querySelector('.user-name').innerHTML = '請用戶重新登入';
        window.location = './';
    }
}

//////////

document.querySelector('.logout').addEventListener('click', logout);
