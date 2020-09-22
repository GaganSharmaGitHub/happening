import nm from 'nodemailer'
import {template} from './template'
export const mailsender=async (rec:string,cod:string)=>{
    var transporter = nm.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_SENDER}`,
          pass: `${process.env.PASSWORD_EMAIL}`
        }
      });
      
      var mailOptions = {
        from: `${process.env.EMAIL_SENDER}`,
        to: rec,
        subject: 'Reset Password',
        html: template(cod)
      };
      let t= await transporter.sendMail(mailOptions) 
      return t;     
      
}