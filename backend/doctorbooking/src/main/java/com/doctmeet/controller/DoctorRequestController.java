package com.doctmeet.controller;

import com.doctmeet.model.DoctorRequest;
import com.doctmeet.repository.DoctorRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/doctor-request")
public class DoctorRequestController {

    @Autowired
    private DoctorRequestRepository doctorRequestRepository;

    // Doctor submits request
    @PostMapping
    public String submitRequest(
            @RequestBody DoctorRequest request
    ) {

        // automatically set values
        request.setStatus("PENDING");

        request.setSubmittedAt(LocalDateTime.now());

        doctorRequestRepository.save(request);

        return "Doctor request submitted successfully ✅";
    }
}