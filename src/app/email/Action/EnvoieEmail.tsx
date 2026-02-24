import { BrevoClient } from "@getbrevo/brevo" ;

export const EnvoieEmail = async ( email: string , subject: string , content: string ) => {
    const client = new BrevoClient ( {apiKey: process.env.BREVO_API_KEY || ""} ) ;
    try {
        const response = await client.transactionalEmails.sendTransacEmail ( {
            sender : {
                name : "Ma Petite Compagnie" ,
                email : "contact@yourcompany.com"
            } ,
            to : [{email}] ,
            subject : subject ,
            htmlContent : content
        } ) ;
        return { success: true, response } ;
    } catch ( error: any ) {
        console . error ( "Error avec Brevo:" , error ) ;
        return { success: false, error } ;
        throw error ;   
    }
}