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
    fetch('http://127.0.0.1:5000/users/', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'x-access-token' : checkToken('token_admin')
      }
    })
    .then(response =>{
      return response.json()
    })
    .then(json => {
        console.log(json)
        $('#user').DataTable({
          autoWidth: false,
          processing: true,
          data: json,
          columns: [
            { data: 'id' },
            { data: 'name'},
            { data: 'username'},
            { data: 'email' },
            { data: 'address' },
            { data: 'city' },
            { data: 'state' },
            { data: 'postcode' },
            { data: 'phone' },
            { data: 'is_admin' },
          ]
        })
    })
    .catch((error) => {
    alert('Error:'+ error);
    });
})