/* jshint esversion: 8 */

// UI ELEMENTS
let drawMode = true;
let value = 0;
let slots = [];
let keys = [];
let menuContainer;
let canvasContainer;
let processLetter;
//let deleteLetterButton;
let menuButton;
let gigantLetter;

// GAME CONFIGURATION
const characters = 'abcdefghijklmnopqrstuvwxyzåæø';
const charactersWhiteList = 'abcdefghijklmnopqrstuvwxyzåæøABCDEFGHIJKLMNOPQRSTUVWXYZAÅÆØ';

const numberOfLetters = 5;
const numberOfAttempts = 6;
const wordsPath = 'wordlist.csv';

// USEFUL FLAGS
let currentAttempt = 1;
let inGame = false;
let wordTable;
let wordList = [];
let wordToGuess;
let wordToCheck;
let usedWords = [];
let win = false;
let currentWordRow = [];
let currentWord = Array(numberOfLetters).fill("");
let currentMode = Array(numberOfLetters).fill("empty");
let currentKeyMode = Array(characters.length).fill("empty");
let allSlotsMode = Array(numberOfLetters * numberOfAttempts).fill("empty");
let allLetters = Array(numberOfLetters * numberOfAttempts).fill("");
let currentLetterWord = 0;
let hasCheckedLetter = false;
let hasCheckedWord = false;
let guessedLetter = [];
let letterToShow = '';
let selectedMenuButton = false;
let selectedHelpButton = false;


// CURSOR
let xp = 0;
let yp = 0;
let hx;
let hy;
let hands;

// HAND MODE
let mode;

// CANVAS
let drawCanvas;

// TESSERACT
let tesseractWorker;


// REQUESTS
// var url_string; = window.location.href; //window.location.href
// var url; = new URL(window.location.href);
// var token; = url.searchParams.get("token");
// console.log(token);

// SAVE TOKENS


function startGame() {

  // Get random word
  for (let w = 0; w < wordTable.getRowCount(); w++) {
    wordList.push(wordTable.getRow(w).arr[0]);
  }

  let rand = Math.floor(Math.random() * (wordTable.getRowCount() + 1));
  wordToGuess = wordTable.getString(rand, 0);
  console.log(wordToGuess);

  //while (currentAttempt < numberOfAttempts) {
  //}
  if (win == false) {
    endGame();
  }

}

function endGame() {
  var finalMessage = "";
  // Stop timer
  if (win == true) {
    finalMessage = "Congratulations! you guessed the word.\n Total attempts:" + String(numberOfAttempts);
  }
  else {
    finalMessage = "The word was " + wordToGuess + ". Better luck next time!";
  }

  finalMessage += "\nDo you want to guess another word?";
}


function checkWord() {
  // For each element in current word, check and update current mode
  // CHECK IF WORD IS IN DICTIONARY
  // if (wordList.includes(wordToCheck.join(''))) {s
  if (!usedWords.includes(wordToCheck.join(''))) {
    // ADD word to usedWords
    usedWords.push(wordToCheck.join(''));
    // CHECK letter by letter
    for (let col = 0; col < numberOfLetters; col++) {

      let index = characters.indexOf(wordToCheck[col].toLowerCase());

      if (wordToCheck[col] == wordToGuess) {
        currentMode[col] = "correct";
        currentKeyMode[index] = "correct";
        allSlotsMode[(currentAttempt - 1) * numberOfLetters + col] = "correct";
        allLetters[(currentAttempt - 1) * numberOfLetters + col] = wordToCheck[col];
      } else if (wordToGuess.includes(wordToCheck[col])) {
        currentMode[col] = "semi";
        currentKeyMode[index] = "semi";
        allSlotsMode[(currentAttempt - 1) * numberOfLetters + col] = "semi";
        allLetters[(currentAttempt - 1) * numberOfLetters + col] = wordToCheck[col];
      } else {
        currentMode[col] = "error";
        currentKeyMode[index] = "error";
        allSlotsMode[(currentAttempt - 1) * numberOfLetters + col] = "error";
        allLetters[(currentAttempt - 1) * numberOfLetters + col] = wordToCheck[col];
      }
    }

  } else {
    console.log("The word has already been used");
  }
  // }
  // else {

  //   console.log("The word is not in the dictionary");
  // }

  // SHOW 
  // for (let col = 0; col < numberOfLetters; col++) {
  //   slots[currentAttempt][col].show(currentWord[col], currentMode[col]);
  // }
  // SHOW WORDS
  for (let row = 0; row < numberOfAttempts; row++) {
    for (let col = 0; col < numberOfLetters; col++) {

      slots[row][col].show(allLetters[row * numberOfLetters + col], allSlotsMode[row * numberOfLetters + col]);
    }
  }

  if (wordToGuess == currentWord.join('')) {
    win = true;
    endGame();
  }
}


