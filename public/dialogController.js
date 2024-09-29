    // Upload File Via dialog Box
const dialog = document.querySelector("#uploadFileDialog");
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


// Update Folder Name via dialog box

const updateFolderDialog = document.querySelector("#updateFolderNameDialog");
const showUpdateFolderDialogButton = document.querySelectorAll(".showUpdateFolderDialogButton");
const closeUpdateFolderDialogButton = document.querySelector(".closeUpdateFolderDialog");

const updateFolderNameForm = document.querySelector("#updateFolderNameForm")
const updateFolderNameFormInput = document.querySelector("#updateFolderNameFormInput")

showUpdateFolderDialogButton.forEach((eachButton)=>{
    eachButton.addEventListener("click", () => {
        console.log("FOLDER DIV CLicked")
        const folderId = eachButton.getAttribute("id");
        const folderName = eachButton.getAttribute("data-name")
        console.log("FOLDER DETAILS")
        console.log(folderId)
        console.log(folderName)
        updateFolderNameForm.setAttribute("action" , "/folder/"+folderId+"/update")
        updateFolderNameFormInput.setAttribute("value" , folderName)
        updateFolderDialog.showModal();
    });
})

closeUpdateFolderDialogButton.addEventListener("click", () => {
    updateFolderDialog.close();
});


// Update file name via dialog box
const updateFileNameDialog = document.querySelector("#updateFileNameDialog");
const showUpdateFileNameDialogButton = document.querySelectorAll(".showUpdateFileNameDialogButton");
const closeUpdateFileNameDialogButton = document.querySelector(".closeUpdateFileNameDialog");

const updateFileNameForm = document.querySelector("#updateFileNameForm")
const updateFileNameFormInput = document.querySelector("#updateFileNameFormInput")

showUpdateFileNameDialogButton.forEach((eachButton)=>{
    eachButton.addEventListener("click", () => {
        const fileId = eachButton.getAttribute("id");
        const filename = eachButton.getAttribute("data-name")
        console.log("FILE DETAILS")
        console.log(fileId)
        console.log(filename)
        updateFileNameForm.setAttribute("action" , "/file/"+fileId+"/update")
        updateFileNameFormInput.setAttribute("value" , filename)
        updateFileNameDialog.showModal();
    });
})

closeUpdateFileNameDialogButton.addEventListener("click", () => {
    updateFileNameDialog.close();
});

// download files 

const downloadLinksArray = document.querySelectorAll(".downloadLink")

downloadLinksArray.forEach((downloadLink)=>{
    downloadLink.addEventListener("click",()=>{
        const url =  downloadLink.getAttribute("data-href");
        const downloadName = downloadLink.getAttribute("data-name");

        fetch(url,{ method:'GET', mode:'cors'})
        .then( response =>{
            if(!response.ok){
                throw new Error("Network Response was not OK")
            }
            return response.blob(); // get file as blob 
        })
        .then(blob =>{
            const download_url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = download_url;
            a.download = downloadName; //specify file name
            document.body.appendChild(a);
            a.click() //Trigger Download
            window.URL.revokeObjectURL(download_url)
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    })
})
