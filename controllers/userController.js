const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const passport = require("passport");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const { cloudinary_js_config } = require("../utils/cloudinary");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");
const commonFunctions = require("../public/commonFunctions");


// const multer  = require('multer')
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })

// const upload = multer({  storage: storage })


const validateSignUpForm = [

    body("userEmail")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Please Enter a valid Email")
        .isLength({ max: 255 })
        .withMessage("Email too long")
        .custom(async (value, { req }) => {
            const user = await db.getUserByEmail(req.body.userEmail)
            if (user) {
                throw new Error("A user already exists with this e-mail address")
            }
        }),

    body("password")
        .notEmpty()
        .withMessage("Password cannot be empty"),

    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm Password cannot be empty")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords do not match")

]


const validateLogInForm = [

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Please Enter the Email Address used while Signup")
        .custom(async (value, { req }) => {
            const user = await db.getUserByEmail(req.body.username)
            if (!user) {
                throw new Error("Invalid User Email")
            }
        }),

    body("password")
        .notEmpty()
        .withMessage("Password cannot be empty")
        .custom(async (value, { req }) => {
            // inject Prisma Code Instead
            const user = await db.getUserByEmail(req.body.username);
            if (!user) {
                throw new Error("Check User Email")
            }
            const match = await bcrypt.compare(req.body.password, user.password);
            if (user && !match) {
                throw new Error("Wrong Password")
            }
        })
]


// const validateCreateNewForm = [
//     body("title")
//     .trim()
//     .notEmpty()
//     .withMessage("Title cannot be empty")
//     .isLength({max:255})
//     .withMessage("Lastname too long"),

//     body("post")
//     .notEmpty()
//     .withMessage("Description cannot be empty")
// ]

// const validationJoinClubForm = [
//     body("secretCode")
//     .trim()
//     .notEmpty()
//     .withMessage("Secret Code Cannot be Empty")
// ]



exports.getSignUpForm = asyncHandler(async (req, res) => {
    res.render("sign-up-form", { user: req.user, title: "Sign Up" })
    // res.send("Sign Up Form Here");
})


exports.postInsertUser = [
    // validateSignUpForm ,

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("sign-up-form", {
                errors: errors.array()
            })
        }

        const { userEmail } = req.body;

        try {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    return next(err)
                }

                const user = await prisma.user.create({
                    data: {
                        username: userEmail,
                        password: hashedPassword,
                        folders: {
                            create: [
                                {
                                    name: "Home Folder"
                                },
                            ]
                        },
                    },
                })

                console.log(user);
                res.redirect("/log-in");
            });
        } catch (err) {
            return next(err);
        }
    })

]


exports.getHomepage = asyncHandler(async (req, res) => {
    // const messages = await db.getAllMessages();
    res.render("homepage", { user: req.user, title: "Members Only" });
})

exports.getLoginForm = asyncHandler(async (req, res) => {
    res.render("login-form", { user: req.user, title: "Log In" })
})


exports.postLoginForm = [
    // validateLogInForm ,  

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("login-form", {
                errors: errors.array(),
                user: req.user,
                title: "Log In"
            })
        } else {
            next();
        }

    }),

    passport.authenticate("local", { failureMessage: "Login failed miserably" }),

    asyncHandler(async (req, res) => {
        // From req.user we use Id to get folder via user_id of folder 
        // After getting the folder we redirect to that folder as our home drive
        console.log("Req User")
        console.log(req.user)
        const rootFolder = await prisma.folder.findMany({
            where: {
                user_id: req.user.id,
                parentFolder: null
            }
        })
        console.log(rootFolder)
        res.redirect("/folder/" + rootFolder[0].id)

    })
]


exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}


exports.getUploadFileForm = asyncHandler(async (req, res, next) => {
    res.render("upload-file-form")
})


exports.postUploadFileForm = asyncHandler(async (req, res, next) => {
    console.log("FIle Uploaded")
    console.log(req.file)
    cloudinary.uploader.upload(req.file.path, { resource_type: "auto", use_filename: true, unique_filename: false, }, async function (err, result) {
        if (err) {
            console.log(err)
            // Add Logic to Show Dialog Box that upload failed and try again
            res.redirect("/folder/" + req.params.id, { upload_failed: true })
        }

        // 1=> Create File DB Entry
        // Data Inputs : name , size(Change from int to decimal if needed) , url , parentFolderid)
        const folderId = parseInt(req.params.id)
        const newFile = await prisma.file.create({
            data: {
                name: result.original_filename,
                size: result.bytes,
                parentFolderId: folderId,
                url: result.url,
            }
        })
        console.log("UPLOADED FILE DETAILS ")
        console.log(result)
        console.log("NEW FILE ENTRY DETAILS ")
        console.log(newFile);

        // 2=> Delete File From local Storage
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("File Deleted From Local Storage Successfully        <%- include ('./functions') %>  !!");
            }
        })

        // 3=> Re-render current parent folder 
        res.redirect("/folder/" + req.params.id)
    });
})


exports.getFolder = asyncHandler(async (req, res, next) => {
    // need to get all files and folders for current folder 
    const folderId = parseInt(req.params.id)
    const folderInfo = await prisma.folder.findUnique({
        where: {
            id: folderId
        }
    })
    const subFolders = await prisma.folder.findMany({
        where: {
            parentFolderId: folderId
        }

    })

    const files = await prisma.file.findMany({
        where: {
            parentFolderId: folderId
        }
    })

    console.log("Folder")
    console.log(folderInfo)
    console.log("Sub Folders")
    console.log(subFolders)
    console.log("Files")
    console.log(files)
    res.render("userFolders", {
        user: req.user,
        folderInfo: folderInfo,
        subFolders: subFolders,
        files: files,
        commonFunctions : commonFunctions
    })
});



exports.postFolder = asyncHandler(async (req, res) => {
    // create new folder with parent folder as current folder 
    const folderId = parseInt(req.params.id)
    const newFolder = await prisma.folder.create({
        data: {
            name: "New Folder",
            parentFolderId: folderId,
            user_id: req.user.id
        }
    })

    res.redirect("/folder/" + req.params.id)
})

exports.updateFolder = asyncHandler(async(req,res)=>{
    // Update just the name
})

exports.deleteFolder = asyncHandler(async(req,res)=>{
    // Delete folder using raw psql query    
})