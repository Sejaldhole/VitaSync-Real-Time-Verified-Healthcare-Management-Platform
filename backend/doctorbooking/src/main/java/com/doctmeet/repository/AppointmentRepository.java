package com.doctmeet.repository;

import java.util.List;
import java.util.Optional;

import com.doctmeet.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByDoctorId(String doctorId);



    List<Appointment> findByDoctorIdAndAppointmentDate(
            String doctorId,
            String appointmentDate
    );

    Optional<Appointment> findByDoctorIdAndAppointmentDateAndAppointmentTime(
            String doctorId,
            String appointmentDate,
            String appointmentTime
    );

    List<Appointment> findByPatientEmail(String patientEmail);

    List<Appointment> findByPatientEmailAndStatus(
            String patientEmail,
            String status
    );

    List<Appointment> findByDoctorIdAndStatus(
            String doctorId,
            String status
    );
}