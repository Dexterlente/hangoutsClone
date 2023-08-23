let form = document.getElementById('lobby__form')
document.addEventListener('DOMContentLoaded', () => {
    let form = document.getElementById('lobby__form');
let displayName = sessionStorage.getItem('display_name')
if(displayName){
    form.name.value = displayName
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    sessionStorage.setItem('display_name', e.target.name.value)

    let inviteCode = e.target.room.value
    if(!inviteCode){
        inviteCode = String(Math.floor(Math.random() * 10000))
    }
    window.location = `room.html?room=${inviteCode}`
})


let goToChatRoomButton = document.getElementById('goToChatRoomButton');
goToChatRoomButton.addEventListener('click', (e) => {
    e.preventDefault();

    let inviteCode = form.room.value;
    if (inviteCode) {
        sessionStorage.setItem('display_name', form.name.value);
        window.location = `chatroom.html?room=${inviteCode}`;
    }
});
});