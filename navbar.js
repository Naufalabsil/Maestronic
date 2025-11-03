const indicator = document.querySelector('.indicator');
const items = document.querySelectorAll('.navigation ul li');

items.forEach(item => {
  item.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    const rect = item.getBoundingClientRect();
    const parentRect = item.parentElement.getBoundingClientRect();
    
    indicator.style.left = `${rect.left - parentRect.left + rect.width/2 - indicator.offsetWidth/2}px`;
  });
});