const s1 = (g) => {
  g.preload = () => {
    wordTable = g.loadTable(wordsPath);
  }

  g.drawGrid = () => {
    g.noStroke();
    g.fill(128);

    // SHOW WORDS
    for (let row = 0; row < numberOfAttempts; row++) {
      for (let col = 0; col < numberOfLetters; col++) {

        slots[row][col].show(allLetters[row * numberOfLetters + col], allSlotsMode[row * numberOfLetters + col]);
      }
    }

    // SHOW KEYBOARD
    for (let letter = 0; letter < characters.length; letter++) {
      keys[letter].show(currentKeyMode[letter]);
    }

  };
  g.setup = () => {
    keys = [];
    slots = [];

    canvasWidth = document.getElementById('canvas_grid').offsetWidth
    canvasHeight = document.documentElement.clientHeight;
    g.createCanvas(canvasWidth, canvasHeight);
    g.background(250);

    // DEFINE WORD CELLS
    size = document.getElementById('canvas_grid').offsetWidth / 20;
    for (let row = 0; row < numberOfAttempts; row++) {
      slots.push([]);
      y = row * (size + size / 4) + canvasHeight / 4;
      for (let col = 0; col < numberOfLetters; col++) {
        x = canvasWidth / 3 + col * 1.2 * size;
        slots[row].push(new Slot(x, y, size, row, col, g));
      }
    }

    keySize = document.getElementById('canvas_grid').offsetWidth / 35;

    //  DEFINE KEYBOARD (IN 3 COLUMNS) 
    for (let i = 0; i < 10; i++) {
      letter = characters.charAt(i);
      x = 1 * (keySize + keySize / 4) + canvasWidth / 9;
      y = canvasHeight / 4 + i * (keySize + keySize / 4);
      keys.push(new Key(x, y, letter, keySize, keySize, g));
    }
    for (let i = 10; i < 20; i++) {
      letter = characters.charAt(i);
      x = 2 * (keySize + keySize / 4) + canvasWidth / 9;
      y = canvasHeight / 4 + (i - 10) * (keySize + keySize / 4);
      keys.push(new Key(x, y, letter, keySize, keySize, g));
    }
    for (let i = 20; i <= characters.length; i++) {
      letter = characters.charAt(i);
      x = 3 * (keySize + keySize / 4) + canvasWidth / 9
      y = canvasHeight / 4 + (i - 20) * (keySize + keySize / 4);
      keys.push(new Key(x, y, letter, keySize, keySize, g));
    }

    //// DEFINE CONTAINERS
    //menuContainer = new Container(canvasWidth / 3, canvasWidth / 8, canvasWidth / 2, 2 * canvasHeight / 3, 200, 150, g);
    //keyboardContainer = new Container(canvasWidth / 9, canvasWidth / 8, canvasWidth / 8, 2 * canvasHeight / 3, 200, 150, g);

    // PAINT CONTENT
    //menuContainer.show();
    //keyboardContainer.show();
    g.drawGrid();

    if (inGame == false) {
      inGame = true;
      startGame();

    }

  };

  g.draw = () => {
    g.setup();

  };

  // g.mouseClicked = () => {
  //   if (!drawMode) {
  //     console.log("Inside toggle");
  //     document.getElementById("canvas_grid").classList.toggle("toggle");
  //     drawMode = true;
  //   }
  //   //else {
  //   //  document.getElementById("canvas_grid").classList.remove('col-12');
  //   //  document.getElementById("canvas_grid").classList.add('col-0');
  //   //  document.getElementById("canvas_draw").classList.remove('col-0');
  //   //  document.getElementById("canvas_draw").classList.add('col-12');
  //   //}

  //   //// ChANGE MODE
  //   //drawMode = !drawMode;

  //   // PAINT ALL THE ELEMENTS AGAIN
  //   g.setup();
  // };
};



