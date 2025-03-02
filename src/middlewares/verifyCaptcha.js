import axios from "axios";

export const verifyCaptcha = async (req, res, next) => {    
    const {captcha} = req.body;
    if (!captcha) {
        return res.status(400).json({message: "Captcha is required"});
    }
    
    try {
        const SECRET_KEY = process.env.SECRET_KEY_CAPTCHA;
        const captchaVerification = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
            params: {
              secret: SECRET_KEY,
              response: captcha,
            },
        });

        if(!captchaVerification.data.success){
            return res.status(400).json({message: "Captcha verification failed"});
        }
        next();
    } catch (error) {
        return res.status(500).json({message: "Error while verifying captcha"});
    }
    
}