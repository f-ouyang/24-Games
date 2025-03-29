"use strict";



function generateExpressions(symbols) {
    const OPERATORS = ['+', '-', '*', '/'];
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

function removeDuplicates(eqnArray,numbers,symbols) {
    let uniqueEqns = [];
    let uniqueEqnsStr = [];
    let nSol=eqns.length;
    let nSymbol=symbols.length;

    // Convert input to string array
    

    
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
                let isSame=valuesI.every((val, index) => math.abs(val-valuesJ[index]) < 1e-8)  
                    // Allow for floating point errors
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
        }// for i
    }// Second, check string equivalence with the particular numbers used
    // All done! Return eqnArray

    return eqnArray;    
}

function extractEquationString(eqns) {
    // Extract the algebraic expressions from the results
    return Object.values(eqns).map(obj => obj.algebra); // Return as string array
}

function displayNumbersInEquation(eqnArray,numbers,symbols) {
    // Put numbers into equations to display
    let eqnArrayWithNumbers = eqnArray.map(eqnStr => {
        let eqnWithNumbers = eqnStr;
        for (let i = 0; i < symbols.length; i++) {
            eqnWithNumbers = eqnWithNumbers.replaceAll(symbols[i], String(numbers[i]));
        }
        return eqnWithNumbers;
    });
    return eqnArrayWithNumbers;
}


// Example usage
let numbers = [2,8,6,16];
let symbols = ["a", "b", "c", "d"];  // Corresponding variables

//Find all combinations of numbers and operators
//let myResults = getAllPossibleResults(numbers, OPERATORS);
let myResults = getAllPossibleResults(numbers, symbols);

//Find Operations that result in 24.0000
let eqns=findSolution(myResults,"24.0000") // Get the equations for 24.0000
if (eqns.length ==0)
    console.log("No solution found");
else {   
    let nSol=eqns.length;
    console.log("Solution found for 24.0000: "+nSol+" solutions");
}
// Extract the algebraic expressions from the results
let eqnsArray=extractEquationString(eqns); // return is string array
// Remove duplicated solutions
let eqnsUnique = removeDuplicates(eqnsArray,numbers,symbols); // return is string array
// Put numbers into equations to display
let eqnsWithNumbers=displayNumbersInEquation(eqnsUnique,numbers,symbols); // return is string array
let nSolUnique=eqnsUnique.length;
console.log("Unique solutions: "+nSolUnique+" solutions");
console.table(eqnsWithNumbers); // Display the unique solutions
