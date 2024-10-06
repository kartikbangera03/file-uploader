require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs")
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const mainRouter = require("./router/mainRouter")
const PORT = process.env.PORT;
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const app = express();

app.use(function(req, res, next) {
  res.setHeader("Content-Security-Policy", "default-src '*'");
  return next();
});

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(passport.session());

app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username
        },
      })

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);


passport.serializeUser((user, done) => {
  done(null, user.id);

});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      },
    })
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use("/", mainRouter);

app.listen(PORT, () => console.log("app listening on port 3000!"));