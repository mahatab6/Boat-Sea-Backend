import dotenv from 'dotenv'
import status from 'http-status';
import AppErrors from '../app/errorHandler/AppErrors';

dotenv.config();

interface EnvConfig {
    PORT: string;
}

const loadEnvVariables = (): EnvConfig =>{
    const requireEnvVariables = [
        "PORT"
    ];

    requireEnvVariables.forEach((variable) => {
        if(!process.env[variable]){
            throw new AppErrors(status.INTERNAL_SERVER_ERROR,`Environment veriable ${variable} is require but it not set`,)
        }
    });

    return {
        PORT: process.env.PORT as string,
    }
}

export const envVariables = loadEnvVariables();