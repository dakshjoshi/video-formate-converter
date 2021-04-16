import { useState, useEffect } from "react";
import "./App.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const localHost = `http://localhost:6969/home`;
  const server = `https://video-format-converter.herokuapp.com/home`;
  const [video, setVideo] = useState("");
  const [videoname, setVideoname] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message4u, setMessage4u] = useState("");

  const onChange = (e) => {
    setVideo(e.target.files[0]);
    setVideoname(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", video);

    try {
      const res = await axios.post(localHost, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage4u("File Danananananananana Uploaded DING DING DING !");
    } catch (error) {
      // if (error.response.status) {
      setMessage4u(
        "THERE'S SOMETHIGN WRONG, BUT YOU ARE NOT WRONG BRO, IT'S PROBABLY SOMETHNG IN THE CLOUDS"
      );
      // } else {
      //   setMessage4u(error.response.data.msg);
      // }
    }
  };
  const [fileList, setFileList] = useState([]);
  useEffect(async () => {
    const HLS = await axios.get(localHost);
    console.log(HLS.data);
    setFileList(HLS.data);
  }, []);

  return (
    <div className="">
      <form onSubmit={onSubmit}>
        <div className="input-group mb-3 ">
          {/* <div className="input-group-prepend">
            <span className="input-group-text">Upload</span>
          </div> */}
          <div class="custom-file">
            <input
              type="file"
              id="customFile"
              className="custom-file-input"
              id="inputGroupFile01"
              accept="video/mp4"
              onChange={onChange}
            />
            <label class="custom-file-label" for="inputGroupFile01">
              Choose file
            </label>
          </div>
        </div>
        <div className="App">
          {video && (
            <div>
              <div className="text-centre mb-2">
                <h5>{videoname}</h5>
              </div>
              <div className="d-flex m-50">
                <div>
                  <video
                    controls
                    width="70%"
                    src={URL.createObjectURL(video)}
                  ></video>
                </div>
                <div className="text-align-right">
                  <input
                    type="submit"
                    value="Upload"
                    className="btn btn-dark rounded-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      <div className="App">
        <table class="table table-dark  ">
          <thead>
            <tr>
              <th scope="col">S. No.</th>
              <th scope="col">HSL parth file</th>
            </tr>
          </thead>
          <tbody>
            {fileList.map((item, i) => {
              return (
                <tr key={i}>
                  <th>{i}</th>
                  <td>{item.fileName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
