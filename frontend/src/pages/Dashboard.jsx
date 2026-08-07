import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadCloud,
    Image as ImageIcon,
    X,
    Mic,
    AlertCircle,
    Stethoscope,
    SquareSquare,
    Activity,
    Camera,
    Languages
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [problemText, setProblemText] = useState('');

    // Voice & Camera states
    const [isRecording, setIsRecording] = useState(false);
    const [activeLang, setActiveLang] = useState('en-US'); // 'en-US' or 'hi-IN'
    const [showCamera, setShowCamera] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fileInputRef = useRef(null);
    const datasetInputRef = useRef(null);
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setProblemText((prev) => prev + (prev ? ' ' : '') + finalTranscript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    // Update language dynamically
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = activeLang;
        }
    }, [activeLang]);

    // Restart recording if language is toggled while active
    const startRecordingWithLang = (lang) => {
        setActiveLang(lang);
        if (!recognitionRef.current) {
            setError('Speech recognition is not supported in this browser.');
            return;
        }
        setError('');

        // If currently recording and swapping languages, stop first
        if (isRecording) {
            recognitionRef.current.stop();
            // Wait a tiny bit for the stop handler to fire before restarting
            setTimeout(() => {
                recognitionRef.current.lang = lang;
                recognitionRef.current.start();
                setIsRecording(true);
            }, 300);
        } else {
            recognitionRef.current.lang = lang;
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    // --- CAMERA LOGIC ---
    const startCamera = async () => {
        try {
            setShowCamera(true);
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError("Unable to access the camera. Please check your browser permissions.");
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            // Set canvas size to match video
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

            canvasRef.current.toBlob((blob) => {
                const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                setImage(file);
                setPreviewUrl(URL.createObjectURL(file));
                stopCamera();
            }, 'image/jpeg');
        }
    };
    // --------------------

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        } else if (file) {
            setError('Please upload a valid image file.');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const removeImage = () => {
        setImage(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDatasetUpload = async (e) => {
        const files = e.target.files;
        if (files.length === 0) return;

        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            const response = await api.post('/upload-dataset', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(response.data.message);
        } catch (err) {
            alert('Failed to upload dataset.');
        } finally {
            if (datasetInputRef.current) datasetInputRef.current.value = '';
        }
    };

    const handleAnalyze = async () => {
        if (!image) {
            setError('Please upload a skin image to proceed.');
            return;
        }
        if (!problemText.trim()) {
            setError('Please describe your problem using text or voice to proceed.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('description', problemText);

            const response = await api.post('/analyze-skin', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            navigate('/results', { state: { result: response.data, imageUrl: previewUrl } });
        } catch (err) {
            setError('Analysis failed. Please try again.');
            setLoading(false);
        }
    };

    const isFormValid = image !== null && problemText.trim().length > 0;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
            if (recognitionRef.current && isRecording) recognitionRef.current.stop();
        };
    }, []);

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 relative z-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Smart Skin Analysis</h1>
                <p className="text-slate-400">Upload your skin image and describe your symptoms for an intelligent medical assessment.</p>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 overflow-hidden"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium text-sm">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Core Requirement 1: Image Upload & Camera */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="glass-card p-6 flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-tight">1. Skin Image <span className="text-red-400">*</span></h3>
                            <p className="text-xs text-slate-400">Upload a photo or capture live</p>
                        </div>
                    </div>

                    <div
                        className={`flex-1 min-h-[290px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all duration-300 relative overflow-hidden ${previewUrl || showCamera ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                            }`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {showCamera ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <canvas ref={canvasRef} className="hidden" />
                                <div className="absolute bottom-4 flex gap-4">
                                    <button onClick={stopCamera} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg">
                                        <X className="w-6 h-6" />
                                    </button>
                                    <button onClick={capturePhoto} className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                        Capture Picture
                                    </button>
                                </div>
                            </div>
                        ) : previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-2 rounded-full text-slate-300 hover:text-white hover:bg-red-500/80 transition-all z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="z-10 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 font-medium text-sm shadow-xl flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-400"></span> Image Captured
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 shadow-inner">
                                    <UploadCloud className="w-8 h-8 text-cyan-400" />
                                </div>
                                <p className="font-medium text-slate-300 mb-2">Drag & drop your image here</p>
                                <p className="text-sm text-slate-500 mb-6 text-center max-w-[200px]">Supports JPG, PNG formats up to 5MB</p>

                                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <UploadCloud className="w-4 h-4" /> Browse Files
                                    </button>
                                    <button
                                        onClick={startCamera}
                                        className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Camera className="w-4 h-4" /> Open Camera
                                    </button>
                                </div>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </motion.div>

                {/* Core Requirement 2: Problem Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="glass-card p-6 flex flex-col"
                    id="problem"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">2. Symptoms <span className="text-red-400">*</span></h3>
                                <p className="text-xs text-slate-400">Describe via text or voice</p>
                            </div>
                        </div>

                        {/* Lang Indicator */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                            <Languages className="w-3 h-3 text-cyan-400" />
                            <span className={activeLang === 'en-US' ? 'text-white' : 'text-slate-500'}>EN</span> / <span className={activeLang === 'hi-IN' ? 'text-white' : 'text-slate-500'}>HI</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col relative group">
                        <textarea
                            value={problemText}
                            onChange={(e) => setProblemText(e.target.value)}
                            placeholder="E.g., I have red pimples... / Mujhe pimples aur redness ho rahi hai..."
                            className="flex-1 w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 pb-20 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none min-h-[220px]"
                        ></textarea>

                        {/* Dual Voice Control Buttons */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-900/80 p-2 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-lg">
                            <span className="text-xs font-medium text-slate-400 ml-2">Speak your symptoms:</span>
                            <div className="flex gap-2">
                                {isRecording ? (
                                    <button
                                        onClick={stopRecording}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all animate-pulse"
                                    >
                                        <Mic className="w-4 h-4" /> Stop Recording ({activeLang === 'en-US' ? 'EN' : 'HI'})
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startRecordingWithLang('en-US')}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-all text-sm"
                                        >
                                            <Mic className="w-3.5 h-3.5 text-blue-400" /> English
                                        </button>
                                        <button
                                            onClick={() => startRecordingWithLang('hi-IN')}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-all text-sm"
                                        >
                                            <Mic className="w-3.5 h-3.5 text-cyan-400" /> Hindi
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Action Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex justify-center mt-8 pt-4 relative z-10"
            >
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !isFormValid}
                    className={`relative overflow-hidden w-full max-w-md py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg shadow-xl outline-none focus:outline-none transition-all duration-500 ${loading
                            ? 'bg-slate-700 text-slate-400 cursor-wait'
                            : isFormValid
                                ? 'bg-gradient-primary text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] border border-white/10'
                                : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        }`}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing Condition...</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_1.5s_infinite]"></div>
                        </>
                    ) : (
                        <>
                            <Activity className="w-6 h-6" />
                            <span>Analyze Skin Condition</span>
                        </>
                    )}
                </button>
            </motion.div>

            {/* Optional Feature: Dataset Upload */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-12 pt-8 border-t border-slate-800 relative z-10"
                id="upload-dataset"
            >
                <div className="glass-card bg-slate-800/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <SquareSquare className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold flex items-center gap-2">
                                Personalized AI Training
                                <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded uppercase tracking-wider">Optional</span>
                            </h4>
                            <p className="text-sm text-slate-400 mt-1">Upload your past skin datasets (ZIP or multiple images) to enhance future customized analysis.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => datasetInputRef.current?.click()}
                        className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors shadow-lg whitespace-nowrap"
                    >
                        Upload Dataset
                    </button>
                    <input
                        type="file"
                        ref={datasetInputRef}
                        onChange={handleDatasetUpload}
                        multiple
                        accept="image/*,.zip"
                        className="hidden"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
