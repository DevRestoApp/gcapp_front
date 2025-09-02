import api from "./api";

export async function register({
    login,
    password,
}: {
    login: string;
    password: string;
}) {
    const res = await api.post("/register", { login, password });
    return res.data;
}

export async function login({
    login,
    password,
}: {
    login: string;
    password: string;
}) {
    const res = await api.post("/login", { login, password });
    const { access_token } = res.data;
    localStorage.setItem("access_token", access_token);
    return res.data;
}

export async function getMe() {
    const res = await api.get("/me");
    return res.data;
}
