import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import PageLoader from "../loader/page-loader";

const Protected = () => {
  // Oturumu açık olan kullanıncın state'i
  const [user, setUser] = useState(undefined);

  // Kullanıcının oturum verilerini al
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsub();
  }, []);

  // Oturum verileri gelene kadar yükleniyor bas
  if (user === undefined) return <PageLoader />;

  // Kullanıcının oturumu kapalı veya epostası doğrulanmışsa
  if (user === null || user?.emailVerified === false) {
    // email doğrulanmışsa bildirim gönder
    if (user?.emailVerified === false) toast.info("Mailinizi doğrulayın");
    // logine yönlendir
    return <Navigate to="/" replace />;
  }

  // Oturumu açık ve epostası doğrulandıysa sayfayı ekrana bas
  return <Outlet context={user} />;
};

export default Protected;

// 🔹 Outlet: bir üst route bileşeninde alt route'ların render edileceği yerdir.
