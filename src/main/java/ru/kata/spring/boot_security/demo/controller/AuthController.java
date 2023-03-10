package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RegistrationService;
import ru.kata.spring.boot_security.demo.service.RoleService;

@Controller
@RequestMapping("/auth")
public class AuthController {
    private final RegistrationService registrationService;
    private final RoleService roleService;

    @Autowired
    public AuthController(RegistrationService registrationService, RoleService roleService) {
        this.registrationService = registrationService;
        this.roleService = roleService;
    }

    @GetMapping("/registration")
    public String registrationPage(/*@ModelAttribute("user") User user*/ Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getListRoles());
        return "auth/registration";

    }

    @PostMapping("/registration")
    public String performRegistration(@ModelAttribute("user") User user) {
        registrationService.register(user);
        return "redirect:/login";

    }

}
