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


// ==========================================
// CREATE SUPABASE CLIENT
// ==========================================

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


    message.textContent = "";


    // ======================================
    // VALIDATE EMAIL
    // ======================================

    if (!email) {

        message.textContent =
        "Please enter your email.";

        return;
    }


    // ======================================
    // VALIDATE PASSWORD
    // ======================================

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

        const {
            data,
            error
        } =
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
        // USER LOGGED IN
        // ======================================

        if (data && data.user) {


            const user =
            data.user;


            // ======================================
            // GET USER PROFILE
            // ======================================

            const {
                data: profile,
                error: profileError
            } =
            await supabaseClient

                .from("profiles")

                .select("account_type")

                .eq("id", user.id)

                .single();


            // ======================================
            // PROFILE ERROR
            // ======================================

            if (profileError) {

                console.error(
                    "Profile error:",
                    profileError
                );


                /*
                 * Fallback:
                 * Read account_type from
                 * Supabase Auth metadata.
                 */

                const accountType =
                user.user_metadata?.account_type;


                // ==================================
                // COMPANY
                // ==================================

                if (
                    accountType === "company"
                ) {

                    window.location.href =
                    "company-dashboard.html";

                    return;

                }


                // ==================================
                // INDIVIDUAL
                // ==================================

                window.location.href =
                "dashboard.html";

                return;

            }


            // ======================================
            // ACCOUNT TYPE
            // ======================================

            const accountType =
            profile?.account_type;


            // ======================================
            // COMPANY DASHBOARD
            // ======================================

            if (
                accountType === "company"
            ) {

                message.textContent =
                "Login successful!";

                setTimeout(function() {

                    window.location.href =
                    "company-dashboard.html";

                }, 400);

                return;

            }


            // ======================================
            // INDIVIDUAL DASHBOARD
            // ======================================

            message.textContent =
            "Login successful!";


            setTimeout(function() {

                window.location.href =
                "dashboard.html";

            }, 400);


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
// EXPORT AUTH
// ==========================================

window.Web3JobsAuth = {

    supabase:
    supabaseClient,

    getCurrentUser:
    getCurrentUser,

    logout:
    logout

};
