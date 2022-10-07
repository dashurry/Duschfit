var modal = document.querySelector("#my-modal"),
    modalBtn = document.querySelector("#modal-btn"),
    closeBtn = document.querySelector(".close");
modalBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);
function openModal() {
    modal.style.display = "block";
}
function closeModal() {
    modal.style.display = "none";
}
function outsideClick(a) {
    a.target == modal && (modal.style.display = "none");
}
