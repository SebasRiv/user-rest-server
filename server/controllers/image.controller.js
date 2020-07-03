const fs = require('fs');
const path = require('path');

const User = require('../models/user');

const imageController = {};

imageController.upload = async (req, res) => {
    const validTypes = ['users'];
    const validExtensions = ['jpg', 'png', 'gif', 'jpeg'];

    const millisecons = new Date().getMilliseconds();

    try {
        if (!req.files) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No file selected'
                }
            });
        }

        const { id, type } = req.params;
        const file = req.files.file;
        const cutName = file.name.split('.');
        const extension = cutName[cutName.length - 1];

        if (validTypes.indexOf(type) < 0) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `The valid type are: ${validTypes.join(', ')}`,
                    type
                }
            });
        }

        if (validExtensions.indexOf(extension) < 0) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `The valid extensions are: ${validExtensions.join(', ')}`,
                    extension
                }
            });
        }

        const fileName = `${id}-${millisecons}.${extension}`;

        switch (type) {
            case 'users':
                saveFile(file, type, fileName);
                await userImage(id, res, fileName);
                break;

            default:
                break;
        }

    } catch (error) {
        const { id, type } = req.params;
        const file = req.files.file;
        const cutName = file.name.split('.');
        const extension = cutName[cutName.length - 1];

        const fileName = `${id}-${millisecons}.${extension}`;

        if (error.kind === 'ObjectId') {
            eraseImage(fileName, type);

            return res.status(400).json({
                ok: false,
                error: {
                    message: 'The user doesn\'t exist'
                }
            });
        } else {
            return res.status(500).json({
                ok: false,
                error
            });
        }
    }
}

imageController.getImage = async (req, res) => {
    const { type, img } = req.params;

    const pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const noImagePath = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(noImagePath);
    }
}

const saveFile = (file, type, fileName) => {
    file.mv(`uploads/${type}/${fileName}`);
}

const userImage = async (id, res, fileName) => {
    const user = await User.findById(id);

    if (!user) {
        eraseImage(fileName, 'users');

        return res.status(400).json({
            ok: false,
            error: {
                message: 'The user doesn\'t exist'
            }
        });
    }

    eraseImage(user.avatar, 'users');

    user.avatar = fileName;

    const userUpdated = await user.save();

    res.status(200).json({
        ok: true,
        user: userUpdated,
        avatar: fileName
    });
}

const eraseImage = (fileName, type) => {
    const pathImage = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);

    fs.access(pathImage, fs.constants.F_OK, (err) => {
        // console.log(`${fileName} ${err ? 'does not exist' : 'exists'}`);
        if (!err) {
            fs.unlink(pathImage, (err) => {
                if (err) throw err;
            });
        }
    });
}

module.exports = imageController;