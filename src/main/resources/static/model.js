export class Role {
    constructor(id, nameNotPrefix, role) {
        this.id = id;
        this.nameNotPrefix = nameNotPrefix;
        this.role = role;
    }
}
export class User {
    constructor(id, firstName, lastName, age, email, roles, password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age
        this.email = email;
        this.roles = roles;
        this.password = password;
    }
}
