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
    document.querySelector('#badge-count').classList.add('d-none')
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
    fetch('http://127.0.0.1:5000/order/', {
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
      else if(response.status == 404){console.log('No history order')}
      else{
        return response.json()
      }
    })
    .then(json => {
        // console.log(json.length)
        if(json == null){
          document.querySelector('#no-history').classList.remove('d-none')
          document.querySelector('#yes-history').classList.add('d-none')
        }
        else{
          for(let i = 0; i < json.length; i++){
            if(json[i]['status'] == 'Complete'){
              document.querySelector('#history-order').innerHTML += `
              <div class="container ms-3 mt-3 me-3 mb-3 shadow-sm p-3 bg-body p-3" style="width: auto;">
                <p class="d-inline mb-0 text-sm text-normal text-dark">${json[i]['date']}</p>
                <p class="d-inline mb-3 text-xxs text-bolder ms-2 text-white bg-gradient-success ps-2 pt-1 pb-1 pe-2">${json[i]['status']}</p>
                <p class="d-inline mb-3 text-xs text-muted">OID/${json[i]['id']}</p>
                <div class="container-fluid d-grid gap-3 align-items-center ps-0 pe-0 mt-3 mb-3" style="grid-template-columns: 0fr 2fr 1fr;">
                  <div class="d-flex align-items-center">
                    <img src="/assets/img/30days.png" alt="" width="80" id="img-order`+i+`">
                  </div>
                  <div class="d-block align-items-center">
                    <p class="text-dark text-bolder mb-0" id="product-order`+i+`">Coffee Beans - 200g</p>
                    <p class="text-muted text-normal text-xs mb-0" id="quantity-price`+i+`"></p>
                    <p class="text-dark text-normal text-xs mb-0 mt-2" id="other-items`+i+`">+</p>
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="vr bg-dark ms-2 me-2"></div>
                    <div class="d-block p-3">
                      <p class="text-sm mb-0">Total Price</p>
                      <p class="text-md text-bolder text-dark mb-1">${formatRupiah(json[i]['total_price'])}</p>
                    </div>
                  </div>
                </div>
                <a class="float-end text-sm text-bolder text-dark cursor-pointer" data-bs-target="#detailOrder-modal`+i+`" id="order-id`+i+`" order-data="${json[i]['id']}" data-bs-toggle="modal">Detail Transctions</a>
              </div>`
            }else if(json[i]['status'] == 'Active'){
              document.querySelector('#history-order').innerHTML += `
              <div class="container ms-3 mt-3 me-3 mb-3 shadow-sm p-3  bg-body p-3" style="width: auto;">
                <p class="d-inline mb-0 text-sm text-normal text-dark">${json[i]['date']}</p>
                <p class="d-inline mb-3 text-xxs text-bolder ms-2 text-white bg-gradient-warning ps-2 pt-1 pb-1 pe-2">${json[i]['status']}</p>
                <p class="d-inline mb-3 text-xs text-muted">OID/${json[i]['id']}</p>
                <div class="container-fluid d-grid gap-3 align-items-center ps-0 pe-0 mt-3 mb-3" style="grid-template-columns: 0fr 2fr 1fr;">
                  <div class="d-flex align-items-center">
                    <img src="/assets/img/30days.png" alt="" width="80" id="img-order`+i+`" >
                  </div>
                  <div class="d-block align-items-center">
                    <p class="text-dark text-bolder mb-0" id="product-order`+i+`">Coffee Beans - 200g</p>
                    <p class="text-muted text-normal text-xs mb-0"  id="quantity-price`+i+`"></p>
                    <p class="text-dark text-normal text-xs mb-0 mt-2"  id="other-items`+i+`">+ </p>
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="vr bg-dark ms-2 me-2"></div>
                    <div class="d-block p-3">
                      <p class="text-sm mb-0">Total Price</p>
                      <p class="text-md text-bolder text-dark mb-1">${formatRupiah(json[i]['total_price'])}</p>
                    </div>
                  </div>
                </div>
                <a class="float-end text-sm text-bolder text-danger cursor-pointer ms-2 me-2" onclick="cancelOrder('${json[i]['id']}')">Cancel Order</a>
                <div class="vr bg-dark float-end ms-2 me-2 mt-1"></div>
                <a class="float-end text-sm text-bolder text-dark cursor-pointer ms-2 me-2" data-bs-target="#detailOrder-modal`+i+`" id="order-id`+i+`" order-data="${json[i]['id']}" data-bs-toggle="modal">Detail Transctions</a>
              </div>`
            }
            else{
              document.querySelector('#history-order').innerHTML += `
              <div class="container ms-3 mt-3 me-3 mb-3 shadow-sm p-3  bg-body p-3" style="width: auto;">
                <p class="d-inline mb-0 text-sm text-normal text-dark">${json[i]['date']}</p>
                <p class="d-inline mb-3 text-xxs text-bolder ms-2 text-white bg-gradient-danger ps-2 pt-1 pb-1 pe-2">${json[i]['status']}</p>
                <p class="d-inline mb-3 text-xs text-muted">OID/${json[i]['id']}</p>
                <div class="container-fluid d-grid gap-3 align-items-center ps-0 pe-0 mt-3 mb-3" style="grid-template-columns: 0fr 2fr 1fr;">
                  <div class="d-flex align-items-center">
                    <img src="/assets/img/30days.png" alt="" width="80" id="img-order`+i+`" >
                  </div>
                  <div class="d-block align-items-center">
                    <p class="text-dark text-bolder mb-0" id="product-order`+i+`">Coffee Beans - 200g</p>
                    <p class="text-muted text-normal text-xs mb-0"  id="quantity-price`+i+`"></p>
                    <p class="text-dark text-normal text-xs mb-0 mt-2"  id="other-items`+i+`">+ </p>
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="vr bg-dark ms-2 me-2"></div>
                    <div class="d-block p-3">
                      <p class="text-sm mb-0">Total Price</p>
                      <p class="text-md text-bolder text-dark mb-1">${formatRupiah(json[i]['total_price'])}</p>
                    </div>
                  </div>
                </div>
                <a class="float-end text-sm text-bolder text-dark cursor-pointer ms-2 me-2" data-bs-target="#detailOrder-modal`+i+`" id="order-id`+i+`" order-data="${json[i]['id']}" data-bs-toggle="modal">Detail Transctions</a>
              </div>`
            }
            document.getElementById('modal-content').innerHTML += 
            `<div class="modal fade" id="detailOrder-modal`+i+`" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog modal-dialog-centered" style="overflow-y: initial !important">
              <div class="modal-content rounded-0">
                <div class="modal-header">
                  <h5 class="modal-title text-center text-dark" id="staticBackdropLabel">Detail Orders</h5>
                  <button type="button" class="btn-close rounded-0" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-light p-0 scroll" style="height: 550px; overflow-y: auto;">
                  <div class="container bg-white p-4">
                    <p class="text-bolder text-dark text-sm mb-1">${json[i]['status']}</p>
                    <hr class="mt-3 pt-0 dashed bg-transparent">
                    <div class="d-flex justify-content-between">
                      <div class="card-title text-muted text-normal text-sm">No. Order</div>
                      <div class="text-sm text-bolder text-danger" id="id-order">${json[i]['id']}</div>
                    </div>
                    <div class="d-flex justify-content-between">
                      <div class="card-title text-muted text-normal text-sm">Date Order</div>
                      <div class="text-sm text-bold text-dark">${json[i]['date']}</div>
                    </div>
                  </div>
                  <div class="container bg-white p-4 mt-2" id="list-order`+i+`">
                    <p class="text-bolder text-dark text-sm mb-1">Detail Product</p>
                    <hr class="mt-3 pt-0 dashed bg-transparent">
                    
                  </div>
                  <div class="container bg-white p-4 mt-2">
                    <p class="text-bolder text-dark text-sm mb-1">Info Shipping</p>
                    <hr class="mt-3 pt-0 dashed bg-transparent">
                    <div class="d-flex">
                      <div class="text-muted text-normal col-3 text-sm">Address :</div>
                      <div class="text-sm text-normal text-dark col-4"><b>${json[i]['name']}</b>
                        +${json[i]['phone']} <br>
                        ${json[i]['address']} <br>
                        ${json[i]['city']}, ${json[i]['state']} <br>
                        ${json[i]['postcode']}</div>
                    </div>
                  </div>
                  <div class="container bg-white p-4 mt-2">
                    <p class="text-bolder text-dark text-sm mb-1">Payment details</p>
                    <div class="d-flex justify-content-between">
                      <div class="card-title text-muted text-normal text-sm">Payment Method</div>
                      <div class="text-sm text-bolder text-dark">${json[i]['payment']}</div>
                    </div>
                    <hr class="mt-3 pt-0 dashed bg-transparent">
                    <div class="d-flex justify-content-between">
                      <div class="card-title text-muted text-normal text-sm">Total Product</div>
                  <div class="text-sm text-bold text-dark" id="total-quantity`+i+`"></div>
                    </div>
                    <hr class="mt-3 pt-0 dashed bg-transparent">
                    <div class="d-flex justify-content-between">
                      <div class="card-title text-dark text-bolder text-sm">Total Price</div>
                      <div class="text-sm text-bolder text-dark" >${formatRupiah(json[i]['total_price'])}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>`
            let totalQuantity = 0;
            let subTotal =0;
            let quantity = [];
            for(let j = 0; j < json[i]['detail_order'].length; j++){
              // console.log(json[i]['detail_order'].length)
              document.getElementById('list-order'+i).innerHTML += `
              <div class="card border-1 p-2 mb-2">
                <div class="row row-cols-3 row-cols-auto">
                  <div class="col-auto">
                    <img src="${json[i]['detail_order'][j]['image']}" width="50" alt="">
                  </div>
                  <div class="col-7 d-flex align-items-center p-0">
                    <div class="d-block">
                      <p class="text-xs text-bold text-dark mb-0">${json[i]['detail_order'][j]['name_product']}</p>
                      <p class="text-xxs text-normal text-dark mb-0">${json[i]['detail_order'][j]['quantity']} x ${formatRupiah(json[i]['detail_order'][j]['price'])}</p>
                    </div>
                  </div>
                  <div class="vr bg-dark pe-0 ps-0 mt-2 mb-2"></div>
                  <div class="col-auto d-flex justify-content-center align-items-center">
                    <div class="d-block p-0 m-0">
                      <p class="text-xxs mb-0">Sub Total</p>
                      <p class="text-xs text-bolder text-dark mb-1">${formatRupiah(json[i]['detail_order'][j]['subtotal'])}</p>
                    </div>
                  </div>
                </div>
              </div>`
              quantity.push(json[i]['detail_order'][j]['quantity'])
              document.getElementById('img-order'+i).src = json[i]['detail_order'][0]['image']
              document.getElementById('product-order'+i).innerHTML = json[i]['detail_order'][0]['name_product']
              document.getElementById('quantity-price'+i).innerHTML = json[i]['detail_order'][0]['quantity'] + ' x ' + formatRupiah(json[i]['detail_order'][0]['price'])
              if(json[i]['detail_order'].length - 1 == 0){
                document.querySelector('#other-items'+i).classList.add('d-none')
              }
              else{
                document.getElementById('other-items'+i).innerHTML = `+ ${json[i]['detail_order'].length - 1} items other `
              }
            }
            for(let k = 0; k < quantity.length; k++){
              subTotal=quantity[k]
              totalQuantity+=subTotal
            }
            document.getElementById("total-quantity"+i).innerHTML = totalQuantity+' items'
          }
        }

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
      if (response.status == 401){window.location.href = 'login.html'}
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
          document.querySelector('#badge-count').classList.add('d-none')
        }else{
        document.getElementById('count-cart').innerHTML = `(${json.length})`
        document.getElementById('badge-count').innerHTML = `${json.length}`
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

function logoutUser(){
  window.localStorage.removeItem('token_user');
  window.location.href = '/'
}

function cancelOrder(id){
  // console.log(id)
  const putStatus = {
    status: 'Cancel'
  }
  fetch('http://127.0.0.1:5000/order/'+id+'/', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token' : checkToken('token_user')
      },
      body: JSON.stringify(putStatus)
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