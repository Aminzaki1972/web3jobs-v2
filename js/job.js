// =========================
// Web3Jobs Job Details
// + Apply Button System
// =========================


// Supabase Settings

const JOBS_SUPABASE_URL =
"https://lmkfieqwkrbdbtemhsyr.supabase.co";

const JOBS_SUPABASE_KEY =
"sb_publishable_S_2GRmf1XaPVG0KQ8-sQIg_eHXLfHus";


const jobDb = supabase.createClient(
    JOBS_SUPABASE_URL,
    JOBS_SUPABASE_KEY
);


// =========================
// Get Job ID From URL
// =========================

const params = new URLSearchParams(
    window.location.search
);

const jobId = params.get("id");


// =========================
// Load Job Details
// =========================

async function loadJob() {

    const container =
        document.getElementById("job-container");


    if (!container) return;


    if (!jobId) {

        container.innerHTML = `
            <p>Job not found</p>
        `;

        return;
    }


    const { data, error } =
        await jobDb
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();


    if (error) {

        console.log(error);

        container.innerHTML = `
            <p>Job not found</p>
        `;

        return;
    }


    container.innerHTML = `

        <div class="job-card">

            <h2>
                ${data.title || ""}
            </h2>

            <h3>
                ${data.company || ""}
            </h3>

            <p>
                📍 ${data.location || ""}
            </p>

            <p>
                💼 ${data.type || ""}
            </p>

            <p>
                ${data.description || ""}
            </p>

            <button
                class="btn"
                onclick="applyForJob(${data.id})">

                Apply Now

            </button>

            <p id="apply-message"></p>

        </div>

    `;
}


// =========================
// Start Loading
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadJob();

    }
);
