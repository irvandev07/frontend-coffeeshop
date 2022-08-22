const formatRupiah = (money) => {
  return new Intl.NumberFormat('id-ID',
    { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
  ).format(money);
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

  fetch('http://127.0.0.1:5000/most-orders/', {
      method: 'GET',
      credentials: 'include',
      })
    .then(response =>{
      return response.json()
    })
    .then(json => {
        // console.log(json)
        for(let i = 0; i < json.length; i++){
          document.querySelector('#col-product').innerHTML += `
          <a href="#" onclick="productDetail('${json[i]['id']}')">
            <div class="col d-flex justify-content-center" id="${json[i]['id']}">
                <div class="card shadow-none img-hover">
                    <img src="${json[i]['image']}" alt="" width="250" height="250" class="image">
                    <div class="middle">
                      <div class="text"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
                      <div class="text text-bold text-sm">${json[i]['name_product']}</div>
                    </div>
                </div>
            </div>
        </a>`
        }
    })
    .catch((error) => {
      alert('Error:'+ error);
    });
});

function addCart(){
    const token = checkToken()
    if (!token){
      alert("Please login for add product to cart")
      if(confirm){
        window.location.href = 'login.html'
      }
    }
    else{
      const name = document.getElementById('name').textContent
      // let price = document.getElementById('price').textContent
      // price = price.split("Rp");
      // price = price[1].split('.');
      // price = price[0]+price[1]
      const quantity = document.getElementById('quantity').value

      const addCart = { 
        name_product : name,
        quantity: quantity,
      };
      const url = "http://127.0.0.1:5000/carts/";
      fetch(url, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              'x-access-token' : checkToken('token_user')
          },
          body: JSON.stringify(addCart)
      })
      .then(response =>  response.json())
      .then(data => {
          if(!data.ok){
            alert(data.message)
          }
          // alert('Successfully add to carts', data);
          // window.location.reload()
      })
      .catch((error) => {
          alert('Error:', error);
      });
    }
}

let url_string = window.location.href;
let url = new URL(url_string);
let id = url.searchParams.get("pid");
fetch('http://127.0.0.1:5000/products/'+id+'/', {
  method: 'GET',
  credentials: 'include',
})
.then(response => response.json())
.then(response => {
    document.querySelector('#name').innerHTML = response['name']
    document.querySelector('#image').src = response['image']
    document.querySelector('#itemCode').innerHTML = 'item code: '+ response['id']
    document.querySelector('#desc').innerHTML = response['description']
    document.querySelector('#price').innerHTML = formatRupiah(response['price'])
    document.querySelector('#stock').innerHTML = 'Stock: '+response['stock']
    if(response['stock'] == 0){
        document.getElementById('add-cart').removeAttribute('onclick', 'addCart()');
        document.getElementById('add-cart').setAttribute('disabled', '');
        document.getElementById('quantity-cart').setAttribute('disabled', '');
        document.getElementById('quantity').value = 0;
    }
})
.catch((error) => {
  alert('Error:'+ error);
});


function productDetail(id) {
    window.location = 'detailproduct.html?pid=' + id;
}

function account(){
    const token = localStorage.getItem('token_user');
    let tokens = token.split(".");
    const user = JSON.parse(atob(tokens[1]));
    if (user['is_admin'] == false) {
        window.location.href = 'account.html';
    }else{
        window.location.href = 'login.html';
    }
}