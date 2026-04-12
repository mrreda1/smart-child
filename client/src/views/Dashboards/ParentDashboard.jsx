import { ASSETS, PREDEFINED_AVATARS } from "@/assets";
import InputField from "@/components/common/InputField";
import { ParentDashboardHeader } from "@/components/common/ParentDashboardHeader";
import SelectField from "@/components/common/SelectField";
import { THEME } from "@/constants/config";
import { useAppContext } from "@/context/AppContext";
import authService from "@/services/authService";
import {
  BarChart2,
  Calendar,
  LinkIcon,
  LogOut,
  PenTool,
  Play,
  Plus,
  Shield,
  Smile,
  Star,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { profiles, setProfiles, setActiveChild } = useAppContext();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(PREDEFINED_AVATARS[0]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    code: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const openModal = (type, profile = null) => {
    setActiveModal(type);
    if (profile) {
      setSelectedProfileId(profile.id);
      setFormData({
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        code: "",
      });
      setAvatarUrl(profile.avatar);
    } else {
      setSelectedProfileId(null);
      setFormData({ name: "", age: "", gender: "", code: "" });
      setAvatarUrl(PREDEFINED_AVATARS[0]);
    }
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setActiveModal(null);
    setAvatarUrl(PREDEFINED_AVATARS[0]);
    setFormData({ name: "", age: "", gender: "", code: "" });
  };

  const handleFileUpload = (e) => {
    if (isSubmitting) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      if (activeModal === "ADD") {
        const newProfile = {
          id: Date.now().toString(),
          name: formData.name || "New Child",
          age: formData.age || "-",
          gender: formData.gender,
          avatar: avatarUrl,
          role: "owner",
          lastActive: "Just now",
        };
        setProfiles([...profiles, newProfile]);
        toast.success("Profile created successfully!");
      } else if (activeModal === "EDIT") {
        setProfiles(
          profiles.map((p) =>
            p.id === selectedProfileId
              ? {
                  ...p,
                  name: formData.name,
                  age: formData.age,
                  gender: formData.gender,
                  avatar: avatarUrl,
                }
              : p,
          ),
        );
        toast.success("Profile updated successfully!");
      } else if (activeModal === "LINK") {
        if (!formData.code || formData.code.trim().length < 5)
          throw new Error("Invalid connection code. Please try again.");
        const linkedProfile = {
          id: Date.now().toString(),
          name: "Linked Child",
          age: 7,
          gender: "O",
          avatar: PREDEFINED_AVATARS[2],
          role: "linked",
          lastActive: "Unknown",
        };
        setProfiles([...profiles, linkedProfile]);
        toast.success("Profile linked successfully!");
      }
      closeModal();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setProfiles(profiles.filter((p) => p.id !== selectedProfileId));
    toast.success("Profile deleted permanently.");
    setIsSubmitting(false);
    closeModal();
  };

  const ownerProfiles = profiles.filter((p) => p.role === "owner");
  const linkedProfiles = profiles.filter((p) => p.role === "linked");

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-gray-500 font-medium">
            Manage profiles and view progress
          </p>
        </div>
        <button
          onClick={() => openModal("ADD")}
          className={`${THEME.primaryYellow} ${THEME.textBlack} font-bold px-6 py-3 rounded-full hover:bg-[#E5B427] transition-colors shadow-sm`}
        >
          + Add Child
        </button>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          Managed Profiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownerProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden group"
            >
              <div className="absolute top-4 left-4 text-xs font-bold text-[#4ade80] bg-green-50 px-3 py-1 rounded-full border border-green-100">
                Owner
              </div>
              <div className="absolute top-4 right-4 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openModal("EDIT", profile)}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit Profile"
                >
                  <PenTool size={16} />
                </button>
                <button
                  onClick={() => openModal("DELETE", profile)}
                  className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Profile"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <img
                src={profile.avatar}
                className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-sm mb-4 object-cover"
                alt={profile.name}
              />
              <h3 className="text-2xl font-black text-gray-900 mb-1">
                {profile.name}
                {profile.age !== "-" && `, ${profile.age}`}
              </h3>
              <p className="text-sm text-gray-400 font-medium mb-6">
                Last active: {profile.lastActive}
              </p>

              <div className="flex flex-col w-full gap-3 mt-auto">
                <button
                  onClick={() => openModal("PLAY_WARNING", profile)}
                  className={`w-full ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-3 rounded-full hover:bg-[#E5B427] transition-colors text-sm flex justify-center items-center gap-2`}
                >
                  <Play size={16} fill="currentColor" /> Play Mode
                </button>
                <button
                  onClick={() => {
                    setActiveChild(profile);
                    navigate("/parent/child/reports");
                  }}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-full transition-colors text-sm flex justify-center items-center gap-2"
                >
                  <BarChart2 size={16} /> View Reports
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          Linked Profiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {linkedProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden group"
            >
              <div className="absolute top-4 right-4 text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                <LinkIcon size={12} /> Linked
              </div>
              <img
                src={profile.avatar}
                className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-sm mb-4 object-cover"
                alt={profile.name}
              />
              <h3 className="text-2xl font-black text-gray-900 mb-1">
                {profile.name}
                {profile.age !== "-" && `, ${profile.age}`}
              </h3>
              <p className="text-sm text-gray-400 font-medium mb-6">
                Last active: {profile.lastActive}
              </p>
              <div className="flex flex-col w-full gap-3 mt-auto">
                <button
                  onClick={() => openModal("PLAY_WARNING", profile)}
                  className={`w-full ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-3 rounded-full hover:bg-[#E5B427] transition-colors text-sm flex justify-center items-center gap-2`}
                >
                  <Play size={16} fill="currentColor" /> Play Mode
                </button>
                <button
                  onClick={() => {
                    setActiveChild(profile);
                    navigate("/loading", { state: { nextView: "/reports" } });
                  }}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-full transition-colors text-sm flex justify-center items-center gap-2"
                >
                  <BarChart2 size={16} /> View Reports
                </button>
              </div>
            </div>
          ))}
          <div
            onClick={() => openModal("LINK")}
            className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/30 transition-all min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 text-gray-300 shadow-sm group-hover:scale-110 transition-transform">
              <Plus size={24} strokeWidth={3} />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Link Profile</h3>
            <p className="text-sm text-gray-400 font-medium mt-1">
              Connect a read-only child profile
            </p>
          </div>
        </div>
      </section>

      {/* Modals Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`${THEME.cardWhite} w-full max-w-md p-8 md:p-10 relative animate-in zoom-in-95 duration-200`}
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
            >
              <X size={20} />
            </button>

            {(activeModal === "ADD" || activeModal === "EDIT") && (
              <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                  {activeModal === "ADD" ? "Add Child" : "Edit Profile"}
                </h2>
                <form className="space-y-4 mt-6" onSubmit={handleFormSubmit}>
                  <div className="flex flex-col items-center justify-center mb-6">
                    <div
                      className={`relative group mb-4 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() =>
                        !isSubmitting && fileInputRef.current?.click()
                      }
                    >
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full bg-[#fdfcf8] border-4 border-gray-100 shadow-sm object-cover"
                      />
                      {!isSubmitting && (
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="text-white" size={24} />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex gap-3 justify-center w-full">
                      {PREDEFINED_AVATARS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setAvatarUrl(url)}
                          className={`w-12 h-12 rounded-full border-2 transition-all ${avatarUrl === url ? "border-[#FFC82C] scale-110 shadow-sm" : "border-transparent hover:scale-105 opacity-70 hover:opacity-100"} ${isSubmitting ? "cursor-not-allowed" : ""}`}
                        >
                          <img
                            src={url}
                            alt={`Icon ${i}`}
                            className="w-full h-full rounded-full object-cover bg-gray-50"
                          />
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 transition-all bg-gray-50 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:text-black hover:border-black hover:bg-white"}`}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                  <InputField
                    name="name"
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Child's Nickname"
                    type="text"
                    icon={Smile}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      name="age"
                      disabled={isSubmitting}
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Age"
                      type="number"
                      icon={Calendar}
                    />
                    <SelectField
                      name="gender"
                      disabled={isSubmitting}
                      value={formData.gender}
                      onChange={handleInputChange}
                      label="Gender"
                      options={[
                        { value: "M", label: "Male" },
                        { value: "F", label: "Female" },
                      ]}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-6 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${isSubmitting ? "opacity-70 cursor-not-allowed" : THEME.primaryYellowHover} transition-colors text-lg flex justify-center items-center gap-2`}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : null}
                    {isSubmitting
                      ? "Processing..."
                      : activeModal === "ADD"
                        ? "Create Profile"
                        : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {activeModal === "LINK" && (
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
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  <InputField
                    name="code"
                    disabled={isSubmitting}
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g. CH-8X9P2"
                    type="text"
                    icon={User}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-6 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${isSubmitting ? "opacity-70 cursor-not-allowed" : THEME.primaryYellowHover} transition-colors text-lg flex justify-center items-center gap-2`}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : null}
                    {isSubmitting ? "Verifying Code..." : "Request Link"}
                  </button>
                </form>
              </div>
            )}

            {activeModal === "DELETE" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                  Delete Profile?
                </h2>
                <p className="text-gray-500 font-medium text-sm mb-8">
                  This action cannot be undone. All data and assessment history
                  for this profile will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : null}
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}

            {activeModal === "PLAY_WARNING" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play size={32} fill="currentColor" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                  Enter Child Mode?
                </h2>
                <p className="text-gray-500 font-medium text-sm mb-8">
                  You are about to switch to the child's interface. To exit back
                  to the Parent Dashboard later, you will need to enter your
                  parent password.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setActiveChild(
                        profiles.find((p) => p.id === selectedProfileId),
                      );
                      navigate("/child-dashboard");
                    }}
                    className={`flex-1 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-3.5 rounded-full hover:bg-[#E5B427] transition-colors flex items-center justify-center gap-2`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ParentDashboard;
