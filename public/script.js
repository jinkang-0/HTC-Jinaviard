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

function initApp() {
  let urlQuerys = new URLSearchParams(window.location.search);
  let playerName = urlQuerys.get("playerName");
  
  playerName = (playerName == null) ? window.location.assign("/") : playerName;

  fetch("/story.json")
    .then(response => {
      return response.json();
    })
    .then(data => {
      storylineData = data;
      if (urlQuerys.get("ending")) {
        return endElements(urlQuerys.get("ending"));
      }
      changeElements("mainScenario");
    });

  for (let x = 0; x < randomMessages.length; x++) {
    randomMessages[x] = randomMessages[x].replace("[name]", playerName);
  }
  document.getElementById("welcomeText").innerHTML = randomMessages[Math.floor(Math.random() * 6)];
}

function changeElements(scenario) {
  if (storylineData[scenario]["type"] == "ending") {
    return endTransition(scenario);
  }
  
  let urlQuerys = new URLSearchParams(window.location.search);
  const playerName = urlQuerys.get("playerName");
  document.getElementById("playerName").innerHTML = playerName;

  let actionText = storylineData[scenario]["actionText"];
  actionText = actionText.replace("[name]", playerName);
  document.getElementById("actionText").innerHTML = actionText;
  
  let effectText = storylineData[scenario]["effectText"];
  effectText = effectText.replace("[name]", playerName);
  document.getElementById("effectText").innerHTML = effectText;
  
  let optionalText = storylineData[scenario]["optionalText"];
  if (optionalText) {
    optionalText = optionalText.replace("[name]", playerName);
    document.getElementById("optionalText").innerHTML = optionalText; 
  } else {
    document.getElementById("optionalText").innerHTML = "";
  }
  
  let questionText = storylineData[scenario]["questionText"];
  document.getElementById("questionText").innerHTML = questionText;
  
  let settingName = storylineData[scenario]["settingName"];
  document.getElementById("settingName").innerHTML = settingName;
  
  let settingDesc = storylineData[scenario]["settingDesc"];
  document.getElementById("settingDesc").innerHTML = settingDesc;
  
  // Image changing
  let imageUrl = storylineData[scenario]["imgSrc"];
  document.getElementById("settingImg").src = imageUrl;
  
  // save states
  saveState.push(scenario);
  document.cookies

  // adding/removing buttons
  document.getElementById("button1").innerHTML = storylineData[scenario]["button1"]["text"];
  document.getElementById("button1").setAttribute("onclick", `interaction(1, "${scenario}")`);
  document.getElementById("button2").innerHTML = storylineData[scenario]["button2"]["text"];
  document.getElementById("button2").setAttribute("onclick", `interaction(2, "${scenario}")`);
  if (storylineData[scenario]["button3"]) {
    document.getElementById("button3").style.display = "block";
    document.getElementById("button3").innerHTML = storylineData[scenario]["button3"]["text"];
    document.getElementById("button3").setAttribute("onclick", `interaction(3, "${scenario}")`);
  } else {
    document.getElementById("button3").style.display = "none";
    document.getElementById("button3").innerHTML = "";
    document.getElementById("button3").setAttribute("onclick", `interaction(3, "${scenario}")`);
  }

}

function interaction(choice, scenario) {
  let scenarioPath = storylineData[scenario][`button${choice}`]["path"];
  let altActionText;
  
  console.log(`${scenario} (origin) -> ${scenarioPath}`);
  changeElements(scenarioPath);
}
