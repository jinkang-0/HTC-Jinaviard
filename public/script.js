const randomMessages = [
  "Good luck, have fun, [name]. I'll be watching you...",
  "Welcome [name], we've been expecting you!",
  "Welcome [name], enjoy your stay!",
  "We're delighted to be in your prescence, sire [name].",
  "It's good to have you [name], now we just need a healer...",
  "Back in my days, [name] would still be their current age."
];

let storylineData;
let playerInventory = [];
let saveState = [];

document.getElementById("nameInput").addEventListener("keyup", (event) => {
  (event.key == "Enter") ? nameRedirect("intro") : null;
})

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
  
  let imageUrl = storylineData[scenario]["imgSrc"];
  document.getElementById("settingImg").src = imageUrl;
  
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
  
  // new logic testing
  function redAlt() {
    console.log("Has " + storylineData[scenario][`button${choice}`]["alternative"]["item"]);
    altActionText = storylineData[scenario][`button${choice}`]["alternative"]["action"];
    let altPath = storylineData[scenario][`button${choice}`]["alternative"]["path"];
    scenarioPath = altPath;
    document.getElementById("actionText").innerHTML = altActionText;
    
    (storylineData[scenario][`button${choice}`]["alternative"]["addItem"]) ? addItem("alt") : null;
  }
  
  function redRand() {
    const chance1 = storylineData[scenario][`button${choice}`]["random"][0]["chance"];
    const chance2 = storylineData[scenario][`button${choice}`]["random"][1]["chance"];
    const randNum = Math.random();

    if (randNum < chance1) {
        console.log(`${chance1 * 100}% chance of happening`);
      
        (storylineData[scenario][`button${choice}`]["random"][0]["addItem"]) ? addItem("rand", 0) : null;
      
        altActionText = storylineData[scenario][`button${choice}`]["random"][0]["action"];
        let altPath = storylineData[scenario][`button${choice}`]["random"][0]["path"];
        scenarioPath = altPath;
    } else {
        console.log(`${chance2 * 100}% chance of happening`);
      
        (storylineData[scenario][`button${choice}`]["random"][1]["addItem"]) ? addItem("rand", 1) : null;
      
        altActionText = storylineData[scenario][`button${choice}`]["random"][1]["action"];
        let altPath = storylineData[scenario][`button${choice}`]["random"][1]["path"];
        scenarioPath = altPath;
    }
  }

  if (storylineData[scenario][`button${choice}`]["alternative"] && storylineData[scenario][`button${choice}`]["random"]) {
    if (playerInventory.indexOf(storylineData[scenario][`button${choice}`]["alternative"]["item"]) != -1) {
      redAlt();
    } else {
      redRand();
    }
  } else if (storylineData[scenario][`button${choice}`]["alternative"]) {
    redAlt();
  } else if (storylineData[scenario][`button${choice}`]["random"]) {
    redRand();
  }
 
  setTimeout(() => {
    if (altActionText) {
      document.getElementById("actionText").innerHTML = altActionText;
    }
    
    // Add item to inventory
    (storylineData[scenario][`button${choice}`]["addItem"]) ? addItem() : null;
  }, 1);
  
  function addItem(altrand=null, arrIndex=null) {
    if (altrand == "alt") {      // ********************************** Alt/Random Add item
      
      playerInventory.push(storylineData[scenario][`button${choice}`]["alternative"]["addItem"]["name"]);
      let item = document.createElement("img");
      item.src = storylineData[scenario][`button${choice}`]["alternative"]["addItem"]["itemSrc"];
      item.className += "item";
      document.getElementById("inventory").appendChild(item);
      console.log(`Item '${storylineData[scenario][`button${choice}`]["alternative"]["addItem"]["name"]}' -> Player Inventory`);
      
    } else if (altrand == "random") {
      
      playerInventory.push(storylineData[scenario][`button${choice}`]["random"][arrIndex]["addItem"]["name"]);
      let item = document.createElement("img");
      item.src = storylineData[scenario][`button${choice}`]["random"][arrIndex]["addItem"]["itemSrc"];
      item.className += "item";
      document.getElementById("inventory").appendChild(item);
      console.log(`Item '${storylineData[scenario][`button${choice}`]["random"][arrIndex]["addItem"]["name"]}' -> Player Inventory`);
      
    } else if (storylineData[scenario][`button${choice}`]["addItem"]) {
      
      playerInventory.push(storylineData[scenario][`button${choice}`]["addItem"]["name"]);
      let item = document.createElement("img");
      item.src = storylineData[scenario][`button${choice}`]["addItem"]["itemSrc"];
      item.className += "item";
      document.getElementById("inventory").appendChild(item);
      console.log(`Item '${storylineData[scenario][`button${choice}`]["addItem"]["name"]}' -> Player Inventory`);
    }
  }
  
  console.log(`${scenario} (origin) -> ${scenarioPath}`);
  changeElements(scenarioPath);
}

function endTransition(scenario) {
  let currentWindowUrl = window.location.href.replace(/play\?playerName=\w+/gi, "");;
  let urlQuerys = new URLSearchParams(window.location.search);
  let playerName = urlQuerys.get("playerName");
  
  console.log(`Game ended at '${scenario}' scenario`);
  window.location.assign(`${currentWindowUrl}ending?playerName=${playerName}&ending=${scenario}`);
}

function endElements(ending, altText=null) {
  let currentWindowUrl = window.location.href.replace(/&|playerName=\w+|ending=\w+|ending\?/gi, "");;
  let urlQuerys = new URLSearchParams(window.location.search);
  let playerName = urlQuerys.get("playerName");
  
  document.getElementById("pic").src = storylineData[ending]["imgSrc"];
  document.getElementById("welcomeText").innerHTML = storylineData[ending]["endTitle"];
  document.getElementsByClassName("text")[0].innerHTML = storylineData[ending]["effectText"];
  document.getElementById("cont").innerHTML = "Retry";
  document.getElementById("cont").onclick = () => {
    window.location.assign(`${currentWindowUrl}intro?playerName=${playerName}`)
  };
}
