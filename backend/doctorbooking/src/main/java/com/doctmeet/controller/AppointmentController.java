package com.doctmeet.controller;

import com.doctmeet.model.Appointment;
import com.doctmeet.model.Doctor;
import com.doctmeet.repository.AppointmentRepository;
import com.doctmeet.repository.DoctorRepository;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.doctmeet.model.SlotResponse;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // ✅ BOOK APPOINTMENT
    @PostMapping
    public String bookAppointment(
            @RequestBody Appointment appointment
    ) {

        // 🔥 Logged-in user email from JWT
        String patientEmail =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        // ✅ set automatically
        appointment.setPatientEmail(patientEmail);

        appointment.setStatus("BOOKED");


        // ✅ check slot already booked or not
        Optional<Appointment> existing =
                appointmentRepository
                        .findByDoctorIdAndAppointmentDateAndAppointmentTime(
                                appointment.getDoctorId(),
                                appointment.getAppointmentDate(),
                                appointment.getAppointmentTime()
                        );

        if (existing.isPresent()) {
            return "Slot not available ❌";
        }

        appointmentRepository.save(appointment);

        return "Appointment booked successfully ✅";
    }
    // ✅ GET AVAILABLE SLOTS
    @GetMapping("/available")

    public SlotResponse getAvailableSlots(

            @RequestParam String doctorId,

            @RequestParam String date
    ) {

        Doctor doctor =
                doctorRepository.findById(doctorId)
                        .orElse(null);

        if (doctor == null) {

            return new SlotResponse();
        }

        // DOCTOR UNAVAILABLE
        if (
                doctor.getUnavailableDates() != null
                        &&
                        doctor.getUnavailableDates()
                                .contains(date)
        ) {

            return new SlotResponse();
        }

        List<String> allSlots =
                new ArrayList<>();

        LocalTime start =
                LocalTime.parse(
                        doctor.getStartTime()
                );

        LocalTime end =
                LocalTime.parse(
                        doctor.getEndTime()
                );

        while (start.isBefore(end)) {

            allSlots.add(start.toString());

            start = start.plusMinutes(
                    doctor.getSlotDuration()
            );
        }

        List<Appointment> bookedAppointments =
                appointmentRepository
                        .findByDoctorIdAndAppointmentDate(
                                doctorId,
                                date
                        );

        List<String> bookedSlots =
                new ArrayList<>();

        for (Appointment appointment
                : bookedAppointments) {

            bookedSlots.add(
                    appointment.getAppointmentTime()
            );
        }

        return new SlotResponse(
                allSlots,
                bookedSlots
        );
    }
    // ✅ APPOINTMENT HISTORY OF PATIENT
    @GetMapping("/history")
    public List<Appointment> getMyAppointments() {

        // GET LOGGED-IN PATIENT EMAIL
        String patientEmail =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        // RETURN ONLY LOGGED-IN USER APPOINTMENTS
        return appointmentRepository
                .findByPatientEmail(patientEmail);
    }

    // ✅ DELETE APPOINTMENT
    @DeleteMapping("/{id}")
    public String deleteAppointment(

            @PathVariable String id,

            Authentication authentication
    ) {

        // FIND APPOINTMENT
        Appointment appointment =
                appointmentRepository.findById(id).orElse(null);

        if (appointment == null) {
            return "Appointment not found ❌";
        }

        // LOGGED-IN USER EMAIL
        String loggedInEmail = authentication.getName();

        // SECURITY CHECK
        if (
                !appointment.getPatientEmail()
                        .equals(loggedInEmail)
        ) {

            return "You cannot cancel this appointment ❌";
        }

        // DELETE
        appointment.setStatus("CANCELLED");

        appointmentRepository.save(appointment);

        return "Appointment cancelled successfully ✅";
    }

    // ✅ UPDATE APPOINTMENT
    @PutMapping("/{id}")
    public String updateAppointment(
            @PathVariable String id,
            @RequestBody Appointment updatedAppointment
    ) {

        Appointment existingAppointment =
                appointmentRepository.findById(id).orElse(null);

        if (existingAppointment == null) {
            return "Appointment not found ❌";
        }

        // Update fields
        existingAppointment.setAppointmentDate(updatedAppointment.getAppointmentDate());
        existingAppointment.setAppointmentTime(updatedAppointment.getAppointmentTime());

        appointmentRepository.save(existingAppointment);

        return "Appointment updated successfully ✅";

    }

    @PutMapping("/complete/{id}")
    public String completeAppointment(

            @PathVariable String id,

            Authentication authentication
    ) {

        // FIND APPOINTMENT
        Appointment appointment =
                appointmentRepository.findById(id).orElse(null);

        if (appointment == null) {
            return "Appointment not found ❌";
        }

        // LOGGED-IN DOCTOR EMAIL
        String email = authentication.getName();

        // FIND DOCTOR
        Doctor doctor =
                doctorRepository.findByEmail(email).orElse(null);

        if (doctor == null) {
            return "Doctor not found ❌";
        }

        // SECURITY CHECK
        if (
                !appointment.getDoctorId()
                        .equals(doctor.getId())
        ) {

            return "You cannot complete this appointment ❌";
        }

        // UPDATE STATUS
        appointment.setStatus("COMPLETED");

        appointmentRepository.save(appointment);

        return "Appointment marked as completed ✅";
    }

    @GetMapping("/history/status")
    public List<Appointment> getAppointmentsByStatus(

            @RequestParam String status,

            Authentication authentication
    ) {

        // LOGGED-IN PATIENT
        String patientEmail = authentication.getName();

        return appointmentRepository
                .findByPatientEmailAndStatus(
                        patientEmail,
                        status
                );
    }

// ✅ DOCTOR APPOINTMENTS
@GetMapping("/doctor")
public List<Appointment> getDoctorAppointments(

        Authentication authentication
) {

    // LOGGED-IN DOCTOR EMAIL
    String email = authentication.getName();

    System.out.println("Logged in email: " + email);

    // FIND DOCTOR
    Doctor doctor =
            doctorRepository
                    .findByEmail(email)
                    .orElse(null);

    System.out.println("Doctor found: " + doctor);

    if (doctor == null) {

        return new ArrayList<>();
    }

    List<Appointment> appointments =
            appointmentRepository
                    .findByDoctorId(
                            doctor.getId()
                    );

    System.out.println("Appointments found: " + appointments.size());

    return appointments;
}

    // ✅ ADD UNAVAILABLE DATE
    @PutMapping("/unavailable-date")

    public String addUnavailableDate(

            @RequestParam String date,

            Authentication authentication
    ) {

        // LOGGED-IN DOCTOR EMAIL
        String email = authentication.getName();

        Doctor doctor =
                doctorRepository
                        .findByEmail(email)
                        .orElse(null);

        if (doctor == null) {

            return "Doctor not found ❌";
        }

        if (
                doctor.getUnavailableDates()
                        == null
        ) {

            doctor.setUnavailableDates(
                    new ArrayList<>()
            );
        }

        // AVOID DUPLICATES
        if (
                !doctor.getUnavailableDates()
                        .contains(date)
        ) {

            doctor.getUnavailableDates()
                    .add(date);

            doctorRepository.save(doctor);
        }

        return "Unavailable date added ✅";
    }


}