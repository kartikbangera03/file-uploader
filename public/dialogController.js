    
const dialog = document.querySelector("dialog");
const showButton = document.querySelector(".showUploadDialogButton");
const closeButton = document.querySelector(".cancelButton");
const uploadFileButton = document.querySelector(".uploadFileButton");
showButton.addEventListener("click", () => {
    console.log("Upload Div Clicked")
    dialog.showModal();
});

closeButton.addEventListener("click", () => {
    dialog.close();
});

uploadFileButton.addEventListener("click", () => {
    console.log("clicked...upload");
});