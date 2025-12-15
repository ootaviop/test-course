const svg =  document.querySelector('svg.squiggle');
const path = svg.querySelector('path');

const scroll = () => {

  const distance = window.scrollY;
  const totalDistance = document.body.scrollHeight - window.innerHeight;

  const scrollPercentage = distance / totalDistance;
  const pathLength = path.getTotalLength();
  


  path.style.strokeDasharray = `${pathLength}`;
  path.style.strokeDashoffset = `${pathLength * (1 - scrollPercentage)}`
}

scroll();
window.addEventListener('scroll', scroll);