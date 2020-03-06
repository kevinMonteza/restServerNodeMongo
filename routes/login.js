const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario");

var router = express.Router();



router.post("/login", (req, res) => {
  let body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Usuario) o contraseña incorrectos"
        }
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o (contraseña) incorrectos"
        }
      });
    }

    let token = jwt.sign(
      {
        usuario: usuarioDB
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );

    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    });
  });
});

//configuracion google

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture
  };
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}

router.post("/google", async (req, res) => {
  let token = req.body.idToken;
  let status = "ok";
  let message;
  let googlePayload = await verify(token);
  try {
    let user = await Usuario.findOne({ email: googlePayload.email });
    if (user) {
      if (!user.google) {
        (status = "error"),
        (message = "Debe inicar sesion con su usuario normal");
      } else {
        token = jwt.sign(
          {
            usuario: user
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
      }
    } else {
       googlePayload.google = true
       googlePayload.password = ':)'
       await  Usuario.create(googlePayload)
    }
  } catch (error) {
    console.log(error);
    status = "error";
    message = error;
  }

  res.json({
    status,
    message,
    token
  });
});

module.exports = router;
