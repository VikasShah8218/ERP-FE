const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

const setAuthToken = (token:any) => {
  localStorage.setItem("auth_token", token);
};

const loginUser = (token = null, user = {}) => {
  setAuthToken(token);
  localStorage.setItem("user", JSON.stringify(user));
};

const loadUserInfo = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : {};
};

const checkInitialAuth = () => {
  return localStorage.getItem("auth_token") ? true : false;
};

const logoutUser = () => {
  localStorage.clear();
};

export { getAuthToken, loginUser, logoutUser, loadUserInfo, checkInitialAuth };
