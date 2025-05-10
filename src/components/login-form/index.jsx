import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/index";
import { toast } from "react-toastify";
import EmailInput from "./email-input";
import PasswordInput from "./password-input";
import ForgotPassword from "./forgot-password";
import AuthToggle from "./auth-toggle";

const Form = () => {
  const navigate = useNavigate();

  // Kaybolma modunda mıyız?
  const [isSignUp, setIsSignUp] = useState(false);

  // Form gönderilince
  const handleSubmit = async (e) => {
    e.preventDefault();

    // İnputlardaki verileri al
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData.entries());

    try {
      if (isSignUp) {
        // Kaydolma modundaysak: hesap oluştur
        const res = await createUserWithEmailAndPassword(auth, email, password);
        // Mail doğrulama epostası gönder
        await sendEmailVerification(res.user);

        // Bildirim gönder
        toast.info("Mailinize doğrulama epostası gönderildi");

        // Giriş yapma moduna geç
        setIsSignUp(false);
      } else {
        // Giriş modundaysak: oturum aç
        const res = await signInWithEmailAndPassword(auth, email, password);

        // Mailini doğrulamamış ise bildirim gönder
        if (!res.user.emailVerified) {
          return toast.info("Lütfen mailinizi doğrulayın");
        }
        // Mailini doğrulamış ise anasayfaya yönlendir ve bildirim
        navigate("/feed");
        toast.success("Oturumunuz açıldı");
      }
      // Formu sıfırla
      e.target.reset();
    } catch (error) {
      // Hatayı bildirim olarak gönder
      toast.error("Hata: " + error.code);
    }
  };
  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <EmailInput />
      <PasswordInput />
      {!isSignUp ? <ForgotPassword /> : <div className="h-[28px] w-1" />}
      <button
        type="submit"
        className="mt-10 bg-white text-black rounded-full p-1 font-bold transition hover:bg-gray-300 cursor-pointer"
      >
        {isSignUp ? "Kaydol" : "Giriş Yap"}
      </button>

      <AuthToggle isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
    </form>
  );
};

export default Form;
