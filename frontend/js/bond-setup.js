// frontend/js/bond-setup.js

// IMPORTANT: Set your backend API URL here
const API_BASE_URL = 'http://localhost:5000/api/bonds'; // Adjust if your port/path is different
const token = localStorage.getItem("token"); // Get the JWT for authentication

// ==========================================================
// 1. AUTHENTICATION CHECK
// ==========================================================
if (!token) {
    // If no JWT token is found, redirect to the login/index page
    window.location.href = "../index.html"; 
}

const bondSetupForm = document.getElementById("bondSetupForm");
if (bondSetupForm) {
    const userNameInput = document.getElementById("userName");
    const partnerNameInput = document.getElementById("partnerName");
    const bondTypeSelect = document.getElementById("bondType");
    const bondDurationSelect = document.getElementById("bondDuration");
    const bondStartDateInput = document.getElementById("bondStartDate");
    const bondEndDateInput = document.getElementById("bondEndDate");
    const bondSummary = document.getElementById("bondSummary");
    const startBondBtn = document.getElementById("startBondBtn");
    // const bondInfo = document.getElementById("bondInfo"); // Not used in this logic

    const today = new Date().toISOString().split("T")[0];
    bondStartDateInput.value = today;
    bondEndDateInput.value = today;

    // --- Utility Functions (Kept your animation/styling logic) ---
    function updateEndDate() {
        const startDate = new Date(bondStartDateInput.value);
        const endDate = new Date(startDate);
        // Duration is in days (assumed based on your logic)
        endDate.setDate(endDate.getDate() + parseInt(bondDurationSelect.value)); 
        bondEndDateInput.value = endDate.toISOString().split("T")[0];
    }
    bondStartDateInput.addEventListener("change", updateEndDate);
    bondDurationSelect.addEventListener("change", updateEndDate);
    updateEndDate();

    function updateSummary() {
        bondSummary.innerHTML = `
            <p><strong>${userNameInput.value || "Your Name"}</strong> & <strong>${partnerNameInput.value || "Partner's Name"}</strong></p>
            <p>Bond Type: <strong>${bondTypeSelect.options[bondTypeSelect.selectedIndex].text}</strong></p>
            <p>Duration: <strong>${bondStartDateInput.value}</strong> to <strong>${bondEndDateInput.value}</strong></p>
        `;
    }

    [userNameInput, partnerNameInput, bondTypeSelect, bondStartDateInput, bondEndDateInput].forEach(el => {
        el.addEventListener("input", updateSummary);
        el.addEventListener("change", updateSummary);
    });
    updateSummary();

    // ==========================================================
    // 2. FORM SUBMISSION (START BOND) - NOW USES API
    // ==========================================================
    startBondBtn.addEventListener("click", async (e) => {
        e.preventDefault(); // Ensure the default submit is prevented
        
        if (!userNameInput.value || !partnerNameInput.value) return alert("Enter both names");

        const bondData = {
            userName: userNameInput.value,
            partnerName: partnerNameInput.value,
            bondType: bondTypeSelect.value,
            startDate: bondStartDateInput.value,
            endDate: bondEndDateInput.value,
            // Add any other setup data you need to send to the server
        };

        try {
            const response = await fetch(`${API_BASE_URL}/setup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Pass the JWT for backend authentication
                    'x-auth-token': token 
                },
                body: JSON.stringify(bondData),
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS: Backend saved data and marked user as 'isConfigured: true'
                alert("Bond setup saved successfully! Redirecting to dashboard.");
                
                // 3. FINAL REDIRECT: Use the URL sent from the backend (/dashboard.html)
                window.location.href = data.redirectUrl; 

            } else {
                // FAILURE: Display error message
                alert(data.message || "Failed to save bond setup.");
            }
        } catch (error) {
            console.error('Bond Setup Error:', error);
            alert("A network error occurred while saving the bond setup.");
        }
    });
}