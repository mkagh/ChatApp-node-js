const aside = document.querySelector('aside');
const asideDivs = aside.querySelectorAll('div:not(.logo):not(#logout)');
const aboutFriends = document.querySelectorAll('.aboutFriends>div');
const myFriends = document.querySelector('.myFriends');
const recievedRequests = document.querySelector('.recivedRequests');
const sentRequests = document.querySelector('.sentRequests');
const chatbox = document.querySelector('.chatbox');
const logout = document.querySelector('#logout');
let participants = []
let everyChat = []
let inputColor = true;

asideDivs.forEach((div) => {
    const icon = div.querySelector("i")
    icon.style.position = "relative"
    div.addEventListener("click", (e) => {
        const whichID = e.target.id
        aboutFriends.forEach((item) => {
            if (item.className === whichID) {
                item.style.display = "block"
            }
            else {
                item.style.display = "none"
            }
        })
    })
})

const search = document.querySelector(".search-bar input")
const searchedusers = document.querySelector(".searchedFriends")
let user;
let allusers;

window.addEventListener("load", async () => {
    try {
        user = await axios.get("/api/v1/user")
        allusers = await axios.get("/api/v1/allusers")
        allusers = allusers.data.allUsers
        const recievedrequests = user.data.recieved
        const friendsList = user.data.friends
        const sentrequests = user.data.sent
        sentRequests.innerHTML = sentrequests.map((request) => {
            return `  <div class="sent">
            <p>${request}</p>
            </div>`
        }).join(" ")
        recievedRequests.innerHTML = recievedrequests.map((request) => {
            return `  <div class="request">
            <p>${request}</p>
            <div class="decider">
            <button onclick=acceptFriend(this)>accept</button>
             <button class="reject-button" onclick=rejectFriend(this)>reject</button>
            </div>
        </div>`
        }).join(" ")

        myFriends.innerHTML = friendsList.map((friend) => {
            return `<div class="friend">
                 <p>${friend}</p>
                 <button onclick=openChat(this)>chat</button>
                 </div>`
        }).join(" ")

        const index = allusers.findIndex(obj => obj.username == user.data.username);
        allusers.splice(index, 1)
    }
    catch (err) {
        console.log(err)
    }
})

search.addEventListener("input", () => {
    let searchedUsers = allusers.filter((oneuser) => {
        return oneuser.username.includes(search.value) && !user.data.friends.includes(oneuser.username) && !user.data.recieved.includes(oneuser.username) && !user.data.sent.includes(oneuser.username)
    })
    if (search.value === '') {
        searchedUsers = []
    }
    searchedusers.innerHTML = searchedUsers.map((user) => {
        return `<div>
          <p>${user.username} </p><button onclick=addFriend(this)> add</button>
          </div>
          `
    }).join(" ")
})

const addFriend = async (element) => {
    try {
        const div = element.closest("div")
        const username = div.querySelector("p").innerText
        element.disabled = true
        const userToGetRequset = await axios.get(`/api/v1/${username}`)
        if (userToGetRequset.data.msg) {
            div.innerHTML = userToGetRequset.data.msg
        }
        const usersUsername = user.data.username
        let requests = userToGetRequset.data.recieved
        const recieved = requests.concat(usersUsername);
        let userToChangeSent = await axios.get(`/api/v1/${user.data.username}`)
        let sents = userToChangeSent.data.sent
        let sent = sents
        sent.push(username);
        const friendRecieves = await axios.patch(`/api/v1/${username}`, { recieved })
        const friendsYouSentTo = await axios.patch(`/api/v1/${user.data.username}`, { sent })
        const index = allusers.findIndex(obj => obj.username == username);
        allusers.splice(index, 1)
        div.remove()
    }
    catch (err) {
        console.log(err)
    }
}

const acceptFriend = async (element) => {
    const closestDiv = element.closest("div")
    const targetedDiv = closestDiv.parentElement
    const userWhoSent = targetedDiv.querySelector("p").innerText
    let username = user.data.username
    element.disabled = true

    const mainUser = await axios.get(`/api/v1/${username}`)
    let friendsArrayFromDB = mainUser.data.friends
    let recievedArrayFromDB = mainUser.data.recieved
    let friends = friendsArrayFromDB.concat(userWhoSent);
    const recieved = recievedArrayFromDB.filter((item) => {
        return item !== userWhoSent
    });

    const updateFriends = await axios.patch(`/api/v1/${username}`, { friends, recieved })
    username = userWhoSent

    const friend = await axios.get(`/api/v1/${username}`)
    let friendArr = friend.data.friends
    friends = friendArr.concat(user.data.username)
    let sentArr = friend.data.sent
    const sent = sentArr.filter((item) => {
        return item !== user.data.username
    });

    const updateFriendsFriends = await axios.patch(`/api/v1/${username}`, { friends, sent })
}

