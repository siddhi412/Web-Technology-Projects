/* =====================================
   CITYCARE HOSPITAL
   PATIENT REGISTRATION VALIDATION
   ===================================== */


/* =====================================
   Get Form Elements
   ===================================== */

const form = document.getElementById("patientForm");

const fullName = document.getElementById("fullName");
const dob = document.getElementById("dob");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");
const bloodGroup = document.getElementById("bloodGroup");
const address = document.getElementById("address");
const appointment = document.getElementById("appointment");
const password = document.getElementById("password");
const confirmPassword =
    document.getElementById("confirmPassword");

const medicalFile =
    document.getElementById("medicalFile");

const terms =
    document.getElementById("terms");


/* =====================================
   Regular Expressions
   ===================================== */


/*
   Name:
   Only alphabets and spaces
   Minimum 2 characters
   Maximum 50 characters
*/

const nameRegex =
    /^[A-Za-z ]{2,50}$/;


/*
   Email:
   Basic email format
*/

const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;


/*
   Indian Mobile Number:
   10 digits
   First digit must be 6-9
*/

const mobileRegex =
    /^[6-9][0-9]{9}$/;


/*
   Password:
   Minimum 8 characters
   Maximum 20 characters
   At least:
   - One uppercase
   - One lowercase
   - One number
   - One special character
*/

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;


/* =====================================
   Date Configuration
   ===================================== */

const today = new Date();

const todayString =
    today.toISOString().split("T")[0];


/*
   Date of Birth cannot be
   greater than today's date.
*/

dob.max = todayString;


/*
   Appointment date cannot be
   before today's date.
*/

appointment.min = todayString;


/* =====================================
   Password Strength
   ===================================== */

password.addEventListener("input", function () {

    const value = password.value;

    const strength =
        document.getElementById("passwordStrength");


    if (value.length === 0) {

        strength.textContent = "";

    }

    else if (passwordRegex.test(value)) {

        strength.textContent =
            "Password Strength: Strong";

    }

    else if (value.length >= 6) {

        strength.textContent =
            "Password Strength: Medium";

    }

    else {

        strength.textContent =
            "Password Strength: Weak";
    }

});


/* =====================================
   Form Submission
   ===================================== */

