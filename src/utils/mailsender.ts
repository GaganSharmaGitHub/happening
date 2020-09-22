import nm from 'nodemailer'
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
        subject: 'Success maje aaa gaye',
        text: 'That was easy!'+cod
      };
      let t= await transporter.sendMail(mailOptions) 
      return t;     
      
}