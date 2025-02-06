const menu = document.getElementById('menu');
const content = document.getElementById('content');
const menuButton = document.getElementById('menu-button');

menuButton.addEventListener('click', () => {
    menu.style.left = menu.style.left === '0px' ? '-250px' : '0px';
    content.style.marginLeft = menu.style.left === '0px' ? '250px' : '0px';
});