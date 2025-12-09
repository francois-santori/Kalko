import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Eye, EyeOff } from "lucide-react";
import { supabase } from "../api/supabaseClient";

export default function CreateAccountModal({ isOpen, onClose, }) {
  const [firstname, setFirstname] = useState(""); // first_name
  const [lastname, setLastname] = useState(""); // last_name
  const [username, setUsername] = useState(""); // pseudo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState({
    firstname: false,
    lastname: false,
    username: false,
    email: false,
    password: false,
    passwordConfirm: false,
  });

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFirstnameError = () => {
    // Option : rendre Nom obligatoire plus tard si besoin
    return "";
  };

  const getLastnameError = () => {
    // Option : rendre Prénom obligatoire plus tard si besoin
    return "";
  };

  const getUsernameError = () => {
    const v = username.trim();
    if (!v) return "Le pseudo est obligatoire.";
    if (v.length < 3) return "Minimum 3 caractères.";
    return "";
  };

  const getEmailError = () => {
    const v = email.trim();
    if (!v) return "L’email est obligatoire.";
    const simpleRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!simpleRegex.test(v)) return "Format d’email invalide.";
    return "";
  };

  const getPasswordError = () => {
    if (!password) return "Le mot de passe est obligatoire.";
    if (password.length < 6) return "Minimum 6 caractères.";
    return "";
  };

  const getPasswordConfirmError = () => {
    if (!passwordConfirm) return "Merci de confirmer le mot de passe.";
    if (passwordConfirm !== password)
      return "Les mots de passe ne correspondent pas.";
    return "";
  };

  const firstnameError = getFirstnameError();
  const lastnameError = getLastnameError();
  const usernameError = getUsernameError();
  const emailError = getEmailError();
  const passwordError = getPasswordError();
  const passwordConfirmError = getPasswordConfirmError();

  const hasErrors =
    usernameError ||
    emailError ||
    passwordError ||
    passwordConfirmError ||
    firstnameError ||
    lastnameError;

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

  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // On marque tous les champs comme "touchés" pour afficher les erreurs
    setTouched({
      firstname: true,
      lastname: true,
      username: true,
      email: true,
      password: true,
      passwordConfirm: true,
    });

    if (hasErrors) return;

    const payload = {
      first_name: firstname.trim(),
      last_name: lastname.trim(),
      username: username.trim(),
      email: email.trim(),
      password,
    };

    try {
      setIsSubmitting(true);

      // Appel Supabase pour créer l'utilisateur
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            first_name: payload.first_name || null,
            last_name: payload.last_name || null,
            username: payload.username,
          },
        },
      });

      if (error) {
        setSubmitError(error.message || "Une erreur est survenue.");
        return;
      }

      console.log("Inscription Supabase réussie :", data);

      // TODO: plus tard, si on utilise une table profiles séparée,
      // on pourra ajouter ici un appel supabase.from('profiles').insert(...)

      // Désactivé : ancien système kalkoApi basé sur le numéro de mobile.
      // Supabase gère désormais l'inscription, donc on ignore onSubmit pour le moment.
      // if (onSubmit) {
      //   onSubmit(payload, data);
      // }

      // On peut éventuellement reset le formulaire ici si tu le souhaites
      setFirstname("");
      setLastname("");
      setUsername("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setTouched({
        firstname: false,
        lastname: false,
        username: false,
        email: false,
        password: false,
        passwordConfirm: false,
      });

      onClose();
    } catch (err) {
      console.error(err);
      setSubmitError("Erreur inattendue lors de la création du compte.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  Renseigne tes infos et rejoins l’aventure.
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
              {/* Nom / Prénom */}
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

              {/* Pseudo */}
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
                  placeholder="Choisis un pseudo"
                />
                {touched.username && usernameError && (
                  <p className="text-[0.7rem] sm:text-xs text-red-300">
                    {usernameError}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm text-white/90">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={inputClass(
                    baseInput,
                    touched.email && emailError,
                    email
                  )}
                  placeholder="ton.email@exemple.com"
                />
                {touched.email && emailError && (
                  <p className="text-[0.7rem] sm:text-xs text-red-300">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Mot de passe + confirmation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      onClick={() => setShowPassword((prev) => !prev)}
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

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm text-white/90">
                    Confirme le mot de passe
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    onBlur={() => handleBlur("passwordConfirm")}
                    className={inputClass(
                      basePasswordInput,
                      touched.passwordConfirm && passwordConfirmError,
                      passwordConfirm
                    )}
                    placeholder="Répète ton mot de passe"
                  />
                  {touched.passwordConfirm && passwordConfirmError && (
                    <p className="text-[0.7rem] sm:text-xs text-red-300">
                      {passwordConfirmError}
                    </p>
                  )}
                </div>
              </div>

              {/* Erreur globale Supabase */}
              {submitError && (
                <p className="text-xs sm:text-sm text-red-300 mt-1">
                  {submitError}
                </p>
              )}

              {/* Actions */}
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
                  disabled={hasErrors || isSubmitting}
                  className={`
                    w-full sm:w-auto rounded-xl
                    bg-white/90 hover:bg-white
                    text-xs sm:text-sm font-semibold text-gray-900
                    px-4 sm:px-6 py-2.5 shadow-[0_14px_45px_rgba(0,0,0,0.55)]
                    transition
                    ${
                      hasErrors || isSubmitting
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }
                  `}
                >
                  {isSubmitting ? "Création..." : "Créer mon compte"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
