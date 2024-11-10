const express = require('express')
const path = require('path');
const multer = require('multer')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connectDB = require('./connect');
connectDB();
const mushroomDb = require('./model');
const { default: axios } = require('axios');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.render('pages/index')
})

const FormData = require('form-data');
const fs = require('fs');

app.post('/uploads', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            console.log('No file uploaded');
            res.render('pages/index')
            return res.status(400).send({ message: 'No file uploaded' });
        }
        const formData = new FormData();
        const filePath = path.join(__dirname, file.path);
        formData.append('hello', fs.createReadStream(filePath));

        res.redirect('/loading');

        try {
            const response = await axios.post('https://7217-18-233-224-152.ngrok-free.app/predict/', formData)
            const demo = response.data.predicted_class
            // const demo = "undefined"
            console.log('Response:' + demo)
            if (demo === "undefined") {
                global.processingResult = "undefined";
                console.log(global.processingResult)
            } else {
                try {
                    let result = await mushroomDb.findOne({ sciName: demo })
                    if (result !== null) {
                        result.file = file.filename

                        global.processingResult = result;
                        console.log(global.processingResult)
                    } else {
                        global.processingResult = "undefined";
                    }
                } catch (error) {
                    throw error
                }
            }

        } catch (err) {
            throw err
        }

    } catch (e) {
        console.error(e.message);
    }
});

app.get('/check-status', (req, res) => {
    if (global.processingResult) {
        return res.send({ completed: true });
    }
    res.send({ completed: false });
});

app.get('/result', (req, res) => {
    if (global.processingResult && global.processingResult != "undefined") {
        res.render('pages/result', {
            result: global.processingResult,
        });

        global.processingResult = null;
    } else if (global.processingResult && global.processingResult === "undefined") {
        res.render('components/badRequest');
    } else {
        res.redirect('/');
    }
});

app.get('/loading', (req, res) => {
    res.render('pages/loading');
});

app.delete('/delete-image/:id', async (req, res) => {
    try {
        const imageId = req.params.id;

        const filePath = path.join(__dirname, '/uploads/', imageId);
        // console.log(filePath);
        await fs.unlink(filePath, (err) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการลบไฟล์:', err);
            }
            let imageCache = [];
            const updateImageCache = (filePath) => {
                const index = imageCache.indexOf(filePath);
                if (index > -1) {
                    imageCache.splice(index, 1);
                }
            };
            updateImageCache(filePath);
        });

    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
    }
});


app.listen(port, () => {
    console.log(`listening on port`, port)
});