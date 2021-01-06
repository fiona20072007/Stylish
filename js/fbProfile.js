/*global FB*/
/*eslint no-undef: "error"*/

function ajax(src, callback, member) {
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
    xhr.open('post', src);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(member));
}

///////////////////set fb////////////////////////////

export function setFb(set, get) {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '889747558096510',
            cookie: true, // Enable cookies to allow the server to access the session.
            xfbml: true, // Parse social plugins on this webpage.
            version: 'v8.0', // Use this Graph API version for this call.
        });

        FB.getLoginStatus(function (response) {
            console.log(123, response);
            if (get) {
                get(response);
            }
            if (response.status === 'connected') {
                FB.api(
                    '/me',
                    {
                        fields: 'id,name,email,picture',
                    },
                    function (response) {
                        console.log(456, response);
                        // set(response);
                    }
                );
            }
            if (response.status === 'connected') {
                let member = {
                    provider: 'facebook',
                    access_token: response.authResponse.accessToken,
                };
                ajax(
                    `https://api.appworks-school.tw/api/1.0/user/signin`,
                    function (xhr) {
                        console.log('login success');
                        if (set) {
                            set(xhr.data.user);
                        }
                    },
                    member
                );
            }
        });
        //此形式為非同步，fetch，call facebook自己的api
    };
    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
}

if (window.location.pathname !== '/profile.html') {
    setFb();
}

export function checkLoginState() {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            console.log('你已經登入囉');
            window.location = './profile.html';
        } else {
            login();
        }
    });
}

// login & logout
export function login() {
    FB.login(
        function (response) {
            if (response.status === 'connected') {
                FB.api(
                    '/me',
                    {
                        fields: 'id,name,email,picture',
                    },
                    function (response) {
                        console.log(response);
                    }
                );
                alert('您已順利登入！');
                window.location = './profile.html';
            }
        },
        {
            scope: 'email',
            auth_type: 'rerequest',
        }
    );
}

export function logout() {
    alert('您已順利登出！');
    FB.logout(function (response) {
        console.log(response);
        window.location = './';
    });
}
