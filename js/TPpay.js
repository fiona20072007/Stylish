import { setFb } from './fbProfile.js';
/*global TPDirect*/
/*eslint no-undef: "error"*/
/////////////////////////FB token////////////////////////////
setFb(set, getToken);
let token;

function set(response) {
    console.log('set', response);
}
function getToken(response) {
    if (response.authResponse !== null) {
        token = response.authResponse.accessToken;
    }
}

/////////////////////////FB token////////////////////////////
/////////////////////////TP pay//////////////////////////////
if (document.querySelector('.check')) {
    document.querySelector('.check').addEventListener('click', onSubmit);
}
let cart = JSON.parse(localStorage.getItem('cart'));
let primeCode;

TPDirect.setupSDK(
    '12348',
    'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF',
    'sandbox'
);

TPDirect.card.setup({
    // Display ccv field
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****',
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY',
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'ccv',
        },
    },
});

const paramMapping = {
    name: '姓名',
    phone: '電話',
    email: 'E-mail',
    address: '地址',
};

function checkEmailFormat(mail) {
    var emailRegex = /\S+@\S+\.\S+/;
    if (emailRegex.test(mail)) {
        document
            .querySelector('#receiver-email')
            .setAttribute('class', 'valid');
        return true;
    } else {
        document
            .querySelector('#receiver-email')
            .setAttribute('class', 'invalid-email');
        document.querySelector('.invalid-email').value = '';
        document
            .querySelector('.invalid-email')
            .setAttribute('placeholder', '請輸入正確email');
        return false;
    }
}

function checkPhoneFormat(phone) {
    var phoneRegex = /(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}|09\d{2}(\d{6}|-\d{3}-\d{3})/;
    if (phoneRegex.test(phone)) {
        document
            .querySelector('#receiver-phone')
            .setAttribute('class', 'valid');
        return true;
    } else {
        document
            .querySelector('#receiver-phone')
            .setAttribute('class', 'invalid-phone');
        document.querySelector('.invalid-phone').value = '';
        document
            .querySelector('.invalid-phone')
            .setAttribute('placeholder', '請輸入正確手機號碼');
        return false;
    }
}

function onSubmit() {
    let userInputName = document.querySelector('#receiver-name').value;
    let userInputEmail = document.querySelector('#receiver-email').value;
    let userInputPhone = document.querySelector('#receiver-phone').value;
    let userInputAddress = document.querySelector('#receiver-address').value;
    let userTime = document.getElementsByName('receiver-time');
    let userInputTime = '';
    let totalAmount = 0;

    for (var i = 0, length = userTime.length; i < length; i++) {
        if (userTime[i].checked) {
            userInputTime = userTime[i].value;
            break;
        }
    }

    let inputRecipent = {
        name: userInputName,
        phone: userInputPhone,
        email: userInputEmail,
        address: userInputAddress,
        time: userInputTime,
    };

    for (let info in inputRecipent) {
        if (inputRecipent[info].length == 0) {
            alert(`請輸入收件人${paramMapping[info]}`);
            checkEmailFormat(userInputEmail);
            checkPhoneFormat(userInputPhone);
            return;
        } else {
            checkEmailFormat(userInputEmail);
            checkPhoneFormat(userInputPhone);
        }
    }

    if (cart.length !== 0) {
        cart.forEach((prod) => {
            let subTotal = prod.price * prod.qty;
            totalAmount += subTotal;
        });
    } else {
        alert('交易失敗，請再試一次');
        return;
    }

    // Get TapPay Fields  status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // Check can getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('請輸入正確付款資料');
        return;
    }

    // Get prime
    if (checkEmailFormat(userInputEmail) && checkPhoneFormat(userInputPhone)) {
        TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
                alert('get prime error ' + result.msg);
                return;
            }

            primeCode = result.card.prime;

            // send prime to your server, to pay with Pay by Prime API .
            // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api

            setObj();
        });
    } else if (checkEmailFormat(userInputEmail) === false) {
        alert('請輸入正確email');
    } else if (checkPhoneFormat(userInputPhone) === false) {
        alert('請輸入正確手機');
    }

    function setObj() {
        let total = totalAmount + 60;
        let cartStorage = {
            prime: primeCode,
            order: {
                shipping: 'delivery',
                payment: 'credit_card',
                subtotal: totalAmount,
                freight: 60,
                total: total,
                recipient: inputRecipent,
                list: cart,
            },
        };
        checkInfo(cartStorage);
    }
    // setTimeout(function () {
    //     let total = totalAmount + 60;
    //     let cartStorage = {
    //         prime: primeCode,
    //         order: {
    //             shipping: 'delivery',
    //             payment: 'credit_card',
    //             subtotal: totalAmount,
    //             freight: 60,
    //             total: total,
    //             recipient: inputRecipent,
    //             list: cart,
    //         },
    //     };
    //     checkInfo(cartStorage);
    // }, 1000);
}

let status = false;
function checkInfo(cartStorage) {
    document.querySelector('.cube').style.display = 'block';
    if (status === false) {
        status = true;
        ajax(
            `https://api.appworks-school.tw/api/1.0/order/checkout`,
            function (xhr) {
                if (xhr.error) {
                    alert('交易失敗，請再試一次');
                    status = false;
                    return;
                } else {
                    localStorage.removeItem('cart');
                    cart = [];
                    localStorage.setItem('cart', JSON.stringify(cart));
                    alert(`訂單編號 : ${xhr.data['number']}`);
                    window.location =
                        './thankyou.html?number=' + xhr.data.number;
                }
            },
            cartStorage
        );
    } else {
        alert('請稍後再試');
    }
}

//////////////////////////////AJAX/////////////////////////////////

function ajax(src, callback, storage) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.open('post', src);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(JSON.stringify(storage));
}
