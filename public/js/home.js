const nameSpan = document.querySelector("span")

let id;
window.addEventListener("load", async () => {
    try {

        const person = await axios.get("/api/v1/user")
        nameSpan.innerHTML = person.data.username
        console.log(person)
        id = person.data.username
        const profileLink = document.querySelector('.profile-link');
        profileLink.href = `/${id}`;
    }
    catch (err) {
        console.log(err
        )
    }
})