document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Mobile Menu
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggle) {
        toggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if(navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '60px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(5, 26, 18, 0.95)';
                navLinks.style.padding = '20px';
            }
        });
    }

    // Check for download params on load
    checkDownloadParams();
});

function showLanding() {
    const landingView = document.getElementById('landing-view');
    const downloadView = document.getElementById('download-view');
    
    if (downloadView) {
        downloadView.style.opacity = '0';
        setTimeout(() => {
            downloadView.classList.remove('active');
            downloadView.style.display = 'none';
            landingView.style.display = 'block';
            // Trigger reflow
            void landingView.offsetWidth;
            landingView.style.opacity = '1';
            
            // Update URL without reload
            window.history.pushState({}, '', window.location.pathname);
        }, 500);
    }
}

function showDownload(params) {
    const landingView = document.getElementById('landing-view');
    const downloadView = document.getElementById('download-view');
    
    if (landingView && downloadView) {
        landingView.style.opacity = '0';
        setTimeout(() => {
            landingView.style.display = 'none';
            downloadView.style.display = 'block';
            // Trigger reflow
            void downloadView.offsetWidth;
            downloadView.classList.add('active');
            downloadView.style.opacity = '1';
            
            // Process download
            processDownload(params);
        }, 500);
    }
}

function checkDownloadParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('collection') || urlParams.has('v')) {
        // Convert URLSearchParams to object
        const params = {};
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        showDownload(params);
    }
}

function processDownload(params) {
    const collection = params.collection;
    const distribution = params.d;
    const packageVariant = params.pv;
    const architecture = params.a;
    const desktopEnvironment = params.de;
    const version = params.v;
    const torrent = params.torrent;

    console.log("Processing download:", params);

    const versionWithoutV = version ? (version.startsWith("v") ? version.substring(1) : version) : "";
    let downloadUrl;

    if (collection === "complete") {
        if (!version) {
            console.error("Missing version parameter for collection download.");
            return;
        }
        const collectionVersion = versionWithoutV.replace(/\.0$/, "");
        downloadUrl = `https://github.com/minios-linux/minios-live/releases/download/${version}/minios-${collectionVersion}-complete-collection.torrent`;
    } else {
        if (!distribution || !desktopEnvironment || !packageVariant || !architecture || !version) {
            // If missing params, maybe just show the view without auto-download
            console.log("Missing required parameters for auto-download.");
            return;
        }

        if (torrent === "1") {
            downloadUrl = `https://github.com/minios-linux/minios-live/releases/download/${version}/minios-${versionWithoutV}.torrent`;
        } else {
            const fileName = `minios-${distribution}-${desktopEnvironment}-${packageVariant}-${architecture}-${versionWithoutV}.iso`;
            downloadUrl = `https://github.com/minios-linux/minios-live/releases/download/${version}/${fileName}`;
        }
    }

    console.log("Constructed URL:", downloadUrl);

    if (downloadUrl) {
        setTimeout(() => {
            console.log("Redirecting to:", downloadUrl);
            window.location.href = downloadUrl;
        }, 2000);
    }
}
