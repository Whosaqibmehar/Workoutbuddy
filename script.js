const auth = firebase.auth();
const db = firebase.firestore();

function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => showDashboard())
    .catch(e => document.getElementById("authError").innerText = e.message);
}

function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => showDashboard())
    .catch(e => document.getElementById("authError").innerText = e.message);
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById("auth").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
  });
}

auth.onAuthStateChanged(user => {
  if (user) showDashboard();
});

function showDashboard() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

function loadWorkout() {
  const list = document.getElementById("workoutList");
  list.innerHTML = "";
  ["Pushups", "Squats", "Plank", "Jumping Jacks"].forEach(exercise => {
    const li = document.createElement("li");
    li.innerText = exercise;
    list.appendChild(li);
  });
}

function askAI() {
  const input = document.getElementById("userInput").value;
  if (!input) return;

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer ",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }]
    })
  })
  .then(res => res.json())
  .then(data => {
    const reply = data.choices[0].message.content;
    const area = document.getElementById("chatArea");
    area.innerHTML += `<p><b>You:</b> ${input}</p>`;
    area.innerHTML += `<p><b>AI:</b> ${reply}</p>`;
    document.getElementById("userInput").value = "";
  });
}
