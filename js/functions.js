// This script contains the functions that are used in the game.
/* Summary of global varaibles visible in this script:
// Global variables for settings
    numberOfNumbers
    maximumNumber
    targetInteger
    allSolutions
    showNumberOfSolutions
// Global variables for tracking the game
    systemSolutions
    userSolutions
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
    {
        //Update all settings
        setupFieldUpdates();
    }
    { // Enable other buttons
        let obj = document.getElementById("ID_ENTER");
        obj.disabled = false;
        obj = document.getElementById("ID_DONE");
        obj.disabled = false;
        obj = document.getElementById("ID_START_OVER");
        obj.disabled = false;
    }
    {   // Clear previous solutions
        systemSolutions = [];
        userSolutions = [];
        ID_DIV_SOLUTION = document.getElementById("ID_DIV_SOLUTION");
        ID_DIV_SOLUTION.innerHTML = ""; // Clear previous solutions
    }
    {// Generate all number buttons}

        // 1. Define your custom button class
        // It is in singleGroupScript.js. The class is numberButtonJavaClass
         
        // 2. Register it as a custom built-in element (extends <button>)
        // customElements.define("number-button", numberButtonJavaClass, { extends: "button" });
        // Skip this: it is already defined at page loading.

        // 3. Create and insert the buttons dynamically
 
        
        // 4. Call this function with however many buttons you want
        createNumberButtons(numberOfNumbers); 
        // 5. Generate the equations buttons. The links need to be set up later.
        generateEquations(numberOfNumbers);


    } // End of Generate all number buttons
    { // Generae and store solutions
        systemSolutions = [];
        userSolutions = [];
        let nSolution = systemSolutions.length;
        while (nSolution == 0) {
            inputNumbers = randomIntArrayInRange(1, maximumNumber, numberOfNumbers);
            systemSolutions = getSolutions(inputNumbers,targetInteger);
            // This return is an array of alphabetic equations
            nSolution = systemSolutions.length;
        }
         if(systemSolutions.length == 0){
            alert ("No Solutions. It is not supposed to happen.");
            throw new Error("No solutions found for the generated numbers.");
        }
    }
    {   // Put the numbers into the buttons
        for (let buttonIndex = 0; buttonIndex < numberOfNumbers; buttonIndex++) {
            let buttonID=`ID_NUMBER_BUTTON_${buttonIndex}`; 
            //This must be consistent with those in createNumberButtons.
            let buttonObject = document.getElementById(buttonID);
            buttonObject.textContent = inputNumbers[buttonIndex];
            buttonObject.value = inputNumbers[buttonIndex]; // Save the current number
            // Enable the button and set the number
            buttonObject.disabled = false;
            buttonObject.draggable = true; // Make it draggable
        }
    }


    function createNumberButtons(numberOfNumbers) {
        const container = document.getElementById("ID_DIV_INPUT");
        container.innerHTML = ""; // Clear existing buttons
        for (let i = 0; i < numberOfNumbers; i++) {
        const btn = document.createElement("button"/*, { is: "number-button" }*/);
        customizeNumberButton(btn); // Call the customization function
        // additional settings
        btn.classList.add("numberButton");
        btn.id = `ID_NUMBER_BUTTON_${i}`;
        btn.textContent = "?";
        container.appendChild(btn);
        //
        // The following operaitons are migrated from class constructor
        //
        const state = {
            operand_1: null,
            operand_2: null,
            op: null
        };
        btn.state = new Proxy(state, {
            set: (target, prop, value) => {
          if (["operand_1", "operand_2", "op"].includes(prop)) {
            target[prop] = value;
            updateNumberButtonInternalState(btn);
            return true;
          }
          return false;
        }
      });

        }  
    
    
    }   // End of createNumberButtons function
    function generateEquations(numberOfNumbers) {
        const container = document.getElementById("ID_DIV_EQUATION");
        container.innerHTML = ""; // Clear existing content
    
        for (let i = 0; i < numberOfNumbers - 1; i++) {
            const row = document.createElement("div");
            row.classList.add("equation-row");
            const oprandeID1 = `ID_OPRAND_BUTTON_1_${i}`;
            const oprandeID2 = `ID_OPRAND_BUTTON_2_${i}`;
            const opID = `ID_OP_SELECT_${i}`;
            // Operand Button 1
            const operand1 = document.createElement("button", { is: "target-button" });
            customizeTargetButton(operand1); 
            // Additional settings
            operand1.id = oprandeID1;
            operand1.textContent="?";
            operand1.targetType = 1; // Type 1 for operand 1
            row.appendChild(operand1);
        
            // Operator Selector
            /* Original code 
            const opSelect = document.createElement("select", { is: "op-selector" });
            opSelect.id = opID;
            //opSelect.classList.add("equation-operator"); //Should have been added in class
            row.appendChild(opSelect);
            */

            // Operator Alternative
            const opSelect = createOpSelector();
            opSelect.id = opID;
            row.appendChild(opSelect);
        
            // Operand Button 2
            const operand2 = document.createElement("button", { is: "target-button" });
             customizeTargetButton(operand2); 
             // Additional settings
            operand2.id = oprandeID2;
            operand2.targetType = 2; // Type 2 for operand 2
            operand2.textContent = "?";
            row.appendChild(operand2);
        
            // Equal sign text
            const equalSign = document.createElement("span");
            equalSign.textContent = " = ";
            equalSign.classList.add("numberButton"); 
            row.appendChild(equalSign);
        
            // Result Button
            const resultBtn = document.createElement("button", /*{ is: "number-button" }*/);
            customizeNumberButton(resultBtn);
            // additional settings
            resultBtn.id = `ID_RESULT_BUTTON_${i}`;
            resultBtn.classList.add("equation-result");
            resultBtn.textContent = "?";
            row.appendChild(resultBtn);
        
            container.appendChild(row);

            // Link All Buttons
            {
                const oprandeID1 = `ID_OPRAND_BUTTON_1_${i}`;
                const oprandeID2 = `ID_OPRAND_BUTTON_2_${i}`;
                const opID = `ID_OP_SELECT_${i}`;
                let obj;
                obj = document.getElementById(oprandeID1);
                obj.answerObject = resultBtn;
                obj = document.getElementById(oprandeID2);
                obj.answerObject = resultBtn;
                obj = document.getElementById(opID);
                obj.answerObject = resultBtn;
            } // End of Link All Buttons
        } // End of loop for generating equations  
    } // End of generateEquations function   
      
    
} /* End of startNewGame function */

