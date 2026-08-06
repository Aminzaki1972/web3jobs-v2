
// =========================
// Web3Jobs App.js
// Supabase Jobs Loader
// =========================


// Supabase Configuration

const SUPABASE_URL = "https://lmkfieqwkrbdbtemhsyr.supabase.co";
const SUPABASE_KEY = "sb_publishable_S_2GRmf1XaPVG0KQ8-sQIg_eHXLfHus";


const client = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// Load Jobs

async function loadJobs() {

    const jobsContainer = document.getElementById("jobs-container");

    if (!jobsContainer) return;


    const { data, error } = await client
        .from("jobs")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.log(error);

        jobsContainer.innerHTML =
        `
        <p>
        Unable to load jobs
        </p>
        `;

        return;
    }


    jobsContainer.innerHTML = "";


    data.forEach(job => {


        jobsContainer.innerHTML +=

        `
        <div class="job-card">

            <h3>
            ${job.title}
            </h3>


            <p>
            Company:
            ${job.company}
            </p>


            <p>
            Location:
            ${job.location}
            </p>


            <p>
            Type:
            ${job.type}
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


// Search Jobs

function searchJobs(){


const input =
document.getElementById("searchInput");


const cards =
document.querySelectorAll(".job-card");


input.addEventListener(
"keyup",
function(){


let value =
input.value.toLowerCase();


cards.forEach(card=>{


let text =
card.innerText.toLowerCase();


if(text.includes(value)){

card.style.display="block";

}else{

card.style.display="none";

}


});


});


}


// Start App

document.addEventListener(
"DOMContentLoaded",
()=>{


loadJobs();

searchJobs();


});
