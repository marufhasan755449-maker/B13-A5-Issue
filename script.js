const container = document.getElementById("issues-container");
const issueCount = document.querySelector("h2");
const searchInput = document.getElementById("searchInput");

function setActiveButton(clickedBtn){
    const buttons = document.querySelectorAll("section button");
    buttons.forEach(btn => btn.classList.remove("btn-primary"));
    clickedBtn.classList.add("btn-primary");
}
function displayIssues(issues){
    container.innerHTML = "";
    issueCount.innerText = `${issues.length} Issues`;

    issues.forEach(issue=>{
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded shadow border-t-4 hover:shadow-lg transition";

        if(issue.status === "open"){
            card.classList.add("border-green-500");
        } else {
            card.classList.add("border-purple-500");
        }

        card.innerHTML = `
            <h3 class="font-bold text-lg text-gray-800 mb-2">${issue.title}</h3>
            <p class="text-sm text-gray-500 mb-3">${issue.description}</p>
            <div class="text-sm space-y-1 text-gray-700">
                <p><b>Status:</b> ${issue.status}</p>
                <p><b>Author:</b> ${issue.author}</p>
                <p><b>Priority:</b> ${issue.priority}</p>
                <p><b>Label:</b> ${issue.label}</p>
                <p><b>Created:</b> ${issue.createdAt}</p>
            </div>
        `;

        container.appendChild(card);
    });
}
async function loadIssues(btn){
    if(btn) setActiveButton(btn);

    container.innerHTML = `<div class="flex justify-center col-span-4">
        <span class="loading loading-spinner loading-lg"></span>
    </div>`;

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();

    displayIssues(data.data);
}
async function openIssues(btn){
    setActiveButton(btn);

    container.innerHTML = `<div class="flex justify-center col-span-4">
        <span class="loading loading-spinner loading-lg"></span>
    </div>`;

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();

    const openData = data.data.filter(issue => issue.status === "open");

    displayIssues(openData);
}
async function closedIssues(btn){
    setActiveButton(btn);

    container.innerHTML = `<div class="flex justify-center col-span-4">
        <span class="loading loading-spinner loading-lg"></span>
    </div>`;

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();

    const closedData = data.data.filter(issue => issue.status === "closed");

    displayIssues(closedData);
}

async function searchIssue(){
    const text = searchInput.value.trim();

    if(text === ""){
        loadIssues();
        return;
    }

    container.innerHTML = `<div class="flex justify-center col-span-4">
        <span class="loading loading-spinner loading-lg"></span>
    </div>`;

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
    const data = await res.json();

    displayIssues(data.data);
}
loadIssues();
function displayIssues(issues) {
    container.innerHTML = "";
    issueCount.innerText = `${issues.length} Issues`;

    issues.forEach(issue => {
        const card = document.createElement("div");
        const borderColor = issue.status === "open" ? "border-t-[6px] border-t-green-500" : "border-t-[6px] border-t-purple-500";
        card.className = `bg-white p-5 rounded-lg shadow-sm border border-gray-100 ${borderColor} hover:shadow-md transition cursor-pointer mb-5 relative`;

        card.innerHTML = `
            <div class="flex justify-between items-start mb-1">
                <div class="flex items-start gap-2">
                    <div class="mt-1 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                    <h3 class="font-extrabold text-gray-800 text-[17px] leading-tight">${issue.title}</h3>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-200 text-pink-500 bg-pink-50 uppercase tracking-tighter">
                    ${issue.priority || 'High'}
                </span>
            </div>

            <p class="text-sm text-gray-500 mb-3 ml-7">${issue.description}</p>

            <div class="flex flex-wrap gap-2 mb-6 ml-7">
                <span class="bg-yellow-400 text-gray-800 text-[10px] font-black px-2 py-0.5 rounded tracking-wide uppercase">
                    ${issue.label || 'BUG'}
                </span>
                ${issue.label2 ? `<span class="bg-yellow-400 text-gray-800 text-[10px] font-black px-2 py-0.5 rounded tracking-wide uppercase">${issue.label2}</span>` : issue.label === 'BUG' ? '<span class="bg-yellow-400 text-gray-800 text-[10px] font-black px-2 py-0.5 rounded tracking-wide uppercase">HELP WANTED</span>' : ''}
            </div>

            <div class="flex justify-between items-end text-[12px] text-gray-400 ml-7">
                <div class="space-y-1">
                    <p>#${issue._id ? issue._id.slice(-1) : '1'} by <span class="font-medium text-gray-500">${issue.author || 'john_doe'}</span></p>
                    <p>Assignee: <span class="font-medium text-gray-500">${issue.assignee || 'jane_smith'}</span></p>
                </div>
                <div class="text-right space-y-1 font-medium">
                    <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
                    <p>Updated: ${new Date(issue.updatedAt || issue.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        card.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            modalTitle.innerText = issue.title;
            modalDescription.innerText = issue.description;
            modalDetails.innerHTML = `
                <div class="grid grid-cols-2 gap-2 text-sm">
                    <p><b>Status:</b> <span class="text-green-600 font-bold uppercase">${issue.status}</span></p>
                    <p><b>Author:</b> ${issue.author}</p>
                    <p><b>Priority:</b> ${issue.priority}</p>
                    <p><b>Label:</b> ${issue.label}</p>
                </div>
            `;
            modal.showModal();
        });

        container.appendChild(card);
    });
}
