// =========================
// Web3Jobs Company Dashboard
// Add Jobs System
// =========================


// Supabase Configuration

const SUPABASE_URL = "ضع_رابط_Supabase_هنا";
const SUPABASE_KEY = "ضع_مفتاح_Supabase_هنا";


const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);




// Add New Job

async function addJob(){


const title =
document.getElementById("title").value;


const company =
document.getElementById("company").value;


const location =
document.getElementById("location").value;


const type =
document.getElementById("type").value;


const description =
document.getElementById("description").value;


const apply_link =
document.getElementById("apply_link").value;



const message =
document.getElementById("message");



if(!title || !company){

message.innerHTML =
"Please enter job title and company name";

return;

}




const { data, error } =
await db
.from("jobs")
.insert([

{

title:title,

company:company,

location:location,

type:type,

description:description,

apply_link:apply_link

}

]);




if(error){

console.error(error);

message.innerHTML =
"Error adding job";

return;

}




message.innerHTML =
"Job published successfully 🚀";



// Clear fields

document.querySelectorAll("input, textarea")
.forEach(input=>{

input.value="";

});



}
