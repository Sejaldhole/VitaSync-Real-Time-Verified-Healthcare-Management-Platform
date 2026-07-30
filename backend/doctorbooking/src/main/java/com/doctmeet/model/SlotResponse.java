package com.doctmeet.model;

import java.util.List;

public class SlotResponse {

    private List<String> allSlots;

    private List<String> bookedSlots;

    public SlotResponse() {
    }

    public SlotResponse(

            List<String> allSlots,

            List<String> bookedSlots
    ) {

        this.allSlots = allSlots;

        this.bookedSlots = bookedSlots;
    }

    public List<String> getAllSlots() {
        return allSlots;
    }

    public void setAllSlots(
            List<String> allSlots
    ) {

        this.allSlots = allSlots;
    }

    public List<String> getBookedSlots() {
        return bookedSlots;
    }

    public void setBookedSlots(
            List<String> bookedSlots
    ) {

        this.bookedSlots = bookedSlots;
    }
}