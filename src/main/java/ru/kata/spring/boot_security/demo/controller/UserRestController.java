package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.DTO.UserDto;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class UserRestController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UserRestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;

    }

    @GetMapping()
    public ResponseEntity<List<UserDto>> getUsersTable() {
        List<UserDto> list = userService.findAll();
        return ResponseEntity.ok(list);
    }


    @PostMapping()
    public ResponseEntity<UserDto> addUser(@RequestBody UserDto userDto) {
        userService.save(userDto);
        User user = userService.findByEmail(userDto.getEmail());
        return ResponseEntity.ok(new UserDto(user));
    }


    @PatchMapping()
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto) {
        User user = new User(userDto);
        userService.update(user);
        return ResponseEntity.ok(new UserDto(user));
    }
    @DeleteMapping()
    public ResponseEntity<HttpStatus> deleteUser(@RequestBody UserDto userDto) {
        userService.delete(userDto.getId());
        return ResponseEntity.ok(HttpStatus.OK);
    }





}
