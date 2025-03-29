// This script contains the functions that are used in the game.
/* Summary of global varaibles visible in this script:
// Global variables for settings
    numberOfNumbers
    maximumNumber
    targetInteger
    allSolutions
    showNumberOfSolutions
// Global variables for tracking the game
    systemSolution
    userSolution
 */

/* Summary of functions in this script:
    startNewGame(); //populate the problem and save solution
    saveSolution(); //check and save the current solution, 
        // go to done if only one solution is needed.
    displaySolution(); //display all solutions, highlight the one user entered
    startInput(); // reset all buttons for the current solution
    */

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// startNewGame
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This function is called when the user clicks the "New Game" button. It populates the problem and saves the solution.
function startNewGame() {
    { // Enable other buttons
        let obj = document.getElementById("ID_ENTER");
        obj.disabled = false;
        obj = document.getElementById("ID_DONE");
        obj.disabled = false;
        obj = document.getElementById("ID_START_OVER");
        obj.disabled = false;
    }
    {// Generate all number buttons}

        // 1. Define your custom button class
        // It is in singleGroupScript.js. The class is NumberButtonJava
         
        // 2. Register it as a custom built-in element (extends <button>)
        customElements.define("number-button", NumberButtonJava, { extends: "button" });
        
        // 3. Create and insert the buttons dynamically
        function createNumberButtons(numberOfNumbers) {
            const container = document.getElementById("ID_DIV_INPUT");
            container.innerHTML = ""; // Clear existing buttons
        
            for (let i = 0; i < numberOfNumbers; i++) {
            const btn = document.createElement("button", { is: "number-button" });
            btn.id = `ID_NUMBER_BUTTON_${i}`;
            btn.textContent = i + 1;
            container.appendChild(btn);
            }
        }
        
        // 4. Call this function with however many buttons you want
        createNumberButtons(numberOfNumbers); 
    } // End of Generate all number buttons
        systemSolution = [];
        userSolution = [];
        let nSolution = systemSolution.length;
        while (nSolution==0) {
            let numbers=randomIntArrayInRange(1, maximumNumber, numberOfNumbers);
            
        }
        }
    { // Generate random numbers and store system solution}
    // Clear the solution
 
} // End of startNewGame

function saveSolution() {
}

function displaySolution() {
}

function startInput() {
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Support Functions
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// misc Math functions
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const randomIntArrayInRange = (min, max, n = 1) =>
    Array.from(
      { length: n },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    );
  