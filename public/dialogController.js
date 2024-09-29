    
const dialog = document.querySelector("#uploadFileDialog");
const showButton = document.querySelector(".showUploadDialogButton");
const closeButton = document.querySelector(".cancelButton");
const uploadFileButton = document.querySelector(".uploadFileButton");

console.log("JAVASCRIPT FILE : dialogController Loaded")
// console.log(showButton)


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



const updateFolderDialog = document.querySelector("#updateFolderNameDialog");
const showUpdateFolderDialogButton = document.querySelectorAll(".showUpdateFolderDialogButton");
const closeUpdateFolderDialogButton = document.querySelector(".closeUpdateFolderDialog");


// console.log(showUpdateFolderDialogButton)
showUpdateFolderDialogButton.forEach((eachButton)=>{
    eachButton.addEventListener("click", () => {
        console.log("Upload Div Clicked")
        updateFolderDialog.showModal();
    });
})



// showUpdateFolderDialogButton.addEventListener("click", () => {
//     console.log("Upload Div Clicked")
//     updateFolderDialog.showModal();
// });

closeUpdateFolderDialogButton.addEventListener("click", () => {
    updateFolderDialog.close();
});



const updateFileNameDialog = document.querySelector("#updateFileNameDialog");
const showUpdateFileNameDialogButton = document.querySelectorAll(".showUpdateFileNameDialogButton");
const closeUpdateFileNameDialogButton = document.querySelector(".closeUpdateFileNameDialog");


showUpdateFileNameDialogButton.forEach((eachButton)=>{
    eachButton.addEventListener("click", () => {
        console.log("Upload Div Clicked")
        updateFileNameDialog.showModal();
    });
})


// showUpdateFileNameDialogButton.addEventListener("click", () => {
//     console.log(showUpdateFileNameDialogButton.getAttribute("id"))
//     console.log("File Upload Div Clicked"+updateFileNameDialog.id)
//     updateFileNameDialog.showModal();
// });

closeUpdateFileNameDialogButton.addEventListener("click", () => {
    updateFileNameDialog.close();
});


