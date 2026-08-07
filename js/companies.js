// =========================
// Web3Jobs Companies System
// =========================


// Supabase Configuration

const SUPABASE_URL = "ضع_رابط_Supabase_هنا";
const SUPABASE_KEY = "ضع_مفتاح_Supabase_هنا";


const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



// Load Companies

async function loadCompanies(){


const container =
document.getElementById("companies-container");


if(!container) return;



const { data, error } = await db
.from("companies")
.select("*")
.order("created_at", {
    ascending:false
});



if(error){

console.error(error);


container.innerHTML =
`
<p>
Unable to load companies
</p>
`;

return;

}




container.innerHTML = "";



data.forEach(company => {


container.innerHTML +=

`

<div class="job-card">


<h3>
${company.name}
</h3>



<img 
src="${company.logo || 'assets/images/company.png'}"
alt="${company.name}"
width="80"
>



<p>
${company.description || ""}
</p>



<a 
class="btn"
href="${company.website}"
target="_blank">

Visit Website

</a>



</div>

`;



});



}



// Start

document.addEventListener(
"DOMContentLoaded",
()=>{

loadCompanies();

});
