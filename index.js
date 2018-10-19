document.addEventListener("DOMContentLoaded", async () => {
  const sideBar = document.getElementsByClassName('w3-sidebar')[0]
  const noteBodyDiv = document.getElementById("note")
  const addNoteButton = document.querySelector('#add-note')
  addNoteButton.addEventListener("click", showNote)
  const userObj = await fetchUser()
  const userId = userObj.id
  const notes = await fetchNotes()
  pasteNotesOnSideBar(notes)

// Allow users to create, edit and delete notes.

  function fetchUser(){
    return fetch("http://localhost:3000/api/v1/users")
    .then(res => res.json())
    .then(users => users[0])
  }

  function fetchNotes(){
    return fetch("http://localhost:3000/api/v1/notes")
    .then(res => res.json())
  }

  function fetchNote(id){
    return fetch(`http://localhost:3000/api/v1/notes/${id}`)
    .then(res => res.json())
  }

  function pasteNotesOnSideBar(notes){
    notes.forEach(note => pasteNoteToSideBar(note))
  }

  function pasteNoteToSideBar(note){
    let a = document.createElement("a")
    a.className = "w3-bar-item w3-button"
    a.setAttribute("data-id", `${note.id}`)
    a.innerHTML = `${note.title} <i id="delete" class="fas fa-minus" style="color: #8F9397;"></i>`
    a.addEventListener("click", showNote)
    sideBar.append(a)
  }

  async function showNote(event){
    if (event.target.id === "delete"){
      // deleteNote()
      console.log(event.target)
    }
    const note = event.target.id === "add-note" ? await addANewNote() : await fetchNote(event.target.getAttribute("data-id"))
    pasteNoteToSideBar(note)
    const h3 = document.createElement('h3')
    h3.contentEditable = true;
    h3.addEventListener("blur", editNote)
    h3.innerText = note.title
    const p = document.createElement('p')
    p.contentEditable = true
    p.addEventListener("blur", editNote)
    p.innerText = note.body
    noteBodyDiv.innerHTML = ''
    noteBodyDiv.setAttribute("data-id", `${note.id}`)
    noteBodyDiv.append(h3, p)
  }

  async function editNote(event){
    const tagName = event.target.tagName
    const keyName = tagName === "H3" ? "title" : "body"
    const id = event.target.parentElement.getAttribute("data-id")
    console.log("parent", event.target.parentElement)
    const keyValToPatch = {[keyName]: event.target.innerText}
    const patchedNote = await patchNote(id, keyValToPatch)
    const noteTitle = sideBar.querySelector(`[data-id="${id}"]`)
    noteTitle.innerText = patchedNote.title
  }

  function patchNote(id, keyValToPatch){
    return fetch(`http://localhost:3000/api/v1/notes/${id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(keyValToPatch)
    })
    .then(res => res.json())
    .catch(console.error)
  }

  function addANewNote(){
    return fetch("http://localhost:3000/api/v1/notes", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        title: "Title",
        body: "Start your note...",
        user_id: userId
      })
    })
    .then(res => res.json())
  }

})

