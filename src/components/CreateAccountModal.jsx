import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Eye, EyeOff } from "lucide-react";

export default function CreateAccountModal({ isOpen, onClose, onSubmit }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState({
    firstname: false,
    lastname: false,
    username: false,
    phone: false,
    password: false,
  });

  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);

  useEffect(() => {
    const v = username.trim();
    if (v.length < 3) {
      setCheckingUsername(false);
      setUsernameTaken(false);
      return;
    }
    setCheckingUsername(true);
    const t = setTimeout(() => {
      const fakeTaken = ["kalko", "admin", "test"];
      setUsernameTaken(fakeTaken.includes(v.toLowerCase()));
      setCheckingUsername(false);
    }, 400);
    return () => clearTimeout(t);
  }, [username]);

  const getFirstnameError = () =>
    !firstname.trim() ? "Ce champ est obligatoire." : "";

  const getLastnameError = () =>
    !lastname.trim() ? "Ce champ est obligatoire." : "";

  const getUsernameError = () => {
    const v = username.trim();
    if (!v) return "Ce champ est obligatoire.";
    if (v.length < 3) return "Minimum 3 caractères.";
    if (usernameTaken) return "Ce pseudo est déjà pris.";
    return "";
  };

  const getPhoneError = () => {
    const d = phone.replace(/\D/g, "");
    if (!d) return "Ce champ est obligatoire.";
    if (d.length !== 10) return "Doit contenir 10 chiffres.";
    if (!/^0[67]\d{8}$/.test(d)) return "Doit commencer par 06 ou 07.";
    return "";
  };

  const getPasswordError = () => {
    if (!password) return "Ce champ est obligatoire.";
    if (password.length < 4) return "Minimum 4 caractères.";
    return "";
  };

  const firstnameError = getFirstnameError();
  const lastnameError = getLastnameError();
  const usernameError = getUsernameError();
  const phoneError = getPhoneError();
  const passwordError = getPasswordError();

  const hasErrors =
    firstnameError ||
    lastnameError ||
    usernameError ||
    phoneError ||
    passwordError;

  const baseInput = `
    w-full rounded-xl bg-white/10 border
    px-3.5 py-2.5 text-sm sm:text-base text-white
    placeholder:text-gray-200/70 shadow-inner
    focus:outline-none transition-all duration-150
  `;

  const basePasswordInput = `
    w-full rounded-xl bg-white/10 border
    pl-3.5 pr-10 py-2.5 text-sm sm:text-base text-white
    placeholder:text-gray-200/70 shadow-inner
    focus:outline-none transition-all duration-150
  `;

  const inputClass = (base, err, val) => {
    if (err)
      return (
        base +
        " border-red-400 focus:border-red-400 focus:ring-red-400/70"
      );
    if (val)
      return (
        base +
        " border-emerald-300 focus:border-emerald-300 focus:ring-emerald-300/70"
      );
    return base + " border-white/20 focus:border-white/60 focus:ring-white/40";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      firstname: true,
      lastname: true,
      username: true,
      phone: true,
      password: true,
    });
    if (hasErrors || checkingUsername) return;

    onSubmit({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      username: username.trim(),
      phone: phone.replace(/\D/g, ""),
      password,
    });
  };

  const handleBlur = (f) =>
    setTouched((p) => ({ ...p, [f]: true }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          aria-modal="true"
          role="dialog"
          className="
            fixed inset-0 z-40
            flex items-end sm:items-center justify-center
            overscroll-none
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="
              absolute inset-0
              bg-black/60 backdrop-blur-md
              pointer-events-none
            "
          />

          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="
              absolute inset-0 w-full h-full
              z-10 pointer-events-auto cursor-default
            "
          />

          <motion.div
            className="
              relative z-20 pointer-events-auto
              touch-pan-y touch-pinch-zoom select-none cursor-default
              w-[90vw] max-w-md sm:w-full sm:max-w-lg
              max-h-[90vh]
              rounded-t-3xl sm:rounded-3xl
              border border-white/15
              bg-gradient-to-b from-white/20 via-white/10 to-white/5
              backdrop-blur-3xl
              shadow-[0_24px_80px_rgba(0,0,0,0.6)]
              overflow-hidden
            "
            initial={{ opacity: 0, y: "100%", filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: "100%", filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="sm:hidden flex justify-center pt-2">
              <div className="h-1 w-10 rounded-full bg-white/50" />
            </div>

            <div className="flex items-start gap-3 px-5 pt-3 pb-3 sm:px-6 sm:pt-5 sm:pb-3">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-white tracking-wide">
                  Créer un compte KALKO
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-white/80">
                  Renseigne tes informations et rejoins l’aventure.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  p-1.5 rounded-full
                  bg-white/10 hover:bg-white/20
                  border border-white/20
                  text-white/80 hover:text-white
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="
                px-5 pb-6 pt-2 sm:px-6 sm:pb-6 sm:pt-3
                space-y-5 overflow-y-auto
              "
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm text-white/90">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    onBlur={() => handleBlur("lastname")}
                    className={inputClass(
                      baseInput,
                      touched.lastname && lastnameError,
                      lastname
                    )}
                    placeholder="Dupont"
                  />
                  {touched.lastname && lastnameError && (
                    <p className="text-[0.7rem] sm:text-xs text-red-300">
                      {lastnameError}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm text-white/90">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    onBlur={() => handleBlur("firstname")}
                    className={inputClass(
                      baseInput,
                      touched.firstname && firstnameError,
                      firstname
                    )}
                    placeholder="Emma"
                  />
                  {touched.firstname && firstnameError && (
                    <p className="text-[0.7rem] sm:text-xs text-red-300">
                      {firstnameError}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm text-white/90">
                  Pseudo
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => handleBlur("username")}
                  className={inputClass(
                    baseInput,
                    touched.username && usernameError,
                    username
                  )}
                />
                <div className="flex items-center gap-2">
                  {checkingUsername && (
                    <p className="text-[0.7rem] sm:text-xs text-white/70">
                      Vérification…
                    </p>
                  )}
                  {touched.username && usernameError && !checkingUsername && (
                    <p className="text-[0.7rem] sm:text-xs text-red-300">
                      {usernameError}
                    </p>
                  )}
                  {touched.username &&
                    !usernameError &&
                    username.trim().length >= 3 &&
                    !checkingUsername && (
                      <p className="text-[0.7rem] sm:text-xs text-emerald-300">
                        Disponible ✔
                      </p>
                    )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm text-white/90">
                  Numéro de mobile
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  inputMode="tel"
                  className={inputClass(
                    baseInput,
                    touched.phone && phoneError,
                    phone
                  )}
                  placeholder="06 12 34 56 78"
                />
                {touched.phone && phoneError ? (
                  <p className="text-[0.7rem] sm:text-xs text-red-300">
                    {phoneError}
                  </p>
                ) : (
                  <p className="text-[0.7rem] sm:text-xs text-white/65">
                    Numéro français, 10 chiffres, 06 ou 07.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm text-white/90">
                  Mot de passe
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={inputClass(
                      basePasswordInput,
                      touched.password && passwordError,
                      password
                    )}
                    placeholder="Ton code secret"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="
                      absolute inset-y-0 right-2 flex items-center
                      text-white/80 hover:text-white transition
                    "
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {touched.password && passwordError && (
                  <p className="text-[0.7rem] sm:text-xs text-red-300">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    w-full sm:w-auto
                    rounded-xl border border-white/25
                    bg-white/5 hover:bg-white/10
                    text-xs sm:text-sm text-white
                    px-4 py-2.5
                  "
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={checkingUsername}
                  className={`
                    w-full sm:w-auto rounded-xl
                    bg-white/90 hover:bg-white
                    text-xs sm:text-sm font-semibold text-gray-900
                    px-4 sm:px-6 py-2.5 shadow-[0_14px_45px_rgba(0,0,0,0.55)]
                    transition
                    ${
                      checkingUsername
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  Créer mon compte
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
