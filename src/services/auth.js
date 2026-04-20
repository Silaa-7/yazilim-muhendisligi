export const registerUser = (newUser) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find((u) => u.email === newUser.email);

  if (exists) {
    throw new Error("Bu email zaten kayıtlı");
  }

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  return newUser;
};

export const loginUser = async (email, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [
    { email: "admin@test.com", password: "1234", role: "admin" },
    { email: "farmer@test.com", password: "1234", role: "farmer" },
    { email: "manager@test.com", password: "1234", role: "greenhouse_manager" },
  ];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) return null;

  return user;
};

// ==========================
// 🔵 SESSION (LOGIN KAYDETME)
// ==========================
export const setSession = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getSession = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// ==========================
// 🔴 LOGOUT
// ==========================
export const logout = () => {
  localStorage.removeItem("user");
};

// ==========================
// 🟣 RESET PASSWORD
// ==========================
export const resetPassword = (email, newPassword) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const index = users.findIndex((u) => u.email === email);

  if (index === -1) {
    throw new Error("Kullanıcı bulunamadı");
  }

  users[index].password = newPassword;

  localStorage.setItem("users", JSON.stringify(users));

  return true;
};