const wrapper = document.getElementById('cardWrapper');
const next = document.getElementById('nextBtn');
const prev = document.getElementById('prevBtn');
const cards = document.querySelectorAll('.card');

// Tambahin flag untuk tiap card supaya animasi cuma jalan sekali
cards.forEach(card => card.dataset.animated = "false");

let index = 0;
const totalCards = cards.length;
const visibleCards = 2;
const cardWidth = 800 / visibleCards + 20;
const maxIndex = totalCards - visibleCards;

function animateCard(card) {
  if(card.dataset.animated === "true") return; // udah pernah jalan
  card.dataset.animated = "true";

  // Count-up rating
  const ratingEl = card.querySelector(".rating");
  const targetRating = parseFloat(ratingEl.dataset.rating);
  if(!isNaN(targetRating)){
    let current = 0;
    const steps = 20;
    const increment = targetRating / steps;
    const stepTime = 50;
    const ratingInterval = setInterval(()=>{
      current += increment;
      if(current >= targetRating){
        current = targetRating;
        clearInterval(ratingInterval);
      }
      ratingEl.textContent = `⭐ ${current.toFixed(1)}`;
    }, stepTime);
  }

  // Count-up price (SVG coin)
// Count-up price (SVG coin) lembut
const priceEl = card.querySelector(".price");
const target = parseInt(priceEl.dataset.price) || 1
priceEl.innerHTML = "";
let count = 0;

const priceInterval = setInterval(()=>{
  if(count >= target){
    clearInterval(priceInterval);
    return;
  }
  count++;
  
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width","16");
  svg.setAttribute("height","16");
  svg.setAttribute("fill","white");
  svg.setAttribute("class","bi bi-coin");
  svg.setAttribute("viewBox","0 0 16 16");
  svg.innerHTML = `
    <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
  `;
  
  priceEl.appendChild(svg);

  // animasi pop lembut
  svg.style.transform = "scale(1)";
  svg.style.opacity = "0";
  svg.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
  requestAnimationFrame(() => {
    svg.style.transform = "scale(1.3)";
    svg.style.opacity = "1";
  });
  setTimeout(() => svg.style.transform = "scale(1)", 300);

},300);

}

// fungsi untuk cek cards visible
function animateVisibleCards(){
  for(let i=index; i<index+visibleCards && i<totalCards; i++){
    animateCard(cards[i]);
  }
}

// event button next/prev
next.addEventListener('click', () => {
  if(index < maxIndex) index++;
  wrapper.style.transform = `translateX(-${index * cardWidth}px)`;
  animateVisibleCards();
});

prev.addEventListener('click', () => {
  if(index > 0) index--;
  wrapper.style.transform = `translateX(-${index * cardWidth}px)`;
  animateVisibleCards();
});

// animate initial visible cards saat page load
animateVisibleCards();
