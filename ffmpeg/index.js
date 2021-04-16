const fileUpload = require("express-fileupload");
const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();
const pOrT = process.env.PORT || 6969;

const { exec } = require("child_process");
app.use(fileUpload());
app.use(cors());
app.use(express.json());

app.use(express.static("./video"));

// Uploading the files
app.post("/home", (req, res) => {
  console.log(req.body);
  if (req.files === null) {
    return res.json({ msg: "Ohohoooo, please upload a file dudeeeee...." });
  }

  // //Create new HLS and Uploader folder

  // //Deleting existin folders
  // if (`${__dirname}/video/uploaded/HSL`)
  //   fs.remove(`${__dirname}/video/uploaded/HSL`, (err) => {
  //     console.error(err);
  //   });
  // if (`${__dirname}/video/uploaded`)
  //   fs.remove(`${__dirname}/video/uploaded`, (err) => {
  //     console.error(err);
  //   });
  // //Creating new clean folders

  // fs.mkdir(`${__dirname}/video/uploaded`);

  const file = req.files.file;
  fs.remove(`${__dirname}/video/HLS`, () => {
    fs.mkdirSync(`${__dirname}/video/HLS`);
    fs.remove(`${__dirname}/video/uploaded`, () => {
      fs.mkdirSync(`${__dirname}/video/uploaded`);

      file.mv(`${__dirname}/video/uploaded/${file.name}`, (error) => {
        if (error) {
          console.error(err);
          return res.send(err);
        }

        exec(
          `cd video && cd HLS && ffmpeg -i ${__dirname}/video/uploaded/${file.name} -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${file.name}.m3u8`,
          (error, stdout, stderr) => {
            if (error) {
              console.log(
                `What the heck man !? Can't do anythign correct ? : ${error}`
              );
              return;
            } else if (stderr) {
              console.log(`It's hopeless bro, Imma just give up : ${stderr}`);
            } else {
              console.log(stdout);
            }
          }
        );

        // //Delete HLS AND Uploaded folder
        // if (fs.existsSync(`${__dirname}/video/uploaded`)) {
        //   fs.remove("uploaded");
        // }

        // if (fs.existsSync(`${__dirname}/video/HLS`)) {
        //   fs.remove("HLS");
        // }

        fs.readdirSync(`${__dirname}/video/HLS`);

        res.json({ fileName: file.name, filePath: `/uploaded/${file.name}` });
      });
    });
  });

  app.get("/home", (req, res) => {
    fs.readdir(
      `${__dirname}/video/HLS`,
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(files);
          res.send(
            files.map((file) => {
              return {
                fileName: file.name,
                isFolder: file.isDirectory(),
              };
            })
          );
          //What is isSocket() ?
        }
      }
    );
  });
});

app.listen(pOrT, () => {
  console.log(`PORT is activated and living a happy lyf on ${pOrT}`);
});
