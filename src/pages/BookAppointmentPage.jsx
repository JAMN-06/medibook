import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import doctors from "../data/doctors";
import { useAppointments } from "../context/AppointmentsContext";

function formatSlot(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function BookAppointmentPage() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { bookAppointment, updateAppointment, appointments } = useAppointments();

    const doctor = doctors.find((doc) => doc.id === doctorId);

    const [selectedSlot, setSelectedSlot] = useState("");
    const [patientName, setPatientName] = useState("");
    const [reason, setReason] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editAppointment, setEditAppointment] = useState(null);

    // Check for edit mode
    useEffect(() => {
        if (location.state?.editAppointment) {
            const appt = location.state.editAppointment;
            setEditAppointment(appt);
            setSelectedSlot(appt.slot);
            setPatientName(appt.patientName);
            setReason(appt.reason);
        }
    }, [location.state]);

    // Get booked slots for this doctor
    const bookedSlots = appointments
        .filter(appt => appt.doctorId === doctorId)
        .map(appt => appt.slot);

    // If editing, remove the current appointment's slot from booked slots
    const blockedSlots = editAppointment 
        ? bookedSlots.filter(slot => slot !== editAppointment.slot)
        : bookedSlots;

    // Filter available slots (remove already booked ones)
    const availableSlots = doctor?.availableSlots.filter(
        slot => !blockedSlots.includes(slot)
    ) || [];

    if (!doctor) {
        return (
            <div className="page-container">
                <p>Doctor not found.</p>
                <Link to="/">Back to all doctors</Link>
            </div>
        );
    }

    function validateForm() {
        const newErrors = {};
        
        if (!selectedSlot) {
            newErrors.slot = "Please select a time slot.";
        }
        
        if (!patientName.trim()) {
            newErrors.patientName = "Please enter your name.";
        } else if (patientName.trim().length < 2) {
            newErrors.patientName = "Name must be at least 2 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        if (editAppointment) {
            // Update existing appointment
            const updatedAppointment = {
                ...editAppointment,
                slot: selectedSlot,
                patientName: patientName.trim(),
                reason: reason.trim() || "General consultation",
            };
            updateAppointment(editAppointment.id, updatedAppointment);
            navigate("/appointments");
        } else {
            // Book new appointment
            const newAppointment = {
                id: `appt-${Date.now()}`,
                doctorId: doctor.id,
                doctorName: doctor.name,
                specialty: doctor.specialty,
                slot: selectedSlot,
                patientName: patientName.trim(),
                reason: reason.trim() || "General consultation",
            };

            bookAppointment(newAppointment);
            navigate("/appointments");
        }
        
        setIsSubmitting(false);
    }

    return (
        <div className="page-container">
            <Link to={`/doctors/${doctor.id}`} className="back-link">
                ← Back to {doctor.name}'s profile
            </Link>

            <h1>{editAppointment ? "Edit Appointment" : "Book an Appointment"}</h1>
            <p className="specialty">
                with {doctor.name} ({doctor.specialty})
            </p>

            <form onSubmit={handleSubmit} className="booking-form">
                <label htmlFor="slot">Choose a time slot</label>
                <select
                    id="slot"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className={errors.slot ? "error" : ""}
                >
                    <option value="">Select a time slot</option>
                    {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                            {formatSlot(slot)}
                        </option>
                    ))}
                </select>
                {errors.slot && <span className="error-text">{errors.slot}</span>}

                <label htmlFor="name">Your full name</label>
                <input
                    id="name"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Mwangi"
                    className={errors.patientName ? "error" : ""}
                />
                {errors.patientName && <span className="error-text">{errors.patientName}</span>}

                <label htmlFor="reason">Reason for visit (optional)</label>
                <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Annual checkup, persistent cough..."
                    rows={3}
                />

                <button type="submit" className="book-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : editAppointment ? "Update Appointment" : "Confirm Appointment"}
                </button>
            </form>
        </div>
    );
}

export default BookAppointmentPage;