package com.doctmeet.controller;

import com.doctmeet.model.Appointment;
import com.doctmeet.model.Doctor;

import org.springframework.security.core.Authentication;

import com.doctmeet.repository.AppointmentRepository;
import com.doctmeet.repository.DoctorRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // ✅ ADD DOCTOR
    @PostMapping
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // ✅ GET ALL / FILTER BY SPECIALIZATION
    @GetMapping
    public List<Doctor> getDoctors(
            @RequestParam(required = false) String specialization
    ) {

        if (specialization != null) {
            return doctorRepository.findBySpecialization(specialization);
        }

        return doctorRepository.findAll();
    }

    // ✅ GET UNIQUE CATEGORIES
    @GetMapping("/categories")
    public Set<String> getCategories() {

        List<Doctor> doctors = doctorRepository.findAll();

        Set<String> categories = new HashSet<>();

        for (Doctor d : doctors) {

            if (d.getSpecialization() != null) {
                categories.add(d.getSpecialization());
            }
        }

        return categories;
    }

    // ✅ DOCTOR DASHBOARD → VIEW OWN APPOINTMENTS
    @GetMapping("/my-appointments")
    public List<Appointment> getMyAppointments(
            Authentication authentication
    ) {

        // GET LOGGED-IN EMAIL
        String email = authentication.getName();

        // FIND DOCTOR BY EMAIL
        Doctor doctor =
                doctorRepository.findByEmail(email).orElse(null);

        if (doctor == null) {
            return List.of();
        }

        // RETURN ONLY THIS DOCTOR'S APPOINTMENTS
        return appointmentRepository
                .findByDoctorId(doctor.getId());
    }

    @PutMapping("/profile")
    public String updateDoctorProfile(
            @RequestBody Doctor updatedDoctor,
            Authentication authentication
    ) {

        // LOGGED-IN DOCTOR EMAIL
        String email = authentication.getName();

        // FIND DOCTOR
        Doctor doctor =
                doctorRepository.findByEmail(email).orElse(null);

        if (doctor == null) {
            return "Doctor not found ❌";
        }

        // UPDATE FIELDS
        doctor.setName(updatedDoctor.getName());

        doctor.setPhone(updatedDoctor.getPhone());

        doctor.setSpecialization(updatedDoctor.getSpecialization());

        doctor.setDegree(updatedDoctor.getDegree());

        doctor.setExperience(updatedDoctor.getExperience());

        doctor.setLicenseNumber(updatedDoctor.getLicenseNumber());

        doctor.setHospitalName(updatedDoctor.getHospitalName());

        doctor.setHospitalAddress(updatedDoctor.getHospitalAddress());

        doctor.setFees(updatedDoctor.getFees());

        doctor.setStartTime(updatedDoctor.getStartTime());

        doctor.setEndTime(updatedDoctor.getEndTime());

        doctor.setSlotDuration(updatedDoctor.getSlotDuration());

        doctor.setAbout(updatedDoctor.getAbout());

        doctor.setProfileImageUrl(updatedDoctor.getProfileImageUrl());

        doctor.setCertificateUrls(updatedDoctor.getCertificateUrls());

        doctorRepository.save(doctor);

        return "Doctor profile updated successfully ✅";
    }

    @PutMapping("/unavailable-dates")
    public String updateUnavailableDates(

            @RequestBody List<String> dates,

            Authentication authentication
    ) {

        // LOGGED-IN DOCTOR EMAIL
        String email = authentication.getName();

        // FIND DOCTOR
        Doctor doctor =
                doctorRepository.findByEmail(email).orElse(null);

        if (doctor == null) {
            return "Doctor not found ❌";
        }

        // SAVE DATES
        doctor.setUnavailableDates(dates);

        doctorRepository.save(doctor);

        return "Unavailable dates updated successfully ✅";
    }

    @GetMapping("/my-appointments/status")
    public List<Appointment> getAppointmentsByStatus(

            @RequestParam String status,

            Authentication authentication
    ) {

        // LOGGED-IN DOCTOR EMAIL
        String email = authentication.getName();

        // FIND DOCTOR
        Doctor doctor =
                doctorRepository.findByEmail(email).orElse(null);

        if (doctor == null) {
            return List.of();
        }

        // FILTER BY STATUS
        return appointmentRepository
                .findByDoctorIdAndStatus(
                        doctor.getId(),
                        status
                );
    }
}