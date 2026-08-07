// =========================
// Web3Jobs app.js
// Supabase Jobs System
// =========================


// =========================
// Supabase Settings
// =========================

const SUPABASE_URL =
"https://uewocyaspztybnvnkbmo.supabase.co";

const SUPABASE_KEY =
"sb_publishable_ap9UMOBhdHdIkW0FCD25nA_NurNviS0";


const db =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================
// Load Jobs
// =========================

async function loadJobs() {

    const container =
    document.getElementById("jobs-container");


    if (!container) {
        return;
    }


    container.innerHTML =
    `
        <p style="text-align:center;">
            Loading jobs...
        </p>
    `;


    try {

        const { data, error } =
        await db
        .from("jobs")
        .select("*")
        .order("created_at", {
            ascending: false
        });


        // =========================
        // Supabase Error
        // =========================

        if (error) {

            console.error(
                "Supabase Jobs Error:",
                error
            );


            container.innerHTML =
            `
                <div class="job-card">

                    <h3>
                        Unable to load jobs
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                </div>
            `;

            return;
        }


        // =========================
        // No Jobs
        // =========================

        if (!data || data.length === 0) {

            container.innerHTML =
            `
                <div class="job-card">

                    <h3>
                        No jobs available
                    </h3>

                    <p>
                        New Web3 jobs will appear here soon.
                    </p>

                </div>
            `;

            return;
        }


        // =========================
        // Clear Container
        // =========================

        container.innerHTML = "";


        // =========================
        // Display Jobs
        // =========================

        data.forEach(job => {


            const card =
            document.createElement("div");


            card.className =
            "job-card";


            card.innerHTML =
            `

                <h3>
                    ${escapeHTML(job.title || "Untitled Job")}
                </h3>


                <p>
                    🏢
                    ${escapeHTML(job.company || "Unknown Company")}
                </p>


                <p>
                    📍
                    ${escapeHTML(job.location || "Remote")}
                </p>


                <p>
                    💼
                    ${escapeHTML(job.type || "Web3 Job")}
                </p>


                <p>
                    ${escapeHTML(job.description || "")}
                </p>


                <a
                    class="btn"
                    href="job.html?id=${encodeURIComponent(job.id)}"
                >
                    View Job
                </a>

            `;


            container.appendChild(card);

        });


    }

    catch (error) {

        console.error(
            "Unexpected Jobs Error:",
            error
        );


        container.innerHTML =
        `
            <div class="job-card">

                <h3>
                    Unable to load jobs
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;

    }

}


// =========================
// Search Jobs
// =========================

function searchJobs() {


    const input =
    document.getElementById("searchInput");


    if (!input) {
        return;
    }


    input.addEventListener(
        "keyup",
        function() {


            const value =
            input.value
            .toLowerCase()
            .trim();


            const cards =
            document.querySelectorAll(
                "#jobs-container .job-card"
            );


            cards.forEach(card => {


                const text =
                card.innerText
                .toLowerCase();


                if (
                    value === "" ||
                    text.includes(value)
                ) {

                    card.style.display =
                    "block";

                }

                else {

                    card.style.display =
                    "none";

                }

            });

        }
    );

}


// =========================
// HTML Security
// =========================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// =========================
// Start Application
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadJobs();

        searchJobs();

    }
);
