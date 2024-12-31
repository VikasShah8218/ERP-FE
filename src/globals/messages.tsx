import { toast } from "react-toastify";
// import { playErrorSound, playNotiSound,playMsgSound } from "./sounds";

const showStatusSoundToast = (
  status = false,
  text = "Something went wrong."
) => {
  if (status) {
    toast.success(text);
    // playNotiSound();
  } else {
    toast.error(text);
    // playErrorSound();
  }
};

const showErrorAlert = (text = "") => {
  toast.error(text);
  // playErrorSound();
};
const showSuccessSoundToast = (text = "") => {
  toast.success(text);
  // playNotiSound();
};

const showMessages = (text= "Message") => {
  toast.info(text)
  // playMsgSound();

}

export { showStatusSoundToast, showMessages,showErrorAlert, showSuccessSoundToast };
