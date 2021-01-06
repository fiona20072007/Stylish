const APIHostName = 'https://api.appworks-school.tw/api/1.0';

function ajaxProduct(src, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                alert(xhr.statusText);
            }
        }
    };
    xhr.open('GET', src);
    xhr.send();
}

/////////////////////////////Product////////////////////////////

let colorHTML = '';
let sizeHTML = '';
let imgHTML = '';
let i = 0;
let j = 0;
let colorAll = 0;
let sizeAll = 0;
let num = 1;
let numLimit = 0;
var productDetails = {};

function composeData(datas) {
    datas.forEach((data) => {
        if (productDetails[data.color_code] == null) {
            productDetails[data.color_code] = {};
        }
        productDetails[data.color_code][data.size] = data.stock;
    });
}

function renderProd(content) {
    let prod = content.data;
    composeData(data);
    colorAll = prod.colors.length;
    sizeAll = prod.sizes.length;

    prod.colors.forEach((color) => {
        let tempColorHTML = `<div
        class="color"
        id="color-${i}"
        style="background-color: #${color.code}"
        ></div>`;
        i += 1;
        colorHTML += tempColorHTML;
    });

    prod.sizes.forEach((size) => {
        let tempSizeHTML = `<div class="size" disabled=false id="size-${j}">${size}</div>`;
        j += 1;
        sizeHTML += tempSizeHTML;
    });

    for (let i = 0; i < 2; i++) {
        let tempImgHTML = `<img src="${prod.images[i]}" alt="product-image"/>`;
        imgHTML += tempImgHTML;
    }

    let prodHTML = `
        <div class="prod-img">
            <img src="${prod.main_image}" alt="product image"/>
        </div>
        <div class="prod-variants">
            <div class="prod-title">${prod.title}</div>
            <div class="prod-id">${prod.id}</div>
            <div class="prod-price">TWD.${prod.price}</div>
            <div class="prod-color">
                <span class="sub-title">顏色</span>
                ${colorHTML}
            <div class="prod-size">
                <span class="sub-title">尺寸</span>
                ${sizeHTML}
            </div>
            <div class="prod-stock">
                <span class="sub-title count-title">數量</span>
                <div class="counter">
                    <div class="count" data-val="-1">-</div>
                    <div class="value">1</div>
                    <div class="count" data-val="1">+</div>
                </div>
            </div>
            <div class="prod-addCart">
                <button class="addCart-btn">加入購物車</button>
            </div>
            <div class="prod-note">
                ${prod.note}
                <br /><br />
                ${prod.texture}<br />
                ${prod.description.replaceAll('\n', '<br>')}<br /><br />
                清洗：${prod.wash}<br />
                產地：${prod.place}
            </div>
        </div>
        `;

    let prodSubHTML = `
        <div class="prod-subcontent-title">
            <div class="title">更多產品資訊</div>
            <div class="seperation-line"></div>
        </div>
        <div class="prod-story">
            ${prod.story}
        </div>
        <div class="prod-subcontent-img">
            ${imgHTML}
        </div>
        `;
    document.querySelector('.prod-content').innerHTML = prodHTML;
    document.querySelector('.prod-subcontent').innerHTML = prodSubHTML;
}

let prodId = encodeURIComponent(
    new URLSearchParams(window.location.search).get('id')
);

let data;
let dataStorage;
ajaxProduct(`${APIHostName}/products/details?id=${prodId}`, function (
    response
) {
    data = response.data.variants;
    dataStorage = response.data;
    renderProd(response);
    listen();
    initialize();
});

/////////////////////////////Product////////////////////////////
/////////////////////////////Button/////////////////////////////

let colorState = {};
let colorStateArr = [];

function listen() {
    document.querySelectorAll('.color').forEach((color) => {
        color.addEventListener('click', clickColor);
    });
    document.querySelectorAll('.size').forEach((size) => {
        size.addEventListener('click', clickSize);
    });
    document.querySelectorAll('.count').forEach((count) => {
        count.addEventListener('click', clickNum);
    });
    document
        .querySelector('.addCart-btn')
        .addEventListener('click', updateLocalStorage);
}

let choiceColor = 0;
function clickColor() {
    num = 1;
    document.querySelector('.value').innerHTML = 1;
    for (let n = 0; n < colorAll; n++) {
        if (this.id === `color-${n}`) {
            choiceColor = n;
            document
                .querySelector(`#color-${n}`)
                .setAttribute('class', 'color-active');
        } else {
            document
                .querySelector(`#color-${n}`)
                .setAttribute('class', 'color');
        }
    }
    data.forEach((color) => {
        if (color.color_code === this.attributes['style'].value.slice(19)) {
            colorState[color.size] = color.stock;
        }
    });
    data.forEach((color) => {
        if (color.color_code === this.attributes['style'].value.slice(19)) {
            colorStateArr.push(color.size);
        }
    });

    for (let key in colorState) {
        if (colorState[key] === 0) {
            document
                .querySelector(`#size-${colorStateArr.indexOf(key)}`)
                .setAttribute('class', 'size-block');
            document
                .querySelector(`#size-${colorStateArr.indexOf(key)}`)
                .setAttribute('disabled', true);
        } else if (
            colorState[key] !== 0 &&
            document.querySelector(`#size-${colorStateArr.indexOf(key)}`)
                .attributes['class'].value === 'size-active'
        ) {
            document
                .querySelector('.size-active')
                .setAttribute('class', 'size-active');
            document
                .querySelector(`#size-${colorStateArr.indexOf(key)}`)
                .setAttribute('disabled', false);
        } else {
            document
                .querySelector(`#size-${colorStateArr.indexOf(key)}`)
                .setAttribute('class', 'size');
            document
                .querySelector(`#size-${colorStateArr.indexOf(key)}`)
                .setAttribute('disabled', false);
        }
    }
    let m = 0;
    let arr = [];
    for (let key in colorState) {
        if (
            document.querySelector(`#size-${colorStateArr.indexOf(key)}`)
                .attributes['class'].value !== 'size-active'
        ) {
            m += 1;
        }
    }
    for (let key in colorState) {
        if (m === 3 && colorState[key] !== 0) {
            arr.push(key);
        }
    }

    if (arr.length !== 0) {
        document
            .querySelector(`#size-${colorStateArr.indexOf(arr[0])}`)
            .setAttribute('class', 'size-active');
        document
            .querySelector(`#size-${colorStateArr.indexOf(arr[0])}`)
            .setAttribute('disabled', false);
    }
}

