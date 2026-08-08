// ==========================================
// Web3Jobs - Jobs System
// Supabase Jobs Loader
// ==========================================


// ==========================================
// JOBS CONTAINER
// ==========================================

const jobsContainer =
    document.getElementById("jobs-container");

const searchInput =
    document.getElementById("searchInput");


// ==========================================
// JOBS DATA
// ==========================================

let allJobs = [];


// ==========================================
// LOAD JOBS FROM SUPABASE
// ==========================================

async function loadJobs() {

    if (!jobsContainer) {
        return;
    }

    jobsContainer.innerHTML = `
        <p style="text-align:center;">
            Loading jobs...
        </p>
    `;

    try {

        const {
            data,
            error
        } = await web3Supabase
            .from("jobs")
            .select("*")
            .order("created_at", {
                ascending: false
            });


        if (error) {

            console.error(
                "Supabase jobs error:",
                error
            );

            jobsContainer.innerHTML = `
                <p style="
                    text-align:center;
                    color:red;
                ">
                    Failed to load jobs.
                </p>
            `;

            return;
        }


        allJobs = data || [];

        displayJobs(allJobs);

    }

    catch (error) {

        console.error(
            "Load jobs error:",
            error
        );

        jobsContainer.innerHTML = `
            <p style="
                text-align:center;
                color:red;
            ">
                Failed to connect to jobs database.
            </p>
        `;
    }
}


// ==========================================
// DISPLAY JOBS
// ==========================================

function displayJobs(jobs) {

    if (!jobsContainer) {
        return;
    }


    if (!jobs || jobs.length === 0) {

        jobsContainer.innerHTML = `
            <p style="text-align:center;">
                No jobs available yet.
            </p>
        `;

        return;
    }


    jobsContainer.innerHTML = jobs.map(function(job) {

        return `

            <div class="job-card">

                <h3>
                    ${escapeHTML(job.title || "Untitled Job")}
                </h3>


                <p>
                    <strong>Company:</strong>
                    ${escapeHTML(job.company || "Not specified")}
                </p>


                <p>
                    <strong>Location:</strong>
                    ${escapeHTML(job.location || "Remote")}
                </p>


                <p>
                    <strong>Type:</strong>
                    ${escapeHTML(job.type || "Not specified")}
                </p>


                <p>
                    ${escapeHTML(
                        job.description ||
                        "No description available."
                    )}
                </p>


                <button
                    class="btn apply-btn"
                    type="button"
                    onclick="applyToJob(${job.id})"
                >
                    Apply
                </button>

            </div>

        `;

    }).join("");
}


// ==========================================
// SEARCH JOBS
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            const searchTerm =
                searchInput.value
                    .toLowerCase()
                    .trim();


            if (!searchTerm) {

                displayJobs(allJobs);

                return;
            }


            const filteredJobs =
                allJobs.filter(function(job) {

                    const title =
                        String(job.title || "")
                            .toLowerCase();

                    const company =
                        String(job.company || "")
                            .toLowerCase();

                    const location =
                        String(job.location || "")
                            .toLowerCase();

                    const type =
                        String(job.type || "")
                            .toLowerCase();

                    const description =
                        String(job.description || "")
                            .toLowerCase();


                    return (

                        title.includes(searchTerm) ||

                        company.includes(searchTerm) ||

                        location.includes(searchTerm) ||

                        type.includes(searchTerm) ||

                        description.includes(searchTerm)

                    );

                });


            displayJobs(filteredJobs);

        }
    );

}


// ==========================================
// APPLY TO JOB
// ==========================================

async function applyToJob(jobId) {

    try {

        const {
            data,
            error
        } =
        await web3Supabase.auth.getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            window.location.href =
                "login.html";

            return;
        }


        const session =
            data
            ? data.session
            : null;


        // User is not logged in

        if (!session) {

            alert(
                "Please login or register before applying for a job."
            );

            window.location.href =
                "login.html";

            return;
        }


        // User is logged in

        alert(
            "Application system is ready. We will connect your application to the selected job next."
        );

        console.log(
            "Selected Job ID:",
            jobId
        );

    }

    catch (error) {

        console.error(
            "Apply error:",
            error
        );

    }
}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ==========================================
// START JOB SYSTEM
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadJobs();

    }
);
