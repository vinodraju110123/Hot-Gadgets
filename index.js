const phoneListContainer = document.querySelector(".phone-list-container");
const searchBtn = document.querySelector("#search-btn");
const showAllBtn = document.querySelector("#showall-btn");
const input = document.querySelector("#search-input");
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modal-content");
const closeModalBtn = document.querySelector("#close-modal");

let fullList = [];
let showingAll = false;

function updateUI(result, showAll = false) {
    phoneListContainer.innerHTML = "";
    fullList = result;

    let showcaseList = showAll ? result : result.slice(0, 6);

    if (!showAll && result.length > 6) {
        showAllBtn.style.display = "block";
    } else {
        showAllBtn.style.display = "none";
    }

    phoneListContainer.innerHTML = showcaseList
        .map(
            (eachInfoObj) => `
        <div class="card flex flex-col justify-center items-center gap-2 bg-slate-100 w-full text-center text-slate-800 rounded-xl shadow-lg p-6">
            <img src="${eachInfoObj.image}" alt="">
            <h3 class="text-xl font-bold">${eachInfoObj.phone_name}</h3>
            <p class="w-2/3 text-semibold">Click below for more details</p>
            <button class="show-details-btn uppercase font-bold text-white bg-purple-600 cursor-pointer px-6 py-2 rounded-md hover:bg-purple-700" data-id="${eachInfoObj.slug}">Show Details</button>
        </div>`
        )
        .join("");

    document.querySelectorAll(".show-details-btn").forEach((btn) => {
        btn.addEventListener("click", () => fetchPhoneDetails(btn.dataset.id));
    });
}


async function fetchPhoneDetails(phoneId) {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/phone/${phoneId}`);
        const result = await response.json();
        displayModal(result.data);
    } catch (error) {
        console.error("Error fetching details:", error);
    }
}


function displayModal(phone) {
    modal.style.display = "flex";
    modalContent.innerHTML = `
        <h2 class="text-2xl font-bold">${phone.name}</h2>
        <img src="${phone.image}" class="w-32 h-32 mx-auto mt-2" alt="">
        <p class="mt-2"><strong>Brand:</strong> ${phone.brand}</p>
        <p class="mt-2"><strong>Release Date:</strong> ${phone.releaseDate}</p>
        <p class="mt-2"><strong>Chipset:</strong> ${phone.mainFeatures.chipSet}</p>
        <p class="mt-2"><strong>Display:</strong> ${phone.mainFeatures.displaySize}</p>
        <button id="close-modal" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer">Close</button>
    `;

    document.querySelector("#close-modal").addEventListener("click", () => {
        modal.style.display = "none";
    });
}


async function fetchGadgets(query) {
    try {
        phoneListContainer.innerHTML = `<p>Loading...</p>`;
        const response = await fetch(`https://openapi.programming-hero.com/api/phones?search=${query}`);
        const result = await response.json();
        updateUI(result.data);
    } catch (error) {
        console.error("Error fetching data:", error);
        phoneListContainer.innerHTML = `<p>Failed to load data.</p>`;
    }
}

searchBtn.addEventListener("click", () => {
    phoneListContainer.innerHTML = `<div class="font-bold grid-col-span-full text-center">Searching...</div>`;
    showingAll = false;
    setTimeout(() => {
        fetchGadgets(input.value);
    }, 1000);
});


showAllBtn.addEventListener("click", () => {
    updateUI(fullList, true);
});

fetchGadgets(13);