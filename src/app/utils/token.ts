import { JwtPayload, SignOptions } from "jsonwebtoken"
import { jwtUtils } from "./jwt"
import { cookieUtils } from "./cookie"
import { Response } from "express"
import { envVariables } from "../../config/env"
import ms from "ms"

const parseMs = (value: string) => ms(value as import("ms").StringValue)

const getAccessToken = (payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, envVariables.ACCESS_TOKEN_SECRET, {expiresIn: envVariables.ACCESS_TOKEN_EXPIRES_IN} as SignOptions)
    return accessToken
}

const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, envVariables.REFRESH_TOKEN_SECRET, {expiresIn: envVariables.REFRESH_TOKEN_EXPIRES_IN} as SignOptions)
    return refreshToken
}



const setAccessTokenCookie = (res: Response, token:string) => {
    cookieUtils.setCookie(res, 'accessToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: parseMs(envVariables.ACCESS_TOKEN_EXPIRES_IN)
    })
}

const setRefreshTokenCookie = (res: Response, token: string) => {

    cookieUtils.setCookie(res, "refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: parseMs(envVariables.REFRESH_TOKEN_EXPIRES_IN)
    })
}

const setBetterAuthCookie = (res: Response, token: string) => {
    cookieUtils.setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: parseMs(envVariables.BETTER_AUTH_TOKEN_EXPIRES_IN)
    })
}


export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthCookie
}