import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Stethoscope,
    MapPin,
    Star,
    Calendar,
    Clock,
    X,
    CheckCircle,
    FileText,
    Phone,
    User as UserIcon
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const { user } = useAuth();

    // Expanded Form State
    const [patientName, setPatientName] = useState(user?.name || '');
    const [patientAge, setPatientAge] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [reason, setReason] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (e) => {
        e.preventDefault();
        if (!date || !time || !patientName || !contactNumber) return;

        setBookingLoading(true);
        try {
            const response = await api.post('/book-appointment', {
                doctorId: selectedDoctor.id,
                patientName,
                patientAge,
                contactNumber,
                reason,
                date,
                time
            });
            setBookingSuccess(response.data.message);

            // Auto close modal after 2.5 seconds giving time to read
            setTimeout(() => {
                closeModal();
            }, 2500);
        } catch (error) {
            console.error('Booking failed', error);
        } finally {
            setBookingLoading(false);
        }
    };

    const openModal = (doc) => {
        setSelectedDoctor(doc);
        setPatientName(user?.name || '');
        setPatientAge('');
        setContactNumber('');
        setReason('');
        setDate('');
        setTime('');
        setBookingSuccess('');
    };

    const closeModal = () => {
        setSelectedDoctor(null);
        setBookingSuccess('');
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Specialist Consultation</h1>
                <p className="text-slate-400">Connect with top dermatologists based on your AI analysis results.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doc, idx) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="glass-card p-6 flex flex-col group hover:border-cyan-500/50 transition-colors duration-300 relative overflow-hidden"
                        >
                            {/* Decorative gradient blur */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="flex items-start gap-4 mb-6 relative z-10">
                                <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
                                    <Stethoscope className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{doc.name}</h3>
                                    <div className="flex flex-col gap-1 text-sm text-slate-400">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {doc.city}</span>
                                        <span className="flex items-center gap-1.5 font-medium text-amber-400">
                                            <Star className="w-3.5 h-3.5 fill-current" /> {doc.rating} Rating
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto relative z-10">
                                <button
                                    onClick={() => openModal(doc)}
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors border border-slate-700 hover:border-slate-500"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedDoctor && (
                    <motion.div
                        key="booking-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="glass-card w-full max-w-lg p-8 relative my-8"
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 rounded-full p-1 border border-slate-700 transition-colors z-20"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {bookingSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                                >
                                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white">Booking Confirmed</h2>
                                    <p className="text-green-400 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">{bookingSuccess}</p>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="border-b border-slate-700 pb-4 mb-6">
                                        <h2 className="text-2xl font-bold text-white mb-2">Schedule Patient Visit</h2>
                                        <p className="text-slate-400 flex items-center gap-2">
                                            <Stethoscope className="w-4 h-4 text-cyan-400" /> Consult with <strong>{selectedDoctor.name}</strong> • {selectedDoctor.city}
                                        </p>
                                    </div>

                                    <form onSubmit={handleBook} className="space-y-5">

                                        {/* Patient Details Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="col-span-1 sm:col-span-2">
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Patient Full Name <span className="text-red-400">*</span></label>
                                                <div className="relative">
                                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        value={patientName}
                                                        onChange={(e) => setPatientName(e.target.value)}
                                                        required
                                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-all"
                                                        placeholder="Patient's legal name"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Age</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={patientAge}
                                                        onChange={(e) => setPatientAge(e.target.value)}
                                                        min="1" max="120"
                                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-cyan-500 transition-all"
                                                        placeholder="E.g., 28"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Contact Number <span className="text-red-400">*</span></label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="tel"
                                                        value={contactNumber}
                                                        onChange={(e) => setContactNumber(e.target.value)}
                                                        required
                                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-all"
                                                        placeholder="+91 XXXXX XXXXX"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Reason for Consultation</label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
                                                <textarea
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-all min-h-[80px] resize-none"
                                                    placeholder="Briefly describe the symptoms or AI analysis results..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* Scheduling Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-700/50 mt-2">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Date <span className="text-red-400">*</span></label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="date"
                                                        value={date}
                                                        onChange={(e) => setDate(e.target.value)}
                                                        required
                                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-all custom-calendar-icon"
                                                        min={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Time <span className="text-red-400">*</span></label>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="time"
                                                        value={time}
                                                        onChange={(e) => setTime(e.target.value)}
                                                        required
                                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-all custom-time-icon"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <button
                                                type="submit"
                                                disabled={bookingLoading}
                                                className="w-full bg-gradient-primary text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center justify-center transition-all hover:-translate-y-1"
                                            >
                                                {bookingLoading ? (
                                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    'Confirm Appointment'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Doctors;
