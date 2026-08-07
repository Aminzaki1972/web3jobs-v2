// =========================
// Web3Jobs Job Details
// + Apply Button System
// =========================


// Get Job ID From URL

const params = new URLSearchParams(
    window.location.search
);

const jobId = params.get("id");




// Load Job Details

async function loadJob(){


const container =
document.getElementById("job-details");


if(!container) return;



const { data, error } =
await db
.from("jobs")
.select("*")
.eq("id", jobId)
.single();




if(error){

console.log(error);

container.innerHTML =
`
<p>
Job not found
</p>
`;

return;

}




container.innerHTML =

`

<div class="job-card">


<h2>
${data.title}
</h2>



<h3>
${data.company}
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




// Start Loading

document.addEventListener(
"DOMContentLoaded",
()=>{

loadJob();

});
