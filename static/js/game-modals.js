/**
 * Game Modal Controls
 * Handles opening and closing of game modals
 */

// Open game modal
function openGameModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';

        // Show the modal
        modal.classList.add('show');

        // Reset scroll position of modal content to top
        const modalContent = modal.querySelector('.game-modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }
}

// Close game modal
function closeGameModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        // Restore background scrolling
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking on the backdrop (outside modal content)
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('game-modal')) {
        event.target.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.game-modal.show');
        modals.forEach(modal => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
});
