import uploadToStorage from "../../firebase/uploadToStorage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import ImagePreview from "./image-preview";
import FormActions from "./form-actions";
import UserAvatar from "./user-avatar";
import TextArea from "./text-area";

const Form = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // ! Resmin ön izleme url'ini oluştur
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // ! Ön izleme resmini kaldır
  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ! Form gönderilince
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Inputlardan verileri al
    const text = e.target.text.value;
    const file = e.target.image.files[0];

    // Veri yoksa bildirim gönder
    if (!text && !file) return toast.warning("Lütfen içeriği belirleyiniz...");

    try {
      setIsLoading(true);
      //Resim varsa resmi storage'a yükle ve url'ini al
      const url = await uploadToStorage(file);

      // Tweets kolleksiyonunun referansını al
      const collectionRef = collection(db, "tweets");

      // Yeni tweet belgesi kolleksiyona kaydet
      await addDoc(collectionRef, {
        content: { text, image: url },
        isEdited: false,
        likes: [],
        createAt: serverTimestamp(),
        user: {
          id: user.uid,
          name: user.displayName,
          photo: user.photoURL,
        },
      });

      // Formu sıfırla
      e.target.reset();
      clearImage();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };
  return (
    <div className="border-b border-tx-gray p-4 flex gap-3">
      <UserAvatar photo={user.photoURL} name={user.displayName} />
      <form onSubmit={handleSubmit} className="w-full pt-1">
        <TextArea />
        <ImagePreview image={image} clearImage={clearImage} />
        <FormActions
          isLoading={isLoading}
          fileInputRef={fileInputRef}
          onImageChange={onImageChange}
        />
      </form>
    </div>
  );
};

export default Form;
