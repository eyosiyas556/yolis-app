"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "../context/ShopContext";
import {
  X,
  Lock,
  User,
  Mail,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
  RotateCcw,
  Phone,
} from "lucide-react";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// In register, user enters 9 digits starting strictly with 9 (e.g. 911234567 or 900000000)
function validateRegisterPhone(phone: string): boolean {
  const digits = phone.trim().replace(/\D/g, "");
  return /^9\d{8}$/.test(digits);
}

// In login, user can enter email OR phone number starting with 9:
function validateLoginPhone(phone: string): boolean {
  const clean = phone.trim();
  const digits = clean.replace(/\D/g, "");
  if (clean.startsWith("+251") || digits.startsWith("251")) {
    return /^2519\d{8}$/.test(digits);
  }
  if (digits.startsWith("09")) {
    return /^09\d{8}$/.test(digits);
  }
  return /^9\d{8}$/.test(digits);
}

export default function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    loginUser,
    registerUser,
    setAuthenticatedUser,
    setActiveNavTab,
  } = useShop();

  // Modes: "login" | "register" | "forgot_email" | "forgot_otp"
  const [internalMode, setInternalMode] = useState<
    "login" | "register" | "forgot_email" | "forgot_otp"
  >(authMode);

  // Sync with context mode whenever modal opens or mode changes
  useEffect(() => {
    if (isAuthModalOpen) {
      setInternalMode(authMode);
      setErrorMsg("");
      setSuccessMsg("");
      setLoading(false);
    }
  }, [isAuthModalOpen, authMode]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Forgot Password flow state
  const [resetEmail, setResetEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [verifiedBoxCount, setVerifiedBoxCount] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Expiry seconds counter (starts at 90s / 1.5 mins)
  const [timerSeconds, setTimerSeconds] = useState(90);

  // New Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Show/Hide password toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs for 6 OTP input boxes
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Expiry countdown timer (counts down to 00:00 without showing 'Expired' text)
  useEffect(() => {
    if (internalMode !== "forgot_otp" || isOtpVerified) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [internalMode, isOtpVerified]);

  // Reset states when modal closes or mode changes
  const resetFormState = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(false);
    setIsOtpVerified(false);
    setVerifiedBoxCount(0);
    setIsVerifying(false);
    setOtpDigits(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmNewPassword("");
    setTimerSeconds(90);
  };

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const identifier = loginIdentifier.trim();
    if (!identifier) {
      setErrorMsg("Please enter your Phone number or Email address.");
      return;
    }

    const isEmailInput = identifier.includes("@") || /[a-zA-Z]/.test(identifier);

    if (isEmailInput) {
      if (!validateEmail(identifier)) {
        setErrorMsg("Please enter a valid email address (e.g. name@gmail.com).");
        return;
      }
    } else {
      if (!validateLoginPhone(identifier)) {
        setErrorMsg("Please enter a valid Ethiopian phone number starting with 9 (e.g. 0911 234 567 or 911 234 567).");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data?.user) {
        const userObj = {
          id: data.user.id,
          fullName: data.user.fullName || "Customer",
          email: data.user.email || loginIdentifier,
          phone: data.user.phone || "",
          role: data.user.role || "CUSTOMER",
        };
        setAuthenticatedUser(userObj);

        // Save account locally for offline fallback
        try {
          const rawAccounts = localStorage.getItem("yolanda_accounts");
          const accounts = rawAccounts ? JSON.parse(rawAccounts) : [];
          const exists = accounts.find(
            (a: any) =>
              (userObj.email && a.email.toLowerCase() === userObj.email.toLowerCase()) ||
              (userObj.phone && a.phone === userObj.phone)
          );
          if (!exists) {
            accounts.push({
              fullName: userObj.fullName,
              phone: userObj.phone || "",
              email: userObj.email,
              passwordHash: loginPassword,
            });
            localStorage.setItem("yolanda_accounts", JSON.stringify(accounts));
          }
        } catch {}

        const isAdmin =
          userObj.role === "ADMIN" ||
          userObj.email.toLowerCase() === "admin@yolandabeauty.com";

        setIsAuthModalOpen(false);
        resetFormState();

        if (isAdmin) {
          window.location.href = "/admin";
          return;
        } else {
          setActiveNavTab("Shop");
          return;
        }
      }

      // If backend API error, attempt local fallback login
      const localRes = loginUser(loginIdentifier, loginPassword);
      if (localRes.success) {
        const isAdmin =
          localRes.user?.role === "ADMIN" ||
          localRes.user?.email.toLowerCase() === "admin@yolandabeauty.com";

        setIsAuthModalOpen(false);
        resetFormState();
        if (isAdmin) {
          window.location.href = "/admin";
          return;
        } else {
          setActiveNavTab("Shop");
          return;
        }
      } else {
        setErrorMsg(data?.error || localRes.error || "Invalid credentials. Please enter your valid Phone or Email and Password.");
      }
    } catch {
      // Offline fallback login
      const localRes = loginUser(loginIdentifier, loginPassword);
      setLoading(false);
      if (localRes.success) {
        const isAdmin =
          localRes.user?.role === "ADMIN" ||
          localRes.user?.email.toLowerCase() === "admin@yolandabeauty.com";

        setIsAuthModalOpen(false);
        resetFormState();
        if (isAdmin) {
          window.location.href = "/admin";
          return;
        } else {
          setActiveNavTab("Shop");
          return;
        }
      } else {
        setErrorMsg(localRes.error || "Invalid credentials. Please enter your valid Phone or Email and Password.");
      }
    }
  };

  const handleRegPhoneChange = (input: string) => {
    let digits = input.replace(/\D/g, "");
    if (digits.startsWith("251")) {
      digits = digits.slice(3);
    }
    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    if (digits.length > 9) {
      digits = digits.slice(0, 9);
    }
    setRegPhone(digits);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const digitsOnly = regPhone.trim();
    if (!validateRegisterPhone(digitsOnly)) {
      setErrorMsg("Please enter a valid 9-digit Ethiopian mobile number starting with 9 (e.g. 911 234 567).");
      return;
    }

    if (!validateEmail(regEmail)) {
      setErrorMsg("Please enter a real, valid email address (e.g. name@gmail.com).");
      return;
    }

    const fullPhone = `+251${digitsOnly}`;

    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please verify your confirmation password.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: regFullName,
          phone: fullPhone,
          email: regEmail,
          password: regPassword,
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data?.user) {
        const userObj = {
          fullName: data.user.fullName || regFullName,
          email: data.user.email || regEmail,
          phone: data.user.phone || fullPhone,
        };
        setAuthenticatedUser(userObj);

        try {
          const rawAccounts = localStorage.getItem("yolanda_accounts");
          const accounts = rawAccounts ? JSON.parse(rawAccounts) : [];
          accounts.push({
            fullName: userObj.fullName,
            phone: userObj.phone || "",
            email: userObj.email,
            passwordHash: regPassword,
          });
          localStorage.setItem("yolanda_accounts", JSON.stringify(accounts));
        } catch {}

        setIsAuthModalOpen(false);
        resetFormState();
        setActiveNavTab("Shop");
        return;
      }

      // Backend failed - try local fallback registration
      const localRes = registerUser(regFullName, fullPhone, regEmail, regPassword);
      if (localRes.success) {
        setIsAuthModalOpen(false);
        resetFormState();
        setActiveNavTab("Shop");
        return;
      } else {
        setErrorMsg(data?.error || localRes.error || "Registration failed.");
      }
    } catch {
      const localRes = registerUser(regFullName, regPhone, regEmail, regPassword);
      setLoading(false);
      if (localRes.success) {
        setIsAuthModalOpen(false);
        resetFormState();
        setActiveNavTab("Shop");
        return;
      } else {
        setErrorMsg(localRes.error || "Registration failed.");
      }
    }
  };

  // Forgot Password Step 1: Request 6-digit OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!validateEmail(resetEmail)) {
      setErrorMsg("Please enter a valid registered email address (e.g. name@gmail.com).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to find account with this email.");
      } else {
        setSuccessMsg("Verification code sent to your email.");
        setOtpDigits(["", "", "", "", "", ""]);
        setIsOtpVerified(false);
        setVerifiedBoxCount(0);
        setTimerSeconds(90); // 1.5 minutes (90s)
        setInternalMode("forgot_otp");
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
      }
    } catch {
      setLoading(false);
      setErrorMsg("Network error. Please try again.");
    }
  };

  // Automatic Verification with Sequential Green Animation Across the 6 Boxes
  const triggerAutoVerification = async (code: string) => {
    if (isVerifying || isOtpVerified) return;
    setIsVerifying(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setIsVerifying(false);
        setVerifiedBoxCount(0);
        setErrorMsg(data.error || "Incorrect verification code. Please check your code.");
      } else {
        // Sequential staggered wave animation across the 6 boxes: Box 1 -> Box 2 -> ... -> Box 6
        for (let i = 1; i <= 6; i++) {
          setTimeout(() => {
            setVerifiedBoxCount(i);
          }, i * 90);
        }

        // Immediately after 6th box completes animation, hide boxes and show password fields
        setTimeout(() => {
          setIsVerifying(false);
          setIsOtpVerified(true);
          setErrorMsg("");
          setSuccessMsg("Code verified. Please set your new password.");
        }, 6 * 90 + 260);
      }
    } catch {
      setIsVerifying(false);
      setVerifiedBoxCount(0);
      setErrorMsg("Network error while verifying code.");
    }
  };

  // OTP Box Handlers
  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanDigit = value.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleanDigit;
    setOtpDigits(updated);
    setErrorMsg("");

    // Advance focus
    if (cleanDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 boxes are filled
    const fullCode = updated.join("");
    if (fullCode.length === 6 && !updated.includes("")) {
      triggerAutoVerification(fullCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = paste[i] || "";
    }
    setOtpDigits(updated);

    if (paste.length === 6) {
      triggerAutoVerification(paste);
    } else {
      const focusTarget = Math.min(paste.length, 5);
      otpInputRefs.current[focusTarget]?.focus();
    }
  };

  // Save New Password & Confirm Password
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("").trim();

    if (newPassword !== confirmNewPassword) {
      setErrorMsg("Passwords do not match. Please ensure both passwords match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          otp: fullOtp,
          newPassword,
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to reset password.");
      } else {
        setSuccessMsg("Password reset successfully! Please sign in with your Phone or Email and New Password.");
        setLoginIdentifier(data.user?.email || data.user?.phone || resetEmail);
        setLoginPassword(newPassword);
        resetFormState();
        setInternalMode("login");
      }
    } catch {
      setLoading(false);
      setErrorMsg("Network error while resetting password.");
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-[#4F2D1C]/15 space-y-4 animate-in zoom-in-95 duration-200 relative my-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            resetFormState();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#4F2D1C]/5 hover:bg-[#4F2D1C]/10 flex items-center justify-center text-[#4F2D1C] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-full bg-[#4F2D1C]/10 text-[#4F2D1C] flex items-center justify-center mx-auto border border-[#4F2D1C]/15">
            {internalMode.startsWith("forgot") ? (
              <KeyRound className="w-5 h-5 text-[#4F2D1C]" />
            ) : (
              <Lock className="w-5 h-5 text-[#4F2D1C]" />
            )}
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#4F2D1C]">
            {internalMode === "login"
              ? "Sign In"
              : internalMode === "register"
              ? "Register"
              : internalMode === "forgot_email"
              ? "Reset Password"
              : isOtpVerified
              ? "Set New Password"
              : "Enter Verification Code"}
          </h2>
          <p className="text-xs text-[#4F2D1C]/70 max-w-xs mx-auto">
            {internalMode === "login"
              ? "Enter your phone number or email and password to sign in."
              : internalMode === "register"
              ? "Create your account with your name, phone, email, and password."
              : internalMode === "forgot_email"
              ? "Enter your registered email address to receive a 6-digit verification code."
              : isOtpVerified
              ? "Enter and confirm your new password below."
              : `Enter the 6-digit code sent to ${resetEmail || "your email"}.`}
          </p>
        </div>

        {/* Tab Toggle (Only for login and register) */}
        {!internalMode.startsWith("forgot") && (
          <div className="flex rounded-full bg-[#FAF6F0] p-1 border border-[#4F2D1C]/15">
            <button
              type="button"
              onClick={() => {
                setInternalMode("login");
                setAuthMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                internalMode === "login"
                  ? "bg-[#4F2D1C] text-white shadow-xs"
                  : "text-[#4F2D1C]/50 hover:text-[#4F2D1C]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setInternalMode("register");
                setAuthMode("register");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                internalMode === "register"
                  ? "bg-[#4F2D1C] text-white shadow-xs"
                  : "text-[#4F2D1C]/50 hover:text-[#4F2D1C]"
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Alert Messages */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 text-center animate-in fade-in duration-150">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-[#EAF2EB] border border-[#4E7055]/30 text-xs font-semibold text-[#4E7055] text-center animate-in fade-in duration-150">
            {successMsg}
          </div>
        )}

        {/* VIEW 1: SIGN IN (Phone or Email & Password) */}
        {internalMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                Phone Number or Email *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#4F2D1C]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="09... / +251... or email address"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF6F0] border border-[#4F2D1C]/15 rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:border-[#4F2D1C]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[#4F2D1C]">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setInternalMode("forgot_email");
                    resetFormState();
                  }}
                  className="text-[11px] font-semibold text-[#C86445] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#4F2D1C]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF6F0] border border-[#4F2D1C]/15 rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:border-[#4F2D1C]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F2D1C]/50 hover:text-[#4F2D1C] transition cursor-pointer p-0.5"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button: Sign In only */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_6px_14px_rgba(79,45,28,0.22),inset_0_1px_2px_rgba(255,255,255,0.2)] active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* VIEW 2: REGISTER (Full Name, Email, Password, Confirm Password) */}
        {internalMode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#4F2D1C]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Yolanda Mesfin"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 bg-[#FAF6F0] border border-[#4F2D1C]/15 rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:border-[#4F2D1C]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                Phone Number *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-[#4F2D1C]/15 shadow-2xs pointer-events-none select-none z-10">
                  <span className="text-xs">🇪🇹</span>
                  <span className="text-xs font-bold text-[#4F2D1C] tracking-tight">+251</span>
                </div>
                <input
                  type="tel"
                  required
                  placeholder="9XXXXXXXX (e.g. 911 234 567)"
                  value={regPhone}
                  onChange={(e) => handleRegPhoneChange(e.target.value)}
                  maxLength={9}
                  className="w-full pl-22 pr-3.5 py-2.5 bg-[#FAF6F0] border border-[#4F2D1C]/15 rounded-xl text-xs font-semibold text-[#4F2D1C] placeholder-[#4F2D1C]/40 focus:outline-none focus:border-[#4F2D1C]"
                />
              </div>
              <p className="text-[10px] text-[#4F2D1C]/60 mt-1 pl-1">
                Enter your 9-digit mobile number starting with 9 (e.g. 911 234 567)
              </p>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#4F2D1C]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="yolanda@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 bg-[#FAF6F0] border border-[#4F2D1C]/15 rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:border-[#4F2D1C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#4F2D1C]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showRegPassword ? "text" : "password"}
                    required
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-9 py-2 bg-[#FAF6F0] border border-[#4F2D1C]/15 rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:border-[#4F2D1C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4F2D1C]/50 hover:text-[#4F2D1C] transition cursor-pointer p-0.5"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#4F2D1C]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showRegConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-9 py-2 bg-[#FAF6F0] border border-[#4F2D1C]/15 rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:border-[#4F2D1C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    aria-label={showRegConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4F2D1C]/50 hover:text-[#4F2D1C] transition cursor-pointer p-0.5"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit button: Create Account only */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_6px_14px_rgba(79,45,28,0.22),inset_0_1px_2px_rgba(255,255,255,0.2)] active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-3"
            >
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* VIEW 3: FORGOT PASSWORD - STEP 1 (Enter Email) */}
        {internalMode === "forgot_email" && (
          <form onSubmit={handleRequestOtp} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                Registered Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#4F2D1C]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="yolanda@gmail.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF6F0] border border-[#4F2D1C]/15 rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:border-[#4F2D1C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_6px_14px_rgba(79,45,28,0.22),inset_0_1px_2px_rgba(255,255,255,0.2)] active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? "Sending..." : "Send Verification Code"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setInternalMode("login");
                resetFormState();
              }}
              className="w-full py-2 text-xs font-semibold text-[#4F2D1C]/50 hover:text-[#4F2D1C] flex items-center justify-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </form>
        )}

        {/* VIEW 4: FORGOT PASSWORD - STEP 2 (OTP Entry OR Password Fields) */}
        {internalMode === "forgot_otp" && (
          <div className="space-y-4">
            {/* When NOT yet verified: show 6 compact OTP boxes + live expiry seconds counter */}
            {!isOtpVerified ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-[#4F2D1C]">
                      Enter 6-Digit Code *
                    </label>

                    <div className="flex items-center gap-3">
                      {/* Expiry Second Counter: Pure digital format, no 'Expired' text */}
                      <span className="font-mono text-xs font-semibold text-[#4F2D1C]/70 bg-[#4F2D1C]/10 px-2 py-0.5 rounded-md border border-[#4F2D1C]/15">
                        {formatTimer(timerSeconds)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRequestOtp()}
                        className="text-[11px] text-[#C86445] hover:underline font-semibold cursor-pointer"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>

                  {/* Compact, optimized 6 OTP boxes with staggered sequential green wave animation */}
                  <div className="flex items-center justify-center gap-2" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => {
                      const isBoxGreen = verifiedBoxCount > idx;

                      return (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          disabled={isVerifying}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className={`w-9 h-10 sm:w-10 sm:h-11 text-center text-base font-semibold font-mono rounded-lg transition-all duration-200 outline-none ${
                            isBoxGreen
                              ? "border-2 border-emerald-600/80 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-500/20 scale-[1.03]"
                              : "bg-[#FAF6F0] border border-[#4F2D1C]/15 text-[#4F2D1C] focus:border-[#4F2D1C] focus:bg-white focus:ring-1 focus:ring-[#4F2D1C]"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {isVerifying && (
                  <div className="text-center text-xs text-[#4F2D1C]/70 font-medium animate-pulse">
                    Verifying code...
                  </div>
                )}
              </div>
            ) : (
              /* When verified: OTP boxes completely disappear, ONLY password fields appear */
              <form onSubmit={handleSaveNewPassword} className="space-y-3.5 animate-in fade-in duration-200">
                <div>
                  <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#4F2D1C]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#FAF6F0] border border-[#4F2D1C]/15 rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:border-[#4F2D1C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F2D1C]/50 hover:text-[#4F2D1C] transition cursor-pointer p-0.5"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Field */}
                <div>
                  <label className="text-[11px] font-bold text-[#4F2D1C] block mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#4F2D1C]/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter your new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#FAF6F0] border border-[#4F2D1C]/15 rounded-xl text-xs text-[#4F2D1C] focus:outline-none focus:border-[#4F2D1C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F2D1C]/50 hover:text-[#4F2D1C] transition cursor-pointer p-0.5"
                    >
                      {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#4F2D1C] hover:bg-[#2D1C14] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_6px_14px_rgba(79,45,28,0.22),inset_0_1px_2px_rgba(255,255,255,0.2)] active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-2"
                >
                  <span>{loading ? "Updating..." : "Save New Password & Sign In"}</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setInternalMode("login");
                resetFormState();
              }}
              className="w-full py-2 text-xs font-semibold text-[#4F2D1C]/50 hover:text-[#4F2D1C] flex items-center justify-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
