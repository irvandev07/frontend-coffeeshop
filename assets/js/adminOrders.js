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
    fetch('http://127.0.0.1:5000/order-detail/', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'x-access-token' : checkToken('token_admin')
        }
    })
    .then(response =>{
      if(response.status == 401){window.location.href = '../login.html'}
      return response.json()
    })
    .then(json => {
        // console.log(json)
        $('#ordersDetail').DataTable({
          autoWidth: false,
          processing: true,
          serverside: true,
          // language: {
          //     'loadingRecords': '&nbsp;',
          //     'processing': '<div class="spinner"></div>'
          // },
          data: json,
          order: [[1, 'desc']],
          columns: [
            { data: 'id' },
            { data: 'order_id'},
            { data: 'product_id'},
            { data: 'product_name' },
            { data: 'quantity' },
            { data: 'subtotal' },
          ]
        })
    })
    .catch((error) => {
        alert('Error:'+ error);
    });
})

document.addEventListener('DOMContentLoaded', () =>{
    fetch('http://127.0.0.1:5000/order/', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'x-access-token' : checkToken('token_admin')
      }
    })
    .then(response =>{
      if(response.status == 401){window.location.href = '../login.html'}
      return response.json()
    })
    .then(json => {
        // console.log(json)
        const table= $('#orders').DataTable({
          autoWidth: false,
          processing: true,
          data: json,
          order: [[5, 'desc']],
          columns: [
            { data: 'id' },
            { data: 'public_id' },
            { data: 'user_id'},
            { data: 'name_user'},
            { data: 'date' },
            { data: 'payment_type' },
            { data: 'status' },
            { data: 'total_price' },
          ]
        })
        $('#orders tbody').on('click', 'tr', function () {
          let data = table.row(this).data();
          $('#modalOrders').modal('show');
          document.getElementById('order-id').value = data['public_id']
          document.getElementById('order-status').value = data['status']
          document.getElementById('btn-delete').setAttribute('onclick','deleteThis("'+data['public_id']+'")')
          document.getElementById('btn-update').setAttribute('onclick','updateThis("'+data['public_id']+'","'+data['status']+'")')
        });
    })
    .catch((error) => {
    alert('Error:'+ error);
    });
})

function deleteThis(id){
  // console.log(e.target.getAttribute('data-id'))
  fetch('http://127.0.0.1:5000/order/'+id+'/', {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'x-access-token' : checkToken('token_admin')
    },
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

function updateThis(id, status){
  const statusUpdate = document.getElementById('order-status')
  status = statusUpdate.value;
  const update = { 
    status: status,
  };
  // console.log(update)
  fetch('http://127.0.0.1:5000/order/'+id+'/', {
      method: 'PUT',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token' : checkToken('token_admin')
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