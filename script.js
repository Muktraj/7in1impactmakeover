const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.menu-overlay');

// Toggle menu and overlay open state
menuToggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    overlay.classList.toggle('open');
    menuToggle.classList.toggle('open'); // For hamburger animation
});

// Close menu when clicking on the overlay
overlay.addEventListener('click', () => {
    menu.classList.remove('open');
    overlay.classList.remove('open');
    menuToggle.classList.remove('open');
});

// Close menu when clicking a link inside the mobile menu
const menuLinks = document.querySelectorAll('.menu a:not(.btn-join)');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        if(menu.classList.contains('open')) {
            menu.classList.remove('open');
            overlay.classList.remove('open');
            menuToggle.classList.remove('open');
        }
    });
});

// Dropdown click for mobile/desktop
const dropdownBtn = document.querySelector('.dropdown > a');
const dropdown = document.querySelector('.dropdown');

if(dropdownBtn) {
    dropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('open');
    });
}

// Map Search functionality
const mapSearchBtn = document.getElementById('mapSearchBtn');
const mapSearchInput = document.getElementById('mapSearchInput');
const googleMapIframe = document.getElementById('googleMapIframe');
const fullAddressText = document.getElementById('fullAddressText');

if (mapSearchBtn && mapSearchInput && googleMapIframe) {
    async function updateMap() {
        const address = mapSearchInput.value.trim();
        if (!address) {
            alert("Please enter a valid address, city, or PIN code.");
            return;
        }

        // Check if the input looks exactly like a 6-digit Indian PIN code
        const isPinCode = /^\d{6}$/.test(address);

        if (isPinCode) {
            fullAddressText.textContent = `Fetching area details for Pincode ${address}...`;
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${address}`);
                const data = await response.json();

                if (data && data[0] && data[0].Status === "Success") {
                    // Extracting the first post office area from the response
                    const postOffice = data[0].PostOffice[0];
                    const areaName = postOffice.Name;
                    const district = postOffice.District;
                    const state = postOffice.State;
                    
                    const detailsString = `Pincode: ${address} | Area: ${areaName}, ${district}, ${state}`;
                    fullAddressText.textContent = detailsString;

                    // Update Map with the precise combination of Area and Post details
                    const encodedAddress = encodeURIComponent(`${areaName}, ${district}, ${state}, ${address}, India`);
                    const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
                    googleMapIframe.src = mapUrl;

                } else {
                    fullAddressText.textContent = `Pincode: ${address} (Area not found)`;
                    const encodedAddress = encodeURIComponent(address + ", India");
                    googleMapIframe.src = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
                }
            } catch (error) {
                fullAddressText.textContent = `Pincode: ${address} (Failed to load area data)`;
                const encodedAddress = encodeURIComponent(address + ", India");
                googleMapIframe.src = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
            }
        } else {
            // Standard Address Search
            fullAddressText.textContent = `Address: ${address}`;
            const encodedAddress = encodeURIComponent(address);
            const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
            googleMapIframe.src = mapUrl;
        }
    }

    mapSearchBtn.addEventListener('click', updateMap);
    mapSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            updateMap();
        }
    });
}

// Global interceptor for any interactive place or button
document.addEventListener('click', (e) => {
    // Exclude clicks inside the modal
    if (e.target.closest('#roleModal')) return;
    
    // Exclude menu toggle so mobile menu still works
    if (e.target.closest('.menu-toggle') || e.target.closest('.menu-overlay')) return;
    
    // Exclude map search inputs
    if (e.target.closest('.map-search-container')) return;

    // Check if the click is on an interactive element or any card section (any "place")
    const target = e.target.closest('a, button, .impact-card, .product-card, .service-card, .hero-content');
    
    if (target) {
        e.preventDefault();
        openRoleModal(e);
    } else {
        // If they click literally anywhere else on the body (empty space), also open it
        // (As requested: "koi pan place")
        openRoleModal(e);
    }
});

function openRoleModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('roleModal');
    if (modal) modal.style.display = 'flex';
}

function closeRoleModal() {
    const modal = document.getElementById('roleModal');
    if (modal) modal.style.display = 'none';
}

function handleRoleSelection(role) {
    closeRoleModal();
    
    // Placeholder Google Form links - replace these with actual links later
    let googleFormUrl = '';
    let redirectUrl = '';
    
    if (role === 'volunteer') {
        googleFormUrl = 'https://forms.gle/7NYadWarP4W64kip8'; // Demo link
        redirectUrl = 'volunteer/index.html';
    } else if (role === 'ngo') {
        googleFormUrl = 'https://forms.gle/3xSx2DRRLrf7gck87 '; // Demo link
        redirectUrl = 'ngo/index.html';
    } else if (role === 'csr') {
        googleFormUrl = 'https://forms.gle/kdPxoanTKxRAXRpi9'; // Demo link
        redirectUrl = 'csr/index.html';
    }

    if (googleFormUrl && redirectUrl) {
        // Open Google Form in new tab
        window.open(googleFormUrl, '_blank');
        // Redirect current tab to the register/login page
        window.location.href = redirectUrl;
    }
}