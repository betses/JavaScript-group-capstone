const header = () => {
  const header = document.getElementById('nav-bar');
  header.innerHTML = `
    <h2> Chiflix </h2>
    <ul class="header-list">
    <li><a href="#">Home</a></li>
    <li><a href="#">Action</a></li>
    <li><a href="#">Comedy</a></li>
</ul>
    `;
};
export default header;