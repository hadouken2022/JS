package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.DTO.UserDto;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {
   void save(UserDto userDto);
   List<UserDto> findAll();
   User findById(Long id);
   void update(User user);
   void delete(Long id);
   User findByEmail(String email);

}
