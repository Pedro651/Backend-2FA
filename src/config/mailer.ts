import nodemailer from "nodemailer"
import twilio from "twilio";

export const transpoter = nodemailer.createTransport({
    service:"gmail", //Por onde vai ser enviado
    auth:{
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

interface sendMailProps{
   to:string,
   subject:string ,
   html:string
}

export async function sendMail({to, subject, html}:sendMailProps){
    try{
        await transpoter.sendMail({
            from: `"Suporte" <${process.env.EMAIL_USER}>`, //Quem manda o email
            to,      //Quem recebe o email
            subject, //Assunto do e-mail
            html,    //Corpo do e-mail em html
        });
        console.log("Email enviado com sucesso")
    }catch(error){
        console.error("Error ao enviar e-mail:", error);
        throw error
    }


}

const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
);


interface sendSMSProps {
    to: string;
    message: string;
}


export async function sendSMS({to, message}: sendSMSProps){

    try{

        await client.messages.create({
            from: process.env.TWILIO_PHONE,
            to,
            body: message
        });


        console.log("SMS enviado com sucesso");


    }catch(error:any){

        console.log("Erro SMS:");
        console.log(error.message)

    }
}