function saveSolution() { // service function for "Enter"
    // Check if the solution is valid
    let finalAnswerID; // ID of the final answer button, to be set in loop;
    let unusedNumbers = false; // Flag to check if there are unused numbers
    for (let i = 0; i < numberOfNumbers - 1; i++) {
        const resultID = `ID_RESULT_BUTTON_${i}`;
         const resultButton = document.getElementById(resultID);
        const resultValue = resultButton.value; // Get the value of the result button
        if (resultValue === "") { 
            alert("Please complete all equations before saving the solution.");
            return;
        }
        if (!resultButton.disabled) {
            if(!unusedNumbers){
                // Have not found unused numbers yet
                unusedNumbers = true; // Set the flag to true
                finalAnswerID = resultID; // Save the ID of the result button; it will be validated late
            } else {
                alert("You must use up all numbers.");
                return;
            }
        }// End of if (!resultButton.disabled)   
     } // End of loop for checking equations
     if(!unusedNumbers){
        alert("No final answer was found. Please double check your entries.");
        return;
     }
     finalResultButton = document.getElementById(finalAnswerID);
     const finalAnswer=Math.round(finalResultButton.value); // Get the final answer
        // The retrieved value is supposed to be an integer, but we should remove rounding errors.
    // Check if the final answer is correct
    if (finalAnswer != targetInteger) {
        alert("The final answer is incorrect. Please check your calculations.");
        return;
    }

    // Build equation based on user input.
    userSolution = buildExpressions(finalAnswerID); // Get the algebraic and numeric expressions
    alert(`You entered the solution as ${userSolution.algebraic} = ${userSolution.numeric}`);

    // Check equation to see if it is equivalent to previous solutions
    const alphabetString = String.fromCharCode(...Array.from({ length: 26 }, (_, i) => i + 97));
    const symbols = [...alphabetString.slice(0,inputNumbers.length)];
    exp1=userSolution.algebraic;
    for (let i = 0; i < userSolutions.length; i++) {
        exp2=userSolutions[i].algebraic;
        if (checkEquivalence(exp1, exp2, symbols,inputNumbers)) {
            exp2Numeric = userSolutions[i].numeric; // Convert to numeric expression
            alert(`The solution you entered: ${userSolution.numeric} is equivalent to previous solution ${exp2Numeric}.`);
            startInput(); // Reset the input for the next solution
            return;
        }
    }

    // All checks passed. Save the solution.
    userSolutions.push(userSolution); // Save the solution in the array
    if (!allSolutions) {
        // If only one solution is needed, go to done
        displaySolution(); // Display all solutions

    } else {
        // If all solutions are needed, display the user solution so far
        const userSolutionsArray = userSolutions.map(solution => solution.numeric);
        let userSolutionHeading;
        if (showNumberOfSolutions) {
            const nSymtemSol = systemSolutions.length;
            const nUserSol = userSolutions.length;
            userSolutionHeading = `You have entered ${nUserSol} of ${nSymtemSol} solution(s): `;
        }   else {
            userSolutionHeading = "You have entered the following solution(s) so far:";
        }
        displaySolutionText(userSolutionHeading, userSolutionsArray,"",""); // Display only the user solutions, not system solutions.
        startInput(); // Reset the input for the next solution
    }
    return;
} // End of saveSolution function

