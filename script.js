const container = document.getElementById("issues-container");
const issueCount = document.querySelector("h2");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("issue_modal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalDetails = document.getElementById("modalDetails");

async function fetchIssues(url) {
    container.innerHTML = `
        <div class="flex justify-center col-span-full py-10">
            <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        container.innerHTML = `<p class="text-center text-red-500 col-span-full">Something went wrong!</p>`;
    }
}

function setActiveButton(clickedBtn) {
    if (!clickedBtn) return;
    const buttons = document.querySelectorAll("section button");
    buttons.forEach(btn => btn.classList.remove("btn-primary"));
    clickedBtn.classList.add("btn-primary");
}

function displayIssues(issues) {
    container.innerHTML = "";
    issueCount.innerText = `${issues.length} Issues`;

    if (issues.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-500 col-span-full">No issues found.</p>`;
        return;
    }

    issues.forEach(issue => {
        const card = document.createElement("div");
        const borderColor = issue.status === "open" ? "border-t-[6px] border-t-green-500" : "border-t-[6px] border-t-purple-500";
        
        card.className = `bg-white p-5 rounded-lg shadow-sm border border-gray-100 ${borderColor} hover:shadow-md transition cursor-pointer relative`;

        card.innerHTML = `
            <div class="flex justify-between items-start mb-1">
                <div class="flex items-start gap-2">
                    <div class="mt-1 ${issue.status === 'open' ? 'text-green-500' : 'text-purple-500'}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                    <h3 class="font-extrabold text-gray-800 text-[17px] leading-tight">${issue.title}</h3>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-200 text-pink-500 bg-pink-50 uppercase">
                    ${issue.priority || 'High'}
                </span>
            </div>

            <p class="text-sm text-gray-500 mb-3 ml-7 line-clamp-2">${issue.description}</p>

            <div class="flex flex-wrap gap-2 mb-6 ml-7">
                <span class="bg-yellow-400 text-gray-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    ${issue.label || 'BUG'}
                </span>
            </div>

            <div class="flex justify-between items-end text-[12px] text-gray-400 ml-7">
                <div>
                    <p>#${issue._id ? issue._id.slice(-4) : '1'} by <span class="font-medium text-gray-500">${issue.author || 'User'}</span></p>
                </div>
                <div class="text-right font-medium">
                    <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            openModal(issue);
        });

        container.appendChild(card);
    });
}

function openModal(issue) {
    modalTitle.innerText = issue.title;
    modalDescription.innerText = issue.description;
    
    modalDetails.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><b>Status:</b> <span class="${issue.status === 'open' ? 'text-green-600' : 'text-purple-600'} font-bold uppercase">${issue.status}</span></p>
            <p><b>Author:</b> ${issue.author || 'N/A'}</p>
            <p><b>Priority:</b> ${issue.priority || 'High'}</p>
            <p><b>Label:</b> ${issue.label || 'BUG'}</p>
            <p><b>Assignee:</b> ${issue.assignee || 'Not Assigned'}</p>
            <p><b>Created:</b> ${new Date(issue.createdAt).toLocaleString()}</p>
        </div>
    `;
    
    modal.showModal();
}

async function loadIssues(btn) {
    setActiveButton(btn);
    const data = await fetchIssues("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    displayIssues(data);
}

async function openIssues(btn) {
    setActiveButton(btn);
    const data = await fetchIssues("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const openData = data.filter(issue => issue.status === "open");
    displayIssues(openData);
}

async function closedIssues(btn) {
    setActiveButton(btn);
    const data = await fetchIssues("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const closedData = data.filter(issue => issue.status === "closed");
    displayIssues(closedData);
}

async function searchIssue() {
    const text = searchInput.value.trim();
    if (text === "") {
        loadIssues();
        return;
    }
    const data = await fetchIssues(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
    displayIssues(data);
}
loadIssues();