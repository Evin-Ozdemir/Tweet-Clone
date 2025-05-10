import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { FaHeart, FaRegComment, FaRegHeart, FaRetweet } from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";

const Buttons = ({ tweet }) => {
  // Aktif kullanıcının id'si tweet'i likleyanların arasında var mı
  const isLiked = tweet.likes?.includes(auth.currentUser.uid);

  // ! Like buttonuna tıklanınca
  const toggleLike = async () => {
    // Güncellenicek dökümanın referansını al
    const docRef = doc(db, "tweets", tweet.id);

    // like'ladıysam: kullanıcı id'sini likes dizisinden kaldır
    // like'lamadıysam: kullanıcı id'sini likes dizisine ekle
    await updateDoc(docRef, {
      likes: isLiked
        ? arrayRemove(auth.currentUser.uid)
        : arrayUnion(auth.currentUser.uid),
    });
  };
  return (
    <div className="flex justify-between items-center text-zinc-500">
      <button className="post-icon hover:text-blue-400 hover:bg-blue-400/20">
        <FaRegComment />
      </button>
      <button className="post-icon hover:text-green-400 hover:bg-green-300/20">
        <FaRetweet />
      </button>
      <button
        onClick={toggleLike}
        className="flex items-center hover:text-pink-400 relative"
      >
        <span className="post-icon hover:bg-pink-400/20">
          {isLiked ? <FaHeart className="text-pink-500" /> : <FaRegHeart />}
        </span>
        <span className={`absolute -end-1 ${isLiked && "text-pink-500"}`}>
          {tweet.likes.length}
        </span>
      </button>
      <button className="post-icon hover:text-blue-400 hover:bg-blue-400/20">
        <FaShareNodes />
      </button>
    </div>
  );
};

export default Buttons;