function displaySolution() { // service function for "Done"
    // Display all solutions

    // Remove user-entered solutions from the list of system solutions
    let remainingSolutions = systemSolutions; // Starting value
    const alphabetString = String.fromCharCode(...Array.from({ length: 26 }, (_, i) => i + 97));
    const symbols = [...alphabetString.slice(0,numberOfNumbers)]; 
    for (let i = 0; i < userSolutions.length; i++) {
        const userExp = userSolutions[i].algebraic;
        for (let j = 0; j < remainingSolutions.length; j++) {
            const systemExp = remainingSolutions[j];
            if (checkEquivalence(userExp, systemExp, symbols, inputNumbers)) {
                // Remove the solution from the list
                remainingSolutions.splice(j, 1); // Remove the solution from the list
                j--; // Adjust the index
            }
         }
    }

     // first, build the user and system solution arrays
    const userSolutionsArray = userSolutions.map(solution => solution.numeric);
    let systemSolutionsArray = []; // Initialize the array
    for (let i = 0; i < remainingSolutions.length; i++) {
        const systemExp = algebraic2Numeric(remainingSolutions[i], inputNumbers); // Convert to numeric expression
        systemSolutionsArray.push(systemExp); // Add the system solution to the array   
    }
    const userSolutionHeading = "You have entered the following solution(s):";
    let systemSolutionHeading;
    if (remainingSolutions.length == 0) {
        systemSolutionHeading = "You have found all solutions.";
    }
    else {
        systemSolutionHeading = "Here are the remaining solutions:";
    }

    // Second, display the solutions
    displaySolutionText(userSolutionHeading, userSolutionsArray, systemSolutionHeading, systemSolutionsArray);

    // Disable all buttons
    let obj = document.getElementById("ID_ENTER");
    obj.disabled = true;
    obj = document.getElementById("ID_DONE"); 
    obj.disabled = true;
    obj = document.getElementById("ID_START_OVER");
    obj.disabled = true;
}// End of displaySolution function

// Supporting function to display the solutions
function displaySolutionText(userSolutionHeading, userSolutionsArray, systemSolutionHeading, systemSolutionsArray) {
const container = document.getElementById("ID_DIV_SOLUTION");
container.innerHTML = ""; // Clear previous contents

function createSection(headingText, bodyLines, headingClass, bodyClass) {
    const heading = document.createElement("div");
    heading.className = headingClass;
    heading.textContent = headingText;

    const body = document.createElement("div");
    body.className = bodyClass;
    body.innerHTML = bodyLines.map(line => `${line}<br>`).join("");

    container.appendChild(heading);
    container.appendChild(body);
}

createSection(userSolutionHeading, userSolutionsArray, "solution-heading", "solution-body");
if (systemSolutionHeading.length > 0) { //if the heading is empty, it means do not display the system solutions.
     createSection(systemSolutionHeading, systemSolutionsArray, "system-heading", "system-body");
    }
} // End of displaySolutions function
function startInput() {
    // reset all buttons for the current solution
    // Reset all buttons

    // Reset all input buttons
    for (let buttonIndex = 0; buttonIndex < numberOfNumbers; buttonIndex++) {
        const buttonID=`ID_NUMBER_BUTTON_${buttonIndex}`; 
        //This must be consistent with those in createNumberButtons.
        const buttonObject = document.getElementById(buttonID);
        buttonObject.disabled = false; // Enable the button
        buttonObject.draggable = true; // Enable dragging
    }

    // Reset all target buttons
    const targetButtons = document.querySelectorAll("[id^='ID_OPRAND_BUTTON_']");
    targetButtons.forEach(button => {
        button.textContent = "?"; // Reset the button text
        if (isTouchDevice) {
            // Enable target for future assignments
            button.disabled = false; // Enable the target button clicking
        } else {
            button.disabled = true; // Disable the button
        }
        button.sourceObject = null; // Reset the source object reference
        button.classList.remove("dragover"); // Reset the style
    });

    // Reset all operator selectors
    const operatorSelectors = document.querySelectorAll("[id^='ID_OP_SELECT_']");
    operatorSelectors.forEach(selector => {
        selector.value = "?"; // Reset the operator selector value
    });

    // Reset all result buttons
    const resultButtons = document.querySelectorAll("[id^='ID_RESULT_BUTTON_']");
    resultButtons.forEach(button => {
        button.textContent = "?"; // Reset the button text
        button.value = ""; // Reset the button value
        button.state.operand_1 = null; // Reset the operand 1 reference
        button.state.operand_2 = null; // Reset the operand 2 reference 
        button.state.op = null; // Reset the operator reference
        button.targetObject = null; // Reset the target object reference
        button.draggable = false; // Disable dragging
        button.disabled = true; // Disable the button
    });

}
 

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Drag and Drop Supporting
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Function For number buttons
function draggableDragStartHandler(event){ 
    // store a ref. on the dragged elem
    event.dataTransfer.setData("text/plain", event.target.id);
 }   

