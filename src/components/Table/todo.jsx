import React, { Component } from "react";
import { Link } from "react-router-dom";
//firebase
import { db } from "../../config/firebase";
let time = ``;
class Todo extends Component {
  state = {
    id: null,
    users: []
  };

  // ! update status function
  updateStatus = todosId => {
    let status = this.refs.status.innerText;
    console.log(status);
    db.collection("todos")
      .doc(todosId)
      .update({
        status
      })
      .then(function() {
        console.log("Document successfully updated!");
      });
  };
  componentWillUnmount() {
    window.removeEventListener("click", this.removeDropdown2);
  }
  removeDropdown2 = e => {
    if (e.target.id === "dropdown1") return false;
    this.refs.dropdown1.classList.remove("block");
  };
  componentWillUpdate() {
    var text = this.refs.status.textContent;
    if (text === "Done") {
      this.refs.status_wrapper.style.backgroundColor = "#48bb77";
    } else if (text === "Stuck") {
      this.refs.status_wrapper.children[0].innerText = "Stuck";
    } else if (text === "Working on It") {
      this.refs.status_wrapper.style.backgroundColor = "#d69e2e";
      this.updateTime();
    } else if (text === "Not Started") {
      this.refs.status_wrapper.style.backgroundColor = "royalblue";
    }
  }
  //! getting users from fatabase
  componentDidMount = () => {
    db.collection("users").onSnapshot(querySnapshot => {
      let users = [];
      querySnapshot.forEach(doc => {
        let user = doc.data();
        users.push(user);
      });
      window.addEventListener("click", this.removeDropdown2);
      this.setState({
        users,
        selectUserIndex: this.props.selectUserIndex
      });
    });
  };

  //show timer for users
  updateTime = () => {
    const timer = this.props.timer ? this.props.timer : new Date().getTime();
    setInterval(() => {
      const now = new Date().getTime();
      const remainingTime = now - timer;
      const seconds = Math.floor(remainingTime / 1000);
      const mins = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      time = `${hours < 10 ? "0" + hours : hours}:${
        remainingMins < 10 ? "0" + remainingMins : remainingMins
      }:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`;
    }, 1000);
  };
  //status dropdown
  handleDropdown = id => {
    const status_priority_dropdown = document.querySelectorAll(
      ".status_priority_wrapper > .status_priority_dropdown"
    );
    if (this.state.id !== id) {
      for (let i = 0; i < status_priority_dropdown.length; i++) {
        status_priority_dropdown[i].style.display = "none";
      }
    }
    status_priority_dropdown[id].classList.toggle("block");
    const status_priority_wrapper = document.querySelector(
      `.status_priority_wrapper${id}`
    );
    for (
      let i = 0;
      i < status_priority_dropdown[id].querySelectorAll("li").length;
      i++
    ) {
      status_priority_dropdown[id]
        .querySelectorAll("li")
        [i].addEventListener("click", e => {
          var text = e.target.innerText;
          if (text === "Done") {
            status_priority_wrapper.style.backgroundColor = "#48bb77";
            status_priority_wrapper.children[0].innerText = "Done";
          } else if (text === "Stuck") {
            status_priority_wrapper.style.backgroundColor = "#f56464";
            status_priority_wrapper.children[0].innerText = "Stuck";
          } else if (text === "Working on it") {
            status_priority_wrapper.children[0].innerText = "Working on It";
            status_priority_wrapper.style.backgroundColor = "#d69e2e";
            this.updateTime();
            const timer = this.props.timer
              ? this.props.timer
              : new Date().getTime();
            console.log(this.props.todoId);
            db.collection("todos")
              .doc(this.props.todoId)
              .update({
                timer
              })
              .then(() => {
                console.log("Document successfully updated!");
              });
          } else if (text === "Not Started") {
            status_priority_wrapper.children[0].innerText = "Not Started";
            status_priority_wrapper.style.backgroundColor = "royalblue";
          }
          if (this.props.todoId) {
            this.updateStatus(this.props.todoId);
          }
        });
    }
    this.setState({ id });
  };
  render() {
    return (
      <tr className="bg-gray-100 border-b border-gray-100">
        <td className="bg-gray-300 text-purple-600 flex border-0 border-b-1 border-purple-600 border-l-8 flex justify-between items-center chat-container">
          {this.props.title}
          <Link
            to={`/home/comments/${this.props.url}`}
            className="relative chat-wrapper cursor-pointer"
          >
            <i className="text-3xl text-gray-500 chat-icon far fa-comment"></i>
            <div className="w-4 h-4 rounded-full text-xs bg-gray-500 text-white absolute bottom-0 right-0 pointer-events-none">
              {this.props.commentsLength}
            </div>
          </Link>
        </td>
        <td style={{ position: "relative" }}>
          <div
            className="h-full bg-cover rounded-full mx-auto "
            style={{
              width: "40px",
              backgroundImage: `url(${this.props.assignedUser})`
            }}
          ></div>
        </td>
        <td
          ref="status_wrapper"
          className={`bg-green-500 text-white relative cursor-pointer status_priority_wrapper status_priority_wrapper${this.props.index}`}
          onClick={() => this.handleDropdown(this.props.index)}
        >
          <p ref="status" id="dropdown1">
            {this.props.status}
          </p>
          <ul
            ref="dropdown1"
            className="absolute top-0 mt-12 shadow-xl -ml-8 left-0 w-48 bg-white dropdown z-50 hidden status_priority_dropdown"
          >
            <li className="border-b border-gray-300 text-green-600 py-3 flex flex-start items-center px-4">
              <span
                className="w-4 h-4 rounded-full block mr-3"
                style={{ backgroundColor: `#599EFD` }}
              ></span>
              <p>Not Started</p>
            </li>
            <li className="border-b border-gray-300 text-green-600 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-green-600 block mr-3"></span>
              <p>Done</p>
            </li>
            <li className="border-b border-gray-300 text-yellow-600 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-yellow-600 block mr-3"></span>
              <p>Working on it</p>
            </li>
            <li className="border-b border-gray-300 text-red-500 py-3 flex flex-start items-center px-4">
              <span className="w-4 h-4 rounded-full bg-red-500 block mr-3"></span>
              <p>Stuck</p>
            </li>
          </ul>
        </td>
        <td>
          <span
            className="block mx-auto rounded-full h-6 w-6/7  bg-black overflow-hidden relative"
            style={{ zIndex: 0 }}
          >
            <div className="bg-purple-600 w-1/2 h-full z-10 relative"></div>
            <input
              readOnly
              ref="date"
              defaultValue={this.props.date}
              className="text-center text-white  text-sm z-20 center bg-transparent"
            />
          </span>
        </td>
        <td className="text-gray-600"> {time} </td>
      </tr>
    );
  }
}

export default Todo;
