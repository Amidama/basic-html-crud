function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://www.mecallapi.com/api/users");
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                trHTML += '<tr>'
                trHTML += '<td>'+object['id']+'</td>'
                trHTML += '<td><img width="50px" src="'+object['avatar']+'" class = "avatar"></td>'
                trHTML += '<td>'+object['fname']+'</td>'
                trHTML += '<td>'+object['lname']+'</td>'
                trHTML += '<td>'+object['username']+'</td>'
                trHTML += '<td> \
                            <button type="button" class="btn btn-warning" onclick="showUserEditBox('+object['id']+')">Edit</button> \
                            <button type="button" class="btn btn-danger" onclick="showUserDeleteBox('+object['id']+')">Delete</button> \
                          </td>'
                trHTML += '<td></td>'
                trHTML += '</tr>'
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    }
}

function showUserCreateBox() {
    Swal.fire({
        title: 'Create user',
        html:
          '<input id="fname" class="swal2-input" placeholder="First">' +
          '<input id="lname" class="swal2-input" placeholder="Last">' +
          '<input id="username" class="swal2-input" placeholder="Username">' +
          '<input id="email" class="swal2-input" placeholder="Email">',
        preConfirm: () => {
            userCreate();
        }
    })
}

function userCreate() {
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://www.mecallapi.com/api/users/create");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "fname": fname,
        "lname": lname,
        "username": username,
        "email": email,
        "avatar": "https://www.mecallapi.com/users/cat.png"
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const object = JSON.parse(this.responseText);
            Swal.fire(object["message"], '', 'success');
            loadTable();
        }
    }
}

function showUserEditBox(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://www.mecallapi.com/api/users/"+id);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const object = JSON.parse(this.responseText);
            const user = object["user"]
            Swal.fire({
                title: 'Edit User',
                html:
                  '<input id="fname" class="swal2-input" placeholder="First" value="'+user["fname"]+'">' +
                  '<input id="lname" class="swal2-input" placeholder="Last" value="'+user["lname"]+'">' +
                  '<input id="username" class="swal2-input" placeholder="Username" value="'+user["username"]+'">' +
                  '<input id="email" class="swal2-input" placeholder="Email" value="'+user["email"]+'">',
                preConfirm: () => {
                    userEdit(id);
                }
            })
        }
    }
}

function userEdit(id) {
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "https://www.mecallapi.com/api/users/update");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "id": id,
        "fname": fname,
        "lname": lname,
        "username": username,
        "email": email,
        "avatar": "https://www.mecallapi.com/users/cat.png"
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const object = JSON.parse(this.responseText);
            if (object["status"] == "ok") {
                Swal.fire(object["message"], '', 'success');
            } else {
                Swal.fire(object["message"], '', 'error');
            }
            loadTable();
        }
    }

}

function showUserDeleteBox(id) {
    Swal.fire({
        title: 'Are you sure to remove id = '+id+'?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            userDelete(id);
        }
    })
}

function userDelete(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "https://www.mecallapi.com/api/users/delete");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "id": id,
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const object = JSON.parse(this.responseText);
            if(object["status"] == ["ok"]) {
                Swal.fire(
                    'Deleted!',
                    object["message"],
                    'success'
                )
            } else {
                Swal.fire(
                    'Failed!',
                    object["message"],
                    'error'
                )
            }
            loadTable();
        }
    }
}

loadTable();