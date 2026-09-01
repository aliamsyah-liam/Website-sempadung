
const menu=document.querySelector('.menu'),links=document.querySelector('.links');
if(menu) menu.addEventListener('click',()=>links.classList.toggle('open'));
document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');obs.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(e=>obs.observe(e));
document.querySelectorAll('.gallery figure').forEach(fig=>{
 fig.addEventListener('click',()=>{
  const img=fig.querySelector('img');
  const modal=document.createElement('div');
  modal.style='position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:9999;display:grid;place-items:center;padding:18px;cursor:pointer';
  modal.innerHTML='<img src="'+img.src+'" alt="'+img.alt+'" style="max-width:95vw;max-height:90vh;border-radius:18px">';
  modal.addEventListener('click',()=>modal.remove());
  document.body.appendChild(modal);
 });
});
