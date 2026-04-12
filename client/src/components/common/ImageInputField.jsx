import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Camera } from "lucide-react";
import { THEME } from "@/constants/config";

const ImageInputField = ({
  initialPhoto = "https://tse1.mm.bing.net/th/id/OIP.oMGwjU2nyjvz_kP6MoNqCgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
}) => {
  const { register, watch, setValue } = useFormContext();

  const [imgURL, setImgURL] = useState(initialPhoto);
  const fileInputRef = useRef(null);
  const photoFile = watch("photo");

  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      const objectUrl = URL.createObjectURL(file);
      setImgURL(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImgURL(initialPhoto);
    }
  }, [photoFile, initialPhoto]);

  const handleRemove = (e) => {
    e.stopPropagation();

    setValue("photo", "", { shouldDirty: true });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center sm:flex-row gap-8 pb-8 border-b border-slate-50">
      <div
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div
          className={`w-32 h-32 rounded-full border-4 ${THEME.primaryYellowBorder} p-1 overflow-hidden bg-slate-50`}
        >
          <img
            src={imgURL}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Camera Icon (Upload) */}
        <div
          className={`absolute bottom-1 right-1 ${THEME.primaryYellow} p-2 rounded-full shadow-lg border-2 border-white group-hover:scale-110 transition-transform`}
        >
          <Camera className="w-4 h-4 text-slate-900" />
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          {...register("photo")}
          ref={(e) => {
            register("photo").ref(e);
            fileInputRef.current = e;
          }}
        />
      </div>

      <div className="text-center sm:text-left">
        <h3 className="font-bold text-slate-900">Profile Picture</h3>
        <p className="text-sm text-slate-500 mb-3">
          JPG, GIF or PNG. Max size of 2MB
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold py-2 px-4 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Upload New Photo
          </button>

          {photoFile && photoFile.length > 0 && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs font-bold py-2 px-4 rounded-full text-red-500 hover:bg-red-50 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageInputField;
