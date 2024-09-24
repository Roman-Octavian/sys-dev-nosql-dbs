// Global variable to store the last clicked topic path
let lastClickedPath = null;

// Get DOM elements
const cards = document.getElementById('card-list');
const dropdown = document.getElementById('dropdown-content');
const popup = document.getElementById('auth-popup');
const closePopup = document.getElementById('close-popup');
const authForm = document.getElementById('auth-form');
const toggleAuth = document.getElementById('toggle-auth');
const popupTitle = document.getElementById('popup-title');
const nameInput = document.getElementById('name');
const nameLabel = document.getElementById('name-label');
const authSubmit = document.getElementById('auth-submit');

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');

// Function to fetch topics from the backend and display them
async function fetchTopics() {
  try {
    const query = await fetch('http://localhost:8080/api/v1/topic');
    const topics = await query.json();
    displayTopics(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
}

// Function to display topics as cards and dropdown links
function displayTopics(topics) {
  topics.forEach((topic) => {
    const path = topic.name.toLowerCase().split(' ').join('-');

    // Create the topic card
    const card = document.createElement('li');
    card.className = 'card';

    // Add event listener for topic card click
    card.addEventListener('click', () => handleTopicClick(path));

    card.innerHTML = topic.name;
    cards.appendChild(card);

    // Create the dropdown link
    const link = document.createElement('a');
    link.textContent = topic.name;
    link.href = '#';

    // Add event listener for dropdown link click
    link.addEventListener('click', (e) => {
      e.preventDefault();
      handleTopicClick(path);
    });

    dropdown.appendChild(link);
  });
}

// Function to handle topic card or dropdown click
function handleTopicClick(path) {
  const token = localStorage.getItem('token');
  if (token) {
    // If user is already logged in, navigate to the topic page
    window.open(`pages/${path}/index.html`, '_self');
  } else {
    // Show login popup if the user is not logged in
    popup.style.display = 'block';
    lastClickedPath = path; // Store the clicked path
  }
}

// Close the popup when the close button is clicked
closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
});

// Toggle between login and signup
toggleAuth.addEventListener('click', (e) => {
  e.preventDefault();
  if (popupTitle.textContent === 'Login') {
    popupTitle.textContent = 'Sign Up';
    nameInput.style.display = 'block';
    nameLabel.style.display = 'block';
    authSubmit.textContent = 'Sign Up';
    toggleAuth.innerHTML = 'Already have an account? <a href="#">Login</a>';
  } else {
    popupTitle.textContent = 'Login';
    nameInput.style.display = 'none';
    nameLabel.style.display = 'none';
    authSubmit.textContent = 'Login';
    toggleAuth.innerHTML = 'Don\'t have an account? <a href="#">Sign Up</a>';
  }
});

// Handle form submission (login/signup)
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const action = popupTitle.textContent.toLowerCase(); // 'login' or 'sign up'
  const data = {
    action: action === 'sign up' ? 'signup' : 'login',
    email: authForm.email.value,
    password: authForm.password.value,
    ...(action === 'sign up' && { name: authForm.name.value }),
  };

  try {
    const response = await fetch('http://127.0.0.1:8080/api/v1/student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Store JWT token in localStorage for future requests
      localStorage.setItem('token', result.token);

      // Navigate to the last clicked topic page if available
      if (lastClickedPath) {
        window.open(`pages/${lastClickedPath}/index.html`, '_self');
      }

      // Hide popup after successful login/signup
      popup.style.display = 'none';
      updateAuthButtons();
    } else {
      console.log(result.error); // Display error message if any
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Update the authentication buttons based on user state
function updateAuthButtons() {
  const token = localStorage.getItem('token');
  if (token) {
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
  } else {
    loginBtn.style.display = 'block';
    signupBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
  }
}

// Log out the user
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  updateAuthButtons(); // Update button visibility after logout
});

// Show login popup when login button is clicked
loginBtn.addEventListener('click', () => {
  popup.style.display = 'block';
  popupTitle.textContent = 'Login';
  nameInput.style.display = 'none';
  nameLabel.style.display = 'none';
  authSubmit.textContent = 'Login';
  toggleAuth.innerHTML = 'Don\'t have an account? <a href="#">Sign Up</a>';
});

// Show sign up popup when sign up button is clicked
signupBtn.addEventListener('click', () => {
  popup.style.display = 'block';
  popupTitle.textContent = 'Sign Up';
  nameInput.style.display = 'block';
  nameLabel.style.display = 'block';
  authSubmit.textContent = 'Sign Up';
  toggleAuth.innerHTML = 'Already have an account? <a href="#">Login</a>';
});

// Fetch and display topics when the page loads
window.onload = () => {
  fetchTopics();
  updateAuthButtons(); // Update button visibility on page load
};
