import { useState } from "react";
import "./App.css";

function App() {
  const [isFriendFormOpen, setIsFFOpen] = useState(false);

  //to check if a friend's select button is clicked
  const [currentFriendOpen, setCurrentFriendOpen] = useState(-1);

  function handleSetCurrentFriendOpen(id) {
    setCurrentFriendOpen(() => id);
  }

  console.log(currentFriendOpen);
  function handleFriendFormOpen() {
    setIsFFOpen((prev) => !prev);
  }

  const [FRIENDS, setFriends] = useState([
    {
      NAME: "Sarah",
      OWE: 0, //YOUR OWE TO YOUR FRIEND. If positive, you owe the friend. Otherwise, other way around.
      IMAGE: "https://i.pravatar.cc/150?img=1",
    },
    {
      NAME: "Anthony",
      OWE: 0,
      IMAGE: "https://i.pravatar.cc/150?img=2",
    },
    {
      NAME: "Mark",
      OWE: 0,
      IMAGE: "https://i.pravatar.cc/150?img=3",
    },
  ]);

  function handleAddFriend(id, name, img) {
    setFriends((friendsArray) => [
      ...friendsArray,
      {
        ID: id,
        NAME: name,
        OWE: 0,
        IMAGE: img,
      },
    ]);
  }

  function handleOwe(id, amount) {
    setFriends((friendsArray) =>
      friendsArray.map((friend, index) =>
        //if current friend is the friend youre splitting the bill will, change the owe value
        index === id ? { ...friend, OWE: friend.OWE + amount } : friend
      )
    );

    setCurrentFriendOpen(() => -1);
  }

  return (
    <div className="App">
      <div className="main-container">
        <div className="friends-container">
          <FriendsList
            friends={FRIENDS}
            onSelect={handleSetCurrentFriendOpen}
            currentFriendOpen={currentFriendOpen}
          />

          {
            //if Add friend is not yet pressed (the add friend form is not opened), just render button
            !isFriendFormOpen && (
              <div className="button-container">
                <button onClick={handleFriendFormOpen}>Add Friend</button>
              </div>
            )
          }

          {
            //if Add friend is pressed, render form instead of the Add friend button
            isFriendFormOpen && (
              <FriendForm
                onClose={handleFriendFormOpen}
                friends={FRIENDS}
                onAddFriend={handleAddFriend}
              />
            )
          }
        </div>

        {
          //if currentFriendOpen is greater than or equal 0, a select button is clicked and split bill form is rendered
          currentFriendOpen >= 0 ? (
            <div className="splitbill-container">
              <SplitBill
                friendToSplitID={currentFriendOpen}
                friends={FRIENDS}
                onSplitBill={handleOwe}
              />
            </div>
          ) : null
        }
      </div>
    </div>
  );
}

function FriendsList({ friends, onSelect, currentFriendOpen }) {
  return (
    <div className="friends-list-container">
      {friends.map((friend, key) => (
        <Friend
          id={key}
          name={friend.NAME}
          owe={friend.OWE}
          image={friend.IMAGE}
          key={friend.NAME}
          onSelect={onSelect}
          currentFriendOpen={currentFriendOpen}
        />
      ))}
    </div>
  );
}

function Friend({ id, name, owe, image, onSelect, currentFriendOpen }) {
  return (
    <>
      <div className="friend-container">
        <div className="friend-img-container">
          <img src={image} alt="friend-img" />
        </div>
        <div className="friend-desc-container">
          <span className="friend-name">{name}</span>
          {
            // if owe > 0, friend owes me
            // if owe < 0, I owe my friend
          }

          {owe > 0 ? (
            <span style={{ color: "green" }}>
              {name} owes you ${Math.abs(owe)}
            </span>
          ) : owe < 0 ? (
            <span style={{ color: "red" }}>
              You owe {name} ${Math.abs(owe)}
            </span>
          ) : (
            <span style={{ color: "black" }}>You and {name} are even</span>
          )}
        </div>

        <div className="button-container">
          {
            //Change button text to either Close or Select
            currentFriendOpen === id ? (
              <button onClick={() => onSelect(-1)}>Close</button>
            ) : (
              <button onClick={() => onSelect(id)}>Select</button>
            )
          }
        </div>
      </div>
    </>
  );
}

function FriendForm({ onClose, friends, onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [imgURL, setImgURL] = useState("");

  function handleAddFriend(e) {
    e.preventDefault();
    onAddFriend(friends.length, friendName, imgURL);
    setFriendName("");
    setImgURL("");
  }

  function handleNameInput(e) {
    setFriendName((name) => (name = e.target.value));
  }

  function handleImgInput(e) {
    setImgURL((url) => (url = e.target.value));
  }

  return (
    <div className="friends-form-container">
      <form
        className="friends-form"
        onSubmit={(e) => {
          handleAddFriend(e);
        }}
      >
        <div>
          <label>👫 Friend name </label>
          <input
            type="text"
            value={friendName || " "}
            required
            onChange={handleNameInput}
          />
        </div>
        <div>
          <label>🖼 Image URL </label>
          <input
            type="text"
            value={imgURL || " "}
            onChange={handleImgInput}
            required
          />
        </div>
        <div>
          <label></label>
          <button>Add</button>
        </div>
      </form>
      <div className="button-container">
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function SplitBill({ friendToSplitID, friends, onSplitBill }) {
  const [billValue, setBillValue] = useState();
  const [expense, setExpense] = useState();
  const [payer, setPayer] = useState("You");
  const friend = friends[friendToSplitID];
  const friendExpense = billValue - expense || 0;

  function handleSplitBill(e) {
    e.preventDefault();
    if (payer === "You") {
      //if you are the payer, the expense of the friend will be added to the OWE attribute of that friend
      onSplitBill(friendToSplitID, friendExpense);
    } else {
      //if friend is the payer, your expense will be added to the OWE attribute
      onSplitBill(friendToSplitID, expense * -1);
    }
  }

  return (
    <form className="split-bill-form">
      <h3>SPLIT A BILL WITH {friend.NAME.toUpperCase()}</h3>
      <div>
        <label>💰 Bill value </label>
        <input
          type="number"
          value={billValue}
          onChange={(e) => setBillValue(() => e.target.value)}
        ></input>
      </div>
      <div>
        <label>🧍‍♂️ Your expense </label>
        <input
          type="number"
          max={billValue}
          value={expense}
          onChange={(e) => setExpense(() => e.target.value)}
        ></input>
      </div>
      <div>
        <label>🧍🧍‍♀️ {friend.NAME}'s expense </label>
        <input type="number" readOnly value={friendExpense} disabled></input>
      </div>
      <div>
        <label>😅 Who is paying the bill? </label>
        <select value={payer} onChange={(e) => setPayer(() => e.target.value)}>
          <option value="You">You</option>
          <option value={friend.NAME}>{friend.NAME}</option>
        </select>
      </div>

      <button onClick={(e) => handleSplitBill(e)}>Split bill</button>
    </form>
  );
}
export default App;
