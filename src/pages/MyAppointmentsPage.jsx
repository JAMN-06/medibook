import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppointments } from "../context/AppointmentsContext";
import AppointmentCard from "../components/AppointmentCard";
import ConfirmDialog from "../components/ConfirmDialog";

function MyAppointmentsPage() {
    const { appointments, cancelAppointment, updateAppointment } = useAppointments();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    
    const sortedAppointments = [...appointments].sort(
        (a, b) => new Date(a.slot) - new Date(b.slot)
    );

    function handleCancel(appointmentId) {
        setAppointmentToCancel(appointmentId);
        setShowConfirmDialog(true);
    }

    function confirmCancel() {
        if (appointmentToCancel) {
            cancelAppointment(appointmentToCancel);
            setAppointmentToCancel(null);
            setShowConfirmDialog(false);
        }
    }

    function handleEdit(appointmentId) {
        
        const appointment = appointments.find(a => a.id === appointmentId);
        if (appointment) {
            
            navigate(`/doctors/${appointment.doctorId}/book`, {
                state: { editAppointment: appointment }
            });
        }
    }

    return (
        <div className="page-container">
            <h1>My Appointments</h1>
            {sortedAppointments.length === 0 ? (
                <div className="empty-state">
                    <p>You have no upcoming appointments.</p>
                    <Link to="/" className="book-btn">
                        Find a Doctor
                    </Link>
                </div>
            ) : (
                sortedAppointments.map((appt) => (
                    <AppointmentCard
                        key={appt.id}
                        appointment={appt}
                        onCancel={handleCancel}
                        onEdit={handleEdit}
                    />
                ))
            )}

            <ConfirmDialog
                isOpen={showConfirmDialog}
                message="Are you sure you want to cancel this appointment?"
                onConfirm={confirmCancel}
                onCancel={() => {
                    setShowConfirmDialog(false);
                    setAppointmentToCancel(null);
                }}
            />
        </div>
    );
}

export default MyAppointmentsPage;