import { doc, updateDoc } from "firebase/firestore";
import Modal from "./index";
import { db } from "../../firebase";
import { useState } from "react";
import uploadToStorage from "../../firebase/uploadToStorage";
import { toast } from "react-toastify";
import Loader from "../loader/index";

const EditModal = ({ isOpen, close, tweet }) => {
  const [isPicDeleting, setIsPicDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(tweet.content.image || null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target[0].value.trim();
    const file = e.target[1].files && e.target[1].files[0];

    if (!text && !file && !tweet.content.image) {
      return toast.info("Lütfen içeriği belirleyin");
    }

    try {
      setIsLoading(true);
      const docRef = doc(db, "tweets", tweet.id);

      let updatedData = {
        "content.text": text,
        isEdited: true,
      };

      if (isPicDeleting) {
        updatedData["content.image"] = null;
      }

      if (file) {
        const imageUrl = await uploadToStorage(file);
        updatedData["content.image"] = imageUrl;
      }

      await updateDoc(docRef, updatedData);
      toast.success("Tweet başarıyla güncellendi");
      close();
    } catch (error) {
      console.error(error);
      toast.error("Güncelleme sırasında bir hata oluştu");
    }

    setIsLoading(false);
    setIsPicDeleting(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <h1 className="text-2xl">Tweet'i Düzenle</h1>
      <form onSubmit={handleSubmit} className="flex flex-col mt-10 min-w-[90%]">
        <label className="text-sm mb-3">Metni Değiştir</label>
        <textarea
          defaultValue={tweet.content.text}
          className="resize-y min-h-20 max-h-[250px] bg-black text-secondary border border-zinc-700 rounded-md p-3 outline-none"
        />

        <label className="text-sm mt-8 mb-3">Fotoğrafı Değiştir</label>

        {!isPicDeleting && tweet.content.image && (
          <>
            <img
              src={previewUrl}
              alt="Önizleme"
              className="w-full max-h-64 object-cover rounded mb-3"
            />
            <button
              onClick={() => {
                setIsPicDeleting(true);
                setPreviewUrl(null);
              }}
              type="button"
              className="button"
            >
              Resmi Kaldır
            </button>
          </>
        )}

        {(isPicDeleting || !tweet.content.image) && (
          <>
            <input type="file" className="button" onChange={handleFileChange} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Yeni Önizleme"
                className="w-full max-h-64 object-cover rounded mt-3"
              />
            )}
          </>
        )}

        <div className="flex justify-end gap-5 mt-10">
          <button onClick={close} type="button" className="cursor-pointer">
            Vazgeç
          </button>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-secondary text-black px-3 py-1 rounded-md cursor-pointer hover:bg-secondary/70 transition min-w-[80px]"
          >
            {isLoading ? <Loader /> : "Kaydet"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditModal;
