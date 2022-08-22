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
    fetch('http://127.0.0.1:5000/products/', {
    method: 'GET',
    credentials: 'include',
    })
    .then(response =>{
     return response.json()
    })
    .then(json => {
        for(let i = 0; i < json.length; i++){
            document.querySelector('#col-product').innerHTML += `
            <a href="#" onclick="productDetail('${json[i]['id']}')" class="search-product">
                <div class="col d-flex justify-content-center" id="${json[i]['id']}" stock=${json[i]['stock']}>
                    <div class="card shadow-none img-hover" style="width: 250px; height:375px">
                        <img src="${json[i]['image']}" alt="" width="250" height="250" class="image">
                        <div class="middle">
                          <div class="text"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
                          <div class="text text-bold text-sm">Details</div>
                        </div>
                        <div class="card-body ps-0">
                            <p class="card-text text-md text-bold text-dark mb-1">${json[i]['name']}</p>
                            <p class="card-text text-xs text-muted mb-1">${json[i]['categories']}</p>
                            <p class="card-text text-md text-danger font-weight-bolder">${formatRupiah(json[i]['price'])}</p>
                        </div>
                    </div>
                </div>
            </a>`
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
      if(response.status == 404){console.log('No products in carts')}
      else{
        return response.json()
      }
    })
    .then(json => {
        // console.log(json.length)
        if(json == null){
          document.querySelector('#header-count-cart').classList.add('d-none')
          document.querySelector('#img-none-cart').classList.remove('d-none')
          document.querySelector('#text-cart-none').classList.remove('d-none')
          document.querySelector('#text-body-none').classList.remove('d-none')
          document.querySelector('#badge-count').classList.add('d-none')
        }else{
        document.getElementById('count-cart').innerHTML = `(${json.length})`
        document.getElementById('badge-count').innerHTML = `${json.length}`
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

// document.addEventListener('DOMContentLoaded', () =>{
//     fetch('http://127.0.0.1:5000/categories/', {
//     method: 'GET',
//     credentials: 'include',
//     headers: {
//         'x-access-token' : checkToken('token_admin')
//         }
//     })
//     .then(response =>{
//      return response.json()
//     })
//     .then(json => {
//         console.log(json)
//         for(let i = 0; i < json.length; i++){
//             document.getElementById('orders-collapse').innerHTML += 
//             `<div class="form-check">
//                 <input class="form-check-input float-none" type="checkbox" value="" id="flexCheckDefault">
//                 <label class="form-check-label" for="flexCheckDefault">
//                 Default checkbox
//                 </label>
//             </div>`
//         }
//     })
//     .catch((error) => {
//       alert('Error:'+ error);
//     });
// })

function productDetail(id) {
    window.location = 'detailproduct.html?pid=' + id;
}

// function account(){
//     const token = checkToken('token_user');
//     let tokens = token.split(".");
//     const user = JSON.parse(atob(tokens[1]));
//     if (user['is_admin'] == false) {
//         window.location.href = 'account.html';
//     }else{
//         window.location.href = 'login.html';
//     }
// }

function mySearch() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('input-search');
    filter = input.value.toUpperCase();
    ul = document.getElementById("col-product");
    li = ul.getElementsByTagName('A');
    countDisplay = 0
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("div")[0];
      txtValue = a.textContent || a.innerText;
    //   console.log(a.getAttribute('stock'))
      if (txtValue.toUpperCase().indexOf(filter) > -1) { 
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }

      const display = li[i].getAttribute('style')
      if (display == "display: none;" ){
            countDisplay++
      }

      if(countDisplay == li.length){
        document.getElementById('not-found-product-title').innerHTML = `Oops Sorry`
        document.getElementById('not-found-product').innerHTML = `Not found results for "<b class="text-dark">${input.value}</b>"`
        document.getElementById('filter-product').style.display = "none"
      }
      else if(txtValue.toUpperCase().indexOf(filter) > -1){
        document.getElementById('not-found-product-title').innerHTML = ""
        document.getElementById('not-found-product').innerHTML = ""
        document.getElementById('filter-product').style.display = ""
      }
      
    }
}

function logoutUser(){
  window.localStorage.removeItem('token_user');
  window.location.reload()
}




