import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import prisma from "../modules/prisma.js";
import jwt from "jsonwebtoken";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id_user: true
    }
  });

  if (!user) {
    return res.status(404).json({ message: "Non-existent mail" });
  }

  const code = generateCode();

  const reset_token = jwt.sign({ code }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const tokenExpiration = new Date();

  tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 15);

  await prisma.user.update({
    where: { email, id_user: user.id_user },
    data: { resetToken: reset_token, tokenExpiration: tokenExpiration },
  });

  const mailOPtions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recuperación de Contraseña",
    text: `Tu código de recuperación es: ${code}`,
  };

  try {
    await transporter.sendMail(mailOPtions);
    res.status(200).json({ message: "Código de recuperación enviado al correo" });
  } catch (error) {
    res.status(500).json({ error: "Error al enviar al correo" });
  }
};


export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: {email},
    select: {
      resetToken: true
    }
  });

  if (!user)return res.status(404).json({ error: "User not found" });

  try {
    const decoded = jwt.verify(user.resetToken, process.env.JWT_SECRET);
    
    if (decoded.code != code) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const passwordHashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: passwordHashed,
        resetToken: null,
        tokenExpiration: null,
      },
    });

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "Token expirado" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Token inválido" });
    } else {
      res.status(500).json({ error: "Error al actualizar la contraseña" });
    }
  }
};

function generateCode() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}