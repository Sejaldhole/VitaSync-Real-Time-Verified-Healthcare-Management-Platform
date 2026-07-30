package com.doctmeet.repository;

import com.doctmeet.model.DoctorRequest;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DoctorRequestRepository
        extends MongoRepository<DoctorRequest, String> {

    // Get all pending requests
    List<DoctorRequest> findByStatus(String status);


}