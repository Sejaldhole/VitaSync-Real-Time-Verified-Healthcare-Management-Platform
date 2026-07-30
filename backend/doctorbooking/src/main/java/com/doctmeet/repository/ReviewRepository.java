package com.doctmeet.repository;

import com.doctmeet.model.Review;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository

        extends MongoRepository<Review, String> {

    List<Review> findByDoctorId(
            String doctorId
    );

    boolean existsByDoctorIdAndPatientEmail(
            String doctorId,
            String patientEmail
    );
}


