import React, { useState } from "react";
import { supabase } from "../../../core/lib/supabase";
import { useNavigate } from "react-router-dom";
import {
  PasswordStrengthMeter,
  checkPasswordStrength,
} from "../../security/components/PasswordStrength";
import {
  SimpleCaptcha,
  useRateLimit,
  RateLimitWarning,
} from "../../security/components/RateLimiting";
import { logAuditEvent } from "../../session/components/SessionManagement";
import { Footer } from "@/shared/index";

interface AuthGateProps {
  classId: string;
}

export const AuthGate: React.FC<AuthGateProps> = ({ classId }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();

  // Rate limiting
  const { isBlocked, resetIn, checkLimit } = useRateLimit(`auth:${email}`);

  const ensureProfile = async (
    userId: string,
    userEmail: string,
    userName?: string,
  ) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking profile:", fetchError);
        return;
      }

      if (!existingProfile) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: userId,
          class_id: classId,
          display_name: userName || userEmail.split("@")[0],
        });

        if (insertError && insertError.code !== "23505") {
          console.error("Error creating profile:", insertError);
        }
      }
    } catch (err) {
      console.error("Profile error:", err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Check rate limit
    if (!checkLimit()) {
      return;
    }

    // For signup, check password strength
    if (!isLogin) {
      const strength = checkPasswordStrength(password);
      if (!strength.isStrong) {
        setError("Password is too weak. Please use a stronger password.");
        return;
      }
    }

    // Show CAPTCHA after 3 failed attempts
    if (!captchaVerified && !showCaptcha) {
      setShowCaptcha(true);
      return;
    }

    if (showCaptcha && !captchaVerified) {
      setError("Please complete the CAPTCHA verification");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          await ensureProfile(
            data.user.id,
            data.user.email || email,
            data.user.user_metadata?.display_name,
          );

          // Log successful login
          await logAuditEvent("user_login", "auth", data.user.id);

          navigate("/app");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              class_id: classId,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          if (data.user.confirmed_at) {
            await ensureProfile(data.user.id, email, displayName);
            await logAuditEvent("user_signup", "auth", data.user.id);
            setMessage("Account created! Redirecting...");
            setTimeout(() => navigate("/app"), 1000);
          } else {
            setMessage("Check your email for the confirmation link!");
          }
        }
        return;
      }
    } catch (err: any) {
      console.error("Auth error:", err);

      let errorMessage = err.message || "An error occurred";

      if (err.message?.includes("Invalid login credentials")) {
        errorMessage =
          "Invalid email or password. If you just signed up, please confirm your email first.";
        // Show CAPTCHA after failed login
        if (!showCaptcha) {
          setShowCaptcha(true);
        }
      } else if (err.message?.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email address before logging in.";
      } else if (err.message?.includes("User already registered")) {
        errorMessage =
          "This email is already registered. Please sign in instead.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            display_name: displayName || email.split("@")[0],
            class_id: classId,
          },
        },
      });

      if (error) throw error;
      setMessage("Check your email for the magic link!");
    } catch (err: any) {
      console.error("Magic link error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Join Your Class"}
            </h1>
            <p className="text-gray-400">
              {isLogin
                ? "Sign in to access your homework"
                : "Create a secure account to get started"}
            </p>
          </div>

          {/* Rate Limit Warning */}
          {isBlocked && <RateLimitWarning resetIn={resetIn} />}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="Your name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="••••••••"
                required
                minLength={8}
              />

              {/* Password Strength Meter for Signup */}
              {!isLogin && (
                <PasswordStrengthMeter password={password} show={true} />
              )}
            </div>

            {/* CAPTCHA */}
            {showCaptcha && (
              <SimpleCaptcha
                show={showCaptcha}
                onVerify={(success) => {
                  if (success) {
                    setCaptchaVerified(true);
                    setShowCaptcha(false);
                  }
                }}
              />
            )}

            {error && (
              <div className="bg-red-900/30 border-l-4 border-red-500 text-red-400 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-900/30 border-l-4 border-green-500 text-green-400 px-4 py-3 rounded-lg">
                <p className="text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isBlocked}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : isLogin ? (
                "Sign In →"
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          {!showCaptcha && (
            <div className="mt-6">
              <button
                onClick={handleMagicLink}
                disabled={loading || !email || isBlocked}
                className="w-full px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-gray-600"
              >
                {loading ? "Sending..." : "✉️ Send Magic Link"}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setMessage("");
                setShowCaptcha(false);
                setCaptchaVerified(false);
              }}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-400 text-center">
              🔒 Your data is encrypted and secure
            </p>
          </div>
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};