form.addEventListener("submit", function (event) {

    /*
       Prevent form submission
       until validation is complete.
    */

    event.preventDefault();


    let isValid = true;


    /* =================================
       Clear Previous Errors
       ================================= */

    document
        .querySelectorAll(".error")
        .forEach(function (element) {

            element.textContent = "";

        });


    document.getElementById(
        "successMessage"
    ).textContent = "";


    /* =================================
       1. Full Name Validation
       ================================= */

    const nameValue =
        fullName.value.trim();

    fullName.value = nameValue;


    if (nameValue === "") {

        document.getElementById(
            "nameError"
        ).textContent =
            "Full name is required.";

        isValid = false;

    }

    else if (!nameRegex.test(nameValue)) {

        document.getElementById(
            "nameError"
        ).textContent =
            "Name should contain only letters and spaces.";

        isValid = false;
    }


    /* =================================
       2. Date of Birth Validation
       ================================= */

    const dobValue = dob.value;


    if (dobValue === "") {

        document.getElementById(
            "dobError"
        ).textContent =
            "Date of birth is required.";

        isValid = false;

    }

    else if (dobValue > todayString) {

        document.getElementById(
            "dobError"
        ).textContent =
            "Date of birth cannot be in the future.";

        isValid = false;
    }


    /* =================================
       3. Gender Validation
       ================================= */

    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        );


    if (!gender) {

        document.getElementById(
            "genderError"
        ).textContent =
            "Please select your gender.";

        isValid = false;
    }


    /* =================================
       4. Email Validation
       ================================= */

    const emailValue =
        email.value.trim();

    email.value = emailValue;


    if (emailValue === "") {

        document.getElementById(
            "emailError"
        ).textContent =
            "Email address is required.";

        isValid = false;

    }

    else if (!emailRegex.test(emailValue)) {

        document.getElementById(
            "emailError"
        ).textContent =
            "Please enter a valid email address.";

        isValid = false;
    }


    /* =================================
       5. Mobile Validation
       ================================= */

    const mobileValue =
        mobile.value.trim();

    mobile.value = mobileValue;


    if (mobileValue === "") {

        document.getElementById(
            "mobileError"
        ).textContent =
            "Mobile number is required.";

        isValid = false;

    }

    else if (!mobileRegex.test(mobileValue)) {

        document.getElementById(
            "mobileError"
        ).textContent =
            "Enter a valid 10-digit Indian mobile number.";

        isValid = false;
    }


    /* =================================
       6. Blood Group Validation
       ================================= */

    if (bloodGroup.value === "") {

        document.getElementById(
            "bloodError"
        ).textContent =
            "Please select a blood group.";

        isValid = false;
    }


    /* =================================
       7. Address Validation
       ================================= */

    const addressValue =
        address.value.trim();

    address.value = addressValue;


    if (addressValue === "") {

        document.getElementById(
            "addressError"
        ).textContent =
            "Address is required.";

        isValid = false;

    }

    else if (addressValue.length < 10) {

        document.getElementById(
            "addressError"
        ).textContent =
            "Please enter a complete address.";

        isValid = false;
    }


    /* =================================
       8. Appointment Date Validation
       ================================= */

    const appointmentValue =
        appointment.value;


    if (appointmentValue === "") {

        document.getElementById(
            "appointmentError"
        ).textContent =
            "Please select an appointment date.";

        isValid = false;

    }

    else if (appointmentValue < todayString) {

        document.getElementById(
            "appointmentError"
        ).textContent =
            "Appointment date cannot be in the past.";

        isValid = false;
    }


    /* =================================
       9. Password Validation
       ================================= */

    const passwordValue =
        password.value;


    if (passwordValue === "") {

        document.getElementById(
            "passwordError"
        ).textContent =
            "Password is required.";

        isValid = false;

    }

    else if (!passwordRegex.test(passwordValue)) {

        document.getElementById(
            "passwordError"
        ).textContent =
            "Password must contain 8-20 characters, uppercase, lowercase, number and special character.";

        isValid = false;
    }


    /* =================================
       10. Confirm Password
       ================================= */

    const confirmPasswordValue =
        confirmPassword.value;


    if (confirmPasswordValue === "") {

        document.getElementById(
            "confirmPasswordError"
        ).textContent =
            "Please confirm your password.";

        isValid = false;

    }

    else if (
        passwordValue !== confirmPasswordValue
    ) {

        document.getElementById(
            "confirmPasswordError"
        ).textContent =
            "Passwords do not match.";

        isValid = false;
    }


    /* =================================
       11. File Validation
       ================================= */

    const file =
        medicalFile.files[0];


    if (file) {

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];


        /*
           Maximum file size = 2 MB
        */

        const maxSize =
            2 * 1024 * 1024;


        if (!allowedTypes.includes(file.type)) {

            document.getElementById(
                "fileError"
            ).textContent =
                "Only PDF, JPG, JPEG and PNG files are allowed.";

            isValid = false;
        }

        else if (file.size > maxSize) {

            document.getElementById(
                "fileError"
            ).textContent =
                "File size must not exceed 2 MB.";

            isValid = false;
        }
    }


    /* =================================
       12. Terms and Conditions
       ================================= */

    if (!terms.checked) {

        document.getElementById(
            "termsError"
        ).textContent =
            "You must accept the terms and conditions.";

        isValid = false;
    }


    /* =================================
       Final Validation Result
       ================================= */

    if (isValid) {

        document.getElementById(
            "successMessage"
        ).textContent =
            "Patient registration successful!";


        /*
           In a real application, the
           validated data should be sent
           securely to the server using HTTPS.
        */


        form.reset();

        document.getElementById(
            "passwordStrength"
        ).textContent = "";

    }

});