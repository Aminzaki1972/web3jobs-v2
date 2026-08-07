// =========================
// Web3Jobs app.js
// Supabase Jobs System
// =========================


// Supabase Settings

const SUPABASE_URL = "ضع_رابط_Supabase_هنا";
const SUPABASE_KEY = "ضع_مفتاح_Supabase_هنا";


const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =========================
// Load Jobs
// =========================

async function loadJobs() {

    const container =
    document.getElementById("jobs-container");


    if (!container) return;


    const { data, error } =
    await db
    .from("jobs")
    .select("*")
    .order("created_at", {
        ascending: false
    });


    if (error) {

        console.error(error);

        container.innerHTML =
        `
        <p>
        Error loading jobs
        </p>
        `;

        return;
    }


    container.innerHTML = "";


    data.forEach(job => {


        container.innerHTML +=

        `
        <div class="job-card">

            <h3>
            ${job.title}
            </h3>


            <p>
            🏢 ${job.company}
            </p>


            <p>
            📍 ${job.location}
            </p>


            <p>
            💼 ${job.type}
            </p>


            <p>
            ${job.description || ""}
            </p>


            <a class="btn"
href="${job.apply_link}"
target="_blank">
Apply Now
</a>


        </div>
        `;


    });


}


// =========================
// Search Jobs
// =========================

function searchJobs() {


    const input =
    document.getElementById("searchInput");


    if (!input) return;


    input.addEventListener(
    "keyup",
    function(){


        const value =
        input.value.toLowerCase();


        const cards =
        document.querySelectorAll(".job-card");


        cards.forEach(card => {


            const text =
            card.innerText.toLowerCase();


            if(text.includes(value)) {

                card.style.display =
                "block";

            } else {

                card.style.display =
                "none";

            }


        });


    });


}


// =========================
// Start Application
// =========================

document.addEventListener(
"DOMContentLoaded",
()=>{

    loadJobs();

    searchJobs();

});
