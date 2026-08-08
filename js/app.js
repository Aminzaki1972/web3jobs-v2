// ==========================================
// Web3Jobs - Jobs System
// ==========================================

document.addEventListener("DOMContentLoaded", async function () {

    const jobsContainer =
        document.getElementById("jobs-container");

    const searchInput =
        document.getElementById("searchInput");


    if (!jobsContainer) {
        console.error("jobs-container not found.");
        return;
    }


    // ==========================================
    // CHECK SUPABASE
    // ==========================================

    if (typeof web3Supabase === "undefined") {

        jobsContainer.innerHTML = `
            <div style="
                text-align:center;
                padding:30px;
                color:red;
            ">
                <h3>Supabase connection error</h3>
                <p>
                    web3Supabase is not defined.
                </p>
            </div>
        `;

        return;
    }


    // ==========================================
    // LOAD JOBS
    // ==========================================

    async function loadJobs() {

        jobsContainer.innerHTML = `
            <p style="text-align:center;">
                Loading jobs...
            </p>
        `;


        try {

            const result =
                await web3Supabase
                    .from("jobs")
                    .select("*");


            console.log(
                "SUPABASE RESULT:",
                result
            );


            // ======================================
            // ERROR
            // ======================================

            if (result.error) {

                jobsContainer.innerHTML = `
                    <div style="
                        text-align:center;
                        padding:30px;
                        color:red;
                    ">

                        <h3>
                            Failed to load jobs
                        </h3>

                        <p>
                            ${escapeHTML(
                                result.error.message
                            )}
                        </p>

                        <p style="
                            font-size:13px;
                            color:#777;
                        ">

                            Code:
                            ${escapeHTML(
                                result.error.code ||
                                "N/A"
                            )}

                        </p>

                    </div>
                `;

                return;
            }


            // ======================================
            // DATA
            // ======================================

            const jobs =
                Array.isArray(result.data)
                    ? result.data
                    : [];


            console.log(
                "JOBS:",
                jobs
            );


            if (jobs.length === 0) {

                jobsContainer.innerHTML = `
                    <p style="
                        text-align:center;
                        padding:30px;
                    ">
                        No jobs available yet.
                    </p>
                `;

                return;
            }


            displayJobs(jobs);


        }

        catch (error) {

            console.error(
                "JOBS EXCEPTION:",
                error
            );


            jobsContainer.innerHTML = `
                <div style="
                    text-align:center;
                    padding:30px;
                    color:red;
                ">

                    <h3>
                        Failed to connect to database
                    </h3>

                    <p>
                        ${escapeHTML(
                            error.message ||
                            String(error)
                        )}
                    </p>

                </div>
            `;

        }

    }


    // ==========================================
    // DISPLAY JOBS
    // ==========================================

    function displayJobs(jobs) {

        jobsContainer.innerHTML =
            jobs.map(function (job) {

                return `

                    <div class="job-card">

                        <h3>
                            ${escapeHTML(
                                job.title ||
                                "Untitled Job"
                            )}
                        </h3>

                        <p>
                            <strong>
                                Company:
                            </strong>

                            ${escapeHTML(
                                job.company ||
                                "Not specified"
                            )}
                        </p>

                        <p>
                            <strong>
                                Location:
                            </strong>

                            ${escapeHTML(
                                job.location ||
                                "Remote"
                            )}
                        </p>

                        <p>
                            <strong>
                                Type:
                            </strong>

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
                            data-job-id="${escapeHTML(
                                job.id
                            )}"
                        >
                            Apply
                        </button>

                    </div>

                `;

            }).join("");


        document
            .querySelectorAll(".apply-btn")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        applyToJob(
                            button.getAttribute(
                                "data-job-id"
                            )
                        );

                    }
                );

            });

    }


    // ==========================================
    // APPLY
    // ==========================================

    async function applyToJob(jobId) {

        try {

            const {
                data,
                error
            } =
            await web3Supabase
                .auth
                .getSession();


            if (error) {

                alert(
                    "Unable to check login session."
                );

                return;
            }


            if (!data.session) {

                alert(
                    "Please login before applying."
                );

                window.location.href =
                    "login.html";

                return;
            }


            const user =
                data.session.user;


            const {
                data: existing,
                error: checkError
            } =
            await web3Supabase
                .from("applications")
                .select("id")
                .eq("job_id", Number(jobId))
                .eq("user_id", user.id)
                .maybeSingle();


            if (checkError) {

                console.error(
                    "Application check:",
                    checkError
                );

                alert(
                    checkError.message
                );

                return;
            }


            if (existing) {

                alert(
                    "You have already applied for this job."
                );

                return;
            }


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
                    "Application insert:",
                    insertError
                );

                alert(
                    insertError.message
                );

                return;
            }


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
                error.message
            );

        }

    }


    // ==========================================
    // SEARCH
    // ==========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const term =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                const cards =
                    document.querySelectorAll(
                        ".job-card"
                    );


                cards.forEach(function (card) {

                    const text =
                        card.textContent
                            .toLowerCase();


                    card.style.display =
                        !term ||
                        text.includes(term)
                            ? ""
                            : "none";

                });

            }
        );

    }


    // ==========================================
    // SECURITY
    // ==========================================

    function escapeHTML(value) {

        return String(value ?? "")

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    // ==========================================
    // START
    // ==========================================

    loadJobs();

});
