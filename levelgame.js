
var playerName = "";
var playerData = [];
var coinsOnPlayer = 0;
var coinsOnBank = 0;
var egg = false;
var playerMove = "";

var coinsFound = 0;
var loadMazeData = [];
var tagOnTile= "";
var mazeTotalcoin= 0;

var levelHasEgg = false;
var levelhasCoin = false;
var levelIsExit = false;
var levelIsBank = false;
var levelIsStart = false;
var nextRoomIsStart = false;

var roomData = [];
var roomNavigateOptions = [];

var welcomeTxt = "Hello there! I am Eighty8, your 3 eyed avatar helper bot! Please tell me your name, so I can help you out!";
//after username input
var helloTxt1 = "Welcome ";
var helloTxt2 = " ! I am very happy to meet you. Now that I know who you are you can go and enter one of the mazes! Please select one from the list below.";
// room chat structs
var roomTxt = "Looks like a normal room to me. ";
var roomBankTxt = "Amazing, we found a bank room, here you can put your found coins in the mazebank! ";
var roomStartTxt = "This looks like the starting point of our adventure. ";
var roomExitTxt = "We found the exit! however, remember to put your the coins are in bank before we leave. ";
// item chat structs
var itemCoinTxt1 = "We found ";
var itemCoinTxt2 = " coins! ";
var itemEggTxt = "We found the golden egg! Superb! ";
var noItemTxt = "I see no items here. ";
var tagText = "Tag number here is: ";
// other chat structs
var optionTxt = "Where should we go next ? ";

function goChatRoom(){
  // describe room first
  var scribeChat = "";
  if (levelIsStart){
    scribeChat += roomStartTxt;
  } else if (levelIsBank){
    scribeChat += roomBankTxt;
  } else if (levelIsExit){
    scribeChat += roomExitTxt;
  } else {
    scribeChat += roomTxt;
  }
  // then describe items
  if(levelhasCoin){
    scribeChat += itemCoinTxt1 + coinsFound + itemCoinTxt2;
  } else if(levelHasEgg){
    scribeChat += itemEggTxt;
  } else {
    scribeChat += noItemTxt;
  }
  //then add tag
  if (tagOnTile != ""){
    if(tagOnTile != null) {
      scribeChat += tagText + tagOnTile + " ! ";
    }
  }
  // then ask for direction
  scribeChat += optionTxt
  // then go chat.
  chat(scribeChat);
}

//typer needs
var iTime = 0;
var typerText = "";
var speed = 12; 
// the avatar will talk you throught things
function typeWriter() {
  if (iTime < typerText.length) {
    document.getElementById("talker").innerHTML += typerText.charAt(iTime);
    iTime++;
    setTimeout(typeWriter, speed);
  }
}

function chat(t){
  iTime = 0;
  document.getElementById("talker").innerHTML = "";
  typerText = t;
  typeWriter();
}

function setMazeData(s){
  loadMazeData = s;
  var i = 0;
    var mLb = "";
    for (;loadMazeData[i];) {
        console.log(i)
        mLb += "<div id='opt"+loadMazeData[i]+"' class='level-item' onclick='goToMazeLevel("+[i]+")'>"+ loadMazeData[i].name + "<div><span>Tiles: "+loadMazeData[i].totalTiles+"</span><span>Reward: "+loadMazeData[i].potentialReward+"</span></div></div>";
        i++;
    }
    levelselect = document.getElementById("level-select");
    levelselect.innerHTML = mLb;
    chat(welcomeTxt);
}

