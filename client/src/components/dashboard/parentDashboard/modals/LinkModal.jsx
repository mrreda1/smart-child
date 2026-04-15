import { ASSETS } from "@/assets";
import InputField from "@/components/common/InputField";
import { Modal } from "@/components/common/Modal";
import { THEME } from "@/constants/config";
import { useAppContext } from "@/context/AppContext";
import { LinkIcon, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const LinkModal = ({ isOpen, onClose }) => {
  const { profiles, setProfiles } = useAppContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { code: "" },
  });

  // Clean up form when closed
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const linkedProfile = {
        id: Date.now().toString(),
        name: "Linked Child",
        age: 7,
        gender: "O",
        avatar: ASSETS.childAvatars[2],
        role: "linked",
        lastActive: "Unknown",
      };

      setProfiles([...profiles, linkedProfile]);
      toast.success("Profile linked successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !isSubmitting && onClose()}>
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <LinkIcon size={32} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
          Link Profile
        </h2>
        <p className="text-gray-500 font-medium text-sm mb-6">
          Enter a code to connect a read-only profile.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            {...register("code", {
              required: "Connection code is required",
              minLength: {
                value: 5,
                message: "Code must be at least 5 characters",
              },
            })}
            disabled={isSubmitting}
            placeholder="e.g. CH-8X9P2"
            type="text"
            icon={User}
            error={errors.code?.message}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-6 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${isSubmitting ? "opacity-70 cursor-not-allowed" : THEME.primaryYellowHover} transition-colors text-lg flex justify-center items-center gap-2`}
          >
            {isSubmitting && (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            )}
            {isSubmitting ? "Verifying..." : "Request Link"}
          </button>
        </form>
      </div>
    </Modal>
  );
};
