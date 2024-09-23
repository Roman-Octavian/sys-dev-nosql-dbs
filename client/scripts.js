const query = await fetch('http://localhost:8080/api/v1/topic');
const topics = await query.json();

const cards = document.getElementById('card-list');
const dropdown = document.getElementById('dropdown-content');

topics.forEach((topic) => {
  const path = topic.name.toLowerCase().split(' ').join('-');

  const card = document.createElement('li');
  card.className = 'card';
  card.addEventListener('click', () => {
    window.open(`pages/${path}/index.html`, '_self');
  });
  card.innerHTML = topic.name;
  cards.appendChild(card);

  const link = document.createElement('a');
  link.textContent = topic.name;
  link.setAttribute('href', `pages/${path}/index.html`);
  dropdown.appendChild(link);
});
