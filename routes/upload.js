const express = require('express');
const fileUpload = require('express-fileupload');

var router = express.Router();


router.use(fileUpload());
router.post('/upload', async (req, res) => {
    console.log(req.files);
    let status ='ok'
    let message 
    let types = ['jpeg', 'png', 'docx', 'pdf']  
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                status:"error",
                message:"no se selecciono un archivo"
            });
          } 
        let archivo = req.files.archivo;
        let type = archivo.name.split('.')
        let extension = type[type.length - 1]
        if( !types.includes(extension) ){
            return res.status(400).json({
                status:'error',
                message:"Extension no permitida, extensiones validas " + types.join(', ')
            })
        }
        message = await archivo.mv(`storage/${type[0]}-${Date.now()}.${type[type.length - 1]}`)
        
    } catch (error) {
        console.log(error);
        message = error
        status = 'error'
    }
    
      res.json({
          status,
          message
      });
    });

module.exports = router
