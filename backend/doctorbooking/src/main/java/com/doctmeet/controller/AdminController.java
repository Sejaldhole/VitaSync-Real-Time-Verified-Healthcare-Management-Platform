package com.doctmeet.controller;

import com.doctmeet.model.Doctor;
import com.doctmeet.model.DoctorRequest;
import com.doctmeet.repository.DoctorRepository;
import com.doctmeet.repository.DoctorRequestRepository;

import com.doctmeet.model.User;
import com.doctmeet.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRequestRepository doctorRequestRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // GET ALL REQUESTS
    @GetMapping("/doctor-requests")
    public List<DoctorRequest> getAllRequests() {

        return doctorRequestRepository
                .findByStatus("PENDING");
    }

    // APPROVE DOCTOR
    @PostMapping("/approve/{id}")
    public String approveDoctor(@PathVariable String id) {

        DoctorRequest request =
                doctorRequestRepository.findById(id).orElse(null);

        if (request == null) {
            return "Request not found ❌";
        }

        // CREATE DOCTOR PROFILE
        Doctor doctor = new Doctor();

// Basic Info
        doctor.setName(request.getName());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());

// Professional Info
        doctor.setSpecialization(request.getSpecialization());
        doctor.setDegree(request.getDegree());
        doctor.setExperience(request.getExperience());
        doctor.setLicenseNumber(request.getLicenseNumber());

// Hospital Info
        doctor.setHospitalName(request.getHospitalName());
        doctor.setHospitalAddress(request.getHospitalAddress());

// Appointment Settings
        doctor.setFees(request.getConsultationFees());

        doctor.setStartTime(request.getStartTime());
        doctor.setEndTime(request.getEndTime());

        doctor.setSlotDuration(request.getSlotDuration());

// Doctor Profile
        doctor.setAbout(request.getAbout());
        doctor.setRating(0);

// Images
        doctor.setProfileImageUrl(request.getProfileImageUrl());
        doctor.setCertificateUrls(request.getCertificateUrls());

        doctorRepository.save(doctor);

        // CREATE LOGIN ACCOUNT
        User user = new User();

        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        user.setRole("DOCTOR");

        userRepository.save(user);

        // UPDATE STATUS
        request.setStatus("APPROVED");

        doctorRequestRepository.save(request);

        return "Doctor approved successfully ✅";
    }

    @PostMapping("/reject/{id}")
    public String rejectDoctor(
            @PathVariable String id
    ) {

        // FIND REQUEST
        DoctorRequest request =
                doctorRequestRepository.findById(id).orElse(null);

        if (request == null) {
            return "Request not found ❌";
        }

        // UPDATE STATUS
        request.setStatus("REJECTED");

        doctorRequestRepository.save(request);

        return "Doctor request rejected successfully ❌";
    }
}