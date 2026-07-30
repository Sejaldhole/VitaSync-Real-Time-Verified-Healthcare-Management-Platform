package com.doctmeet.model;

import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "doctor_requests")
public class DoctorRequest {

    @Id
    private String id;

    // Basic Info
    private String name;
    private String email;
    private String phone;
    private String password;

    // Professional Info
    private String specialization;
    private String degree;
    private int experience;
    private String licenseNumber;

    // Hospital / Clinic
    private String hospitalName;
    private String hospitalAddress;

    // Appointment Settings
    private double consultationFees;
    private String startTime;
    private String endTime;
    private int slotDuration;

    // Doctor Profile
    private String about;

    // Doctor profile image
    private String profileImageUrl;

    // Multiple certificates/degrees
    private List<String> certificateUrls;

    // Request Status
    private String status; // PENDING / APPROVED / REJECTED

    private LocalDateTime submittedAt;
}