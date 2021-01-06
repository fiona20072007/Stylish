/////////////////////////////cart//////////////////////////////

let cartProd = JSON.parse(localStorage.getItem('cart'));
let prodHTML = '';
let selectHTML = '<select>';
let n = 0;

if (cartProd.length === 0) {
    document.querySelector('.list').innerHTML = '購物車空空的耶';
} else {
    renderProd(cartProd);
}
renderTotal(cartProd);

function renderProd(cartProd) {
    n = 0;

    cartProd.forEach((prod) => {
        let subTotal = prod.price * prod.qty;
        selectHTML = '<select>';

        for (let i = 1; i <= prod.stock; i++) {
            let selectTempHTML = `<option value=${i}>${i}</option>`;
            selectHTML += selectTempHTML;
        }
        selectHTML += `</select>`;

        let prodTempHTML = `
        <div class="prod">
            <div class="variant">
                <div class="pic">
                    <img src="${prod.image}" />
                </div>
                <div class="details">
                ${prod.name}<br />${prod.id}<br /><br />顏色：${prod.color.name}<br />尺寸：${prod.size}
                </div>
            </div>
            <div class="amount">
                ${selectHTML}
            </div>
            <div class="price">NT.${prod.price}</div>
            <div class="subtotal">NT.${subTotal}</div>
            <div class="remove" id="remove-${n}">
                <img src="images/cart-remove.png" />
            </div>
        </div>`;
        prodHTML += prodTempHTML;
        n += 1;
    });
    document.querySelector('.list').innerHTML = prodHTML;

    for (let i = 0; i < cartProd.length; i++) {
        document.querySelectorAll('select')[i].selectedIndex =
            cartProd[i].qty - 1;
    }
    listen();
}

function listen() {
    document.querySelectorAll('select').forEach((sel) => {
        sel.addEventListener('change', clickSelect);
    });
    document.querySelectorAll('.remove').forEach((rem) => {
        rem.addEventListener('click', clickRemove);
    });
}

function clickSelect() {
    for (let i = 0; i < cartProd.length; i++) {
        cartProd[i].qty =
            document.querySelectorAll('select')[i].selectedIndex + 1;
        localStorage.setItem('cart', JSON.stringify(cartProd));

        document.querySelectorAll('.subtotal')[i + 1].innerHTML = `NT.${
            cartProd[i].price * cartProd[i].qty
        }`;
    }
    renderTotal(cartProd);
}

function renderCartNumber() {
    document.querySelector('.cart-number').innerHTML = cartProd.length;
    document.querySelector('.cart-number-bottom').innerHTML = cartProd.length;
}

function clickRemove() {
    let index = parseInt(this.id.slice(7));
    cartProd.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartProd));
    prodHTML = '';
    renderProd(cartProd);
    renderTotal(cartProd);
    renderCartNumber();
    alert('已從購物車中移除');
    if (JSON.parse(localStorage.getItem('cart')).length === 0) {
        document.querySelector('.list').innerHTML = '購物車空空的耶';
    }
}

/////////////////////////////cart//////////////////////////////
/////////////////////////////total/////////////////////////////
function renderTotal(cartProd) {
    let totalAmount = 0;
    cartProd.forEach((prod) => {
        let subTotal = prod.price * prod.qty;
        totalAmount += subTotal;
    });
    let totalHTML = `
    <div class="row">
        <div class="title">總金額</div>
        <div class="price">
            <span class="unit">NT. </span>
            <span class="dollor">${totalAmount}</span>
        </div>
    </div>
    <div class="row">
        <div class="title">運費</div>
        <div class="price">
            <span class="unit">NT. </span>
            <span class="dollor">60</span>
        </div>
    </div>
    <div class="row">
        <div class="separator"></div>
    </div>
    <div class="row">
        <div class="title">應付金額</div>
        <div class="price">
            <span class="unit">NT. </span>
            <span class="dollor">${totalAmount + 60}</span>
        </div>
    </div>
    <div class="row">
        <button class="check">確認付款</button>
    </div>`;
    document.querySelector('.total').innerHTML = totalHTML;

    if (cartProd.length === 0) {
        document.querySelector('.check').setAttribute('class', 'check-block');
    } else {
        document.querySelector('.check').setAttribute('class', 'check');
    }
}
