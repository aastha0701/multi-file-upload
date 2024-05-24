const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const zip = require('express-zip');
const archiver = require('archiver');
const FtpSrv = require('ftp-srv');

const app = express();
const port = 3000;
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const ftpServer = new FtpSrv({ url: 'ftp://192.168.1.2:21', pasv_url: '192.168.1.2' });

ftpServer.on('login', (data, resolve, reject) => {
  // Add authentication logic here if needed
  resolve({
    fs: new FtpSrv.FsDriver({
      root: path.join(__dirname, 'uploads'),
      cwd: '/',
      blacklist: ['DESKTOP.INI', 'thumbs.db', '.DS_Store'],
      permissions: 'elradfmw',
    }),
  });
});

ftpServer.listen().then(() => {
  console.log('FTP Server listening on port 21');
});



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/upload', upload.array('files'), (req, res) => {
  res.redirect('/');
});

app.get('/files', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(files);
    }
  });
});

// ... (previous code)

app.get('/download', async (req, res) => {
  try {
    const files = req.query.files.split(',');
    const zipFileName = 'downloadedFiles.zip';

    const archive = archiver('zip');
    archive.on('error', (err) => {
      throw err;
    });

    res.attachment(zipFileName);
    archive.pipe(res);

    files.forEach(file => {
      const filePath = path.join(__dirname, 'uploads', file);
      archive.append(fs.createReadStream(filePath), { name: file });
    });

    archive.finalize();
  } catch (error) {
    console.error('Error downloading files:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/download/all', async (req, res) => {
  try {
    const files = fs.readdirSync('uploads/');
    const zipFileName = 'allFiles.zip';

    const archive = archiver('zip');
    archive.on('error', (err) => {
      throw err;
    });

    res.attachment(zipFileName);
    archive.pipe(res);

    files.forEach(file => {
      const filePath = path.join(__dirname, 'uploads', file);
      archive.append(fs.createReadStream(filePath), { name: file });
    });

    archive.finalize();
  } catch (error) {
    console.error('Error downloading all files:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// ... (rest of the code)


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
