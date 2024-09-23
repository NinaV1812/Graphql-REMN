import React from "react";
import axios from "axios";
function App() {
  const addUserHandler = () => {
    const userData = {
      email: "nina@gmail.com",
      password: "testing123",
    };
    axios({
      url: "http://localhost:5001/graphql",
      // url: "/graphql",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        query: `
            mutation {
              addUser(userInput:{
                email:"${userData.email}"
                password:"${userData.password}"
              }){
                _id
                email
                password
              }
            }
          `,
      },
    })
      .then((response) => {
        console.log("response", response);
      })
      .catch((err) => {
        console.log("err", err);
      });
    console.log("Add user");
  };
  return (
    <div className="App">
      <button onClick={addUserHandler}>ADD USER</button>
    </div>
  );
}

export default App;
