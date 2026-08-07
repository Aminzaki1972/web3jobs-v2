// ==========================================
// Web3Jobs Authentication
// Supabase Auth
// ==========================================


// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL =
"https://uewocyaspztybnvnkbmo.supabase.co";

const SUPABASE_KEY =
"sb_publishable_ap9UMOBhdHdIkW0FCD25nA_NurNviS0";


// Create Supabase client

const { createClient } = supabase;

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



    // Check email

    if (!email) {

        message.textContent =
        "Please enter your email.";

        return;
    }



    // Check password

    if (!password) {

        message.textContent =
        "Please enter your password.";

        return;
    }



    message.textContent =
    "Logging in...";


    try {

        // ======================================
        // SUPABASE LOGIN
        // ======================================

        const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });



        // ======================================
        // LOGIN ERROR
        // ======================================

        if (error) {

            console.error(
                "Login error:",
                error
            );

            message.textContent =
            error.message;

            return;
        }



        // ======================================
        // LOGIN SUCCESS
        // ======================================

        if (data && data.user) {

            message.textContent =
            "Login successful!";


            // Go to home page

            setTimeout(function() {

                window.location.href =
                "index.html";

            }, 700);

        }

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
// CHECK CURRENT USER
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

        const { error } =
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
// EXPORT USER STATUS
// ==========================================

window.Web3JobsAuth = {

    supabase: supabaseClient,

    getCurrentUser: getCurrentUser,

    logout: logout

};
