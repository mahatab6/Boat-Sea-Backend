import { Request, Response } from "express";



const createBoat = async (req: Request, res: Response) => {
    console.log("request body",req.body)
    res.json({
        success: true
    })
}


export const boatController = {
    createBoat
}