let gridP5 = new p5(s1, 'canvas_grid');

const s2 = (d) => {
  d.preload = () => {
  };

  d.drawDots = () => {

    var screenH = document.documentElement.clientHeight;
    var screenW = document.getElementById('canvas_draw').offsetWidth;

    var r = 2;
    var cw = 30;
    var ch = 30;
    d.strokeWeight(2);
    d.stroke(0);
    d.fill(0);
    for (var x = 20; x < screenW; x += cw) {
      for (var y = 20; y < screenH; y += ch) {
        d.point(x - r / 2, y - r / 2);
      }
    }
  };

  // CHECK FINGERS FOR MODE (NOTE THE Y IS INVERSED)
  d.fingersUp = (landmarks) => {
    if ((landmarks[0][4].y < landmarks[0][2].y) && (landmarks[0][8].y < landmarks[0][6].y) && (landmarks[0][12].y < landmarks[0][10].y) && (landmarks[0][16].y < landmarks[0][14].y) && (landmarks[0][20].y < landmarks[0][18].y)) {
      return "move";
    }

    else if ((landmarks[0][8].y < landmarks[0][6].y) && (landmarks[0][7].y < landmarks[0][12].y) && (landmarks[0][7].y < landmarks[0][16].y) && (landmarks[0][7].y < landmarks[0][20].y)) {
      return "draw";

    } else if ((landmarks[0][4].y < landmarks[0][2].y) && (landmarks[0][3].y < landmarks[0][8].y) && (landmarks[0][3].y < landmarks[0][12].y) && (landmarks[0][3].y < landmarks[0][16].y) && (landmarks[0][3].y < landmarks[0][20].y)) {
      return "confirm";

    } else if ((landmarks[0][4].y > landmarks[0][2].y) && (landmarks[0][3].y > landmarks[0][8].y) && (landmarks[0][3].y > landmarks[0][12].y) && (landmarks[0][3].y > landmarks[0][16].y) && (landmarks[0][3].y > landmarks[0][20].y)) {
      return "cancel";
    }
    // else if ((landmarks[0][8].y > landmarks[0][6].y) && (landmarks[0][12].y > landmarks[0][10].y) && (landmarks[0][16].y > landmarks[0][14].y) && (landmarks[0][20].y > landmarks[0][18].y)) {
    //   return "click";
    //} 
    else {
      return "unknown";
    }
  };

  // "VIRTUAL HAND MOUSE" FUNCTION
  d.onResults = (results) => {
    let canvasWidth = document.getElementById('canvas_grid').offsetWidth

    handInUse = "";
    if (results.multiHandedness) {
      for (const hand of results.multiHandedness) {
        if (hand.label == "Right") {
          handInUse = "Left";
        }
        else { handInUse = "Right"; }
      }
    }
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        mode = d.fingersUp(results.multiHandLandmarks);
        hx = document.getElementById('canvas_draw').offsetWidth - (results.multiHandLandmarks[0][8].x * document.getElementById('canvas_draw').offsetWidth);
        hy = results.multiHandLandmarks[0][8].y * document.documentElement.clientHeight;

        console.log(handInUse, mode);

        // FOR EACH OF THE BUTTONS/ ELEMENTS WE CHECK IF WE ARE IN AND IN WHICH MODE
        // IF SOMETHING IS HIDEN< THEN YOU SHOULD NOT BE ABLE TO INTERACT

        if (processLetter.contains(hx, hy)) {
          if (handInUse == "Right") {
            if (mode == "move") {
              if (hasCheckedLetter == false) {

                // HIDE EVERYTHING TO PROCESS
                processLetter.hide();
                //deleteLetterButton.hide();
                helpButton.hide();
                menuButton.hide();
                navigateButton.hide();
                //navigateBackButton.hide();

                for (let col = 0; col < numberOfLetters; col++) {
                  currentWordRow[col].hide();
                }

                // DRAW DOTS AGAIN
                d.drawDots();

                // PREPROCESS IMAGE 
                drawP5.filter(d.DILATE);
                drawP5.filter(d.DILATE);
                drawP5.filter(d.DILATE);
                drawP5.filter(d.THRESHOLD);

                Tesseract.recognize(
                  drawP5.drawingContext.canvas, {
                  lang: 'dan',
                  tessedit_pageseg_mode: '10',
                  tessedit_char_whitelist: charactersWhiteList
                }
                )
                  .catch(err => {
                    console.error(err);
                  })
                  .then(result => {
                    // Get Confidence score
                    console.log(result);
                    confidence = result.confidence

                    letterToShow = result.text[0];




                    //{ tessedit_char_whitelist: characters, tessedit_pageseg_mode: 'SINGLE_CHAR' }));
                    // console.log(guessedLetter);

                    //confidenceLevel = guessedLetter[0]._resolve.symbols[0].confidence;
                    //letterToShow = guessedLetter[0]._resolve.symbols[0].text;
                    // letterToShow = "A";

                    if (charactersWhiteList.includes(letterToShow)) {
                      // DEFINE & SHOW THE GIGANT LETTER
                      gigantLetter = new Text(letterToShow, document.getElementById('canvas_draw').offsetWidth / 2 - 200, document.documentElement.clientHeight / 2 + 200, 500, 0, "-", d);
                      gigantLetter.show();

                      // DEFINE SUBMIT LETTER EVENT
                      hasCheckedLetter = true;
                    } else {

                      // SHOW MESSAGE SAYING AN ERROR HAPPENED
                      console.log("Opps, an error occurred and the etter could not be recognized");
                      // ACT AS IF THEY REJECTED THE LETTER

                      // CLEAN SCREEN
                      d.background(255);
                      d.drawDots();

                      // SHOW EVERYTHING AGAIN
                      processLetter.show();
                      //deleteLetterButton.show();
                      helpButton.show();
                      menuButton.show();
                      navigateButton.show();

                      // MOVE POINTER TO CENTER TO MAKE SURE IT DOESN'T SEND IT AGAIN
                      hx = document.getElementById('canvas_draw').offsetWidth / 2;
                      hy = document.documentElement.clientHeight

                      // MAKE SURE IT DOESN'T SEND IT AGAIN
                      hasCheckedLetter = true;

                      // PAINT THE LAST LETTER AFTER PAINTING 
                      for (let col = 0; col < numberOfLetters; col++) {
                        currentWordRow[col].show(currentWord[col], currentMode[col]);
                      }
                    }
                  }
                  )
              }
            }
          }
        }


        // else if (deleteLetterButton.contains(hx, hy)) {
        //   if (handInUse == "Right") {
        //     if (mode == "move") {

        //       // DELETE CANVAS AND DRAW EVERYTHING AGAIN

        //       d.background(255);
        //       d.drawDots();
        //       processLetter.show();
        //       deleteLetterButton.show();
        //       menuButton.show();
        //       helpButton.show();
        //       navigateButton.show();

        //       // PAINT THE LAST WORD AFTER PAINTING 
        //       for (let col = 0; col < numberOfLetters; col++) {
        //         if (currentLetterWord == col) {
        //           currentMode[col] = "current";
        //         }
        //         currentWordRow[col].show(currentWord[col], currentMode[col]);
        //       }
        //     }
        //   }
        // }
        else if (helpButton.contains(hx, hy)) {
          if (handInUse == "Right") {
            if (mode == "move") {
              selectedHelpButton = true;
              // HIDE EVERYTHING, SHOW TUTORIAL
              processLetter.hide();
              //deleteLetterButton.hide();
              helpButton.hide();
              menuButton.hide();
              navigateButton.hide();
              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].hide();
              }

              // SHOW TUTORIAL
            }
          }
        }

        else if (menuButton.contains(hx, hy)) {
          if (handInUse == "Right") {
            if (mode == "move") {

              if (selectedMenuButton == false) {

                selectedMenuButton = true;
                // HIDE EVERYTHING

                processLetter.hide();
                //deleteLetterButton.hide();
                helpButton.hide();
                navigateButton.hide();
                for (let col = 0; col < numberOfLetters; col++) {
                  currentWordRow[col].hide();
                }

                d.background(180);
                d.drawDots();
                menuButton.show();

                // SHOW MENU
                menuContainer.show();
                newGameButton.show();
                resumeGameButton.show();
                changeHandButton.show();

              } else {
                selectedMenuButton = false;
                // SHOW EVERYTHING AGAIN
                d.background(255);
                d.drawDots();
                menuButton.show();
                processLetter.show();
                // deleteLetterButton.show();
                helpButton.show();
                navigateButton.show();
                for (let col = 0; col < numberOfLetters; col++) {
                  currentWordRow[col].show();
                }

              }

            }
          }
        }
        else if (navigateButton.contains(hx, hy)) {
          if (handInUse == "Right") {
            if (mode == "move") {
              console.log("Navigate");
              // SHOW OTHER SCREEN
              d.toggle();
              navigateButton.hide();
              navigateBackButton.show();
            }
          }
        }
        else if (navigateBackButton.contains(hx, hy)) {
          if (handInUse == "Right") {
            if (mode == "move") {
              console.log("Navigate back");
              // SHOW OTHER SCREEN
              d.toggle();
              navigateBackButton.hide();
              // Paint all the screen again
              d.background(255);
              d.drawDots();
              menuButton.show();
              processLetter.show();
              //deleteLetterButton.show();
              helpButton.show();
              navigateButton.show();
              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].show();
              }


            }
          }
        }
        else if (handInUse == "Right") {
          if (mode == "draw") {
            // DRAWING MODE
            if (xp == 0 && yp == 0) {
              xp = hx;
              yp = hy;
            } else {
              d.stroke(0, 0, 255);
              d.strokeWeight(30);
              d.line(xp, yp, hx, hy);
              xp = hx
              yp = hy
            }

          }
        } else if (handInUse == "Left") {

          // Avoid mistakes
          if (mode != 'confirm' && mode != 'cancel' & mode != 'draw') {
            // DELETE MODE

            // CHECK IF IS NOT DELETING AN ELEMENT
            if (processLetter.contains(hx, hy) || helpButton.contains(hx, hy) || menuButton.contains(hx, hy) || navigateButton.contains(hx, hy) || navigateBackButton.contains(hx, hy)) {
            } else {

              d.stroke(255);
              d.strokeWeight(200);

              if (xp == 0 && yp == 0) {
                xp = hx;
                yp = hy;
              }

              d.line(xp, yp, hx, hy);

              xp = hx;
              yp = hy;

              // PAINT THE GRID AFTER DELETING 
              d.drawDots();
              menuButton.show();
              processLetter.show();
              //deleteLetterButton.show();
              helpButton.show();
              navigateButton.show();
              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].show(currentWord[col], currentMode[col]);
              }

            }
          }

          xp = hx;
          yp = hy;
        }


        if (mode == "confirm") {
          // Check what was the event to confirm
          // if submit letter event
          if (hasCheckedLetter == true) {
            // IF THEY ACCEPT THE LETTER
            gigantLetter.hide();

            // CLEAN SCREEN
            d.background(255);
            d.drawDots();

            currentWord[currentLetterWord] = letterToShow;
            currentMode[currentLetterWord] = "empty";
            currentLetterWord++;
            currentMode[currentLetterWord] = "current";

            if (currentLetterWord == numberOfLetters) {
              hasCheckedWord = true;
            }

            // SHOW EVERYTHING AGAIN
            processLetter.show();
            // deleteLetterButton.show();
            helpButton.show();
            menuButton.show();
            navigateButton.show();

            // MOVE POINTER TO CENTER TO MAKE SURE IT DOESNT SEND AGAIN
            hx = document.getElementById('canvas_draw').offsetWidth / 2;
            hy = document.documentElement.clientHeight

            // MAKE SURE IT DOESN'T SEND IT AGAIN
            hasCheckedLetter = false;

            // PAINT THE LAST LETTER AFTER PAINTING 
            for (let col = 0; col < numberOfLetters; col++) {
              currentWordRow[col].show(currentWord[col], currentMode[col]);
            }

          } else if (hasCheckedWord == true) {
            hasCheckedWord = false;
            // IF THEY ACCEPT THE WORD
            // SUBMIT 
            // show other screen, 
            d.toggle();

            navigateButton.hide();
            navigateBackButton.show();
            // call check word,
            console.log(currentWord);
            wordToCheck = [...currentWord];
            checkWord();
            currentAttempt++;


            currentWordRow = [];
            currentWord = ["", "", "", "", "",];
            currentMode = ["empty", "empty", "empty", "empty", "empty"];
            currentLetterWord = 0;
            // restart variables


          }

        }
        if (mode == "cancel") {
          // Check what was the event to cancel
          if (hasCheckedLetter == true) {
            // IF THEY REJECT THE LETTER
            gigantLetter.hide();

            // CLEAN SCREEN
            d.background(255);
            d.drawDots();

            // SHOW EVERYTHING AGAIN
            processLetter.show();
            //deleteLetterButton.show();
            helpButton.show();
            menuButton.show();
            navigateButton.show();

            // MOVE POINTER TO CENTER TO MAKE SURE IT DOESN'T SEND IT AGAIN
            hx = document.getElementById('canvas_draw').offsetWidth / 2;
            hy = document.documentElement.clientHeight

            // MAKE SURE IT DOESN'T SEND IT AGAIN
            hasCheckedLetter = false;

            // PAINT THE LAST LETTER AFTER PAINTING 
            for (let col = 0; col < numberOfLetters; col++) {
              currentWordRow[col].show(currentWord[col], currentMode[col]);
            }
          } else if (hasCheckedWord == true) {
            // IF THEY REJECT THE WORD
            hasCheckedWord = false;
            //offer to select letter to change
          }
        }
      }
    }
  };


  d.setup = () => {
    d.pixelDensity(3.0);
    drawCanvas = d.createCanvas(document.getElementById('canvas_draw').offsetWidth, document.documentElement.clientHeight);

    d.background(255);
    currentWord = [];

    // DEFINE THE BUTTONS
    processLetter = new Button("PROCESS\nLETTER", document.getElementById('canvas_draw').offsetWidth - 150, document.documentElement.clientHeight - 150, 200, 28, 'green', 'green', 255, "br", d);
    //deleteLetterButton = new Button("DELETE\nLETTER", 300, document.documentElement.clientHeight - 150, 200, 28, 'red', 'red', 255, "bl", d);
    menuButton = new Button("MENU", document.getElementById('canvas_draw').offsetWidth - 150, 150, 200, 28, 'blue', 'blue', 255, "tr", d);
    helpButton = new Button("HELP", 300, 150, 200, 50, 'blue', 'blue', 255, "tl", d);
    navigateButton = new Toggle(">>", 0, 0, document.getElementById('canvas_draw').offsetWidth / 10, document.documentElement.clientHeight, 60, 250, 'blue', 'blue', "l", d);
    navigateBackButton = new Toggle("<<", document.getElementById('canvas_draw').offsetWidth - document.getElementById('canvas_draw').offsetWidth / 3, 0, document.getElementById('canvas_draw').offsetWidth / 10, document.documentElement.clientHeight, 60, 'blue', 'blue', 250, "r", d);
    menuContainer = new Container(document.getElementById('canvas_draw').offsetWidth / 2 - 100, 300, document.getElementById('canvas_draw').offsetWidth / 7, 200, 'blue', 'blue', d);
    resumeGameButton = new Key(document.getElementById('canvas_draw').offsetWidth / 2 - 100, 325, "RESUME GAME", document.getElementById('canvas_draw').offsetWidth / 7, document.getElementById('canvas_draw').offsetWidth / 40, d);
    newGameButton = new Key(document.getElementById('canvas_draw').offsetWidth / 2 - 100, 375, "NEW GAME", document.getElementById('canvas_draw').offsetWidth / 7, document.getElementById('canvas_draw').offsetWidth / 40, d);
    changeHandButton = new Key(document.getElementById('canvas_draw').offsetWidth / 2 - 100, 425, "CHANGE HAND", document.getElementById('canvas_draw').offsetWidth / 7, document.getElementById('canvas_draw').offsetWidth / 40, d);

    // DEFINE THE CURRENT WORD BOX
    size = document.getElementById('canvas_draw').offsetWidth / 20;
    y = document.documentElement.clientHeight - 2 * size;
    for (let col = 0; col < numberOfLetters; col++) {
      x = (document.getElementById('canvas_draw').offsetWidth + 150) / 2 - numberOfLetters / 2 * 1.2 * size + col * 1.2 * size;
      currentWordRow.push(new Slot(x, y, size, 0, col, d));
    }

    // PAINT THE GRID 
    d.drawDots();

    // GET VIDEO INPUT
    videoElement = document.getElementsByClassName('input_video')[0];


    // CONFIG OF HAND MODEL
    hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.75,
      minTrackingConfidence: 0.75
    });

    // GET HAND LANDMARKS
    //hands.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({
          image: videoElement
        });
      },
      width: 1280,
      height: 720,
    });

    camera.start();

  };



  d.draw = () => {
    d.noLoop();

    hands.onResults(d.onResults);
    // PAINT THE BUTTONS AFTER PAINTING
    processLetter.show();
    //deleteLetterButton.show();
    menuButton.show();
    helpButton.show();
    navigateButton.show();

    // PAINT THE LAST WORD AFTER PAINTING 
    for (let col = 0; col < numberOfLetters; col++) {
      if (currentLetterWord == col) {
        currentMode[col] = "current";
      }
      currentWordRow[col].show(currentWord[col], currentMode[col]);

    }
  };

  d.toggle = () => {
    console.log("Inside toggle");
    if (drawMode == true) {
      document.getElementById("canvas_grid").classList.toggle("toggle");
    }

    //document.getElementById("canvas_grid").classList.remove('show');

    //if (drawMode) {
    //  document.getElementById("canvas_grid").classList.remove('col-0');
    //  document.getElementById("canvas_grid").classList.add('col-9');
    //  document.getElementById("canvas_draw").classList.remove('col-12');
    //  document.getElementById("canvas_draw").classList.add('col-3');

    //}
    //else {
    //  document.getElementById("canvas_grid").classList.remove('col-12');
    //  document.getElementById("canvas_grid").classList.add('col-3');
    //  document.getElementById("canvas_draw").classList.remove('col-0');
    //  document.getElementById("canvas_draw").classList.add('col-9');
    //}

    //// PAINT ALL THE ELEMENTS AGAIN
    //d.setup();
    //d.draw();
  };
};
let drawP5 = new p5(s2, 'canvas_draw');



let cursor;
let eraser;

const s3 = (p) => {
  p.setup = () => {
    p.createCanvas(document.getElementById('canvas_pointer').offsetWidth, document.documentElement.clientHeight);
    p.noStroke();
    cursor = p.loadImage('cursor.png');
    eraser = p.loadImage('eraser.png');
  };


  p.draw = () => {
    p.clear();
    p.fill(0);

    switch (mode) {
      case "draw": {
        p.ellipse(hx, hy, 33, 33);
        break;
      }
      case "delete": {
        p.image(eraser, hx, hy, 33, 33);
        break;
      }
      case "move": {
        p.image(cursor, hx, hy, 33, 33);
        break;
      }
      case "confirm": {
        p.ellipse(hx, hy, 33, 33);
        break;
      }
      case "cancel": {
        p.ellipse(hx, hy, 33, 33);
        break;
      }
      default: {
        p.ellipse(hx, hy, 33, 33);
        break;
      }
    }

  };

};

let pointerP5 = new p5(s3, 'canvas_pointer');
