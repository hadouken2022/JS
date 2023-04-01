import {Role, User} from './model.js';


fetch("api/auth")
    .then(response => response.json())
    .then(data => {

        //parse User
        let roles = data.roles.map(role => {
            return new Role(role.id, role.nameNotPrefix);
        });
        let user = new User(data.id, data.firstName, data.lastName, data.age, data.email, roles)
        console.log(user);

        //Чек на админа и группировка ролей
        let loginAuth = data.email;
        let isAdmin = false;
        let rolesStr = data.roles.map(role => {
            if (role.nameNotPrefix === "ADMIN") {
                isAdmin = true;
            }
            return role.nameNotPrefix;
        })
        console.log(`Admin : ${isAdmin}`)
        console.log(`Roles : ${rolesStr}`)

        //Отображение в header логина и ролей
        let login = document.getElementById('login-roles');
        login.innerText = `${loginAuth} with roles: ${rolesStr}`;

        //скрытие админ панели, если юзер не админ
        if (isAdmin === false) {
            let adminPanel = document.getElementById('admin-panel-left-tab').style.display = 'none';
            adminPanel = document.getElementById('adminPanel').style.display = 'none';
            const userButton = $('a[href="#userPanel"]');
            userButton.click();
        }

        //Добавление талицы about user
        let tbody = document.getElementById('table-about-user');
        let tr = document.createElement('tr');
        tr.id = `tr-${user.id}`;
        for (let field in user) {
            let td = document.createElement("td");
            if (field === "password") {
            } else {
                if (field === "roles") {
                    td.innerHTML = user.roles.map(role => role.nameNotPrefix).join(" ");
                } else {
                    td.innerHTML = user[field];
                }
                td.id = `${field}-${user.id}`;
                tr.append(td);
            }
        }
        tbody.append(tr);


    })
    .catch(error => {
        console.error(error);
    });

tableUsers();

