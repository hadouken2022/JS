package ru.kata.spring.boot_security.demo.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.DTO.UserDto;
import ru.kata.spring.boot_security.demo.model.User;

@RestController
public class AuthRestController {

    @GetMapping("api/auth")
    public ResponseEntity<UserDto> userAuth(@AuthenticationPrincipal User userAuth) {
        return ResponseEntity.ok(new UserDto(userAuth));
    }
}
