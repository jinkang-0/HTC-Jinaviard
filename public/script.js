// Random welcome messages on /intro.html
const randomMessages = [
  "Good luck, have fun, [name]. I'll be watching you...",
  "Welcome [name], we've been expecting you!",
  "Welcome [name], enjoy your stay!",
  "We're delighted to be in your prescence, sire [name].",
  "It's good to have you [name], now we just need a healer...",
  "Back in my days, [name] would still be their current age."
];

let storylineData;

// Listen for "Enter" key on name input field
document.getElementById("nameInput").addEventListener("keyup", (event) => {
  (event.key == "Enter") ? nameRedirect("intro") : null;
})

// Redirect user to /intro.html or /play.html given sufficient name
function nameRedirect(redirType) {  
  if (redirType == "intro") {
    let errorPlaceholder = document.getElementById("errorPlaceholder");
    let currentWindowUrl = window.location.href.replace(/#start$|\?/gi, "");
    let playerName = document.getElementById("nameInput").value.trim();
    
    if (!playerName) {
      errorPlaceholder.innerHTML = "Invalid name! (Name is blank)";
    } else if (playerName.length > 14) {
      errorPlaceholder.innerHTML = "Invalid name! (Name exceeds 14 characters)";
    } else if (playerName.match(/[|&;$%@"<>()+,!?#^*]/g)) {
      errorPlaceholder.innerHTML = "Invalid name! (Invalid characters)";
    } else {
      errorPlaceholder.innerHTML = "";
      window.location.assign(`${currentWindowUrl}intro?playerName=${playerName}`);
    }
  } else if (redirType == "play") {
    let urlQuerys = new URLSearchParams(window.location.search);
    let currentWindowUrl = window.location.href.replace(/intro|\?|playerName=\w+/gi, "");
    let playerName = urlQuerys.get("playerName");
    
    window.location.assign(`${currentWindowUrl}play?playerName=${playerName}`);
  }
}
