// =========================
// Web3Jobs Job Details
// =========================


// Supabase Configuration

const SUPABASE_URL = "https://lmkfieqwkrbdbtemhsyr.supabase.co";
const SUPABASE_KEY = "sb_publishable_S_2GRmf1XaPVG0KQ8-sQIg_eHXLfHus";


const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



// Get Job ID From URL

const params = new URLSearchParams(
    window.location.search
);

const jobId = params.get("id");



// Load Job Details

async function loadJobDetails(){


const container =
document.getElementById("job-container");


if(!jobId){

container.innerHTML =
`
<h2>
Job not found
</h2>
`;

return;

}



const { data, error } = await db
.from("jobs")
.select("*")
.eq("id", jobId)
.single();



if(error){

console.error(error);


container.innerHTML =
`
<h2>
Unable to load job
</h2>
`;

return;

}




container.innerHTML =

`

<div class="job-card">


<h2>
${data.title}
</h2>


<p>
🏢 Company:
${data.company}
</p>


<p>
📍 Location:
${data.location}
</p>


<p>
💼 Type:
${data.type}
</p>



<p>

${data.description || ""}

</p>



<a class="btn"

href="${data.apply_link}"

target="_blank">

Apply Now

</a>



</div>

`;



}



// Start

document.addEventListener(
"DOMContentLoaded",
()=>{

loadJobDetails();

});
