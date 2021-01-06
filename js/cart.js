import { checkLoginState } from './fbProfile.js';

if (localStorage.getItem('cart') === null) {
    var storageArray = [];
    localStorage.setItem('cart', JSON.stringify(storageArray));
    //當localStorage已存在資料陣列，指定一個內容與陣列資料庫相同的陣列
}
if (JSON.parse(localStorage.getItem('cart')).length === 0) {
    document.querySelector('.cart-number').innerHTML = 0;
    document.querySelector('.cart-number-bottom').innerHTML = 0;
} else {
    document.querySelector('.cart-number').innerHTML = JSON.parse(
        localStorage.getItem('cart')
    ).length;

    document.querySelector('.cart-number-bottom').innerHTML = JSON.parse(
        localStorage.getItem('cart')
    ).length;
}

document.querySelector('.search-img1').addEventListener('click', checkSearch);
function checkSearch() {
    if (document.querySelector('.logo').style.display === 'none') {
        document.querySelector('.search').style.display = 'none';
        document.querySelector('.logo').style.display = 'inline-block';
    } else {
        document.querySelector('.search').style.display = 'inline-block';
        document.querySelector('.logo').style.display = 'none';
    }
}

document.querySelector('.login').addEventListener('click', checkLoginState);
document.querySelector('.login-1').addEventListener('click', checkLoginState);
