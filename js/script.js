const APIHostName = "https://api.appworks-school.tw/api/1.0";

// function ajaxIndex(src, callback) {
//     var xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 callback(JSON.parse(xhr.responseText));
//             } else {
//                 alert(xhr.statusText);
//             }
//         }
//     };
//     xhr.open('GET', src);
//     xhr.send();
// }
function ajaxIndex(src, callback) {
  fetch(src)
    .then(res => {
      return res.json();
    })
    .then(data => {
      callback(data);
    })
    .catch(err => alert(err));
}

///////////////////////////////Banner/////////////////////////////////

let bannerHTML = "";
let stepHTML = "";
let bannerTotal = 0;
let bannerShowNumber = 1;

function renderBanner(content) {
  bannerTotal = content.data.length;
  content.data.forEach(obj => {
    let tempShowHTML = `
      <a 
        class="show" href="./product.html?id=${obj.product_id}" 
        id="slide-${obj.id}" 
        style="background-image: url('${obj.picture}')"
        onmouseover=mouseIn()
        onmouseout=mouseOut() >
        <div class="comment">
          ${obj.story.replaceAll("\n", "<br>")}
        </div>
      </a>
      `;
    bannerHTML += tempShowHTML;
  });
  let stepClass = `<div class="step"></div>`;
  bannerHTML += stepClass;
  document.querySelector(".banner").innerHTML = bannerHTML;
  let i = 1;
  content.data.forEach(() => {
    let tempStepHTML = `<a class="circle" id="circle-${i}" href="#" onclick=handleClickCircle(${i})>O</a>`;
    stepHTML += tempStepHTML;
    i += 1;
  });
  document.querySelector(".step").innerHTML = stepHTML;
}
/* eslint-disable */
function handleClickCircle(i) {
  let bannerShowImg = `slide-${i}`;
  for (let i = 1; i <= bannerTotal; i++) {
    if (bannerShowImg === document.querySelector(`#slide-${i}`).id) {
      document.querySelector(`#slide-${i}`).setAttribute("class", "show-now");
      document
        .querySelector(`#circle-${i}`)
        .setAttribute("class", "circle-show-now");
      if (bannerShowNumber < bannerTotal) {
        bannerShowNumber += 1;
      } else {
        bannerShowNumber = 1;
      }
    } else {
      document.querySelector(`#slide-${i}`).setAttribute("class", "show");
      document
        .querySelector(`#circle-${i}`)
        .setAttribute("class", "circle-show");
    }
  }
}
/* eslint-enable */

function setClass() {
  let bannerShowImg = `slide-${bannerShowNumber}`;
  for (let i = 1; i <= bannerTotal; i++) {
    if (bannerShowImg === document.querySelector(`#slide-${i}`).id) {
      document.querySelector(`#slide-${i}`).setAttribute("class", "show-now");
      document
        .querySelector(`#circle-${i}`)
        .setAttribute("class", "circle-show-now");
    } else {
      document.querySelector(`#slide-${i}`).setAttribute("class", "show");
      document
        .querySelector(`#circle-${i}`)
        .setAttribute("class", "circle-show");
    }
  }
  if (bannerShowNumber < bannerTotal) {
    bannerShowNumber += 1;
  } else {
    bannerShowNumber = 1;
  }
}

let setBannerTime = window.setInterval(setClass, 5000);
/* eslint-disable */
function mouseIn() {
  window.clearInterval(setBannerTime);
}
function mouseOut() {
  // setClass();
  setBannerTime = window.setInterval(setClass, 5000);
}
/* eslint-enable */
ajaxIndex(`${APIHostName}/marketing/campaigns`, function(response) {
  renderBanner(response);
  setClass();
});

///////////////////////////////Banner/////////////////////////////////
///////////////////////index & Category & Search////////////////////////

let productHTML = "";
let category = "all";
let nextpage = 0;
let loading = false;
var url = location.href;

if (url.indexOf("?") != -1) {
  var ary = url.split("?")[1];
}
if (ary === "tag=women") {
  category = "women";
} else if (ary === "tag=men") {
  category = "men";
} else if (ary === "tag=accessories") {
  category = "accessories";
} else if (
  ary ==
  `keyword=${encodeURIComponent(
    new URLSearchParams(window.location.search).get("keyword")
  )}`
) {
  category = "search";
} else {
  category = "all";
}

function renderProducts(content) {
  content.data.forEach(obj => {
    let productColor = "";
    obj.colors.forEach(color => {
      productColor += `<div class="color" style="background-color: #${color.code};"></div>`;
    });
    let tempProductHTML = `
    <a class="product" href="./product.html?id=${obj.id}">
      <img src="${obj.main_image}" alt="product image" />
      <div class="colors">${productColor}</div>
      <div class="name">${obj.title}</div>
      <div class="price">TWD.${obj.price}</div>
    </a>
    `;
    productHTML += tempProductHTML;
  });
  document.querySelector(".products").innerHTML = productHTML;
}

if (category == "search") {
  let inputSearch = encodeURIComponent(
    new URLSearchParams(window.location.search).get("keyword")
  );
  ajaxIndex(
    `${APIHostName}/products/${category}?keyword=${inputSearch}`,
    function(response) {
      if (response.data.length === 0) {
        document.querySelector(
          ".main-products"
        ).innerHTML = `<h1>沒有搜尋到任何產品哦！</h1>`;
      } else {
        renderProducts(response);
        if (response.next_paging) {
          nextpage = response.next_paging;
        }
      }
    }
  );
} else {
  ajaxIndex(`${APIHostName}/products/${category}?paging=${nextpage}`, function(
    response
  ) {
    if (response.data.length === 0) {
      document.querySelector(
        ".main-products"
      ).innerHTML = `<h1>沒有搜尋到任何產品哦！</h1>`;
    }
    renderProducts(response);
    if (response.next_paging) {
      nextpage = response.next_paging;
    }
  });
}

/////////////////////index & Category & Search//////////////////////
//////////////////////////////Scroll////////////////////////////////

window.addEventListener("scroll", function() {
  let scrollNumber = document
    .querySelector(".buttomscroll")
    .getBoundingClientRect();
  if (
    scrollNumber.bottom < scrollNumber.bottom + 100 &&
    scrollNumber.top <
      (window.innerHeight || document.documentElement.clientHeight) &&
    loading == false
  ) {
    if (nextpage !== undefined && nextpage !== 0 && loading === false) {
      loading = true;
      ajaxIndex(
        `${APIHostName}/products/${category}?paging=${nextpage}`,
        function(response) {
          nextpage = response.next_paging;
          renderProducts(response);
          loading = false;
        }
      );
    }
  }
});

//window.addEventListener("click", function(){});
//window.removeEventListener("click", function(){});

//////////////////////////////Scroll////////////////////////////////