function clickSize() {
    num = 1;
    document.querySelector('.value').innerHTML = 1;
    for (let n = 0; n < sizeAll; n++) {
        if (
            document.querySelector(`#size-${n}`).attributes['disabled'].value ==
                'true' &&
            `size-${n}` == this.id
        ) {
            return;
        }
    }

    for (let n = 0; n < sizeAll; n++) {
        if (
            document.querySelector(`#size-${n}`).attributes['disabled'].value ==
            'false'
        ) {
            // n is false so need to active or none
            if (`size-${n}` == this.id) {
                document
                    .querySelector(`#size-${n}`)
                    .setAttribute('class', 'size-active');
            } else {
                document
                    .querySelector(`#size-${n}`)
                    .setAttribute('class', 'size');
            }
        } else {
            // n is true, so blocked it
            document
                .querySelector(`#size-${n}`)
                .setAttribute('class', 'size-block');
        }
    }
}

function clickNum() {
    choiceColor = document
        .querySelector('.color-active')
        .attributes['style'].value.slice(19);
    let choiceSize = document.querySelector('.size-active').innerHTML;
    numLimit = productDetails[choiceColor][choiceSize];
    if (num < 1) {
        num = 1;
    } else {
        num += parseInt(this.attributes['data-val'].value);
        if (num <= 0) {
            num = 1;
        } else if (num > numLimit) {
            num = numLimit;
        }
    }
    document.querySelector('.value').innerHTML = num;
}
/////////////////////////////Button/////////////////////////////
/////////////////////////////Initial/////////////////////////////

function initialize() {
    document.querySelector('#color-0').setAttribute('class', 'color-active');
    let defaultColor = document
        .querySelector('#color-0')
        .attributes['style'].value.slice(19);
    let sizeIndex = 0;
    for (let size in productDetails[defaultColor]) {
        if (productDetails[defaultColor][size] > 0) {
            document
                .querySelector(`#size-${sizeIndex}`)
                .setAttribute('class', 'size-active');
            break;
        }
        sizeIndex += 1;
    }
}
/////////////////////////////Initial/////////////////////////////
//////////////////////////localStorage///////////////////////////

let cartTotal = 0;
var storageArray;
//當localStorage沒有資料陣列，指定一個空陣列放入資料庫
if (localStorage.getItem('cart') === null) {
    storageArray = [];
    localStorage.setItem('cart', JSON.stringify(storageArray));
    //當localStorage已存在資料陣列，指定一個內容與陣列資料庫相同的陣列
} else {
    storageArray = JSON.parse(localStorage.getItem('cart'));
}

function updateLocalStorage() {
    let finalChoiceColor = document
        .querySelector('.color-active')
        .attributes['style'].value.slice(19);
    let finalChoiceSize = document.querySelector('.size-active').innerHTML;

    let inputObject = {
        id: dataStorage.id,
        name: dataStorage.title,
        price: dataStorage.price,
        color: {
            code: finalChoiceColor,
            name:
                dataStorage.colors[
                    document
                        .querySelector('.color-active')
                        .attributes['id'].value.replace('color-', '')
                ].name,
        },
        size: finalChoiceSize,
        qty: num,
        stock: productDetails[finalChoiceColor][finalChoiceSize],
        image: dataStorage.main_image,
    };

    //將新物件加入我們的陣列
    storageArray.push(inputObject);
    let productMap = storageArray.map((prod) => {
        return (
            prod.name === inputObject.name &&
            prod.color.code === inputObject.color.code &&
            prod.size === inputObject.size
        );
    });
    productMap.pop();

    if (storageArray.length > 1) {
        for (let i = 0; i < productMap.length; i++) {
            if (productMap[i]) {
                storageArray[i].qty = inputObject.qty;
                storageArray.pop();
                break;
            }
        }
    }

    cartTotal = storageArray.length;
    //將陣列修改成JSON字串
    //將處理後的JSON字串更新到資料庫中
    localStorage.setItem(`cart`, JSON.stringify(storageArray));
    document.querySelector('.cart-number').innerHTML = cartTotal;
    document.querySelector('.cart-number-bottom').innerHTML = cartTotal;
    alert('已加入購物車');
    //將資料呈現在頁面上
    // createlist();
}

//////////////////////////localStorage///////////////////////////