// this loads all the levels, in order to select one
function loadLevels () { 
  fetch('https://maze.hightechict.nl/api/mazes/all', { 
    method: 'get', 
    headers: new Headers({
      'Authorization':  'HTI Thanks You [60d9]', 
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }).then(response => response.json())
  .then(data => setMazeData(data));
}

function setPlayName(){
  name = document.getElementById("player-name").value;
  playerName = name;
  setPlayerName = document.getElementById("play-name");
  setPlayerName.innerHTML = playerName;
}

function setTileTag(){
  name = document.getElementById("tile-tag").value;
  tagOnTile = name;
  setTagToRoom();
}
function goTagTile(){
  fetch('https://maze.hightechict.nl/api/maze/tag?tagValue='+tagOnTile , { 
    method: 'post', 
    headers: new Headers({
      'Authorization':  'HTI Thanks You [60d9]', 
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
  }).then(response => response.json())
  .then(data => {
     chat("tag added "+ tagOnTile);
  })
}
function setTagToRoom(){
  roomtag = document.getElementById("room-tag");
  roomtag.innerHTML = tagOnTile;
}

function sayHello(){
  setPlayName();
  if(playerName === ""){
    chat("I didn't get a name from you! silly!");
    return;
  } else {
    registerPlayName();
    hideName = document.getElementById("player-name-area");
    hideName.classList.add("is-hide");
  }
}

function registerPlayName(){
  resetIntroGUI();
  fetch('https://maze.hightechict.nl/api/player/register?name='+playerName , { 
    method: 'post', 
    headers: new Headers({
      'Authorization':  'HTI Thanks You [60d9]', 
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
  }).then(response => response.json())
  .then(data => {
     loadPlayer();
  })
  .catch((error) => {
    chat('Hello '+ playerName +'! lets start a maze!');
    loadPlayer();
  });
}


function loadPlayer(){
  fetch('https://maze.hightechict.nl/api/player/', { 
    method: 'get', 
    headers: new Headers({
      'Authorization':  'HTI Thanks You [60d9]', 
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }).then(response => response.json())
  .then(data => setPlayerData(data));
}

function setPlayerData(pD){
  playerData = pD;
  console.log( playerData.name+" is in maze", playerData.isInMaze ,
    " maze " , playerData.maze ,
    " found egg: ", playerData.hasFoundEasterEgg ,
    " score in bank ", playerData.mazeScoreInBag ,
    " score in hand ", playerData.mazeScoreInHand ,
    " playerScore ", playerData.playerScore )
    //show level selection
  if(!playerData.isInMaze){
    mazeTotalcoin = 0;
    showLevel = document.getElementById("level-overview");
    showLevel.classList.remove("is-hide");
    helloscribe = helloTxt1 +" "+ playerName + " " + helloTxt2;
    goBlur();
    chat(helloscribe);
  } else {
    mazeName = document.getElementById("maze-name");
    mazeName.innerHTML = playerData.maze;
    mazeName.classList.remove("is-hide");
    continueScribe = "Oh dear! we are still stuck in " + playerData.maze + "! Lets see where we left it! " + playerName;
    lookupMazeByName(playerData.maze);
    coinsOnPlayer = playerData.mazeScoreInHand;
    coinsOnBank = playerData.mazeScoreInBag;
    egg = playerData.hasFoundEasterEgg;
    chat(continueScribe);
    setHudScores();
    setTimeout(function(){ getRoomInfo() }, 2500);
  }
}

function setHudScores(){
    // set coins hand
    ch = document.getElementById("coin-found");
    ch.innerHTML = coinsOnPlayer;
    // set coins bank
    cb = document.getElementById("bank-score");
    cb.innerHTML = coinsOnBank;
    // set egg
    ef = document.getElementById("egg-find");
    if (egg === false){
      segg= "not found";
    } else {
      segg = "found";
    }
    ef.innerHTML = segg;

}

function lookupMazeByName(pDn){
  var index = loadMazeData.findIndex(object => {
    return object.name === pDn;
  })
  mazeTotalcoin = loadMazeData[index].potentialReward;
  tc = document.getElementById("total-coin");
  var coinRemain = loadMazeData[index].potentialReward -  coinsOnBank;
  tc.innerHTML = coinRemain;
  
}

function forgetPlayer(){
  fetch('https://maze.hightechict.nl/api/player/forget', { 
    method: 'delete', 
    headers: new Headers({
      'Authorization':  'HTI Thanks You [60d9]', 
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }).then(response => response.json())
  .then(date => {
    console.log("FORGET OK");
    registerPlayName();
  }).catch((error) => {
    console.log("FORGET OK");
    registerPlayName();
  });
}

function goToMazeLevel(i){
  goEnterMaze(loadMazeData[i].name);
}

function removeIntroGUI(){
  showPlayerHUD();
  lvlGUI = document.getElementById("GUI-layer");
  lvlGUI.classList.remove("level-GUI--intro");
  hideMazes = document.getElementById("level-overview");
  hideMazes.classList.add("is-hide");
}

function goEnterMaze(maze){
  fetch('https://maze.hightechict.nl/api/mazes/enter?mazeName='+maze , { 
    method: 'post', 
    headers: new Headers({
      'Authorization':  'HTI Thanks You [60d9]', 
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
  }).then(response => response.json())
  .then(data => {
     if(data === "You have already played this maze.") {
       chat("You have already played this maze.")
     } else {
      mazeName = document.getElementById("maze-name");
      mazeName.innerHTML = maze
      mazeName.classList.remove("is-hide");
      getRoomInfo();
      nextRoomIsStart = true;
     }
  }).catch((error) => {
    chat('lets go'+ maze +'! '+ playerName);
    getRoomInfo();
  });
}

function getRoomInfo(){
  fetch('https://maze.hightechict.nl/api/maze/possibleActions', { 
    method: 'get', 
    headers: new Headers({
      'Authorization':  'HTI Thanks You [60d9]', 
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }).then(response => response.json())
  .then(data => {
    setRoomData(data);
  });
}

function setRoomData(d){
  
  roomData = d;
  roomNavigateOptions = roomData.possibleMoveActions;
  console.log(roomData.canCollectScoreHere, roomData.canExitMazeHere, roomData.currentScoreInBag , roomData.currentScoreInHand, roomData.tagOnCurrentTile)
  var rt = "";
  if (roomData.canCollectScoreHere){
    // should set bank
    rt = "bank";
  } else if (roomData.canExitMazeHere){
    // should set exit
    rt = "exit"; 
  } else if (nextRoomIsStart) {
    // should set start
    rt = "start";
    nextRoomIsStart = false;
  } else {
    // default
    rt = "room";
  }
  if(roomData.tagOnCurrentTile){
    tagOnTile = roomData.tagOnCurrentTile;
    setTagToRoom();
  } else {
    tagOnTile = "";
    setTagToRoom();
  }
  setTimeout(function(){ setRoomType(rt) } , 2500);
  removeIntroGUI();
  goBlur();
  presentRoomOptions();
}

function setRoomType(tp) {
  var btnBank = document.getElementById("bank-button");    
  var btnExit = document.getElementById("exit-button");
  if(tp === "start" || tp === "room"){
    if(tp=== "start"){
      levelIsStart = true;
    } else {
      levelIsStart = false;
    }
    // remove room subclasses
    levelIsExit = false;
    levelIsBank = false;
    resetRoom();
    btnBank.disabled = true;
    btnExit.disabled = true;
  } else if(tp === "bank"){
    // add bank subclass
    levelIsStart = false; 
    levelIsExit = false;
    levelIsBank = true;
    setBankRoom();
    btnBank.disabled = false;
    btnExit.disabled = true;
  } else if(tp === "exit"){
    // add exit subclass
    levelIsStart = false;
    levelIsExit = true;
    levelIsBank = false;
    setExitRoom();
    btnBank.disabled = true;
    btnExit.disabled = false;
  }
}

function resetRoom(){
  lvlGUI = document.getElementById("GUI-layer");
  lvlGUI.classList.remove("level-GUI--bank");
  lvlGUI.classList.remove("level-GUI--exit");
}
function setBankRoom(){
  // bank pays 1 coins when found :)
  lvlGUI = document.getElementById("GUI-layer");
  lvlGUI.classList.add("level-GUI--bank");
  lvlGUI.classList.remove("level-GUI--exit");
}
function setExitRoom(){
  // exit pays 1 coin when found :)
  lvlGUI = document.getElementById("GUI-layer");
  lvlGUI.classList.add("level-GUI--exit");
  lvlGUI.classList.remove("level-GUI--bank");
}

function setRoomItem(it){
  if(it === ""){
    resetItem();
  } else if(it === "coin"){
    setCoinItem();
  } else if(it === "egg"){
    setEggItem();
  }
}

function resetItem(){
  plc = document.getElementById("item-placeholder");
  if(plc.classList.contains("item-hold--golden-coin")){
    plc.classList.remove("item-hold--golden-coin");
  }
  if(plc.classList.contains("item-hold--golden-egg")){
    plc.classList.remove("item-hold--golden-egg");
  }
  levelhasCoin = false;
  levelhasEgg = false;
}

function setCoinItem(){
  plc = document.getElementById("item-placeholder");
  if(plc.classList.contains("item-hold--golden-coin")){
    plc.classList.remove("item-hold--golden-coin");
  }
  if(plc.classList.contains("item-hold--golden-egg")){
    plc.classList.remove("item-hold--golden-egg");
  }
  setTimeout(function(){ plc.classList.add("item-hold--golden-coin"); }, 3000);
  levelhasCoin = true;
}

function setEggItem(){
  plc = document.getElementById("item-placeholder");
  if(plc.classList.contains("item-hold--golden-coin")){
    plc.classList.remove("item-hold--golden-coin");
  }
  if(plc.classList.contains("item-hold--golden-egg")){
    plc.classList.remove("item-hold--golden-egg");
  }
  setTimeout(function(){ plc.classList.add("item-hold--golden-egg"); }, 3000);
  levelHasEgg = true;
}

function presentRoomOptions(){
  reloadHUD();
  var i = 0;
    var rOpts = "";
    for (;roomNavigateOptions[i];) {
      rOpts += "<div id='room-opt"+[i]+"' class='level-action' onclick='setDirection("+[i]+")'>"+ roomNavigateOptions[i].direction + "<span class='tag'>"+ roomNavigateOptions[i].tagOnTile +"</span><div><span class='reward'>"+ roomNavigateOptions[i].rewardOnDestination +"</span><span class='visit'>"+ makeInfoLabel("v", roomNavigateOptions[i].hasBeenVisited) +"</span><span class='bank'>"+ makeInfoLabel("b",roomNavigateOptions[i].allowsScoreCollection) +"</span><span class='start'>"+ makeInfoLabel("s",roomNavigateOptions[i].isStart) +"</span><span class='exit'>"+ makeInfoLabel("e",roomNavigateOptions[i].allowsExit) +"</span></div></div>";
        i++;
    }
    roomOpts = document.getElementById("room-options");
    roomOpts.innerHTML = rOpts;
    setTimeout(function(){ goChatRoom() }, 2500);
}

function reloadHUD(){
  tc = document.getElementById("total-coin");
  var coinRemain = mazeTotalcoin -  coinsOnBank;
  tc.innerHTML = coinRemain;
  fetch('https://maze.hightechict.nl/api/player/', { 
    method: 'get', 
    headers: new Headers({
      'Authorization':  'HTI Thanks You [60d9]', 
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }).then(response => response.json())
  .then(data => setHUDdata(data));
}

function setHUDdata(pD){
  playerData = pD;
  console.log( playerData.name+" is in maze", playerData.isInMaze ,
  " maze " , playerData.maze ,
  " found egg: ", playerData.hasFoundEasterEgg ,
  " score in bank ", playerData.mazeScoreInBag ,
  " score in hand ", playerData.mazeScoreInHand ,
  " playerScore ", playerData.playerScore )
  //show level selection
  mazeName = document.getElementById("maze-name");
  mazeName.innerHTML = playerData.maze;
  mazeName.classList.remove("is-hide");
  continueScribe = "Oh dear! we are still stuck in " + playerData.maze + "! Lets see where we left it! " + playerName;
  lookupMazeByName(playerData.maze);
  coinsOnPlayer = playerData.mazeScoreInHand;
  coinsOnBank = playerData.mazeScoreInBag;
  egg = playerData.hasFoundEasterEgg;
  if(egg){
    setRoomItem("egg");
  }
  setHudScores();
}

function makeInfoLabel(s,v){
  if(s === "v"){
    if(v) {
      ls = "visit";
    } else {
      ls = "new"
    }
  } else if(s === "e"){
    if(v) {
      ls = "exit";
    } else {
      ls = "no"
    }
  } else if (s === "s"){
    if(v) {
      ls = "start";
    } else {
      ls = "no"
    }
  } else if (s === "b"){
    if(v) {
      ls = "bank";
    } else {
      ls = "no"
    }
  } else {
    ls = s;
  }
  return ls;
}

function setDirection(d){
  chat("let's move " + roomNavigateOptions[d].direction + " shall we?");
  playerMove = roomNavigateOptions[d].direction;
  if (roomNavigateOptions[d].isStart) {
    nextRoomIsStart = true;
    tb = "start";
  } else if (roomNavigateOptions[d].allowsExit) {
    tb = "exit";
  } else if (roomNavigateOptions[d].allowsScoreCollection) {
    tb = "bank";
  } else{
    tb = "room"
  }
  tagOnTile = roomNavigateOptions[d].tagOnTile;
  if(roomNavigateOptions[d].rewardOnDestination != 0){
    setCoins(roomNavigateOptions[d].rewardOnDestination);
    setRoomItem("coin");
  } else {
    setCoins(0)
    setRoomItem("");
  }
  setTimeout(function(){ 
    goBlur();
    setRoomType(tb);
    moveDirection();
  }, 1200);
}

function moveDirection(){
  fetch('https://maze.hightechict.nl/api/maze/move?direction='+playerMove , { 
    method: 'post', 
    headers: new Headers({
      'Authorization':  'HTI Thanks You [60d9]', 
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
  }).then(response => response.json())
  .then(data => {
    getRoomInfo();
  })
}

function setCoins(c){
  coinsFound = c;
}

function goExitMaze(){
  if(levelIsExit){
    // /api/maze/exit POST
    fetch('https://maze.hightechict.nl/api/maze/exit' , { 
      method: 'post', 
      headers: new Headers({
        'Authorization':  'HTI Thanks You [60d9]', 
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    })
    chat(playerName + " quit the maze " + playerData.maze +" !");
    loadPlayer();
    resetIntroGUI();
  } else {
    chat("You lied to me, " + playerName + " this is no exit")
  }
}

function showPlayerHUD(){
  ttile = document.getElementById("tag-tile");
  if(!ttile.classList.contains("is-hide")) {
    ttile.classList.remove("is-hide");
  }
  lvlGUI = document.getElementById("act-buttons");
  if(!lvlGUI.classList.contains("active")){
    lvlGUI.classList.add("active");
  }
  lvlAct = document.getElementById("room-options");
  if(!lvlAct.classList.contains("active")){
    lvlAct.classList.add("active");
  }
}

function hidePlayerHUD(){
  ttile = document.getElementById("tag-tile");
  if(!ttile.classList.contains("is-hide")) {
    ttile.classList.add("is-hide");
  }
  lvlGUI = document.getElementById("act-buttons");
  if(lvlGUI.classList.contains("active")){
    lvlGUI.classList.remove("active");
  }
  lvlAct = document.getElementById("room-options");
  if(lvlAct.classList.contains("active")){
    lvlAct.classList.remove("active");
  }
}

function resetIntroGUI(){
  roomData = [];
  hidePlayerHUD();
  mazeName = document.getElementById("maze-name");
  mazeName.innerHTML = "";
  if(!mazeName.classList.contains("is-hide")) {
    mazeName.classList.add("is-hide");
  }
  
  lvlGUI = document.getElementById("GUI-layer");
  lvlGUI.classList.remove("level-GUI--exit");
  lvlGUI.classList.remove("level-GUI--bank");
  lvlGUI.classList.add("level-GUI--intro");
}

function goCashToBank(){
  if(levelIsBank){
    fetch('https://maze.hightechict.nl/api/maze/collectScore' , { 
      method: 'post', 
      headers: new Headers({
        'Authorization':  'HTI Thanks You [60d9]', 
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    }).then(response => response.json())
    .then(data => {
      chat("We stashed our coins in the mazebank! "+ playerName);
      reloadHUD();
    })
  } else {
    chat("You lied to me, " + playerName + "  this is no bank room")
  }
}
function goBlur(){
  getbody = document.getElementById("body-ent");
  getbody.classList.add("body-ent--blurred");
  setTimeout(function(){ goUnBlur() }, 1000);
}
function goUnBlur(){
  getbody = document.getElementById("body-ent");
  getbody.classList.remove("body-ent--blurred");
}
