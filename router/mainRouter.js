const { Router } = require("express");
const passport = require("passport");
const router = Router();

const userController = require("../controllers/userController")

router.get("/", userController.getHomepage)

router.get("/sign-up", userController.getSignUpForm);
router.post("/sign-up",userController.postInsertUser);

router.get("/log-in" , userController.getLoginForm)
router.post("/log-in" , 
    userController.postLoginForm 
    )

router.get("/log-out", userController.logOut)


const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({  storage: storage })

// router.get("/upload-file", userController.getUploadFileForm);
// router.post("/upload-file",upload.single('uploaded-file'), userController.postUploadFileForm);


router.get("/folder/:id", userController.getFolder);

router.post("/folder/:id", userController.postFolder);

router.post("/folder/:id/upload-file",upload.single('uploaded-file'),userController.postUploadFileForm);

router.post("/folder/:id/update", userController.updateFolder)

router.get("/folder/:id/delete", userController.deleteFolder)


module.exports = router;