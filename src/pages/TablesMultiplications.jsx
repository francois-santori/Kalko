import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TablesMultiplications() {
  const navigate = useNavigate();

  // --- ÉTATS DU JEU ---
  const [selectedTables, setSelectedTables] = useState([2, 3, 4, 5]); // tables choisies par défaut
  const [questionCount, setQuestionCount] = useState(10); // nb de questions dans une partie
  const [currentQuestion, setCurrentQuestion] = useState(null); // { a, b, answer }
  const [currentIndex, setCurrentIndex] = useState(0); // numéro de la question (0 → question 1)
  const [score, setScore] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // --- GÉNÉRATION D'UNE NOUVELLE QUESTION ---
  const generateQuestion = () => {
    if (selectedTables.length === 0) {
      return null;
    }
    const table =
      selectedTables[Math.floor(Math.random() * selectedTables.length)];
    const b = Math.floor(Math.random() * 10) + 1; // 1 à 10
    return {
      a: table,
      b,
      answer: table * b,
    };
  };

  // --- LANCER UNE NOUVELLE PARTIE ---
  const startGame = () => {
    if (selectedTables.length === 0) {
      alert("Choisis au moins une table pour commencer la partie 😉");
      return;
    }
    const firstQuestion = generateQuestion();
    if (!firstQuestion) return;

    setCurrentQuestion(firstQuestion);
    setCurrentIndex(0);
    setScore(0);
    setInputValue("");
    setFeedback(null);
    setLastCorrectAnswer(null);
    setIsFinished(false);
    setIsPlaying(true);
  };

  // --- VALIDER LA RÉPONSE ---
  const handleValidate = (e) => {
    e.preventDefault();
    if (!isPlaying || !currentQuestion) return;

    const numeric = Number(inputValue.trim());
    if (Number.isNaN(numeric)) {
      setFeedback(null);
      return;
    }

    const isCorrect = numeric === currentQuestion.answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    setLastCorrectAnswer(currentQuestion.answer);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // petite pause avant la question suivante
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questionCount) {
        // partie terminée
        setIsFinished(true);
        setIsPlaying(false);
        setCurrentQuestion(null);
      } else {
        // nouvelle question
        const nextQuestion = generateQuestion();
        setCurrentQuestion(nextQuestion);
        setCurrentIndex(nextIndex);
        setInputValue("");
        setFeedback(null);
        setLastCorrectAnswer(null);
      }
    }, 600);
  };

  // --- GESTION DES TABLES COCHÉES ---
  const toggleTable = (n) => {
    setSelectedTables((prev) =>
      prev.includes(n) ? prev.filter((t) => t !== n) : [...prev, n].sort()
    );
  };

  // --- PETIT RACCOURCI CLAVIER : ENTRÉE POUR VALIDER ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && isPlaying && !isFinished) {
        handleValidate(e);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isFinished, currentQuestion, inputValue, currentIndex]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-white relative"
      style={{
        backgroundImage: "url('/fond-abstrait-1.webp')",
      }}
    >
      {/* Vignettage / overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-5xl px-4 md:px-8 py-8">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-2 drop-shadow">
              Tables de multiplications
            </h1>
            <p className="text-sm md:text-base text-slate-100/80 max-w-xl">
              Choisis tes tables, lance la partie et réponds le plus vite
              possible. Ton objectif : faire un maximum de bonnes réponses 💪
            </p>
          </div>

          <div className="flex justify-center md:justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/jeux")}
              className="rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 text-xs md:text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition"
            >
              ← Retour au menu
            </button>
          </div>
        </header>

        {/* CARD PRINCIPALE */}
        <div className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-5 md:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLONNE GAUCHE : PARAMÈTRES */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold tracking-tight">
                Paramètres du jeu
              </h2>

              {/* Tables à travailler */}
              <div className="bg-black/20 rounded-2xl border border-white/10 p-4">
                <p className="text-sm text-slate-100/90 mb-2">
                  Choisis les tables de multiplications :
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                    const active = selectedTables.includes(n);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => toggleTable(n)}
                        className={`text-sm font-semibold rounded-xl py-1.5 transition-all border ${
                          active
                            ? "bg-emerald-500/80 border-emerald-300 text-white shadow-lg"
                            : "bg-white/5 border-white/15 text-slate-100/90 hover:bg-white/10"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nombre de questions */}
              <div className="bg-black/20 rounded-2xl border border-white/10 p-4">
                <p className="text-sm text-slate-100/90 mb-2">
                  Nombre de questions :
                </p>
                <div className="flex gap-2">
                  {[5, 10, 15].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setQuestionCount(n)}
                      className={`flex-1 text-sm font-semibold rounded-xl py-1.5 border transition-all ${
                        questionCount === n
                          ? "bg-indigo-500/80 border-indigo-300 text-white shadow-lg"
                          : "bg-white/5 border-white/15 text-slate-100/90 hover:bg-white/10"
                      }`}
                    >
                      {n} questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton lancer / rejouer */}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={startGame}
                  className="flex-1 rounded-2xl bg-emerald-500/90 hover:bg-emerald-400 border border-emerald-300 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  {isFinished ? "Rejouer une partie" : "Lancer la partie"}
                </button>
              </div>

              {/* Résumé / score */}
              <div className="mt-2 text-xs text-slate-100/80">
                <p>
                  Score actuel :{" "}
                  <span className="font-semibold">
                    {score} / {Math.max(currentIndex, isFinished ? questionCount : currentIndex || 0) || 0}
                  </span>
                </p>
                {isFinished && (
                  <p className="mt-1 text-emerald-200">
                    Partie terminée ! Tu as obtenu{" "}
                    <span className="font-semibold">
                      {score} / {questionCount}
                    </span>
                    .
                  </p>
                )}
              </div>
            </section>

            {/* COLONNE DROITE : ZONE DE JEU */}
            <section className="flex flex-col justify-between bg-black/25 rounded-2xl border border-white/10 p-4 md:p-5">
              {!isPlaying && !currentQuestion && !isFinished && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <p className="text-sm md:text-base text-slate-100/90 mb-2">
                    Prépare-toi à jouer !
                  </p>
                  <p className="text-xs md:text-sm text-slate-200/80">
                    Choisis tes tables et le nombre de questions, puis clique
                    sur <span className="font-semibold">« Lancer la partie »</span>.
                  </p>
                </div>
              )}

              {isPlaying && currentQuestion && (
                <div className="flex-1 flex flex-col justify-between gap-4">
                  {/* Question */}
                  <div className="text-center mt-2">
                    <p className="text-xs text-slate-200/80 mb-1">
                      Question {currentIndex + 1} / {questionCount}
                    </p>
                    <p className="text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow mb-4">
                      {currentQuestion.a} × {currentQuestion.b} = ?
                    </p>
                  </div>

                  {/* Formulaire de réponse */}
                  <form
                    onSubmit={handleValidate}
                    className="flex flex-col items-center gap-3"
                  >
                    <input
                      type="number"
                      inputMode="numeric"
                      autoFocus
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="
                        w-full max-w-xs
                        text-center text-2xl md:text-3xl font-semibold
                        bg-black/40
                        border-2
                        border-white/30
                        rounded-2xl
                        px-4 py-2
                        outline-none
                        focus:border-emerald-400
                        focus:ring-0
                        placeholder:text-slate-400
                      "
                      placeholder="Ta réponse"
                    />
                    <button
                      type="submit"
                      className="
                        rounded-2xl
                        bg-white/90
                        hover:bg-white
                        text-slate-900
                        px-6 py-2
                        text-sm md:text-base
                        font-semibold
                        shadow-[0_15px_35px_rgba(0,0,0,0.8)]
                        transition-transform
                        hover:-translate-y-0.5
                      "
                    >
                      Valider
                    </button>
                  </form>

                  {/* Feedback */}
                  <div className="h-10 flex items-center justify-center mt-2">
                    {feedback === "correct" && (
                      <p className="text-emerald-300 text-sm md:text-base">
                        ✅ Bravo, c&apos;est correct !
                      </p>
                    )}
                    {feedback === "wrong" && (
                      <p className="text-rose-300 text-sm md:text-base">
                        ❌ Ce n&apos;est pas la bonne réponse.
                        {lastCorrectAnswer !== null && (
                          <>
                            {" "}
                            La bonne réponse était{" "}
                            <span className="font-semibold">
                              {lastCorrectAnswer}
                            </span>
                            .
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {isFinished && !isPlaying && (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                  <p className="text-lg md:text-xl font-semibold text-slate-50">
                    Partie terminée 🎉
                  </p>
                  <p className="text-sm md:text-base text-slate-100/85">
                    Tu as obtenu{" "}
                    <span className="font-bold">
                      {score} / {questionCount}
                    </span>
                    . Clique sur <span className="font-semibold">« Rejouer une partie »</span>{" "}
                    pour t&apos;entraîner encore !
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
