let suggestion = null;

// 📌 öneri oluştur (manager)
export const createSuggestion = (text, createdBy) => {
  suggestion = {
    id: Date.now(),
    message: text,
    status: "PENDING",
    createdBy,
  };

  return suggestion;
};

// 📌 getir
export const getSuggestion = () => suggestion;

// 📌 kabul
export const acceptSuggestion = () => {
  if (!suggestion) return null;

  suggestion.status = "ACCEPTED";
  return suggestion;
};

// 📌 reddet
export const rejectSuggestion = () => {
  if (!suggestion) return null;

  suggestion.status = "REJECTED";
  return suggestion;
};