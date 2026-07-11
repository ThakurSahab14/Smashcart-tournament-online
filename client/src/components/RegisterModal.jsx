import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiMessageSquare, FiPhone, FiSend } from "react-icons/fi";

export default function RegisterModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    ign: "",
    mobile: "",
    discord: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -30, rotateY: -15 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  const fields = [
    { name: "name", label: "Your Name", icon: FiUser, type: "text", placeholder: "Enter your full name" },
    { name: "ign", label: "In-Game Name", icon: FiMessageSquare, type: "text", placeholder: "Your SMASHKART IGN" },
    { name: "mobile", label: "Mobile Number", icon: FiPhone, type: "tel", placeholder: "Your WhatsApp number" },
    { name: "discord", label: "Discord ID (Optional)", icon: FiMessageSquare, type: "text", placeholder: "Your Discord username" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-asphalt/90 backdrop-blur-md"
          />

          {/* 3D Card */}
          <motion.div
            initial={{ opacity: 0, rotateX: -15, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, rotateX: 15, y: -50, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              delay: 0.1
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-asphalt via-asphalt/95 to-asphalt/90 shadow-2xl shadow-volt/10"
            style={{ perspective: 1000 }}
          >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-volt/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-surge/15 blur-3xl" />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative border-b border-white/5 px-6 py-5"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <FiX size={20} />
              </button>
              <div className="text-center">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="font-display text-2xl font-bold uppercase tracking-wide text-white"
                >
                  Join the <span className="text-volt">Tournament</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-1 text-sm text-white/50"
                >
                  Fill in your details to register
                </motion.p>
              </div>
            </motion.div>

            {/* Form */}
            <div className="relative p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-volt/20"
                  >
                    <FiSend className="h-8 w-8 text-volt" />
                  </motion.div>
                  <h3 className="font-display text-xl font-bold text-white">Registration Submitted!</h3>
                  <p className="mt-2 text-sm text-white/60">
                    We'll contact you soon. For any issues, email us at{" "}
                    <a href="mailto:lucy14thakur@gmail.com" className="text-volt hover:underline">
                      lucy14thakur@gmail.com
                    </a>
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 rounded-full bg-volt px-6 py-2 font-display text-sm font-bold uppercase text-asphalt transition hover:brightness-110"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {fields.map((field, i) => (
                    <motion.div
                      key={field.name}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={inputVariants}
                      className="relative"
                    >
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/60">
                        {field.label}
                      </label>
                      <div
                        className={`relative transition-all duration-300 ${
                          focusedField === field.name ? "scale-[1.02]" : ""
                        }`}
                      >
                        <field.icon
                          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                            focusedField === field.name ? "text-volt" : "text-white/30"
                          }`}
                          size={18}
                        />
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField(null)}
                          required={field.name !== "discord"}
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder-white/30 transition-all duration-300 focus:border-volt/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-volt/20"
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 rounded-lg bg-red-500/20 border border-red-500/50 px-4 py-2 text-center text-sm text-red-300"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Support note */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 text-center text-xs text-white/40"
                  >
                    For any issues or trouble with registration or tournament,{" "}
                    <br />
                    contact us at{" "}
                    <a
                      href="mailto:lucy14thakur@gmail.com"
                      className="text-surge hover:underline"
                    >
                      lucy14thakur@gmail.com
                    </a>
                  </motion.p>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={!loading ? { scale: 1.03, boxShadow: "0 0 30px rgba(0,229,255,0.4)" } : {}}
                    whileTap={!loading ? { scale: 0.97 } : {}}
                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-volt to-volt/80 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-asphalt shadow-lg shadow-volt/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Register Now"}
                  </motion.button>
                </form>
              )}
            </div>

            {/* Bottom decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="h-1 w-full bg-gradient-to-r from-transparent via-volt to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}