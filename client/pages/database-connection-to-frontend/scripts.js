const query = await fetch('http://localhost:8080/api/v1/topic');
const topics = await query.json();

const dropdown = document.getElementById('dropdown-content');
const fetchBtn = document.getElementById('fetch-quizzes-btn');
const quizzesTable = document.getElementById('quizzes-table');
const quizzesTbody = document.getElementById('quizzes-tbody');

topics.forEach((topic) => {
  const path = topic.name.toLowerCase().split(' ').join('-');
  const link = document.createElement('a');
  link.textContent = topic.name;
  link.setAttribute('href', `/pages/${path}/index.html`);
  dropdown.appendChild(link);
});

fetchBtn.addEventListener('click', async () => {
  try {
    const topicName = encodeURIComponent('Database Connection to Frontend');
    const quizzesQuery = await fetch('http://localhost:8080/api/v1/activity/quizzes/' + topicName);
    const quizzes = await quizzesQuery.json();

    quizzesTbody.innerHTML = '';

    if (quizzes.length > 0) {
      quizzesTable.style.display = 'table';

      quizzes.forEach((quizz) => {
        if (quizz.activity_details && quizz.activity_details.length > 0) {
          const details = quizz.activity_details[0];

          const row = document.createElement('tr');

          const nameCell = document.createElement('td');
          nameCell.textContent = details.name;

          const typeCell = document.createElement('td');
          typeCell.textContent = details.type;

          row.appendChild(nameCell);
          row.appendChild(typeCell);

          quizzesTbody.appendChild(row);
        }
      });
    } else {
      quizzesTbody.innerHTML = '<tr><td colspan="2">No unfinished activities found</td></tr>';
      quizzesTable.style.display = 'table';
    }
  } catch (error) {
    console.error('Error fetching activities:', error);
  }
});
