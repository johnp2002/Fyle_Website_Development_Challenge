document.addEventListener('DOMContentLoaded', function () {
    const username = 'johnpapa';
    const repositoriesList = document.getElementById('repositoriesList');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userBio = document.getElementById('userBio');
    const userLocation = document.getElementById('userLocation');
    const userSocialLinks = document.getElementById('userSocialLinks');
    const githubLink = document.getElementById('githubLink');
    const paginationContainer = document.getElementById('pagination');
    const overlay = document.getElementById('overlay');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const olderButton = document.getElementById('olderButton');
    const newerButton = document.getElementById('newerButton');

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resetButton = document.getElementById('resetButton');

    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            fetchRepositoriesWithSearch(searchTerm, 10); // Pass perPage here
        }
    });
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm === '') {
            // If search input is empty, fetch all repositories
            fetchRepositories(currentPage);
        } else {
            // If search input is not empty, fetch repositories based on the search term
            // fetchRepositoriesWithSearch(searchTerm, 10); // Pass perPage here
        }
    });

    const token = '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'; // Replace with your actual token
    let currentPage = 1;

    function updatePaginationButtons() {
        const buttons = paginationContainer.querySelectorAll('.pagination-button');
        olderButton.disabled = currentPage === 1;
        newerButton.disabled = currentPage === buttons.length;

        // Set the 'active' class to the currently active page button
        buttons.forEach((button, index) => {
            button.classList.toggle('active', index === currentPage - 1);
        });
    }

    function showLoading() {
        overlay.classList.add('active');
    }

    function hideLoading() {
        overlay.classList.remove('active');
    }

    // Function to show loading for a specific duration (e.g., 2 seconds)
    function showLoadingForDuration(duration) {
        showLoading();
        setTimeout(hideLoading, duration);
    }

    // Fetch user details with loading indicator
    showLoadingForDuration(3000); // Display loading for 2 seconds on page load
    fetchUserDetails();

    function fetchUserDetails() {
        fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(user => {
                userAvatar.src = user.avatar_url;
                userName.textContent = user.name;
                userBio.textContent = user.bio || 'No bio available';
                userLocation.innerHTML = `
                    <i class="fas fa-map-marker-alt"></i> ${user.location || 'Location not specified'}
                `;

                // Display social media links if available
                if (user.twitter_username) {
                    userSocialLinks.innerHTML = `
                        <a href="https://twitter.com/${user.twitter_username}" target="_blank">
                            <i class="fab fa-twitter"></i> https://twitter.com/${user.twitter_username}
                        </a>
                    `;
                }

                // Set GitHub link
                githubLink.href = user.html_url;
                githubLink.innerHTML = `<i class="fas fa-link"></i> ${user.html_url}`;

                hideLoading();
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                hideLoading();
            });
    }

    function fetchRepositories(page = 1, perPage = 10) {
        showLoading();
        fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(repositories => {
                repositoriesList.innerHTML = '';

                repositories.forEach(repo => {
                    displayRepository(repo);
                });

                hideLoading();
                currentPage = page;
                updatePaginationButtons();
            })
            .catch(error => {
                console.error('Error fetching repositories:', error);
                hideLoading();
            });
        hideLoading();
    }

    function displayRepository(repo) {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card', 'card', 'mb-4');
        repoCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title"><a href="${repo.html_url}" target="_blank">${repo.name}</a></h5>
                <p class="card-text">${repo.description || 'No description available'}</p>
                <p class="card-text"><strong>Topics:</strong> ${(repo.topics.length) ? repo.topics.map(topic => `<span class="badge badge-primary mr-1">${topic}</span>`).join('') : 'No topics'}</p>
            </div>
        `;
        repositoriesList.appendChild(repoCard);
    }

    function generatePaginationButtons(totalPages) {
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('btn', 'btn-outline-primary', 'mx-1', 'pagination-button');
            button.addEventListener('click', function () {
                fetchRepositories(i);
            });
            paginationContainer.appendChild(button);
        }

        // Set the 'active' class to the currently active page button
        updatePaginationButtons();
    }

    fetchUserDetails();

    // Example: Fetching total repository count for pagination
    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(user => {
            const totalPages = Math.ceil(user.public_repos / 10); // Assuming 10 repositories per page
            generatePaginationButtons(totalPages);
            fetchRepositories(currentPage);
        })
        .catch(error => console.error('Error fetching user details for pagination:', error));

    // Event listeners for Older and Newer buttons
    olderButton.addEventListener('click', function () {
        const newPage = currentPage - 1;
        if (newPage >= 1) {
            fetchRepositories(newPage);
        }
    });

    newerButton.addEventListener('click', function () {
        const newPage = currentPage + 1;
        const totalPages = paginationContainer.querySelectorAll('.pagination-button').length;
        if (newPage <= totalPages) {
            fetchRepositories(newPage);
        }
    });

    // Function to fetch repositories with search term
    function fetchRepositoriesWithSearch(searchTerm, perPage) {
        showLoading();
        fetch(`https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${perPage}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(repositories => {
                repositoriesList.innerHTML = '';

                repositories.forEach(repo => {
                    if (repo) {
                        // Check if the search term exists in title, topics, or description
                        const titleMatch = repo.name.toLowerCase().includes(searchTerm.toLowerCase());
                        const topicsMatch = repo.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
                        const descriptionMatch = repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase());

                        if (titleMatch || topicsMatch || descriptionMatch) {
                            // Display the repository
                            displayRepository(repo);
                        }
                    }
                });

                hideLoading();
                currentPage = 1; // Reset current page to 1 after search
                updatePaginationButtons();
            })
            .catch(error => {
                console.error('Error fetching repositories with search:', error);
                hideLoading();
            });
    }
});
