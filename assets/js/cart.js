const formatRupiah = (money) => {
    return new Intl.NumberFormat('id-ID',
      { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
    ).format(money);
}

const checktoken = () => {
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
  const token = checktoken();
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
    fetch('http://127.0.0.1:5000/carts/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'x-access-token' : checktoken('token_user')
        },
    })
    .then(response =>{
        if (response.status == 401){
          window.location.href = 'login.html'
        }
        else if(response.status == 404){console.log('No products in carts')}
        else{
          return response.json()
        }
    })
    .then(json => {
        // console.log(json)
        if(json == null){
          document.querySelector('#cart-summary').classList.add('d-none')
          document.querySelector('#header-count-cart').classList.add('d-none')
          document.querySelector('#img-none-cart').classList.remove('d-none')
          document.querySelector('#text-cart-none').classList.remove('d-none')
          document.querySelector('#text-body-none').classList.remove('d-none')
          document.querySelector('#cart-product').innerHTML +=`
          <div class="container text-center vh-100 mb-0">
            <img src="/assets/img/logo-black.svg" width="150" class="mt-10"/>
            <p class="text-dark text-2xl text-bolder"> Opps Sorry</p>
            <p> No products in carts</p>
          </div>`
        }else{
          document.getElementById('count-cart').innerHTML = `(${json.length})`
          for(let i = 0; i < json.length; i++){
            document.querySelector('#cart-product').innerHTML += `
            <div class="container">
              <div class="row">
                <div class="col">
                  <div class="form-check">
                    <input class="form-check-input me-3 checkbox-cart" type="checkbox" value="${json[i]['product_id']},${json[i]['quantity']},${json[i]['price']}" style="margin-top: 2rem;">
                    <img src="${json[i]['image']}" alt="" width="80" class="rounded-1">
                    <label class="form-check-label" for="cart-select">
                      <p class="text-normal mb-0">${json[i]['name_product']}</p> 
                      <p class="text-bolder mb-0">${formatRupiah(json[i]['price'])}</p> 
                    </label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-8">
                </div>
                <div class="col">
                  <div class="d-flex align-items-center">
                    <a href="#" class="me-5 text-center" onclick="deleteThis('${json[i]['id']}')">Delete product <i class="fa-solid fa-trash-can ms-2"></i></a>
                    <div class="input-group inline-group" style="height: 41px;">
                      <div class="input-group-prepend bg-light">
                        <button class="button btn-minus btn-xs p-2">
                          <i class="fa fa-minus"></i>
                        </button>
                      </div>
                      <input class="form-control quantity bg-light border-0 text-center" min="0" name="quantity" value="${json[i]['quantity']}" type="number" id="quantity">
                      <div class="input-group-append bg-light">
                        <button class="button btn-plus btn-xs p-2">
                          <i class="fa fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr>`

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

            $('input[class^="form-check-input"]').click(function() {
              let arrPriceQuantity = getValuePriceQuantity();
              let subtotal = [];
              let quantity = 0;
              let totalPrice = 0;
              for(let i = 0; i < arrPriceQuantity.length; i++){
                quantity += arrPriceQuantity[i][1]
                subtotal.push(arrPriceQuantity[i][0] * arrPriceQuantity[i][1])
                // subtotal += arrPriceQuantity[i][0]
                // console.log(subtotal,quantity)
              }
              for(let i = 0; i < subtotal.length; i++){
                totalPrice += subtotal[i]
              }
              
              document.getElementById('total-price-cart').innerHTML = formatRupiah(totalPrice)
              document.getElementById('total-items-cart').innerHTML = quantity +' items'
            });

            // $('.btn-plus, .btn-minus').on('click', function(e) {
            //   const isNegative = $(e.target).closest('.btn-minus').is('.btn-minus');
            //   const input = $(e.target).closest('.input-group').find('input');
            //   if (input.is('input')) {
            //       input[0][isNegative ? 'stepDown' : 'stepUp']()
            //   }
            // })
  
          }
        }
    })
    .catch((error) => {
      alert('Error:'+ error);
    });
})

function getOrderList() {
  let chkArray = {order:[]};
  let arrPrice = []
  $('input[class^="form-check-input"]:checkbox:checked').each(function(i) {
    let value = $(this).val();
    value = value.split(",");
    let proID = value[0]
    let quantity = value[1]
    let price = value[2]
    arrPrice[i] = price
    chkArray['order'][i] = 
    { 
      product_id : parseInt(proID),
      quantity: parseInt(quantity),
    };
  });
  return chkArray;
}

function getValuePriceQuantity() {
  let arrPriceQuantity = []
  $('input[class^="form-check-input"]:checkbox:checked').each(function(i) {
      let value = $(this).val();
      value = value.split(",");
      let quantity = value[1]
      let price = value[2]
      arrPriceQuantity[i] = [parseInt(price), parseInt(quantity)]
      
  });
  return arrPriceQuantity;
}

function deleteThis(id){
  // console.log(id)
  fetch('http://127.0.0.1:5000/carts/'+id+'/', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'x-access-token' : checktoken()
    },
  })
  .then(response => response.json())
  .then(data => {
    alert('Success Delete Carts')
    if(confirm){
      window.location.reload(data)
    }
  })
}

let addBtn = document.getElementById('checkout')
addBtn.addEventListener('click', () => {
  // console.log(getOrderList());
  const url = "http://127.0.0.1:5000/order/";
  fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
          'x-access-token' : checktoken('token_user')
      },
      body: JSON.stringify(getOrderList())
  })
  .then(response =>  {
    if(response.status == 503){alert('Please wait for order')}
    else if(response.status == 201){alert('Success')}
     response.json()
  })
  // .then(data => {
  //     alert('Successfully Order', data);
  //     // window.location.reload()
  // })
  .catch((error) => {
      alert('Error:', error);
  });
});

function logoutUser(){
  window.localStorage.removeItem('token_user');
  window.location.reload()
}



