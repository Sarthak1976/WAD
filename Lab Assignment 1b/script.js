document.addEventListener("DOMContentLoaded", () => {
    const regForm = document.getElementById("regForm");
    const otherHobby = document.getElementById("otherHobby");
    const otherText = document.getElementById("otherText");
    const citySelect = document.getElementById("city");

    const validationRules = {
        name: {
            pattern: /^[A-Za-z\s]+$/,
            error: "Name should only contain letters."
        },
        mobile: {
            pattern: /^[6-9]\d{9}$/,
            error: "Must be 10 digits starting with 6, 7, 8, or 9."
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            error: "Email is invalid."
        },
        password: {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            error: "Invalid password: Min 8 chars, uppercase, lowercase, number and symbol."
        },
        address: {
            validate: (val) => val.includes('\n') || val.trim().length > 30,
            error: "The address should be multiline."
        },
        otherText: {
            validate: (val) => val.trim().length > 0,
            error: "Please specify your other hobby."
        }
    };

    // --- 1. Hobby & City Tooltip Validation ---
    const checkGroupValidity = () => {
        // City check
        if (citySelect.value === "") {
            citySelect.setCustomValidity("Please select an item in the list.");
        } else {
            citySelect.setCustomValidity("");
        }

        // Hobbies check
        const anyHobbyChecked = document.querySelector('.hobby:checked, #otherHobby:checked') !== null;
        const firstHobby = document.querySelector('.hobby'); // Attach tooltip to first checkbox
        
        if (!anyHobbyChecked) {
            firstHobby.setCustomValidity("Please select at least one hobby.");
        } else {
            firstHobby.setCustomValidity("");
        }
    };

    // --- 2. Real-time Text Validation ---
    const validate = (input) => {
        const id = input.id;
        const value = input.value;
        const rule = validationRules[id];
        let errorSpan = document.getElementById(id + "Error");

        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.id = id + "Error";
            errorSpan.className = 'error';
            input.parentNode.insertBefore(errorSpan, input.nextSibling);
        }

        if (!rule) return true;

        let isValid = rule.pattern ? rule.pattern.test(value) : rule.validate(value);

        if (isValid) {
            input.classList.add("valid");
            input.classList.remove("invalid");
            errorSpan.innerText = "";
            input.setCustomValidity("");
        } else {
            input.classList.add("invalid");
            input.classList.remove("valid");
            errorSpan.innerText = rule.error;
            input.setCustomValidity(rule.error); // Show tooltip for text fields too
        }
        return isValid;
    };

    // --- 3. Event Listeners ---
    const inputs = regForm.querySelectorAll("input[type='text'], input[type='tel'], input[type='email'], input[type='password'], textarea");

    inputs.forEach((input) => {
        input.addEventListener("input", () => validate(input));
        input.addEventListener("keydown", (e) => {
            if (e.key === "Tab" && !validate(input)) e.preventDefault();
        });
    });

    // Handle "Other" hobby toggle
    otherHobby.addEventListener("change", function() {
        otherText.style.display = this.checked ? "block" : "none";
        if (!this.checked) {
            otherText.value = "";
            otherText.classList.remove("invalid", "valid");
            document.getElementById("otherTextError").innerText = "";
        }
        checkGroupValidity();
    });

    // Update validity bubbles whenever these change
    citySelect.addEventListener("change", checkGroupValidity);
    document.querySelectorAll(".hobby").forEach(cb => cb.addEventListener("change", checkGroupValidity));

    // --- 4. Submission ---
    // --- 4. Unified Submission Logic ---
    regForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Stop page reload immediately
        
        checkGroupValidity(); // Final check for City/Hobby bubbles

        let isAllValid = regForm.checkValidity(); // Checks native bubble states

        // Validate text fields specifically
        inputs.forEach(input => {
            if (input.id === "otherText") {
                if (otherHobby.checked && !validate(input)) isAllValid = false;
            } else {
                if (!validate(input)) isAllValid = false;
            }
        });

        if (!isAllValid) {
            regForm.reportValidity(); // Show browser bubbles if any
        } else {
            // IF VALID: Collect data and send
            const formData = {
                name: document.getElementById("name").value,
                mobile: document.getElementById("mobile").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                gender: document.querySelector('input[name="gender"]:checked').value,
                hobbies: Array.from(document.querySelectorAll('.hobby:checked, #otherHobby:checked'))
                              .map(cb => cb.nextSibling.textContent.trim())
            };

            // Call the save function
            sendDataWithAjax(formData);
        }
    });
}); // Close DOMContentLoaded

// Define this outside or inside DOMContentLoaded
function sendDataWithAjax(data) {
    console.log("Simulating AJAX POST request...");
    
    // 1. Retrieve existing array
    let userList = JSON.parse(localStorage.getItem("registrationData")) || [];

    // 2. Push new entry
    userList.push(data);

    // 3. Save to Local Storage
    localStorage.setItem("registrationData", JSON.stringify(userList));

    // 4. Success alert and redirect
    alert("Form Submitted Successfully!");
    window.location.href = "raw-data.html";
}