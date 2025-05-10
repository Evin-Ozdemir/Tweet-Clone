import { CiImageOn as Image } from "react-icons/ci";
import { FaRegSmile as Smile } from "react-icons/fa";
import { MdOutlineGifBox as Gif } from "react-icons/md";
import Loader from "../loader/index";

const FormActions = ({ isLoading, fileInputRef, onImageChange }) => {
  return (
    <div className="flex justify-between">
      <div className="text-tw-blue text-xl flex gap-4">
        <label htmlFor="image" type="button" className="form-icon">
          <input
            type="file"
            id="image"
            name="image"
            className="hidden"
            onChange={onImageChange}
            ref={fileInputRef}
          />
          <Image />
        </label>

        <button type="button" className="form-icon">
          <Gif />
        </button>
        <button type="button" className="form-icon">
          <Smile />
        </button>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="bg-secondary font-bold px-5 py-[6px] rounded-full text-primary tracking-wide hover:brightness-70 min-w-[100px] transition cursor-pointer flex justify-center "
      >
        {isLoading ? <Loader /> : "Gönder"}
      </button>
    </div>
  );
};

export default FormActions;
