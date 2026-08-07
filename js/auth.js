// =========================
// Web3jops Authentication
// Supabase Auth System
// =========================

// Supabase Configuration
const SUPABASE_URL =
  "https://zsaokfdnvursdhw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_S_2GRmf1XaPVG0KQ8-sQIg_eHXLfHus";

const db = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// =========================
// Register User
// =========================

async function register() {

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  const roleElement =
    document.getElementById("role");

  const message =
    document.getElementById("message");

  if (!email || !password) {

    message.innerHTML =
      "Please fill all fields";

    return;
  }

  let role = "individual";

  if (roleElement) {
    role = roleElement.value;
  }

  const { data, error } =
    await db.auth.signUp({

      email: email,

      password: password,

      options: {
        data: {
          account_type: role,
          role: role
        }
      }

    });


  if (error) {

    message.innerHTML =
      error.message;

    return;
  }


  const user =
    data.user;


  if (user) {

    const { error: profileError } =
      await db
        .from("profiles")
        .upsert([
          {
            id: user.id,
            email: email,
            role: role
          }
        ]);


    if (profileError) {

      console.log(
        "Profile error:",
        profileError
      );

    }

  }


  message.innerHTML =
    "Account created successfully!";


  setTimeout(() => {

    window.location.href =
      "login.html";

  }, 2000);

}



// =========================
// Login User
// =========================

async function login() {

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  const message =
    document.getElementById("message");


  if (!email || !password) {

    message.innerHTML =
      "Please fill all fields";

    return;
  }


  message.innerHTML =
    "Signing in...";


  const { data, error } =
    await db.auth.signInWithPassword({

      email: email,

      password: password

    });


  if (error) {

    message.innerHTML =
      error.message;

    return;
  }


  const user =
    data.user;


  if (!user) {

    message.innerHTML =
      "Login failed.";

    return;
  }


  // =========================
  // Get User Profile
  // =========================

  const { data: profile, error: profileError } =
    await db
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();


  if (profileError) {

    console.log(
      "Profile error:",
      profileError
    );

  }


  // =========================
  // If profile does not exist
  // create one from Auth metadata
  // =========================

  if (!profile) {

    const accountType =
      user.user_metadata?.account_type ||
      user.user_metadata?.role ||
      "individual";


    await db
      .from("profiles")
      .upsert([
        {
          id: user.id,
          email: user.email,
          role: accountType
        }
      ]);


    // Individual user
    window.location.href =
      "profile.html";

    return;
  }


  // =========================
  // Redirect according to role
  // =========================

  if (profile.role === "company") {

    window.location.href =
      "dashboard.html";

  } else {

    window.location.href =
      "profile.html";

  }

}