// Function for op-selector (operator selector)
function handleChange(event) {
    // for op-selector, we need to update the answer object accordingly.
    // TODO: can we just use "this" here?
    const thisObject = event.target; // The op-selector that fired the event
    answerObject = thisObject.answerObject; // get the link to the result button
        if (thisObject.value === "?") {
            answerObject.state.op = null; // Indicate the operator is not set
        }
        else {  // Set the operator in the answer object
            answerObject.state.op = thisObject; // Set the operator in the answer object
        }
        // Force update of answer button UI
        if (typeof answerObject.updateInternalState === 'function') {
            answerObject.updateInternalState();
        }
}
      


// Functions for target buttons

function targetDragEnterHandler(event){
    // highlight potential drop target when the draggable element enters it
    if (event.target.sourceObject !== null) return; //  Nothing to do if source is already assigned
    event.target.classList.add("dragover"); // Add style
    event.preventDefault(); //stopes dragleave from firing when dragging over the target
}

function targetDragLeaveHandler(event){
    //TODO: replace event.target with "this"?
    event.target.classList.remove("dragover"); // Reset style
}

function targetDropHandler(event){
    if (event.target.sourceObject !== null) return; // Nothing to do if source is already assigned
    // Interface apparent update
    event.preventDefault();
    event.target.classList.remove("dragover");  

    // Get related parameters
    // Update records
    const draggedID = event.dataTransfer.getData("text/plain");
    const draggedObj = document.getElementById(draggedID);
    const targetObject = event.target; // The target button that received the drop

    targetDropAssignUpdate(targetObject, draggedObj);
/*  This part is replaced by the function targetDropAssignUpdate


    targetObject.sourceObject = draggedObj;
    targetObject.textContent = draggedObj.textContent; 


    // Update the source object state
    draggedObj.disabled = true; // Disable the button
    draggedObj.draggable = false; // Disable dragging
    draggedObj.linkedTarget = targetObject; // Link the target button to the source button
    // These operations are OK even for tap events. However, more handling may be needed for tap events.

    //Update answer button
    switch (targetObject.targetType) {
        case 1:{
            targetObject.answerObject.state.operand_1 = draggedObj;
            break;
        }   
        case 2:{
            targetObject.answerObject.state.operand_2 = draggedObj;
            break;
        }
        default:
            console.error("Illegal Type value for target obj.");
    }
    // Force update of answer button UI
    if (typeof targetObject.answerObject.updateInternalState === 'function') {
        targetObject.answerObject.updateInternalState();
    }
    targetObject.disabled = false; // Enable the target button clicking 
    */
}



function targetDragOverHandler(event){
    if (event.target.sourceObject !== null) return; //  Nothing to do if source is already assigned
    event.preventDefault(); //stopes dragleave from firing when dragging over the target
    // prevent default to allow drop This is required for drop to fire.
}

function targetClickHandler(event){
    myObject = event.target; // The target button that was clicked
    if (myObject.sourceObject === null) return; // Nothing to do if no source object
    resetTargetState(myObject); // Reset the target button state
    if (isTouchDevice) {
        // Enable target for future assignments
        myObject.disabled = false; // Enable the target button clicking
    }
}

