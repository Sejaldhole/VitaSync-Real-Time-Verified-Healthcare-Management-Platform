package com.doctmeet.model;

import java.util.List;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "doctors")
public class Doctor {

    @Id
    private String id;

    // Basic Info
    private String name;
    private String email;
    private String phone;

    // Professional Info
    private String specialization;
    private String degree;
    private int experience;
    private String licenseNumber;

    // Hospital Info
    private String hospitalName;
    private String hospitalAddress;

    // Appointment Settings
    private double fees;
    private String startTime;
    private String endTime;
    private int slotDuration;

    // Doctor Profile
    private String about;
    private double rating;

    // Images
    private String profileImageUrl;
    private List<String> certificateUrls;

    private List<String> unavailableDates;
}