import {Role, User} from './model.js';
import {deleteButton, editButton} from './usersTable.js';

const form = document.querySelector('#new-user-form');

const select = document.getElementById("select-for-roles");

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

form.addEventListener('submit', (event) => {
    event.preventDefault(); // предотвращаем отправку формы
    const formData = new FormData(form);
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


    let user = new User(0, data.firstName, data.lastName, data.age, data.email, selectedValues, data.password);


    fetch('api/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)  //Отправляем нового юзера на сервер
    })
        .then(response => response.json())
        .then(data => {     //Получаем нового юзера с сервера, после записи в БД и назначении ID

            //Parse на User, включая parse Role
            let roles = data.roles.map(role => {
                return new Role(role.id, role.nameNotPrefix, role.role);
            });


            user = new User(data.id, data.firstName, data.lastName, data.age, data.email, roles);


            //Добавляю новую строку в таблицу с новым юзером
            let trNew = document.createElement("tr");
            trNew.id = `tr-${user.id}`;
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
                    trNew.append(td);
                }
            }
            trNew.append(editButton(user));
            trNew.append(deleteButton(user));
            const tbody = document.getElementById("table-users");
            tbody.append(trNew);

            const allUsersButton = $('a[href="#userTable"]');
            allUsersButton.click();
            form.reset();

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
                console.log(user)
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
                        console.log('newUser:'+user)

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

        })
        .catch(error => {
            console.error(error);
        });
});



async function fetchRoles() {
    const response = await fetch('api/admin/roles');
    return await response.json();
}


