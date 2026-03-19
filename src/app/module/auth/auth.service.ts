import status from "http-status";
import AppErrors from "../../errorHandler/AppErrors";
import { auth } from "../../lib/auth"
import { IregisterCustomer } from "./auth.interface"


const registerCustomer = async (payload: IregisterCustomer) => {
    
    const {name, email, password} = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        }
    });

    if(!data.user){
        throw new AppErrors(status.INTERNAL_SERVER_ERROR, "Faild to register Customar",)
    }

    return{
        ...data
    }
}



export const AuthService = {
    registerCustomer
}