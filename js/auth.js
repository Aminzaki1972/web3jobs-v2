// ==========================================
// Web3Jobs Authentication
// ==========================================

// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL =
"https://uewocyaspztybnvnkbmo.supabase.co";

const SUPABASE_KEY =
"sb_publishable_ap9UMOBhdHdIkW0FCD25nA_NurNviS0";


// ==========================================
// CREATE SUPABASE CLIENT
// ==========================================

const { createClient } = window.supabase;

const supabaseClient =
createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// LOGIN
// ==========================================

async function login() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");


    // Clear message

    message.textContent = "";


    // ==========================================
    // VALIDATE
    // ==========================================

    if (!email) {

        message.textContent =
            "Please enter your email.";

        return;
    }


    if (!password) {

        message.textContent =
            "Please enter your password.";

        return;
    }


    message.textContent =
        "Logging in...";


    try {


        // ==========================================
        // SUPABASE LOGIN
        // ==========================================

        const {
            data,
            error
        } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


        // ==========================================
        // LOGIN ERROR
        // ==========================================

        if (error) {

            console.error(
                "Login error:",
                error
            );

            message.textContent =
                error.message;

            return;
        }


        if (!data || !data.user) {

            message.textContent =
                "Login failed.";

            return;
        }


        const user =
            data.user;


        // ==========================================
        // GET ACCOUNT TYPE
        // ==========================================

        let accountType =
            user.user_metadata?.account_type;


        // ==========================================
        // TRY PROFILES TABLE
        // ==========================================

        const {
            data: profile,
            error: profileError
        } =
        await supabaseClient

            .from("profiles")

            .select("account_type")

            .eq("id", user.id)

            .maybeSingle();


        if (!profileError && profile) {

            accountType =
                profile.account_type;

        }


        console.log(
            "Account type:",
            accountType
        );


        // ==========================================
        // COMPANY
        // ==========================================

        if (accountType === "company") {

            message.textContent =
                "Company login successful!";


            setTimeout(function() {

                window.location.href =
                    "company-dashboard.html";

            }, 500);


            return;
        }


        // ==========================================
        // INDIVIDUAL
        // ==========================================

        message.textContent =
            "Login successful!";


        setTimeout(function() {

            window.location.href =
                "dashboard.html";

        }, 500);

    }


    catch (error) {

        console.error(
            "Unexpected login error:",
            error
        );

        message.textContent =
            "Login failed. Please try again.";

    }

}


// ==========================================
// GET CURRENT USER
// ==========================================

async function getCurrentUser() {

    try {

        const {
            data,
            error
        } =
        await supabaseClient.auth.getUser();


        if (error) {

            console.error(
                "Get user error:",
                error
            );

            return null;
        }


        return data.user || null;

    }


    catch (error) {

        console.error(error);

        return null;

    }

}


// ==========================================
// LOGOUT
// ==========================================

async function logout() {

    try {

        const {
            error
        } =
        await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Logout error:",
                error
            );

            return;
        }


        window.location.href =
            "index.html";

    }


    catch (error) {

        console.error(error);

    }

}


// ==========================================
// GLOBAL AUTH OBJECT
// ==========================================

window.Web3JobsAuth = {

    supabase:
        supabaseClient,

    getCurrentUser:
        getCurrentUser,

    logout:
        logout

};
