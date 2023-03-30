package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;


@Controller
public class UsersController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UsersController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/admin")
    public String getUsersTable(Model model, @AuthenticationPrincipal User user) {
        model.addAttribute("userList", userService.findAll());
        model.addAttribute("authUser", user);
        model.addAttribute("newUser", new User());
        model.addAttribute("roles", roleService.getListRoles());
        return "users";
    }
    /*@GetMapping(value = "/admin/{id}")
    public String getUserById(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", userService.findById(id));
        return "user";
    }*/
    /*@GetMapping(value = "/admin/new")
    public String newUser(*//*@ModelAttribute("User") User user*//* Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getListRoles());
        return "users";
    }*/
    @PostMapping("/admin")
    public String addUser(@ModelAttribute("user") User user) {
        userService.save(user);
        return "redirect:/admin";
    }
    /*@GetMapping(value = "/admin/{id}/edit")
    public String editUser(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", userService.findById(id));
        model.addAttribute("roles", roleService.getListRoles());
        return "edit";
    }*/
    @PatchMapping("/admin/{id}/edit")
    public String updateUser(@ModelAttribute("user") User user, @PathVariable("id") Long id) {
        userService.update(id, user);
        return "redirect:/admin";
    }
    @DeleteMapping("/admin/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        userService.delete(id);
        return "redirect:/admin";
    }
    /*@GetMapping("/authUser/info")
    public String userInfo(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authUser = (User) authentication.getPrincipal();
        model.addAttribute("authUser", userService.findById(authUser.getId()));
        return "authUser";
    }*/

}