function resetTargetState(targetObject) { // Reset the target button state
    //Serving target click and can be called remotely
    // Resets the state and content of the target button and reset associated buttons

    const sourceObject = targetObject.sourceObject;
    if (sourceObject === null) return; // Nothing to do if no source object


        //Reset the source
    sourceObject.classList.remove('disabled');//TODO: is this done automatically?
    sourceObject.disabled = false;
    sourceObject.draggable = true; // Enable dragging again
    sourceObject.linkedTarget = null; // Reset the linked target reference
 
    

    // Reset self states
    targetObject.textContent = "?"; // Reset the target button text
    targetObject.sourceObject = null; // Reset the source object reference
    targetObject.disabled = true; // Disable the target button

    //Reset the associated answer object
    const answerObject = targetObject.answerObject;
    // Reset the propagated objects
    const linkedTargetObj = answerObject.linkedTarget;
    if (linkedTargetObj !== null) {
        resetTargetState(linkedTargetObj); // Reset the linked target button state
    }   
    
    switch (targetObject.targetType) {
        case 1:{
            answerObject.state.operand_1 = null;
            break;
        }
        case 2:{
            answerObject.state.operand_2 = null;
            break;
        }
        default:
            console.error("Illegal Type value for target obj.");
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Touch event handlers (mostly generated by Claude)
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ----------------------------------------------------------
// Listeners
// ----------------------------------------------------------
function handleNumberButtonTap(event) { 
    const button = event.currentTarget;

    //test test
    alert(`Tapped button with ID: ${button.id} and value: ${button.value}`);
    
    // Don't select if button is disabled
    if (button.disabled) return;

    // This is for mobile only.
    if (!isTouchDevice) return; // Only handle touch devices here.
    
    // If this button is already selected, clear the selection.
    if (selectedButtonID === button.id) {
        clearSelection();
        return;
    }

    // Clear any existing selection first
    clearSelection();
    
    // Select this number
    button.classList.add('selected');
    selectedButtonID = button.id;
        
    // Start 5-second timeout
    if (selectionTimeout) {// Just to be safe
        clearTimeout(selectionTimeout);
        selectionTimeout = null;
    }   
    /* test test
    selectionTimeout = setTimeout(() => {
        clearSelection();
     }, SELECTION_TIMEOUT_MS);
     */
}

// Target button tap handler
function handleTargetButtonTap(event) {

    // Note that there is another listener for click. It cancels the number asignment.
    // This handler establishes assignment. It should only be used on mobile platforms.
    // Both listeners will fire.
    if (!isTouchDevice) return; // Only handle touch devices here.

    const button = event.currentTarget;
    const selectedButton = document.getElementById(selectedButtonID);
    // Only assign if we have a selection and target is empty
    if (selectedButtonID && button.textContent === '?') {
        
        targetDropAssignUpdate(button, selectedButton);
        /*
        // Assign number to target
        button.textContent = selectedNumber;
        button.classList.add('assigned');
        
        // Disable the number button permanently
        selectedButton.disabled = true;
        selectedButton.classList.add('disabled');
        
        console.log(`Assigned ${selectedNumber} to target`);
        
        // Clear selection
        clearSelection(); */
    } else if (!selectedButtonID) {
        // No number button is selected.
        return;
        // Optional: Show user feedback here
    } else if (button.textContent !== '?') {
        // A number is already assigned to this target
        // Do nothing, let the other handler deal with it
        return;
    }
    // Disable the original button
    selectedButton.disabled = true;
}


// ----------------------------------------------------------
// Supporting functions
// ----------------------------------------------------------

function clearSelection() {
    // Called to clear current selection
    if (selectedButtonID) {
        const buttonObject = document.getElementById(selectedButtonID);
        buttonObject.classList.remove('selected');
        buttonObject.disabled = false; // Re-enable the button
    }
   selectedButtonID = null;
   
    
    if (selectionTimeout) {
        clearTimeout(selectionTimeout);
        selectionTimeout = null;
    }
}

// ----------------------------------------------------------
// Page Initialization
// ----------------------------------------------------------
// Call this when your page loads
document.addEventListener('DOMContentLoaded', initializeGame);

// **** Operator Selection Code Change
function createOpSelector() {
    const select = document.createElement('select');
    select.classList.add("op-button");
    select.classList.add("equation-operator");
    
    const ops = ["?", "+", "-", "*", "/"];
    const opsDisplay = ["?", "+", "-", "×", "÷"];
    
    ops.forEach((op, index) => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = opsDisplay[index];
        select.appendChild(option);
    });
    
    select.addEventListener("change", handleChange);
    select.answerObject = null;
    
    return select;
}

function initializeGame() {
    // This is called when the page is loaded.
    return;
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
  
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Find Solutions
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getSolutions(numbers,targetNumber){
    // Universal constants
    const OPERATORS = ['+', '-', '*', '/'];
    const alphabetString = String.fromCharCode(...Array.from({ length: 26 }, (_, i) => i + 97));
    if(numbers.length>26){
        alert("The number of numbers must be no more than 26.");
        throw new Error("The number of numbers must be no more than 26.");
        // This is not supposed to happen as number of numbers has a limited choice, but just to be safe.
    }
    const symbols = [...alphabetString.slice(0,numbers.length)]; 
     //  variables corresponding to the numbers
     // Note that the "end" position is not included in the result.

    //Find all combinations of numbers and operators
    let myResults = getAllPossibleResults(numbers, symbols);

    //Find Operations that result in target
    const eqns=findSolution(myResults,targetNumber.toFixed(4)) 
        // Get the equations yielding the target number. Fix to 4 decimal points to match the function.
    if (eqns.length ==0)
        return []; // Empty array
    else {   
     }
    // Remove duplicated solutions
    let eqnsUnique = removeDuplicates(eqns,numbers,symbols); // return is string array
    return eqnsUnique;
    
    function generateExpressions(symbols) {
        if (symbols.length === 1) {
            return new Set([{ algebra: symbols[0] }]);
        }

        let expressions = new Set();

        for (let i = 0; i < symbols.length; i++) {
            for (let j = 0; j < symbols.length; j++) {
                if (i === j) continue;

                //let remainingNumbers = numbers.filter((_, index) => index !== i && index !== j);
                let remainingSymbols = symbols.filter((_, index) => index !== i && index !== j);

                for (let op of OPERATORS) {
                    //let numericExpr = `(${numbers[i]} ${op} ${numbers[j]})`;
                    let algebraExpr = `(${symbols[i]} ${op} ${symbols[j]})`;

                    //let newNumbers = [math.evaluate(numericExpr), ...remainingNumbers];
                    let newSymbols = [algebraExpr, ...remainingSymbols];

                    for (let subExpr of generateExpressions(newSymbols)) {
                        expressions.add({
                            //expr: `${numericExpr} ${subExpr.expr}`,
                            //algebra: `${algebraExpr} ${subExpr.algebra}`
                            algebra:subExpr.algebra
                        });
                    }
                }
            }
        }

        return expressions;
    }

    function getAllPossibleResults(numbers, symbols) {
        let expressions = generateExpressions(symbols);
        let results = {};// Object to hold results. It has key-value pairs.
        
        math.scope={}; // Clear the scope
        // create variables assigning numbers
        let tempScope={}; // an object to hold the variables
        for (let i = 0; i < numbers.length; i++) {
            tempScope[symbols[i]] = numbers[i];
        }
        // Iterate through all expressions and evaluate them

        for (let {algebra } of expressions) {
            //let result = math.evaluate(expr);
            // Use algebraic expression to compute values
            let resultAlgebra = math.evaluate(algebra, tempScope);
            let resultFix=resultAlgebra.toFixed(4);  // Fix to 4 decimal places
            if (!results[resultFix]) {
                results[resultFix] = [];
            }
            results[resultFix].push({algebra});
        }
        //clean up global variables
        return results;
    }

    function findSolution(equations, target) {
        let eqns = equations[target];
        return eqns ? eqns : [];
    }
    function removeDuplicates(eqns,numbers,symbols) {
        // Convert input to string array
        let eqnArray=Object.values(eqns).map(obj=>obj.algebra); // Extract algebraic expressions
            //eqnArray is modified to remove duplicates

        {   //Compare equations and remove duplicates
            const nTest=10; //Number of tests.               
            // run test for equivalence
            for (let i = 0; i < eqnArray.length; i++) { //Note that eqnArray.length changes as we remove duplicates
                const eqnStrI = eqnArray[i];
                 // Compare with other equations
                for (let j=i+1; j < eqnArray.length; j++) { // Note that eqnArray.length changes as we remove duplicates
                    const eqnStrJ = eqnArray[j];
                    const isSame = checkEquivalence(eqnStrI, eqnStrJ, symbols, numbers, nTest);
                    if (isSame) {
                        // If all values are the same, then the equations are the same
                        // Remove the equation from the list
                        eqnArray.splice(j,1); // Delete one element j. eqnArray is modified.
                        j--; // Adjust the index
                    }          
                } // for j
            } // for i
        } //Compare equations and remove duplicates    
        return eqnArray;
    }

}// end of function getSolutions(numbers,targetNumber）


function checkEquivalence(expr1, expr2, variables, values, nTest = 10) {
    // Build groups of variable names that must share the same value
    const groups = new Map();
    for (let i = 0; i < variables.length; i++) {
      const groupId = values[i];
      if (!groups.has(groupId)) {
        groups.set(groupId, []);
      }
      groups.get(groupId).push(variables[i]);
    }
 
    
    // Run randomized testing
    for (let t = 0; t < nTest; t++) {
      const valueAssignments = {};
  
      for (const group of groups.values()) {
        const randVal = Math.random(); // Random value for the group
        // Assign the same random value to all variables in the group
        group.forEach(varName => {
          valueAssignments[varName] = randVal;
        });
      }
  
      const v1 = math.evaluate(expr1, valueAssignments);
      const v2 = math.evaluate(expr2, valueAssignments);
  
      if (Math.abs(v1 - v2) > 1e-9) {
         return false;
      }
    }
  
    return true;
  } // end of function areEquivalentByGroupedRandomValues(expr1, expr2, variables, values, nTest = 10)


// Utility functions
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Service Setup Field Updates
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function setupFieldUpdates() {
// Reads set up values from the HTML page and updates global variables
  let obj;
 // Number of Numbers
 obj = document.getElementById("ID_NUMBER_OF_NUMBERS");
 numberOfNumbers = parseInt(obj.value);
  // Maximum Number
 obj=document.getElementById("ID_MAX_INTEGER");
 maximumNumber = parseInt(obj.value);
  // Target Integer
 obj=document.getElementById("ID_TARGET_INTEGER");
 targetInteger = parseInt(obj.value);
 
 // All Solutions
 obj=document.getElementById("ID_ALL_SOLUTIONS");
 allSolutions = obj.checked;
 if(allSolutions) {
        document.getElementById("ID_SHOW_NUMBER_OF_SOLUTIONS_LABEL").style.display = "block";
    }
    else {
        document.getElementById("ID_SHOW_NUMBER_OF_SOLUTIONS_LABEL").style.display = "none";
    }
 // Show Number of Solutions
 obj=document.getElementById("ID_SHOW_NUMBER_OF_SOLUTIONS");
 showNumberOfSolutions = obj.checked;
} // End of setupFieldUpdates function





// Construct algebraic and numeric expressions from a computation tree
function buildExpressions(rootID) {
    // Input: rootID is the ID of the root button (answer button),
    // nSymbols is the number of symbols used.
    // Output: an object with algebraic and numeric expressions.


    function buildIdToSymbolMapFromDOM() {
        const map = {};
        const buttons = document.querySelectorAll("[id^='ID_NUMBER_BUTTON_']");
      
        buttons.forEach(button => {
          const match = button.id.match(/_(\d+)$/);
          if (match) {
            const index = parseInt(match[1], 10);
            const symbol = String.fromCharCode(97 + Math.min(index, 25));
            map[button.id] = symbol;
          }
        });
      
        return map;
      }
  
    function traverse(node) {
      const { operand_1, operand_2, op } = node.state;
        const id = node.id;
      
      if (operand_1 === null || operand_2 === null || op === null) {
        // If it's a leaf node, map it to a letter symbol
        if (!(id in idToSymbol)) {
          console.error("ID not in map:", id);
        }

        return {
          algebraic: idToSymbol[id],
          numeric: node.value.toString()
        };
      } 
      else {
        // If it's an operator node, traverse its children
            const left = traverse(operand_1);
            const right = traverse(operand_2);
            const operator = op.value;
        
            return {
                algebraic: `(${left.algebraic} ${operator} ${right.algebraic})`,
                numeric: `(${left.numeric} ${operator} ${right.numeric})`
            };
        }
    }
    const idToSymbol = buildIdToSymbolMapFromDOM();
    // idToSymbol is global variable, visible in traverse function.
    const rootNode = document.getElementById(rootID);
    return traverse(rootNode);
  } // End buildExpressions

// Convert algebraic expression to numeric expression using the current input numbers
  function algebraic2Numeric(expr) {
    return expr.replace(/\b[a-z]\b/g, (match) => {
      const index = match.charCodeAt(0) - 97; // 'a'.charCodeAt(0) === 97
      const replacement = inputNumbers[index];
      return replacement !== undefined ? replacement : match; // fall back to original if missing
    });
  }

  // Generator for operator selector with customized contents
  function createOpSelector() {
    const select = document.createElement('select');
    select.classList.add("op-button");
    select.classList.add("equation-operator");
    
    
    const ops = ["?", "+", "-", "*", "/"];
    const opsDisplay = ["?", "+", "-", "×", "÷"];
    
    ops.forEach((op, index) => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = opsDisplay[index];
        select.appendChild(option);
    });
    
    select.addEventListener("change", handleChange);
    select.answerObject = null;
    
    return select;
}

function targetDropAssignUpdate(targetObject, draggedObj){
    clearSelection(); // Clear any existing selection
    targetObject.sourceObject = draggedObj;
    targetObject.textContent = draggedObj.textContent;
    // Update the source object state
    draggedObj.disabled = true; // Disable the button
    draggedObj.draggable = false; // Disable dragging
    draggedObj.linkedTarget = targetObject; // Link the target button to the source button
    // These operations are OK even for tap events. However, more handling may be needed for tap events.
    draggedObj.classList.remove('selected'); // Remove selection style if any
   
    //Update answer button
    switch (targetObject.targetType) {
        case 1:{
            targetObject.answerObject.state.operand_1 = draggedObj;
            break;
        }   
        case 2:{
            targetObject.answerObject.state.operand_2 = draggedObj;
            break;
        }
        default:
            console.error("Illegal Type value for target obj.");
    }
    // Force update of answer button UI
    if (typeof targetObject.answerObject.updateInternalState === 'function') {
        targetObject.answerObject.updateInternalState();
    }
    targetObject.disabled = false; // Enable the target button clicking
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Custom Class Support Functions
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Called when state.operand_1, operand_2, or op is changed in number button.
    function updateNumberButtonInternalState(numberObject) { 
      if ([numberObject.state.operand_1, numberObject.state.operand_2, numberObject.state.op].some(v => v === null)) {
        numberObject.textContent = '?';
        numberObject.value = ''; // Clear the value when not all operands are set
        numberObject.disabled = true; // Disable the button when not all operands are set
        numberObject.draggable = false; // Disable dragging when not all operands are set
      } else {
        const symb1 = numberObject.state.operand_1.value;
        const symb2 = numberObject.state.op.value;
        const symb3 = numberObject.state.operand_2.value;
  
        const expression = `${symb1}${symb2}${symb3}`;
        try {
          const answer = math.evaluate(expression);
          numberObject.value = answer; // Store the answer in the button's value

          const frac = math.fraction(answer); // We hope it won't be complicated by rounding error
          numberObject.textContent = frac.toFraction(true); // Display the answer
        } catch (err) {
          console.error("Expression error:", err);
          numberObject.textContent = '?';
        }
        // Enable the button for dragging
        numberObject.disabled = false;
        numberObject.draggable = true;  
      }// end of else
    }

    // end of updateNumberButtonInternalState()

    // Custom Settings of Number and target buttons
    function customizeNumberButton(numberButton) {
        // We will gradually move actions from creator to here.
        numberButton.classList.add("numberButton");
        numberButton.setAttribute("draggable", "true"); // Make it draggable
        // Add shared behavior for all buttons
        numberButton.linkedTarget = null; // The target button that this number button is linked to
        
        numberButton.addEventListener("dragstart", draggableDragStartHandler);
        if (isTouchDevice) {
            numberButton.addEventListener('click', handleNumberButtonTap);
            // Add tap listener only for touch devices
        }

        // Default: Disabled
        numberButton.disabled = true;
        numberButton.draggable = false; 
        // Set proxy to handle state changes
        const state = {
        operand_1: null,
        operand_2: null,
        op: null
      };
        numberButton.state = new Proxy(state, {
        set: (target, prop, value) => {
            if (["operand_1", "operand_2", "op"].includes(prop)) {
            target[prop] = value;
            updateNumberButtonInternalState(numberButton);
            return true;
            }
            return false;
        }
      }); 
      
    }

    function customizeTargetButton(targetButton) {
        targetButton.classList.add("numberButton");
        targetButton.classList.add("targetButton");
        targetButton.sourceObject = null; // Initialize sourceObject property to null
        targetButton.answerObject = null;
        targetButton.targetType = null; // To be set when the button is created

        // Add shared behavior for all buttons
        targetButton.addEventListener("dragenter", targetDragEnterHandler);
        targetButton.addEventListener ("dragleave", targetDragLeaveHandler);
        targetButton.addEventListener("drop", targetDropHandler);
        targetButton.addEventListener("dragover", targetDragOverHandler);
        targetButton.addEventListener("click", targetClickHandler);
        // The following listener is only for mobile devices.
        
        if (isTouchDevice) {
          targetButton.addEventListener('click', handleTargetButtonTap);
        } 
        // Note: for mobile devices, click has two listeners. They will all fire.

        // add properties
        targetButton.sourceObject = null; //The number button that drops here
        targetButton.answerObject = null; // link to the answer button

        // Disable only if it is not mobile device
        if (!isTouchDevice) {
            targetButton.disabled = true; // Disable the button by default
        } else {
            this.disabled = false; // Enable the button for touch devices
        } 
    }