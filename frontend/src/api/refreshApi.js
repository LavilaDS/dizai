import { refreshToken } from "./authApi.js"

export async function refreshApi(callback, payload=null){
    const okRefreshToken = await refreshToken();
    console.log("okRefreshToken", okRefreshToken);
    if(okRefreshToken){
        const response = await callback(payload);
        if(response !== false) {
            return response;
        }
    }
    throw new Error("Erro ao atualizar o token");
}