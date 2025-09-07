let selectedNumber = null;
let selectedButton = null;
let selectionTimeout = null;
const SELECTION_TIMEOUT_MS = 5000; // 5 seconds

// Clear selection function
function clearSelection() {
    if (selectedButton) {
        selectedButton.classList.remove('selected');
    }
    selectedNumber = null;
    selectedButton = null;
    
    if (selectionTimeout) {
        clearTimeout(selectionTimeout);
        selectionTimeout = null;
    }
    
    console.log('Selection cleared');
}

// Number button tap handler
function handleNumberButtonTap(event) {
    const button = event.currentTarget;
    
    // Don't select if button is disabled
    if (button.disabled) return;
    
    // Clear any existing selection first
    clearSelection();
    
    // Select this number
    button.classList.add('selected');
    selectedNumber = button.dataset.value;
    selectedButton = button;
    
    console.log(`Selected number: ${selectedNumber}`);
    
    // Start 5-second timeout
    selectionTimeout = setTimeout(() => {
        console.log('Selection timed out');
        clearSelection();
    }, SELECTION_TIMEOUT_MS);
}

// Target button tap handler
function handleTargetButtonTap(event) {
    const button = event.currentTarget;
    
    // Only assign if we have a selection and target is empty
    if (selectedNumber && button.textContent === '?') {
        // Assign number to target
        button.textContent = selectedNumber;
        button.classList.add('assigned');
        
        // Disable the number button permanently
        selectedButton.disabled = true;
        selectedButton.classList.add('disabled');
        
        console.log(`Assigned ${selectedNumber} to target`);
        
        // Clear selection
        clearSelection();
    } else if (!selectedNumber) {
        console.log('No number selected. Please select a number first.');
        // Optional: Show user feedback here
    } else if (button.textContent !== '?') {
        console.log('Target already has a value assigned.');
    }
}

// Initialize event listeners
function initializeGame() {
    // Add event listeners to all number buttons
    document.querySelectorAll('.number-btn').forEach(button => {
        button.addEventListener('click', handleNumberButtonTap);
    });
    
    // Add event listeners to all target buttons
    document.querySelectorAll('.target-btn').forEach(button => {
        button.addEventListener('click', handleTargetButtonTap);
    });
    
    // Optional: Clear selection if user clicks elsewhere
    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        
        // If clicked element is not a number or target button, clear selection
        if (!clickedElement.classList.contains('number-btn') && 
            !clickedElement.classList.contains('target-btn')) {
            clearSelection();
        }
    });
}

// CSS classes you'll need:
/*
.number-btn {
    padding: 10px 15px;
    margin: 5px;
    border: 2px solid #ccc;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

/* State 1: Enabled (default state) */
.number-btn:enabled {
    border-color: #ccc;
    background: #fff;
    color: #333;
}

.number-btn:enabled:hover {
    border-color: #999;
    background: #f0f0f0;
}

/* State 2: Selected */
.number-btn.selected {
    border-color: #007AFF;
    background-color: #E3F2FD;
    box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.3);
    color: #007AFF;
    font-weight: bold;
}

.number-btn.selected:hover {
    background-color: #BBDEFB;
}

/* State 3: Disabled */
.number-btn:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
    opacity: 0.6;
    border-color: #ddd;
}

.target-btn {
    padding: 15px 20px;
    margin: 5px;
    border: 2px dashed #999;
    background: #fafafa;
    border-radius: 8px;
    cursor: pointer;
    min-width: 60px;
    text-align: center;
}

.target-btn.assigned {
    border-color: #4CAF50;
    background-color: #E8F5E8;
    border-style: solid;
}
*/

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
// *** Corresponding generator code
const opSelectorInstance = new OpSelector();
const opSelect = opSelectorInstance.element; // Get the actual DOM element
opSelect.id = opID;
row.appendChild(opSelect);