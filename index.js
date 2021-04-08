const strengthMeter = document.getElementById("strength");
const passwordField = document.getElementById("password");
const reasonsDiv = document.getElementById("reasons");

passwordField.addEventListener("input", updateStrengthMeter);

function updateStrengthMeter() {
    const weaknesses = calculatePasswordStrength(passwordField.value);
    let strength = 100;
    reasonsDiv.innerHTML = "";
    weaknesses.forEach((weakness) => {
        if (weakness == null) return;
        strength -= weakness.deduction;
        const messageElement = document.createElement("div");
        messageElement.textContent = weakness.message;
        reasonsDiv.appendChild(messageElement);
    });
    if (strength === 100) {
        const messageElement = document.createElement("div");
        messageElement.textContent = "Password meets recommended criteria";
        reasonsDiv.appendChild(messageElement);
    }
    strengthMeter.setAttribute("title", "Strength: " + strength + "%");
    strengthMeter.style.setProperty("--strength", strength);
}

function calculatePasswordStrength(password) {
    const weaknesses = [];
    weaknesses.push(lengthWeakness(password));
    weaknesses.push(caseWeakness(password, /[A-Z]/g, "uppercase"));
    weaknesses.push(caseWeakness(password, /[a-z]/g, "lowercase"));
    weaknesses.push(caseWeakness(password, /[0-9]/g, "number"));
    weaknesses.push(caseWeakness(password, /[^0-9a-zA-Z\s]/g, "special"));
    weaknesses.push(repeatCharWeakness(password));
    return weaknesses;
}

function lengthWeakness(password) {
    const length = password.length;
    if (length <= 5) {
        return {
            message: "Your password is too short",
            deduction: 40,
        };
    }
    if (length <= 8) {
        return {
            message: "Your password could be longer",
            deduction: 15,
        };
    }
}

function caseWeakness(password, regex, type) {
    const matches = password.match(regex) || [];
    if (matches.length === 0) {
        return {
            message: `Your password doesn\'t contain any ${type} characters`,
            deduction: 20,
        };
    }
    if (matches.length <= 2) {
        return {
            message: `Your password could use more ${type} characters`,
            deduction: 5,
        };
    }
}

function repeatCharWeakness(password) {
    const matches = password.match(/(.)\1/g) || [];
    if (matches.length > 0) {
        return {
            message: "Your password contains repeated characters",
            deduction: matches.length * 10,
        };
    }
}
