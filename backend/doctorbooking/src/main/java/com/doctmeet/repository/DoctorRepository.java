package com.doctmeet.repository;

import com.doctmeet.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

import java.util.Optional;

public interface DoctorRepository extends MongoRepository<Doctor, String> {

    List<Doctor> findBySpecialization(String specialization);

    Optional<Doctor> findByEmail(String email);


}