function tableUsers() {
    const adminButton = $('a[href="#adminPanel"]');
    adminButton.click();

    const url = "api/admin"; // Запрос на Rest для получения списка юзеров
    const tbody = document.getElementById("table-users");

    fetch(url)
        .then(response => response.json())
        .then(data => {

            //Parse на User, включая parse Role
            let users = data.map(user => {
                let roles = user.roles.map(role => {
                    return new Role(role.id, role.nameNotPrefix);
                });
                return new User(user.id, user.firstName, user.lastName, user.age, user.email, roles)
            });

            //Добавляем таблицу юзеров
            users.forEach(user => {
                let tr = document.createElement("tr");
                tr.id = `tr-${user.id}`;
                for (let field in user) {
                    let td = document.createElement("td");
                    if (field === "password") {
                    } else {
                        if (field === "roles") {
                            td.innerHTML = user.roles.map(role => role.nameNotPrefix).join(" ");
                        } else {
                            td.innerHTML = user[field];
                        }
                        td.id = `${field}-${user.id}`;
                        tr.append(td);
                    }
                }
                tr.append(editButton(user));
                tr.append(deleteButton(user));
                tbody.append(tr);

                //Редактирование
                const select = document.getElementById(`select-for-roles-edit-${user.id}`);
                (async () => {
                    const data = await fetchRoles();
                    data.forEach(role => {
                        let option = document.createElement("option");
                        option.value = role.id;
                        option.id = role.role;
                        option.text = role.nameNotPrefix;
                        select.appendChild(option);
                    })
                })();
                const formEdit = document.querySelector(`#edit-form-${user.id}`);
                formEdit.addEventListener('submit', (event) => {
                    event.preventDefault(); // предотвращаем отправку формы
                    const formData = new FormData(formEdit);
                    const data = {};
                    for (let [key, value] of formData.entries()) {
                        data[key] = value;
                    }

                    const options = select.selectedOptions;
                    const selectedValues = [];
                    for (let i = 0; i < options.length; i++) {
                        let role = new Role(options[i].value, options[i].nameNotPrefix, options[i].id);
                        selectedValues.push(role);
                    }

                    let user = new User(data.id, data.firstName, data.lastName, data.age, data.email, selectedValues, data.password);
                    //console.log(user)
                    fetch('api/admin', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(user)
                    })
                        .then(response => response.json())
                        .then(data => {

                            //Parse на User, включая parse Role
                            let roles = data.roles.map(role => {
                                return new Role(role.id, role.nameNotPrefix, role.role);
                            });
                            user = new User(data.id, data.firstName, data.lastName, data.age, data.email, roles);
                            console.log(user)
                            let button = document.querySelector(`#edit-${user.id} .btn-secondary`);
                            button.click();
                            for (let field in user) {
                                let newTd = document.getElementById(`${field}-${user.id}`);
                                if (field === "password") {
                                } else {
                                    if (field === "roles") {
                                        newTd.innerHTML = user.roles.map(role => role.nameNotPrefix).join(" ");
                                    } else {
                                        newTd.innerHTML = user[field];
                                    }
                                }
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                });

                //Удаление
                const formDelete = document.querySelector(`#delete-form-${user.id}`);
                formDelete.addEventListener('submit', (event) => {
                    event.preventDefault(); // предотвращаем отправку формы
                    const formData = new FormData(formDelete);
                    const data = {};
                    for (let [key, value] of formData.entries()) {
                        data[key] = value;

                    }


                    fetch('api/admin', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(new User(data.id))
                    })
                        .then(response => response.json())
                        .then(data => {

                            let button = document.querySelector(`#delete-${user.id} .btn-secondary`);
                            button.click();

                            const trDelete = document.querySelector(`#tr-${user.id}`)
                            trDelete.remove();
                        })
                        .catch(error => {
                            console.error(error);
                        });
                });

            });
        })
        .catch(error => {
            console.error(error);
        });
}

// Добавляет кнопку Delete и модальное окно, связь по id юзера
export function deleteButton(user) {


    let td = document.createElement("td");

    // HTML код для кнопки
    let button = `<input type="submit" class="btn btn-danger" data-toggle="modal" data-target="#delete-${user.id}" value="Delete"/>`;
    td.insertAdjacentHTML('beforeend', button);
console.log("OK");
    // HTML код для модального окна
    let modal = `
      <div class="modal fade" id="delete-${user.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">Delete user</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" id="modal-form-edit">
              <form id="delete-form-${user.id}">

               <div class="form-group">
                   <label for="delete-id-field-${user.id}" class="row font-weight-bold justify-content-center">ID</label>
                   <input type="number" class="form-control" id="delete-id-field-${user.id}" value="${user.id}" name="id" readonly>
               </div>

               <div class="form-group">
                   <label for="delete-firstname-field-${user.id}" class="row font-weight-bold justify-content-center">First Name</label>
                   <input type="text" class="form-control" id="delete-firstname-field-${user.id}" value="${user.firstName}" name="firstName" readonly>
               </div>

               <div class="form-group">
                   <label for="delete-lastname-field-${user.id}" class="row font-weight-bold justify-content-center">Last Name</label>
                   <input type="text" class="form-control" id="delete-lastname-field-${user.id}" value="${user.lastName}" name="lastName" readonly>
               </div>

               <div class="form-group">
                   <label for="delete-age-field-${user.id}" class="row font-weight-bold justify-content-center">Age</label>
                   <input type="number" class="form-control" id="delete-age-field-${user.id}" value="${user.age}" name="age" readonly>
               </div>

               <div class="form-group">
                   <label for="delete-email-field-${user.id}" class="row font-weight-bold justify-content-center">E-mail</label>
                   <input type="email" class="form-control" id="delete-email-field-${user.id}" value="${user.email}" name="email" readonly>
               </div>

               <div class="modal-footer">
                   <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                   <input type="submit" class="btn btn-danger" value="Delete">
               </div>
           </form>
            </div>
          </div>
        </div>
      </div>`
    ;
    td.insertAdjacentHTML('beforeend', modal);

    return td;
}
// Добавляет кнопку Edit и модальное окно, связь по id юзера
export function editButton(user) {

    let td = document.createElement("td");

    // HTML код для кнопки
    let button = `<input type="submit" class="btn btn-info" data-toggle="modal" data-target="#edit-${user.id}" value="Edit"/>`;
    td.insertAdjacentHTML('beforeend', button);

    // HTML код для модального окна
    let modal = `
      <div class="modal fade" id="edit-${user.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">Edit user</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" id="modal-form-edit">
              <form id="edit-form-${user.id}">

               <div class="form-group">
                   <label for="edit-id-field-${user.id}" class="row font-weight-bold justify-content-center">ID</label>
                   <input type="number" class="form-control" id="edit-id-field-${user.id}" value="${user.id}" name="id" readonly>
               </div>

               <div class="form-group">
                   <label for="edit-firstname-field-${user.id}" class="row font-weight-bold justify-content-center">First Name</label>
                   <input type="text" class="form-control" id="edit-firstname-field-${user.id}" value="${user.firstName}" name="firstName">
               </div>

               <div class="form-group">
                   <label for="edit-lastname-field-${user.id}" class="row font-weight-bold justify-content-center">Last Name</label>
                   <input type="text" class="form-control" id="edit-lastname-field-${user.id}" value="${user.lastName}" name="lastName">
               </div>

               <div class="form-group">
                   <label for="edit-age-field-${user.id}" class="row font-weight-bold justify-content-center">Age</label>
                   <input type="number" class="form-control" id="edit-age-field-${user.id}" value="${user.age}" name="age">
               </div>

               <div class="form-group">
                   <label for="edit-email-field-${user.id}" class="row font-weight-bold justify-content-center">E-mail</label>
                   <input type="email" class="form-control" id="edit-email-field-${user.id}" value="${user.email}" name="email">
               </div>

               <div class="form-group">
                   <label for="edit-password-field-${user.id}" class="row font-weight-bold justify-content-center">Password</label>
                   <input type="password" class="form-control" id="edit-password-field-${user.id}" value="" name="password">
               </div>
               
               <div class="form-group">
                   <label for="select-for-roles-edit-${user.id}" class="row font-weight-bold justify-content-center">Role</label>
                   <select multiple class="form-control" id="select-for-roles-edit-${user.id}" name="roles"></select>
               </div>

               <div class="modal-footer">
                   <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                   <input type="submit" class="btn btn-success" value="Edit">
               </div>
           </form>
            </div>
          </div>
        </div>
      </div>`
    ;
    td.insertAdjacentHTML('beforeend', modal);

    return td;
}

async function fetchRoles() {
    const response = await fetch('api/admin/roles');
    return await response.json();
}

/*$(async function () {
    await allUsers();
});
const table = $('#table-users');

async function allUsers() {
    fetch("api/admin")
        .then(res => res.json())
        .then(data => {
            data.forEach(user => {
                let tableWithUsers = `$(
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.nameNotPrefix.concat(" "))}</td>
                    <td>
                        <button type="button" class="btn btn-info" data-toggle="modal" id="buttonEdit"
                        data-action="edit" data-id="${user.id}" data-target="#edit">Edit</button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger" data-toggle="modal" id="buttonDelete"
                        data-action="delete" data-id="${user.id}" data-target="#delete">Delete</button>
                    </td>
                </tr>)`;
                table.append(tableWithUsers);

            })
        })
}*/

