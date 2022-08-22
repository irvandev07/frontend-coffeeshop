const formatRupiah = (money) => {
  return new Intl.NumberFormat('id-ID',
    { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
  ).format(money);
}

const checkToken = () => {
    const token = localStorage.getItem('token_admin');
    if (token) {
      // cek valid
  
      return token;
    }
    else{
      window.location.href = '../login.html';
    }

    return;
};

document.addEventListener('DOMContentLoaded', () => {
    const token = checkToken();
    if (!token) {
      window.location.href = '../login.html';
    } else {
      getProfile(token);
    }
});

function logoutAdmin(){
    window.localStorage.removeItem('token_admin');
    window.location.reload()
}
 
const getProfile = (token) => {
  let tokens = token.split(".");
  const user = JSON.parse(atob(tokens[1]));
  document.getElementById('name').innerText = user['username'];
};

document.addEventListener('DOMContentLoaded', () =>{
  fetch('http://127.0.0.1:5000/products/', {
    method: 'GET',
    credentials: 'include',
  })
  .then(response =>{
      if(response.status == 401){window.location.href = '../login.html'}
      return response.json()
  })
  .then(json => {
      // console.log(json)
      const table = $('#product').DataTable({
        autoWidth: false,
        processing: true,
        serverside: true,
        // language: {
        //     'loadingRecords': '&nbsp;',
        //     'processing': '<div class="spinner"></div>'
        // },
        data: json,
        columns: [
          { data: 'id' },
          { data: 'categories_id'},
          { data: 'categories'},
          { data: 'name' },
          { data: 'stock' },
          { data: 'price' },
          // {data: 'id',
          //   "render": function ( data ) { 
          //     return '<button data-edit="'+data+'" onclick="deleteThis(event)" class="btn btn-xs btn-light me-1"><i class="fa-solid fa-pen"></i></button><button data-id="'+data+'" onclick="deleteThis(event)" class="btn btn-xs btn-danger ms-1"><i class="fa-solid fa-trash-can"></i></button>'
          //   }
          // }
        ]
      })

      $('#product tbody').on('click', 'tr', function () {
        let data = table.row(this).data();
        // console.log(data['id'])
        $('#modalProduct').modal('show');
        document.getElementById('product-id').value = data['id']
        document.getElementById('product-cat').value = data['categories_id']
        document.getElementById('product-name').value = data['name']
        document.getElementById('product-stock').value = data['stock']
        document.getElementById('product-price').value = data['price']
        document.getElementById('product-img').value = data['image']
        document.getElementById('product-desc').value = data['description']
        document.getElementById('btn-delete').setAttribute('onclick','deleteThis("'+data['id']+'")')
        document.getElementById('btn-update').setAttribute('onclick','updateThis("'+data['id']+'","'+data['categories']+'", "'+data['name']+'","'+data['stock']+'","'+data['price']+'","'+data['image']+'","'+data['description']+'")')
      });
  })
  .catch((error) => {
    alert('Error:'+ error);
  });
})

function addProduct(){
    const add = document.getElementById('addProduct');
    const data = new FormData(add);
    const name = data.get('name');
    const price = data.get('price');
    const stock = data.get('stock');
    const cat = data.get('categories');
    const desc = data.get('desc');
    const img = data.get('image');
    // console.log(name, price, stock, cat, desc, img)
    if ((name == "") || (price == "")|| (stock == "")|| (cat == "")|| (desc == "")|| (img == "")){
        alert("Please insert data")
    }
    else{
      const addPro = { 
        name_product: name, 
        categories_id: cat,
        description :desc,
        price : price,
        stock:stock,
        image:img
      };
      const url = "http://127.0.0.1:5000/products/";
      fetch(url, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token' : checkToken('token')
          },
          body: JSON.stringify(addPro)
      })
      .then(response => response.json())
      .then(data => {
          alert('Successfully create todo', data);
          window.location.reload()
      })
      .catch((error) => {
          alert('Error:', error);
      });
        
    }
}

function updateThis(id, categories, name, stock, price, img, desc){
  const pro_cat = document.getElementById('product-cat')
  const pro_name = document.getElementById('product-name')
  const pro_stock = document.getElementById('product-stock')
  const pro_price = document.getElementById('product-price')
  const pro_img = document.getElementById('product-img')
  const pro_desc = document.getElementById('product-desc')
  categories = pro_cat.value;
  name = pro_name.value;
  stock = pro_stock.value;
  price = pro_price.value;
  img = pro_img.value;
  desc = pro_desc.value;
  const update = { 
    name_product: name,
    categories_id: categories,
    stock: parseInt(stock),
    price: parseInt(price),
    image: img,
    description: desc,
  };

  console.log(update)
  fetch('http://127.0.0.1:5000/products/'+id+'/', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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

function deleteThis(id){
  fetch('http://127.0.0.1:5000/products/'+id+'/', {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
  })
  .then(response => response.json())
  .then(data => {
    swal({
      title: "Good job!",
      text: "You clicked the button!",
      icon: "success",
      button: window.location.reload(data),
    });
  })
}