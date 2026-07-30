package com.doctmeet.model;

import lombok.Data;

import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reviews")

@Data
public class Review {

    @Id
    private String id;

    private String doctorId;

    private String patientEmail;

    private int rating;

    private String reviewText;

    private String patientName;

    private String reviewDate;

}


