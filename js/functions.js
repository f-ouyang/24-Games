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
        systemSolution = [];
        userSolution = [];
        let nSolution = systemSolution.length;
        while (nSolution == 0) {
            inputNumbers = randomIntArrayInRange(1, maximumNumber, numberOfNumbers);
            systemSolution = getSolutions(inputNumbers,targetInteger);
            // This return is an array of alphabetic equations
            nSolution = systemSolution.length;
        }
         if(systemSolution.length == 0){
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
        const btn = document.createElement("button", { is: "number-button" });
        btn.id = `ID_NUMBER_BUTTON_${i}`;
        btn.textContent = "?";
        container.appendChild(btn);
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
            operand1.id = oprandeID1;
            operand1.textContent="?";
            operand1.targetType = 1; // Type 1 for operand 1
            row.appendChild(operand1);
        
            // Operator Selector
            const opSelect = document.createElement("select", { is: "op-selector" });
            opSelect.id = opID;
            //opSelect.classList.add("equation-operator"); //Should have been added in class
            row.appendChild(opSelect);
        
            // Operand Button 2
            const operand2 = document.createElement("button", { is: "target-button" });
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
            const resultBtn = document.createElement("button", { is: "number-button" });
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

function saveSolution() {
}

function displaySolution() {
}

function startInput() {
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
}
      


// Functions for target buttons

function targetDragEnterHandler(event){
    // highlight potential drop target when the draggable element enters it
    event.target.classList.add("dragover"); // Add style
    event.preventDefault(); //stopes dragleave from firing when dragging over the target
}

function targetDragLeaveHandler(event){
    //TODO: replace event.target with "this"?
    event.target.classList.remove("dragover"); // Reset style
}

function targetDropHandler(event){
    event.preventDefault();
    event.target.classList.remove("dragover");  
    // Update records
    const draggedID = event.dataTransfer.getData("text/plain");
    const draggedObj = document.getElementById(draggedID);
    event.target.sourceObject = draggedObj;
    event.target.textContent = draggedObj.textContent; 
    //
    draggedObj.disabled = true; // Disable the button
    draggedObj.draggable = false; // Disable dragging
    //Update answer button
    switch (event.target.targetType) {
        case 1:{
            event.target.answerObject.state.operand_1 = draggedObj;
            break;
        }   
        case 2:{
            event.target.answerObject.state.operand_2 = draggedObj;
            break;
        }
        default:
            console.error("Illegal Type value for target obj.");
    }          
}



function targetDragOverHandler(event){
    event.preventDefault(); //stopes dragleave from firing when dragging over the target
    // prevent default to allow drop This is required for drop to fire.
}

function targetClickHandler(event){
    //Reset the states
   
    //Reset the target: no need
    
    //event.target.currentNumber=event.target.previousNumber;
    //event.target.innerText=String(event.target.currentNumber);
    
    //Reset the source
    sourceObject = event.target.sourceObject;
    if (sourceObject === null) return; // Nothing to do if no source object
    sourceObject.classList.remove('disabled');//TODO: is this done automatically?
    sourceObject.disabled = false;
    sourceObject.draggable = true; // Enable dragging again
    answerObject = event.target.answerObject;
    event.target.textContent = "?"; // Reset the target button text
    event.target.sourceObject = null; // Reset the source object reference
    switch (event.target.targetType) {
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
   
/*
    sourceObject.style.opacity = 1;
    event.target.sourceObject.style.pointer_Events = "auto";
    event.target.sourceObject.setAttribute("draggable", "true");
    const displayNumber=Math.round(Math.random()*1000); // random integer between 0 and 1000
    event.target.sourceObject.innerText=displayNumber; // display the number in text
*/
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
        let uniqueEqns = [];
        let uniqueEqnsStr = [];
        let nSol=eqns.length;
        let nSymbol=symbols.length;

        // Convert input to string array
        let eqnArray=Object.values(eqns).map(obj=>obj.algebra); // Extract algebraic expressions
            //eqnArray is modified to remove duplicates

        
        {   // First, check algebraic expressions for equivalence. We test expressions with random numbers.
            // In the following loops, eqnArray.length changes as we remove duplicates

            const nTest=10; //Number of tests.

            // Generate random numbers for testing
            let randomArray=Array.from({length:nTest},()=>Array.from({length:nSymbol},()=>Math.random()));
            
        
            // run test for equivalence
            for (let i = 0; i < eqnArray.length; i++) {
                let eqnStrI = eqnArray[i];
                // generate array of results
                let valuesI=[];
                for (let k=0; k<nTest; k++) {
                    let tempScope={}; // an object to hold the variables
                    let randNumbers=randomArray[k];
                    for (let l = 0; l < nSymbol; l++) {
                        tempScope[symbols[l]] = randNumbers[l];
                    }
                    let resultI = math.evaluate(eqnStrI, tempScope);
                    valuesI.push(resultI);
                } // for k, fill valuesI
                // Compare with other equations
                for (let j=i+1; j < eqnArray.length; j++) { // Note that eqnArray.length changes as we remove duplicates{
                    let eqnStrJ = eqnArray[j];
                    let valuesJ=[];
                    for (let k=0;k<nTest;k++) {
                        let tempScope={}; // an object to hold the variables
                        let randNumbers=randomArray[k];
                        for (let l = 0; l < nSymbol; l++) {
                            tempScope[symbols[l]] = randNumbers[l];
                        }
                        let resultJ = math.evaluate(eqnStrJ, tempScope);
                        valuesJ.push(resultJ);
                    } // for k, fill valuesJ
                    // Compare valuesI and valuesJ
                    let isSame=valuesI.every((val, index) => val === valuesJ[index]);
                    // isSame is true if all values are the same
                    if (isSame) {
                        // If all values are the same, then the equations are the same
                        // Remove the equation from the list
                        eqnArray.splice(j,1);
                        j--; // Adjust the index
                    }          
                } // for j
            } // for i
        } // First, check algebraic expressions for equivalence. We test expressions with random numbers.
        { // Second, check string equivalence with the particular numbers used
            // In the following loops, eqnArray.length changes as we remove duplicates
            for (let i = 0; i < eqnArray.length; i++) {
                let eqnStrI = eqnArray[i];
                // substitute numbers into the equation string
                for (let l = 0; l < nSymbol; l++) {
                    eqnStrI=eqnStrI.replaceAll(symbols[l],String(numbers[l]));
                }
                // Now do all j
                for (let j=i+1; j < eqnArray.length; j++) {
                    let eqnStrJ = eqnArray[j];
                    // substitute numbers into the equation string
                    for (let l = 0; l < nSymbol; l++) {
                        eqnStrJ=eqnStrJ.replaceAll(symbols[l],String(numbers[l]));
                    }
                    // Compare eqnStrI and eqnStrJ
                    if (eqnStrI===eqnStrJ) {
                        // If the strings are the same, then the equations are the same
                        // Remove the equation from the list
                        eqnArray.splice(j,1);
                        j--; // Adjust the index
                    }
                } // for j
            } // for i
        }// Second, check string equivalence with the particular numbers used
        // All done! Return eqnArray

        return eqnArray;    
    }
}// end of function getSolutions(numbers,targetNumber）

// Utility functions
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Service Setup Field Updates
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function setupFieldUpdates() {
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
 // Show Number of Solutions
 obj=document.getElementById("ID_SHOW_NUMBER_OF_SOLUTIONS");
 showNumberOfSolutions = obj.checked;
} // End of setupFieldUpdates function

