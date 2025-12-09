import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import TablesModesModal from "../components/jeux/tables/TablesModesModal";

export default function Jeux() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Modal de choix de mode pour les tables
  const [isModesModalOpen, setIsModesModalOpen] = useState(false);

  // Protection de la page : si pas connecté → retour à l'accueil (version Supabase)
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!isMounted) return;

        // Pas de session valide → retour à l'accueil
        if (error || !data?.user) {
          navigate("/");
          return;
        }

        const meta = data.user.user_metadata || {};

        // On reconstruit un "user" pour l'UI, à partir des métadonnées Supabase
        setUser({
          id: data.user.id,
          email: data.user.email,
          firstname: meta.first_name || "",
          lastname: meta.last_name || "",
          username: meta.username || "",
        });
      } catch (e) {
        console.error("Erreur auth Supabase :", e);
        navigate("/");
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Erreur lors de la déconnexion Supabase :", e);
    } finally {
      navigate("/");
    }
  };

  // Navigation vers un mode de jeu
  const goToTablesMode = (mode) => {
    setIsModesModalOpen(false);
    navigate(`/jeux/tables-multiplications?mode=${mode}`);
  };

  // Pendant la vérification de l'auth, on peut afficher un petit écran neutre
  if (checkingAuth) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center text-white relative"
        style={{ backgroundImage: "url('/fond-abstrait-1.webp')" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/30"></div>
        <div className="relative z-10 text-center">
          <p className="text-lg text-slate-200">
            Chargement de ton espace de jeux…
          </p>
        </div>
      </div>
    );
  }

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
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-3 drop-shadow">
              Menu des Jeux
            </h1>
            {user && (
              <p className="text-base md:text-lg text-slate-200">
                Bienvenue,{" "}
                <span className="font-semibold">
                  {user.firstname} {user.lastname}
                </span>
                .
              </p>
            )}
            {!user && (
              <p className="text-base md:text-lg text-slate-200">
                Bienvenue sur KALKO.
              </p>
            )}
          </div>

          <div className="flex justify-center md:justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="
                rounded-2xl
                bg-white/10 hover:bg-white/20
                border border-white/25
                px-4 py-2
                text-sm font-medium text-white
                shadow-[0_10px_30px_rgba(0,0,0,0.5)]
                backdrop-blur-2xl
                transition
              "
            >
              Se déconnecter
            </button>
          </div>
        </header>

        {/* GRID DES JEUX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Tables de Multiplications */}
          <button
            type="button"
            onClick={() => setIsModesModalOpen(true)}
            className="
              group
              relative w-full
              overflow-hidden
              rounded-3xl
              bg-white/10
              border border-white/20
              backdrop-blur-xl
              shadow-[0_20px_40px_rgba(0,0,0,0.6)]
              px-5 py-5
              text-left
              transition-transform duration-200
              hover:-translate-y-1
              hover:bg-white/15
              hover:shadow-[0_25px_60px_rgba(0,0,0,0.8)]
            "
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-xl font-semibold tracking-tight">
                Tables de Multiplications
              </h2>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-100">
                4 modes
              </span>
            </div>

            <p className="text-sm text-slate-100/90 mb-4">
              Entraîne-toi sur les tables de 1 à 10, en mode libre, chrono,
              survie ou défi 30s.
            </p>

            <div className="flex items-center justify-between text-xs text-slate-100/80">
              <span>Calcul mental • Multiplications</span>
              <span className="group-hover:translate-x-1 transition-transform">
                Choisir un mode →
              </span>
            </div>
          </button>
        </div>

        {/* Texte d'info / placeholder pour les futurs jeux */}
        <div className="mt-8 text-center text-sm text-slate-200/80">
          D'autres mini-jeux KALKO arriveront bientôt dans ce menu.
        </div>
      </div>

      {/* MODAL CHOIX DES MODES */}
      <TablesModesModal
        isOpen={isModesModalOpen}
        onClose={() => setIsModesModalOpen(false)}
        onSelectMode={goToTablesMode}
      />
    </div>
  );
}
