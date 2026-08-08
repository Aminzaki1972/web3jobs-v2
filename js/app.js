// ==========================================
// Web3Jobs - Jobs System
// Supabase Jobs + Applications
// ==========================================


// ==========================================
// ELEMENTS
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
// LOAD JOBS
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
                    ${escapeHTML(
                        job.title ||
                        "Untitled Job"
                    )}
                </h3>


                <p>
                    <strong>Company:</strong>
                    ${escapeHTML(
                        job.company ||
                        "Not specified"
                    )}
                </p>


                <p>
                    <strong>Location:</strong>
                    ${escapeHTML(
                        job.location ||
                        "Remote"
                    )}
                </p>


                <p>
                    <strong>Type:</strong>
                    ${escapeHTML(
                        job.type ||
                        "Not specified"
                    )}
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
                    data-job-id="${job.id}"
                >
                    Apply
                </button>

            </div>

        `;

    }).join("");


    // Add Apply events

    const applyButtons =
        document.querySelectorAll(
            ".apply-btn"
        );


    applyButtons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const jobId =
                    button.getAttribute(
                        "data-job-id"
                    );

                applyToJob(jobId);

            }
        );

    });
}


// ==========================================
// APPLY TO JOB
// ==========================================

async function applyToJob(jobId) {

    try {

        // Get current logged-in user

        const {
            data,
            error
        } =
        await web3Supabase
            .auth
            .getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            alert(
                "Unable to check your login session."
            );

            return;
        }


        const session =
            data
            ? data.session
            : null;


        // ======================================
        // USER NOT LOGGED IN
        // ======================================

        if (!session) {

            alert(
                "Please login before applying for a job."
            );

            window.location.href =
                "login.html";

            return;
        }


        const user =
            session.user;


        // ======================================
        // CHECK EXISTING APPLICATION
        // ======================================

        const {
            data: existingApplication,
            error: existingError
        } =
        await web3Supabase
            .from("applications")
            .select("id")
            .eq("job_id", jobId)
            .eq("user_id", user.id)
            .maybeSingle();


        if (existingError) {

            console.error(
                "Application check error:",
                existingError
            );

            alert(
                "Could not check your application."
            );

            return;
        }


        // Already applied

        if (existingApplication) {

            alert(
                "You have already applied for this job."
            );

            return;
        }


        // ======================================
        // INSERT APPLICATION
        // ======================================

        const {
            error: insertError
        } =
        await web3Supabase
            .from("applications")
            .insert({

                job_id: Number(jobId),

                user_id: user.id,

                status: "pending"

            });


        if (insertError) {

            console.error(
                "Application insert error:",
                insertError
            );

            alert(
                "Failed to submit your application."
            );

            return;
        }


        // ======================================
        // SUCCESS
        // ======================================

        alert(
            "Your application has been submitted successfully!"
        );

    }

    catch (error) {

        console.error(
            "Apply error:",
            error
        );

        alert(
            "Something went wrong. Please try again."
        );

    }
}


// ==========================================
// SEARCH
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
                        String(
                            job.title || ""
                        ).toLowerCase();

                    const company =
                        String(
                            job.company || ""
                        ).toLowerCase();

                    const location =
                        String(
                            job.location || ""
                        ).toLowerCase();

                    const type =
                        String(
                            job.type || ""
                        ).toLowerCase();

                    const description =
                        String(
                            job.description || ""
                        ).toLowerCase();


                    return (

                        title.includes(
                            searchTerm
                        ) ||

                        company.includes(
                            searchTerm
                        ) ||

                        location.includes(
                            searchTerm
                        ) ||

                        type.includes(
                            searchTerm
                        ) ||

                        description.includes(
                            searchTerm
                        )

                    );

                });


            displayJobs(filteredJobs);

        }
    );

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
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadJobs();

    }
);
