import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./index";
import { v4 } from "uuid";

// Parametre olarak aldığı dosya bir resim ise storage'a yükle ve geriye resim url'ini return etsin
const uploadToStorage = async (file) => {
  // 1. Dosya yoksa veya dosya resim değilse fonksiyonu durdur
  if (!file || !file.type.startsWith("image")) return null;

  // 2. Maksimun dosya boyutu 2mb geçiyorsa hata fırlat
  if (file.size > 2097152) {
    toast.error("Lütfen 2mb'ın altında bir medya yükleyin");
    throw new Error("Medya içeriği sınırı aşıyor");
  }
  // 3. Dosyanın yükleniceği konumun referansını al
  const imageRef = ref(storage, v4() + file.name);

  // 4. Referansını oluşturduğumuz konuma dosyayı yükle
  await uploadBytes(imageRef, file);

  // 5. Storage'a yüklenen dosyanın url'ini al ve return et
  const url = await getDownloadURL(imageRef);

  return url;
};
export default uploadToStorage;
