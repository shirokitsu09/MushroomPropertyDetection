const express = require('express')
const path = require('path');
const multer = require('multer')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

dummy = {
    
}

// ตั้งค่าที่เก็บไฟล์อัปโหลด
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // บันทึกไฟล์ในโฟลเดอร์ 'uploads'
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname); // ชื่อไฟล์ = เวลา + ชื่อไฟล์เดิม
//     }
// });

// const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/result', (req, res) => {
    res.render('pages/result')
})

app.post('/uploads', (req, res) => {
    data = req.file
    console.log(data)
})

// app.post('/upload', upload.single('image'), (req, res) => {
//     const imageName = req.file.filename;  // เก็บชื่อไฟล์ที่อัปโหลด
//     res.render('result', { imageName: imageName });  // ส่งชื่อไฟล์ไปแสดงในหน้า result.ejs
// });

app.listen(port, () => {
    console.log(`listening on port`, port)
});