const openChat = async (element) => {
    participants = []
    const closestDiv = element.closest("div")
    const friendToChatWith = closestDiv.querySelector("p").innerText
    chatbox.innerHTML = `
        <div class="chatingFriend">
          <p>${friendToChatWith}</p>
        </div>
        <div style="flex-grow: 1"  class="messages-box">
        </div>
        <div class="typeMessage">
              <input class="${inputColor ? 'white' : 'black'}"  placeholder="type message here..." type="text">
            <div class="send-button">
               <button onclick=sendMessage(this)>send</button>
            </div>
        </div>`
    participants.push(friendToChatWith)
    participants.push(user.data.username)
    participants.sort()

    try {
        const getAllChats = await axios.get("/api/v1/chats")
        let allParticipantsInDb = []
        if (getAllChats.data) {
            everyChat = getAllChats.data.allChats
            everyChat.forEach((chat) => {
                return allParticipantsInDb.push(chat.participants)
            })
        }
        let findingMatch = allParticipantsInDb.find(subArray => {
            return JSON.stringify(subArray) === JSON.stringify(participants);
        })
        const isThereMatch = Boolean(findingMatch)
        if (!isThereMatch) {
            const populateChats = axios.post("/api/v1/chats", { participants })
        }
        const getOneChat = await axios.get(`/api/v1/chat?participants=${participants}`)
        const oneChat = getOneChat.data.oneChat.chat
        const addChat = oneChat.map((item) => {
            const itemName = item.slice(0, user.data.username.length)
            const justMessage = item.slice(user.data.username.length + 2)//+2 is to remove :
            return `<div class="${itemName == user.data.username ? 'red' : 'blue'}" ><p>${justMessage}</p><br></div>`
        }).join(" ")
        const messagesBox = document.querySelector('.messages-box');
        messagesBox.innerHTML = addChat
    }
    catch (err) {
        console.log(err)
    }
}

const sendMessage = async (element) => {
    element.disabled = true
    try {
        const secondClosestDiv = element.closest("div").parentElement
        const message = secondClosestDiv.querySelector("input").value
        const getOneChat = await axios.get(`/api/v1/chat?participants=${participants}`)
        let chat = getOneChat.data.oneChat.chat
        if (message !== "") {
            let myMessage = `${user.data.username} : ${message}`
            chat.push(myMessage)
            const addMessageToChat = await axios.patch("/api/v1/chat", { participants, chat })
            const getOneChatAgain = await axios.get(`/api/v1/chat?participants=${participants}`)
            const chatAgain = getOneChatAgain.data.oneChat.chat
            const addChat = chatAgain.map((item) => {
                const itemName = item.slice(0, user.data.username.length)
                return `<div class="${itemName == user.data.username ? 'red' : 'blue'}" ><p>${item}</p><br></div>`
            }).join(" ")
            const messagesBox = document.querySelector('.messages-box');
            messagesBox.innerHTML = addChat
        }
        element.disabled = false
    } catch (err) {
        console.log(err)
    }
}

const rejectFriend = async (element) => {
    const secondClosestDiv = element.closest("div").parentElement
    const friendWhoSent = secondClosestDiv.querySelector("p").innerText
    const username = user.data.username
    element.disabled = true

    const getToPatch = await axios.get(`/api/v1/${username}`)
    let recievedArrayFromDB = getToPatch.data.recieved
    const recieved = recievedArrayFromDB.filter((item) => {
        return item !== friendWhoSent
    });

    const updateRecievedReqs = await axios.patch(`/api/v1/${username}`, { recieved })
    
    const getFriendwhoSent = await axios.get(`/api/v1/${friendWhoSent}`)

    let sentArrayFromDB = getFriendwhoSent.data.sent
    const sent = sentArrayFromDB.filter((item) => {
        return item !== user.data.username
    });
    const updateSents = await axios.patch(`/api/v1/${friendWhoSent}`, { sent })
}

const darkMode = document.querySelector(".dark")
const lightMode = document.querySelector(".light")
const allAboutFriends = document.querySelector(".aboutFriends")

darkMode.addEventListener("click", () => {
    const typeMessageInput = document.querySelector(".typeMessage input")
    chatbox.style.background = "#444654"
    allAboutFriends.style.background = "black"
    inputColor = false
    typeMessageInput.style.background = "#444654"
    typeMessageInput.style.color = "white"
})

lightMode.addEventListener("click", () => {
    const typeMessageInput = document.querySelector(".typeMessage input")
    chatbox.style.background = "white"
    allAboutFriends.style.background = "#f9f9f9"
    inputColor = true
    typeMessageInput.style.background = "white"
    typeMessageInput.style.color = "#444654"
})

