// Emoji Data Organized by Categories
const emojiData = {
    smileys: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😇', '🙂', '🙃', '😌', '😍', '😘', '😗', '😙', '😚', '😋'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🥊', '🎳', '🏹', '🥋', '🏆', '🏅', '🎽', '🥌'],
    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦']
};

// Variables for Drag-and-Drop
let selectedTimeslot = null;
let draggedEmoji = null;
let draggedEmojiClone = null;
let currentDroppable = null;

// Generate Timeslots
function generateTimeslots() {
    const timeline = document.getElementById('timeline');
    for (let hour = 8; hour <= 23; hour++) {
        const hour12 = hour > 12 ? hour - 12 : hour;
        const amPm = hour >= 12 ? 'PM' : 'AM';
        const timeLabel = `${hour12}:00 ${amPm}`;

        const timeslotDiv = document.createElement('div');
        timeslotDiv.classList.add('timeslot');

        const timeslotHeader = document.createElement('div');
        timeslotHeader.classList.add('timeslot-header');
        timeslotHeader.textContent = timeLabel;

        const emojiPlaceholdersDiv = document.createElement('div');
        emojiPlaceholdersDiv.classList.add('emoji-placeholders');

        // Create emoji placeholders
        for (let i = 0; i < 4; i++) {
            const emojiPlaceholder = document.createElement('div');
            emojiPlaceholder.classList.add('emoji-placeholder');
            emojiPlaceholder.addEventListener('click', () => {
                selectedTimeslot = emojiPlaceholder;
                openEmojiDrawer();
            });
            emojiPlaceholdersDiv.appendChild(emojiPlaceholder);
        }

        // Note Placeholder
        const notePlaceholder = document.createElement('div');
        notePlaceholder.classList.add('note-placeholder');

        const noteInput = document.createElement('textarea');
        noteInput.classList.add('note-input');
        noteInput.setAttribute('placeholder', 'Add note...');

        notePlaceholder.appendChild(noteInput);

        timeslotDiv.appendChild(timeslotHeader);
        timeslotDiv.appendChild(emojiPlaceholdersDiv);
        timeslotDiv.appendChild(notePlaceholder);

        timeline.appendChild(timeslotDiv);
    }
}

// Open Emoji Drawer Modal
function openEmojiDrawer() {
    const drawer = document.getElementById('emoji-drawer');
    drawer.classList.add('open');
    loadEmojis('smileys'); // Load default category
}

// Close Emoji Drawer Modal
function closeEmojiDrawer() {
    const drawer = document.getElementById('emoji-drawer');
    drawer.classList.remove('open');
}

// Load Emojis Based on Category
function loadEmojis(category) {
    const emojiGrid = document.getElementById('emoji-grid');
    emojiGrid.innerHTML = '';
    const emojis = emojiData[category];
    emojis.forEach(emojiChar => {
        const emojiItem = document.createElement('div');
        emojiItem.classList.add('emoji-item');
        emojiItem.textContent = emojiChar;

        // Touch Events for Drag-and-Drop
        emojiItem.addEventListener('touchstart', handleDragStart, false);
        emojiItem.addEventListener('touchmove', handleDragMove, false);
        emojiItem.addEventListener('touchend', handleDragEnd, false);

        emojiGrid.appendChild(emojiItem);
    });
}

// Initialize Tab Buttons
function initTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');
            loadEmojis(category);
        });
    });
}

// Initialize Drawer Toggle Button
function initDrawerToggleButton() {
    const openDrawerButton = document.getElementById('open-drawer-button');
    const closeDrawerButton = document.getElementById('close-drawer');

    openDrawerButton.addEventListener('click', () => {
        selectedTimeslot = null;
        openEmojiDrawer();
    });

    closeDrawerButton.addEventListener('click', () => {
        closeEmojiDrawer();
    });
}

// Initialize Live Time Display
function initLiveTime() {
    const timeElement = document.getElementById('live-time');

    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateTime, 1000); // Update every second
    updateTime(); // Initial call to display time immediately
}

// Handle Drag Start
function handleDragStart(e) {
    e.preventDefault();
    draggedEmoji = e.target;
    draggedEmoji.classList.add('dragging');

    // Create a clone for visual feedback
    draggedEmojiClone = draggedEmoji.cloneNode(true);
    draggedEmojiClone.classList.add('dragging-clone');
    draggedEmojiClone.style.top = `${e.touches[0].clientY}px`;
    draggedEmojiClone.style.left = `${e.touches[0].clientX}px`;
    document.body.appendChild(draggedEmojiClone);

    // Disable scrolling while dragging
    document.body.style.overflow = 'hidden';
}

// Handle Drag Move
function handleDragMove(e) {
    if (!draggedEmojiClone) return;

    e.preventDefault();
    draggedEmojiClone.style.top = `${e.touches[0].clientY}px`;
    draggedEmojiClone.style.left = `${e.touches[0].clientX}px`;

    // Determine the element under the touch
    const elemBelow = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);

    if (!elemBelow) return;

    const droppableBelow = elemBelow.closest('.emoji-placeholder');

    if (currentDroppable !== droppableBelow) {
        if (currentDroppable) {
            currentDroppable.classList.remove('highlight');
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) {
            currentDroppable.classList.add('highlight');
            magnetEffect(currentDroppable);
        }
    }
}

// Handle Drag End
function handleDragEnd(e) {
    if (!draggedEmojiClone) return;

    draggedEmojiClone.remove();
    draggedEmojiClone = null;

    document.body.style.overflow = 'auto';

    if (currentDroppable) {
        currentDroppable.textContent = draggedEmoji.textContent;
        currentDroppable.classList.remove('highlight');
        if (navigator.vibrate) {
            navigator.vibrate(50); // Vibrate for 50ms
        }
    }

    draggedEmoji.classList.remove('dragging');
    draggedEmoji = null;
    currentDroppable = null;
}

// Magnet-like Animation Effect
function magnetEffect(placeholder) {
    placeholder.style.transform = 'scale(1.1)';
    setTimeout(() => {
        placeholder.style.transform = 'scale(1)';
    }, 200);
}

// Initialize the App
function initializeApp() {
    generateTimeslots();
    initTabButtons();
    initDrawerToggleButton();
    initLiveTime();
    loadEmojis('smileys'); // Load default emojis
}

// Run the App
initializeApp();
