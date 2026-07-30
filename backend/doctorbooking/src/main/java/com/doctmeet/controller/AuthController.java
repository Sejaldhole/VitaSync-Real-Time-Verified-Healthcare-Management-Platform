package com.doctmeet.controller;

import com.doctmeet.model.User;
import com.doctmeet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.doctmeet.config.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Register user
    @PostMapping("/register")
    public String register(@RequestBody User user) {

        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "User already exists!";
        }

        // Save user
        userRepository.save(user);

        return "User registered successfully!";
    }


    @PostMapping("/login")
    public String login(@RequestBody User user) {

        // Find user by email
        User existingUser = userRepository.findByEmail(user.getEmail()).orElse(null);

        if (existingUser == null) {
            return "User not found!";
        }

        // Check password
        if (!existingUser.getPassword().equals(user.getPassword())) {
            return "Invalid password!";
        }

        String token = JwtUtil.generateToken(existingUser.getEmail(), existingUser.getRole());
        return token;
    }

    @GetMapping("/me")

    public User getMyProfile() {

        String email =

                org.springframework.security
                        .core.context
                        .SecurityContextHolder

                        .getContext()

                        .getAuthentication()

                        .getName();

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }

    @PutMapping("/update")

    public User updateProfile(

            @RequestBody User updatedUser
    ) {

        String email =

                org.springframework.security
                        .core.context
                        .SecurityContextHolder

                        .getContext()

                        .getAuthentication()

                        .getName();

        User existingUser =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (existingUser == null) {
            return null;
        }

        // UPDATE PROFILE FIELDS

        existingUser.setName(
                updatedUser.getName()
        );

        existingUser.setBirthDate(
                updatedUser.getBirthDate()
        );

        existingUser.setAge(
                updatedUser.getAge()
        );

        existingUser.setGender(
                updatedUser.getGender()
        );

        existingUser.setPhone(
                updatedUser.getPhone()
        );

        existingUser.setBloodGroup(
                updatedUser.getBloodGroup()
        );

        existingUser.setAddress(
                updatedUser.getAddress()
        );

        System.out.println(updatedUser);

        System.out.println(existingUser);

        // SAVE TO MONGODB
        return userRepository.save(
                existingUser
        );
    }
}