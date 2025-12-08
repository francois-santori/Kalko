// src/api/kalkoApi.js
// API mockée KALKO — stockage localStorage

const STORAGE_KEYS = {
  USERS: "kalko_users",
  SESSION: "kalko_session",
  SCORES: "kalko_scores",
  USER_GAME_STATE: "kalko_user_game_state",
  GAMES: "kalko_games",
};

function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

function seedGamesIfNeeded() {
  const existing = load(STORAGE_KEYS.GAMES, null);
  if (existing && Array.isArray(existing) && existing.length > 0) return existing;

  const games = [
    {
      id: "game_addition_easy",
      key: "addition_easy",
      title: "Additions Rapides",
      description: "Enchaîne les additions simples le plus vite possible.",
      difficulty: "facile",
      category: "Calcul mental",
      unlockedByDefault: true,
      order: 1,
    },
    {
      id: "game_addition_combo",
      key: "addition_combo",
      title: "Combo Additions",
      description: "Garde ta série de bonnes réponses pour faire exploser le score.",
      difficulty: "moyen",
      category: "Calcul mental",
      unlockedByDefault: false,
      order: 2,
    },
    {
      id: "game_multiplication_easy",
      key: "multiplication_easy",
      title: "Tables en Mode Gaming",
      description: "Révise tes tables avec un chrono et des séries aléatoires.",
      difficulty: "moyen",
      category: "Tables",
      unlockedByDefault: true,
      order: 3,
    },
    {
      id: "game_mix_speed",
      key: "mix_speed",
      title: "Mix Turbo",
      description: "Additions + soustractions + multiplications en mode vitesse.",
      difficulty: "difficile",
      category: "Calcul mixte",
      unlockedByDefault: false,
      order: 4,
    },
  ];

  save(STORAGE_KEYS.GAMES, games);
  return games;
}

// ---------- Users / Auth ----------

async function getUsers() {
  return load(STORAGE_KEYS.USERS, []);
}

async function saveUsers(users) {
  save(STORAGE_KEYS.USERS, users);
  return users;
}

async function isUsernameTaken(username) {
  const users = await getUsers();
  const value = username.trim().toLowerCase();
  if (!value) return false;
  return users.some((u) => u.username.toLowerCase() === value);
}

async function registerUser(payload) {
  const { firstname, lastname, username, phone, password } = payload;

  if (!firstname?.trim() || !lastname?.trim() || !username?.trim() || !phone?.trim() || !password) {
    throw new Error("Champs obligatoires manquants.");
  }

  const users = await getUsers();
  const usernameLower = username.trim().toLowerCase();

  if (users.some((u) => u.username.toLowerCase() === usernameLower)) {
    throw new Error("Ce pseudo est déjà pris.");
  }

  const newUser = {
    id: generateId("user"),
    firstname: firstname.trim(),
    lastname: lastname.trim(),
    username: username.trim(),
    phone: phone.replace(/\D/g, ""),
    password,
    createdAt: new Date().toISOString(),
  };

  const updated = [...users, newUser];
  await saveUsers(updated);

  await setCurrentUserId(newUser.id);

  return newUser;
}

async function login({ username, password }) {
  const users = await getUsers();
  const uname = username.trim().toLowerCase();

  const user = users.find(
    (u) =>
      u.username.toLowerCase() === uname &&
      u.password === password
  );

  if (!user) {
    throw new Error("Identifiants incorrects.");
  }

  await setCurrentUserId(user.id);
  return user;
}

async function logout() {
  save(STORAGE_KEYS.SESSION, null);
}

async function setCurrentUserId(userId) {
  save(STORAGE_KEYS.SESSION, { userId });
}

async function getCurrentUser() {
  const session = load(STORAGE_KEYS.SESSION, null);
  if (!session || !session.userId) return null;

  const users = await getUsers();
  return users.find((u) => u.id === session.userId) || null;
}

// ---------- Jeux ----------

async function getGamesForUser(userId = null) {
  const games = seedGamesIfNeeded();

  if (!userId) {
    return games.map((g) => ({
      ...g,
      unlocked: !!g.unlockedByDefault,
    }));
  }

  const state = load(STORAGE_KEYS.USER_GAME_STATE, []);
  const userState =
    state.find((s) => s.userId === userId) || { userId, unlockedGameIds: [] };

  return games
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((g) => {
      const unlocked =
        g.unlockedByDefault || userState.unlockedGameIds.includes(g.id);
      return { ...g, unlocked };
    });
}

async function unlockGameForUser(userId, gameId) {
  if (!userId || !gameId) return;

  const games = seedGamesIfNeeded();
  const exists = games.some((g) => g.id === gameId);
  if (!exists) throw new Error("Jeu introuvable.");

  const state = load(STORAGE_KEYS.USER_GAME_STATE, []);
  let userState = state.find((s) => s.userId === userId);

  if (!userState) {
    userState = { userId, unlockedGameIds: [] };
    state.push(userState);
  }

  if (!userState.unlockedGameIds.includes(gameId)) {
    userState.unlockedGameIds.push(gameId);
  }

  save(STORAGE_KEYS.USER_GAME_STATE, state);
  return userState;
}

async function getGameById(gameId) {
  const games = seedGamesIfNeeded();
  return games.find((g) => g.id === gameId) || null;
}

// ---------- Scores ----------

async function getScores() {
  return load(STORAGE_KEYS.SCORES, []);
}

async function saveScore(data) {
  const scores = await getScores();

  const newScore = {
    id: generateId("score"),
    userId: data.userId,
    gameId: data.gameId,
    score: data.score,
    maxScore: data.maxScore ?? null,
    durationMs: data.durationMs ?? null,
    extra: data.extra ?? null,
    createdAt: new Date().toISOString(),
  };

  scores.push(newScore);
  save(STORAGE_KEYS.SCORES, scores);
  return newScore;
}

async function getScoresForUser(userId, { gameId = null } = {}) {
  const scores = await getScores();
  return scores
    .filter((s) => s.userId === userId && (!gameId || s.gameId === gameId))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

// ---------- EXPORT UNIQUE ----------

export const kalkoApi = {
  getUsers,
  registerUser,
  login,
  logout,
  getCurrentUser,
  isUsernameTaken,
  getGamesForUser,
  unlockGameForUser,
  getGameById,
  saveScore,
  getScoresForUser,
};
