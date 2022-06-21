import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import ImageUpload from "./ImageUpload";
function App() {
  // IT WORKS AS AN VARIABLE WHERE POSTS IS THE VAR NAME AND SETPOSTS IS THE VAR WHICH IS USED TO MODIFY IT AND ALL THESE ARE THE OBJECT OF THE ARRAY
  const [posts, setPosts] = useState([
    // NOW ITS NOT NEEDED BECAUSE WE HAVE USED MAP FUNCTION AND ACCESSED THIS DATA FROM THE DATABASE
    // {
    //   username: "neelamm",
    //   caption: "React😎",
    //   imageURL:
    //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRzUy_h6LlV3-A9GLg-1AqzrY_YDZWuU0OgqszTyfPG6zK5sjJ8jO1fMMHYHPhr42NPtk&usqp=CAU",
    // },
    // {
    //   username: "mohit",
    //   caption: "Yes this works😁",
    //   imageURL:
    //     "https://media.istockphoto.com/photos/renewable-energy-and-sustainable-development-picture-id1186330948?k=20&m=1186330948&s=612x612&w=0&h=5aNPCcQ8FcZraX44PEhb2mqcHkow2xMITJMHdh28xNg=",
    // },
  ]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    // any singlew time any change happens u login or logout this code will fire
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in...
        console.log(authUser);
        // if user loggedin and refreshed then  also he will be still login because
        // this uses cookie tracking nd then it would send a piece of code to state
        setUser(authUser);

        // if user has any displayname then dont update there name
        if (authUser.displayName) {
          //dont update username
          // but if there is a new user created then go and update their profile and add it to their fairbase  attribute
        } else {
          //if we just created someone..

          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        //user has logged out..
        setUser(null);
      }
    });
    return () => {
      //if user refresh again perform some cleanup actions before u refire the useeffct
      // detatch the listener so that no duplicate will be there and then refire the useeffect
      unsubscribe();
    };
    // we r using user to change username .anytime they change the code will fire
  }, [user, username]);

  // useeffect = runs a piece  of code based on a specific condition

  // run everytime whenever post variable changes
  useEffect(() => {
    //this is where the code runs
    // snapshot is the very powerful listener .every single time the database changes in the collection
    // every single time the document gets added changed modified inside the posts.it will take the snapshot of exactly what that collection looks like
    // so we r gonna get an update of all the documents if somebody adds a document or add the post

    db.collection("posts").onSnapshot((snapshot) => {
      // every time a new post is added ,this code fires
      // from that snapshot go get the docs and map through every single one get each doc[doc here means the data which is there in the database in the firebase .we have to access eqch and every doc so we will use map function]
      // [map is like a for loop which tells to iterate through each element ie doc and get access to it right here ][doc.data will give all the properties of the document ie username caption imageurl]
      // [as soon as the component loads that will be loaded ]
      setPosts(
        snapshot.docs.map((doc) => ({
          // object is created
          // id is there created inthe firebase database
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const signUp = (event) => {
    // this will cause from refreshing the page
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    // we want that module to close once we sign in
    setOpenSignIn(false);
  };

  return (
    <div className="app">
      {/* if login then only show upload button or else show message  */}
      {/* optional chaining */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>SORRY ,U NEED TO LOGIN TO UPLOAD</h3>
      )}

      <Modal
        open={open}
        // EVERY SINGLE TIME U CLICK OUTSIDE THE MODAL IT SWT THE STATE  OF THE MODAL TO FALSE IE IT WILL CLOSE THE MODAL
        onClose={() => setOpen(false)}
      >
        <Box sx={style}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7BjQbqG7hXmDAtPxbP3s0Wnwc1YVDL1TFwbYnT-paqcopumimMBOPnb8y1EzhRBx11aU&usqp=CAU"
                alt="applogo"
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              SignUp
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        // EVERY SINGLE TIME U CLICK OUTSIDE THE MODAL IT SWT THE STATE  OF THE MODAL TO FALSE IE IT WILL CLOSE THE MODAL
        onClose={() => setOpenSignIn(false)}
      >
        <Box sx={style}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7BjQbqG7hXmDAtPxbP3s0Wnwc1YVDL1TFwbYnT-paqcopumimMBOPnb8y1EzhRBx11aU&usqp=CAU"
                alt="applogo"
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              SignIN
            </Button>
          </form>
        </Box>
      </Modal>

      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7BjQbqG7hXmDAtPxbP3s0Wnwc1YVDL1TFwbYnT-paqcopumimMBOPnb8y1EzhRBx11aU&usqp=CAU"
          alt="applogo"
        />
      </div>
      {/* /* IF USER IS LOGGEDIN THEN SHOW THE BUTTON AS LOGOUT */}
      {/* TO LOGOUT */}
      {user ? (
        <Button onClick={() => auth.signOut()}>LOG OUT</Button>
      ) : (
        /* all this will be shown when we r loggedin */

        <div className="app_loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>SIGN IN</Button>
          <Button onClick={() => setOpen(true)}>SIGN UP</Button>
        </div>
      )}
      {/* THIS WILL ITERATE THROUGH ALL THE OBJECT OF ARRAY POST 1 BY 1 AND GIVE IT AS OUTPUT  */}
      {/* previsously we were mapping throught our post thinking that everything was just an object bt know it is and object with keys so actually we can do it as destructure it
      at this point so we added id with post 👆 */}
      {/* PREVIOUSL WE HAVE NOT PASSED ANY KEY SO IF WE DINT PASS ANY  KEY EVERY SINGLE TIME WE ADD A NEW DOCUMENT OR FIELD OR ELEMENT TO THAT 
      A NEW POST TO THE PAGE IT WAS RERENDERING THE ENTIRE LIST BECAUSE IT WAS NOT SURE WHICH WAS CHANGED WHICH WAS EDITED OR WHIUCH 1 WAS UPDATED
       SO NOW WE ADDED A UNIQUE KEY WHICH IS THE ID OF THE POST  SO IF WE ADDED NEW POST  IT WILL REREDNER ONLY THE NEW 1 WHICH IS ADDED */}
      {posts.map(({ id, post }) => (
        <Post
          key={id}
          username={post.username}
          caption={post.caption}
          imageURL={post.imageURL}
        />
      ))}
      {/* WE HAVE USED MAP FUNCTION SO WE DONT NEED TO GIVE INPUT AGAIN AND AGAIN */}
      {/* <Post
        username="neelamm"
        caption="React😎"
        imageURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRzUy_h6LlV3-A9GLg-1AqzrY_YDZWuU0OgqszTyfPG6zK5sjJ8jO1fMMHYHPhr42NPtk&usqp=CAU"
      />
      <Post
        username="mohit"
        caption="Yes this works😁"
        imageURL="https://media.istockphoto.com/photos/renewable-energy-and-sustainable-development-picture-id1186330948?k=20&m=1186330948&s=612x612&w=0&h=5aNPCcQ8FcZraX44PEhb2mqcHkow2xMITJMHdh28xNg="
      />
      <Post
        username="ABC"
        caption="CHILLAX👍"
        imageURL="https://i.guim.co.uk/img/media/fe1e34da640c5c56ed16f76ce6f994fa9343d09d/0_174_3408_2046/master/3408.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=67773a9d419786091c958b2ad08eae5e"
      /> */}
    </div>
  );
}

export default App;
