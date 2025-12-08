import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateAccountModal from "../components/CreateAccountModal";
import { kalkoApi } from "../api/kalkoApi";

export default function Accueil() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  // Connexion avec le formulaire de gauche
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword) return;

    try {
      setIsLoggingIn(true);
      await kalkoApi.login({
        username: loginUsername,
        password: loginPassword,
      });
      navigate("/jeux");
    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          "Connexion impossible. Vérifie ton pseudo et ton mot de passe."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Création du compte via le modal
  const handleCreateAccount = async (data) => {
    try {
      const newUser = await kalkoApi.registerUser(data);
      console.log("Nouveau compte KALKO :", newUser);
      setIsCreateOpen(false);
      navigate("/jeux");
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur lors de la création du compte.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-white relative"
      style={{
        backgroundImage: "url('/fond-abstrait-1.webp')",
      }}
    >
      {/* Vignettage subtil */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/30"></div>

      <div className="w-full max-w-5xl px-4 md:px-8 py-10 relative z-10">
        {/* Titre + texte d'intro */}
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-5xl font-extrabold tracking-wide mb-12 drop-shadow">
            KALKO
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Le Calcul en mode Gaming !
          </p>
        </header>

        {/* Deux cartes : Connexion / Nouveau compte */}
        <div className="grid gap-10 md:grid-cols-2">
          {/* Carte Connexion */}
          <section
            className="
              relative
              bg-white/12
              bg-gradient-to-b from-white/20/90 to-white/5
              border border-white/25
              rounded-[1rem]
              p-7 md:p-7
              backdrop-blur-3xl
              backdrop-saturate-150
              shadow-[0_24px_80px_rgba(0,0,0,0.6)]
              flex flex-col justify-between
              w-[90%]
              mx-auto
            "
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">Connexion</h2>

            <form className="flex flex-col gap-3" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="px-3 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/80"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="px-3 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/80"
              />

              {/* Liens aide connexion */}
              <div className="grid grid-cols-2 gap-2 mt-1 text-sm text-slate-300">
                <button
                  type="button"
                  onClick={() =>
                    alert("Fonction 'Identifiant oublié' bientôt disponible.")
                  }
                  className="text-slate-300 hover:text-white transition underline-offset-4 hover:underline text-left"
                >
                  Identifiant oublié ?
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert("Fonction 'Mot de passe oublié' bientôt disponible.")
                  }
                  className="text-slate-300 hover:text-white transition underline-offset-4 hover:underline text-left"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="mt-3 bg-sky-500/90 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-2xl py-2.5 font-semibold shadow-lg shadow-sky-900/40 transition"
              >
                {isLoggingIn ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          </section>

          {/* Carte Nouveau compte */}
          <section
            className="
              relative
              bg-white/12
              bg-gradient-to-b from-white/20/90 to-white/5
              border border-white/25
              rounded-[1rem]
              p-6 md:p-7
              backdrop-blur-3xl
              backdrop-saturate-150
              shadow-[0_24px_80px_rgba(0,0,0,0.6)]
              flex flex-col justify-between
              w-[90%]
              mx-auto
            "
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">Nouveau compte</h2>

            <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-4 text-center">
              Tu n&apos;as pas encore de compte ? <br /><br />
              Crée ton espace personnel pour
              enregistrer tes résultats, suivre tes progrès et débloquer de
              nouveaux mini-jeux.
            </p>

            <button
              className="mt-2 bg-emerald-500/90 hover:bg-emerald-400 text-white rounded-2xl py-2.5 font-semibold shadow-lg shadow-emerald-900/40 transition"
              onClick={() => setIsCreateOpen(true)}
            >
              Créer un nouveau compte
            </button>
          </section>
        </div>
      </div>

      {/* Modal de création de compte */}
      <CreateAccountModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateAccount}
      />
    </div>
  );
}
