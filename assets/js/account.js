const formatRupiah = (money) => {
  return new Intl.NumberFormat('id-ID',
    { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
  ).format(money);
}

function updateAccount(){
    const token = localStorage.getItem('token');
    let tokens = token.split(".");
    const user = JSON.parse(atob(tokens[1]));
    const id = user['id']
}

function logoutUser(){
  window.localStorage.removeItem('token_user');
  window.location.href = '/'
}

const checkToken = () => {
  const token = localStorage.getItem('token_user');
  if (token) {
    return token;
  }
  else{
    document.querySelector('#header-count-cart').classList.add('d-none')
    document.getElementById('img-none-cart').classList.remove('d-none')
    document.querySelector('#text-cart-none').classList.remove('d-none')
    document.querySelector('#text-body-none').classList.remove('d-none')
  }
  return;
};

const getProfile = (token) => {
  let tokens = token.split(".");
  const user = JSON.parse(atob(tokens[1]));
  document.getElementById('username').innerHTML = user['username']
};

document.addEventListener('DOMContentLoaded', () => {
const token = checkToken();
  if (!token) {
    document.getElementById('btn-user').classList.add('d-none')
    document.getElementById('btn-regis-login').classList.remove('d-none')
  } else {
    document.getElementById('btn-user').classList.remove('d-none')
    document.getElementById('btn-regis-login').classList.add('d-none')
    getProfile(token);
  }
});

document.addEventListener('DOMContentLoaded', () =>{
    const name = document.getElementById('name')
    const username = document.getElementById('username-edit')
    const phone = document.getElementById('phone')
    const pass = document.getElementById('password')
    const address = document.getElementById('address')
    const city = document.getElementById('city')
    const state = document.getElementById('state')
    const postcode = document.getElementById('postcode')
    fetch('http://127.0.0.1:5000/users/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'x-access-token' : checkToken('token_user')
        },
    })
    .then(response =>{
      if (response.status == 401){
        window.location.href = 'login.html'
      }
      else{
        return response.json()
      }
    })
    .then(json => {
        // console.log(json)
        name.value = json['name']
        username.value = json['username']
        phone.value = json['phone']
        pass.value = json['password']
        address.value = json['address']
        city.value = json['city']
        state.value = json['state']
        postcode.value = json['postcode']
        document.getElementById('update').setAttribute('onclick', 'saveChanges("'+json['name']+'","'+json['username']+'","'+json['address']+'","'+json['phone']+'","'+json['password']+'","'+json['city']+'","'+json['state']+'","'+json['postcode']+'")')
    })
    .catch((error) => {
      alert('Error:'+ error);
    });

    
})

document.addEventListener('DOMContentLoaded', () =>{
  const token = checkToken()
  if(!token){
    document.getElementById('count-cart').innerHTML = `(0)`
  }else{
    fetch('http://127.0.0.1:5000/carts/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'x-access-token' : checkToken('token_user')
      },
    })
    .then(response =>{
      if (response.status == 401){window.location.href = 'index.html'}
      else if(response.status == 404){console.log('No products in carts')}
      else{
        return response.json()
      }
    })
    .then(json => {
        // console.log(json.length)
        if(json == null){
          document.querySelector('#header-count-cart').classList.add('d-none')
          document.getElementById('img-none-cart').classList.remove('d-none')
          document.querySelector('#text-cart-none').classList.remove('d-none')
          document.querySelector('#text-body-none').classList.remove('d-none')
        }else{
        document.getElementById('count-cart').innerHTML = `(${json.length})`
        // document.getElementById('text-cart-none').classList.add('d-none')
        for(let i = 0; i < json.length; i++){
          document.querySelector('#cart-list').innerHTML += `
          <div class="container m-0 p-0">
            <div class="row">
              <div class="col-auto">
                <img src="${json[i]['image']}" alt="" width="50" class="rounded-1">
              </div>
              <div class="col justify-content-center align-content-center align-items-center">
                <p class="text-bolder mb-0 text-xs text-dark">${json[i]['name_product']}</p> 
                <p class="text-normal mb-0 text-xs text-muted">${json[i]['quantity']} items</p> 
                <p class="text-bolder mb-0 text-xs text-danger">${formatRupiah(json[i]['price'])}</p> 
              </div>
            </div>
            <hr>
          </div>`
        }
      }
    })
    .catch((error) => {
      alert('Error:'+ error);
    });
  }
})

function checkForm(){
    const name = document.getElementById('name').value
    const username = document.getElementById('username-edit').value
    const phone = document.getElementById('phone').value
    const pass = document.getElementById('password').value
    const address = document.getElementById('address').value
    const city = document.getElementById('city').value
    const state = document.getElementById('state').value
    const postcode = document.getElementById('postcode').value
    let cansubmit = (name.length > 0) || (username.length > 0) || (pass.length > 0) || (phone.length > 0) || (address.length > 0) || (city.length > 0) || (state.length > 0) || (postcode.length > 0);
    document.getElementById("update").disabled = !cansubmit;
};

function saveChanges(name, username, phone, password, address, city, state, postcode){
  let updatename = document.getElementById('name').value
  let updateusername = document.getElementById('username-edit').value
  let updatephone = document.getElementById('phone').value
  let updatepass = document.getElementById('password').value
  let updateaddress = document.getElementById('address').value
  let updatecity = document.getElementById('city').value
  let updatestate = document.getElementById('state').value
  let updatepostcode = document.getElementById('postcode').value

  name = updatename
  username = updateusername
  phone = updatephone
  password = updatepass
  address = updateaddress
  city = updatecity
  state = updatestate
  postcode = updatepostcode

  const update = {
    name : name,
    username : username,
    phone : parseInt(phone),
    password : password,
    address : address,
    city : city,
    state : state,
    postcode : parseInt(postcode)
  }

  fetch('http://127.0.0.1:5000/users/', {
    method: 'PUT',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token' : checkToken('token_user')
    },
    body: JSON.stringify(update)
    })
    .then(response => response.json())
    .then(data => {
      alert('Successfully update', data);
      window.location.reload()
    })
    .catch((error) => {
      alert('Error:', error);
    });
}