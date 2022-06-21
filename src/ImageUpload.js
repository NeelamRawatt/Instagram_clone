import { Button } from "@mui/material";
import React, { useState } from "react";
import { storage, db } from "./firebase";
import firebase from "firebase/compat/app";
function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setprogress] = useState(0);
  //  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    // when u will seelect file if multiple file are selected then select the first file
    // and setimage in state to that
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // access a storage in firebase get a reference to this file/photo.we r creaqting new folder
    // named as images and storing everything in it nd image name is the name of the image that we selected
    // .put(image) means puting that image in it
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setprogress(progress);
      },
      (error) => {
        // error function....
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function.......
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });

            // once u done set all to null
            setprogress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div>
      <progress value={progress} max="100" />
      {/* grabs the latest text and it just posp inside the caption */}
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(event) => setCaption(event.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>UPLOAD</Button>
    </div>
  );
}

export default ImageUpload;
