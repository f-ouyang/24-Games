// Get the value of a selected option in a dropdown (select element)
const selectElement = document.querySelector('select');
const selectedValue = selectElement.value;

// =================================================================
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Serving Settings
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// =================================================================

//Default Values, to be imported from user settgings in the futre
const numberOfNumbersDefault = 4;
const maximumNumberDefault = 9;
const targetIntegerDefault = 24;
const allSolutionsDefault = false;
const showNumberOfSolutionsDefault = true;

// Define global variables for the page scope
let numberOfNumbers = numberOfNumbersDefault;
let maximumNumber = maximumNumberDefault;
let targetInteger = targetIntegerDefault;
let allSolutions = allSolutionsDefault;
let showNumberOfSolutions = showNumberOfSolutionsDefault;


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization: enable setting fields and load default numbers
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
{
    let obj;
    // Number of Numbers
    obj = document.getElementById("ID_NUMBER_OF_NUMBERS");
    obj.value = numberOfNumbers;
    obj.classList.remove("hidden");
    // Maximum Number
    obj=document.getElementById("ID_MAX_INTEGER");
    obj.value = maximumNumber; 
    obj.classList.remove("hidden");
    // Target Integer
    obj=document.getElementById("ID_TARGET_INTEGER");
    obj.value = targetInteger;
    obj.classList.remove("hidden");
    // All Solutions
    obj=document.getElementById("ID_ALL_SOLUTIONS");
    obj.checked = allSolutions;
    obj.classList.remove("hidden");
    // Show Number of Solutions
    obj=document.getElementById("ID_SHOW_NUMBER_OF_SOLUTIONS");
    obj.checked = showNumberOfSolutions;
    obj = document.getElementById("ID_SHOW_NUMBER_OF_SOLUTIONS_LABEL");
     if (allSolutions) {
         obj.style.display = "block";
    }
    else {
        obj.style.display = "none";
    }

;

}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Service Filed Updates
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
{
    let obj = document.getElementById("ID_NUMBER_OF_NUMBERS");
    obj.addEventListener("change", function() {
        numberOfNumbers = Number(this.value);
    });

    obj = document.getElementById("ID_MAX_INTEGER");
    obj.addEventListener("input", function() {
        if (!this.checkValidity()) {
            alert(`Invalid Input. Enter a number between 1 and ${this.max}`);
            this.value = maximumNumber;
         }else{
            maximumNumber = Number(this.value);
        }
     });
   
    obj = document.getElementById("ID_TARGET_INTEGER");
    obj.addEventListener("input", function() {
         if (!this.checkValidity()) {
             alert(`Invalid Input. Enter a number between 1 and ${this.max}`);
             this.value = targetInteger;
          }else{
             targetInteger = Number(this.value);
         }
    });

    obj = document.getElementById("ID_ALL_SOLUTIONS");
    obj.addEventListener("change", function() {
        allSolutions = this.checked;
        let obj2 = document.getElementById("ID_SHOW_NUMBER_OF_SOLUTIONS_LABEL");
        let obj1 = document.getElementById("ID_SHOW_NUMBER_OF_SOLUTIONS");
        if(allSolutions){
            obj1.checked = showNumberOfSolutions;
            obj2.style.display = "block";
        }
        else{
            obj2.style.display = "none";
        }
    });

    obj = document.getElementById("ID_SHOW_NUMBER_OF_SOLUTIONS");
    obj.addEventListener("change", function() {
        showNumberOfSolutions = obj.checked;
    });

} // End of Service Filed Updates

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Control Buttons
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
{
    let obj = document.getElementById("ID_NEW_GAME");
    obj.addEventListener("click", function() {
        startNewGame(); //populate the problem and save solution
    });

    obj = document.getElementById("ID_ENTER");
    obj.addEventListener("click", function() {
        saveSolution(); //check and save the current solution, 
        // go to done if only one solution is needed.
    });
    obj = document.getElementById("ID_DONE");
    obj.addEventListener("click", function() {
        displaySolution(); //display all solutions, highlight the one user entered;
    });

    obj = document.getElementById("ID_START_OVWER");
    obj.addEventListener("click", function() {
        startInput(); // reset all buttons for the current solution
    });

} // End of Control Buttons