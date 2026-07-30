package com.doctmeet.controller;

import com.doctmeet.model.Appointment;
import com.doctmeet.model.Doctor;
import com.doctmeet.model.Review;

import com.doctmeet.repository.AppointmentRepository;
import com.doctmeet.repository.DoctorRepository;
import com.doctmeet.repository.ReviewRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.doctmeet.model.User;
import com.doctmeet.repository.UserRepository;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    // ADD REVIEW
    @PostMapping
    public String addReview(

            @RequestBody Review review,

            Authentication authentication
    ) {

        String patientEmail =
                authentication.getName();

        // CHECK ALREADY REVIEWED
        boolean alreadyReviewed =

                reviewRepository
                        .existsByDoctorIdAndPatientEmail(

                                review.getDoctorId(),

                                patientEmail
                        );

        if (alreadyReviewed) {

            return "You already reviewed this doctor ❌";
        }

        // CHECK COMPLETED APPOINTMENT
        List<Appointment> appointments =

                appointmentRepository
                        .findByPatientEmail(patientEmail);

        boolean completedAppointment = false;

        for (Appointment appointment : appointments) {

            if (

                    appointment.getDoctorId()
                            .equals(review.getDoctorId())

                            &&

                            appointment.getStatus()
                                    .equals("COMPLETED")
            ) {

                completedAppointment = true;
                break;
            }
        }

        if (!completedAppointment) {

            return "Complete appointment first ❌";
        }

        review.setPatientEmail(patientEmail);


        User patient =
                userRepository.findByEmail(patientEmail)
                        .orElse(null);

        if (patient != null) {

            review.setPatientName(
                    patient.getName()
            );
        }

        review.setReviewDate(
                java.time.LocalDate.now().toString()
        );



        reviewRepository.save(review);

        // UPDATE DOCTOR RATING
        List<Review> reviews =

                reviewRepository.findByDoctorId(
                        review.getDoctorId()
                );

        double total = 0;

        for (Review r : reviews) {

            total += r.getRating();
        }

        double average =
                total / reviews.size();

        Doctor doctor =

                doctorRepository
                        .findById(review.getDoctorId())
                        .orElse(null);

        if (doctor != null) {

            doctor.setRating(average);

            doctorRepository.save(doctor);
        }

        return "Review added successfully ✅";
    }

    // GET REVIEWS OF DOCTOR
    @GetMapping("/{doctorId}")
    public List<Review> getReviews(

            @PathVariable String doctorId
    ) {

        return reviewRepository
                .findByDoctorId(doctorId);
    }
}


