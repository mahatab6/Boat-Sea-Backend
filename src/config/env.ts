import dotenv from 'dotenv'
import status from 'http-status';
import AppErrors from '../app/errorHandler/AppErrors';

dotenv.config();

interface EnvConfig {
    PORT: string
    DATABASE_URL: string
    FRONTEND_URL: string
}

const loadEnvVariables = (): EnvConfig =>{
    const requireEnvVariables = [
        "PORT",
        "DATABASE_URL",
        "FRONTEND_URL"
    ];

    requireEnvVariables.forEach((variable) => {
        if(!process.env[variable]){
            throw new AppErrors(status.INTERNAL_SERVER_ERROR,`Environment veriable ${variable} is require but it not set`,)
        }
    });

    return {
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string
    }
}

export const envVariables = loadEnvVariables();