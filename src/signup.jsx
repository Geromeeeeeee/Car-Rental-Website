import { useState, useEffect } from "react";
import axios from "axios";

const PasswordInput = ({ id, value, onChange, placeholder, show, setShow }) => (
    <div className="relative">
        <input
            type={show ? "text" : "password"}
            id={id}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-12 transition"
            placeholder={placeholder}
            autoComplete={id === "password" ? "new-password" : "off"}
        />

        <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={show ? "Hide password" : "Show password"}
        >
            {show ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            )}
        </button>
    </div>
);

export function Signup({ setNavDisplay }) {
    useEffect(() => {
        setNavDisplay(false);
        return () => setNavDisplay(true);
    }, [setNavDisplay]);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [licenseImage, setLicenseImage] = useState(null); 
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordValidation = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>_]/.test(password)
    };

    const isStrongPassword =
        passwordValidation.length &&
        passwordValidation.uppercase &&
        passwordValidation.lowercase &&
        passwordValidation.number &&
        passwordValidation.special;

    const clearField = () => {
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPhone("");
        setLicenseNumber("");
        setLicenseImage(null);
        const fileInput = document.getElementById("licenseImage");
        if (fileInput) fileInput.value = "";
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!fullName || !email || !password || !confirmPassword || !phone || !licenseNumber || !licenseImage) {
            setError("Please fill in all fields and upload your license picture.");
            return;
        }

        if (!isStrongPassword) {
            setError("Password is too weak. Use uppercase, lowercase, number, and special character.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Pack using FormData 
            const formData = new FormData();
            formData.append("action", "signup");
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("phone", phone);
            formData.append("licenseNumber", licenseNumber);
            formData.append("licenseImage", licenseImage); 

            const response = await axios.post(
                "http://localhost/Car-Rental-Website/back/login_signup.php",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            const stat = response.data.signup;

            const errorMessages = {
                "1": "Full name must include both first and last name.",
                "2": "Full name must contain only letters.",
                "3": "Full name is too short.",
                "4": "Invalid email format. Please use a valid email address.",
                "5": "Password must be 8–20 characters.",
                "6": "License format should be like ABC 123 or ABC 1234.",
                "7": "Email already exists. Try logging in or use a different email.",
                "8": "Account creation failed. Please try again later.",
                "9": "Invalid file type. Only JPG, JPEG, and PNG are allowed.",
                "10": "File is too large. Maximum size is 5MB.",
                "11": "Failed to save uploaded image. Check server permissions."
            };

            if (stat === "success") {
                setSuccess("Account created successfully! You can now log in.");
                clearField();
            }
            else if (errorMessages[stat]) {
                setError(errorMessages[stat]);
            } else {
                setError("Unexpected response. Please try again.");
            }

        } catch (error) {
            setError("Connection error. Make sure Apache and MySQL are running.");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 flex items-center justify-center p-5">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">

                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-black-900">MLT Car Rental</h1>
                    <p className="text-gray-600 mt-2">Create your account to get started</p>
                </div>

                {/* Display Alert Messages */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded mb-4 shadow-sm">
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded mb-4 shadow-sm">
                        <p className="font-medium">Success</p>
                        <p className="text-sm">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSignup} noValidate>
                    {/* Full Name */}
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            placeholder="e.g., John Doe"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">First and last name, letters only</p>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            placeholder="e.g., name@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            placeholder="e.g., 1234 567 8901"
                            required
                            autoComplete="tel"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: 1234 567 8901</p>
                    </div>

                    {/* License Number */}
                    <div className="mb-4">
                        <label htmlFor="licenseNumber" className="block text-gray-700 font-medium mb-1">
                            Driver's License Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="licenseNumber"
                            value={licenseNumber}
                            onChange={(e) => { const val = e.target.value; const hasDash = val.includes("-"); if (hasDash && val.length <= 13) { setLicenseNumber(val); } else if (!hasDash && val.length <= 11) { setLicenseNumber(val); } }}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            placeholder="e.g., N01-26-123456" maxLength={13} required autoComplete="off"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: AAA-YY-NNNNNN (Agency Code - Year - Serial Number)</p>
                        {licenseNumber && !/^[A-Z0-9]{3}-?\d{2}-?\d{6}$/.test(licenseNumber.trim().toUpperCase()) && (
                            <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                                ⚠️ Invalid format (e.g., N01-26-123456)
                            </p>
                        )}
                    </div>

                    {/* condition kineme, lalabas lang yung upload license pic kapag nag-match yung tinype sa format hehe */}
                    <div className="mb-4"> 
                        <label htmlFor="licenseImage" className={`block font-medium mb-1 flex items-center gap-1 ${/^[A-Z0-9]{3}-?\d{2}-?\d{6}$/.test(licenseNumber.trim().toUpperCase()) ? "text-green-700" : "text-gray-400"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Upload License Picture <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            id="licenseImage"
                            accept="image/*"
                            onChange={(e) => setLicenseImage(e.target.files[0])}
                            disabled={!/^[A-Z0-9]{3}-?\d{2}-?\d{6}$/.test(licenseNumber.trim().toUpperCase())}
                            className={`w-full p-2 border-2 border-dashed rounded-lg bg-green-50/50 focus:outline-none transition text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold 
                            ${/^[A-Z0-9]{3}-?\d{2}-?\d{6}$/.test(licenseNumber.trim().toUpperCase()) 
                                ? "border-green-300 bg-green-50/30 file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer" 
                                : "border-gray-200 bg-gray-50 text-gray-400 file:bg-gray-100 file:text-gray-400 cursor-not-allowed"
                            }`}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Max file size: 5MB (PNG, JPG, JPEG)</p>
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <PasswordInput
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            show={showPassword}
                            setShow={setShowPassword}
                        />
                        <div className="mt-2 text-xs space-y-1">
                            <p className={passwordValidation.length ? "text-green-600" : "text-red-500"}>✓ At least 8 characters</p>
                            <p className={passwordValidation.uppercase ? "text-green-600" : "text-red-500"}>✓ Uppercase letter</p>
                            <p className={passwordValidation.lowercase ? "text-green-600" : "text-red-500"}>✓ Lowercase letter</p>
                            <p className={passwordValidation.number ? "text-green-600" : "text-red-500"}>✓ Number</p>
                            <p className={passwordValidation.special ? "text-green-600" : "text-red-500"}>✓ Special character</p>
                            {password && (
                                <p className={`font-semibold mt-2 ${isStrongPassword ? "text-green-600" : "text-orange-500"}`}>
                                    {isStrongPassword ? "Strong Password" : "Weak Password"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <PasswordInput
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            show={showConfirmPassword}
                            setShow={setShowConfirmPassword}
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                    </div>

                    {/* Submit Action Block */}
                    <button
                        type="submit"
                        disabled={!isStrongPassword}
                        className={`w-full text-white py-3 rounded-lg font-bold focus:outline-none focus:ring-4 transition duration-200 transform active:scale-[0.98]
                        ${isStrongPassword
                            ? "bg-blue-900 hover:bg-blue-800 focus:ring-blue-300 hover:scale-[1.02]"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center border-t pt-6">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-700 font-semibold hover:text-blue-900 hover:underline transition duration-200">
                            Sign in here
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}