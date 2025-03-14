// Email signature text
const emailSignature = '\n\n--\nCheck out SR:IYKYK: https://webresidencies.akademie-solitude.de/srpt1/';

// 1) Place <video> inside the #myVideo container
const linkHouse = document.getElementById('links');
const myVideoDiv = document.getElementById('myVideo');

// Create the <video> element
const videoEl = document.createElement('video');
videoEl.id = 'videoElement';
videoEl.src = 'h264.mp4';   // Your H.264 MP4 path
videoEl.controls = true;
videoEl.autoplay = false;
videoEl.muted = false;

// Add the video into #myVideo container
myVideoDiv.appendChild(videoEl);

// 2) Timed links from data.json
fetch('data.json')
    .then(response => response.json())
    .then(links => {
        let currentLink = null;

        videoEl.addEventListener('play', () => {
            console.log('Playing...');
        });

        videoEl.addEventListener('timeupdate', () => {
            const currentTime = videoEl.currentTime;
            for (let link of links) {
                if (currentTime >= link.time && currentTime < (link.time + 3)) {
                    if (currentLink !== link.url) {
                        linkHouse.innerHTML = `<a href="${link.link}" target="_blank">${link.content}</a>`;
                        currentLink = link.url;
                        // Pause the video when a link is clicked
                        linkHouse.querySelector('a').addEventListener('click', () => {
                            videoEl.pause();
                        });
                    }
                    return;
                }
            }
            linkHouse.innerHTML = '';
            currentLink = null;
        });
    })
    .catch(error => console.error('Error loading JSON:', error));

// -------------------------
// NOTES ICON + MODAL
// -------------------------

// 3) Create a clickable icon in bottom-right
const iconWrapper = document.createElement('div');
iconWrapper.id = 'iconWrapper';
document.body.appendChild(iconWrapper);

// Use an <img> as your icon
const notesIcon = document.createElement('img');
notesIcon.id = 'notesIcon';
notesIcon.src = 'notes.png';
iconWrapper.appendChild(notesIcon);

// 4) Create the modal for notes
const notesModal = document.createElement('div');
notesModal.id = 'notesModal';
document.body.appendChild(notesModal);

// A <textarea> for user input
const notesTextarea = document.createElement('textarea');
notesTextarea.id = 'notesTextarea';
notesTextarea.placeholder = 'Type notes here...';
notesModal.appendChild(notesTextarea);

// Buttons container
const buttonsDiv = document.createElement('div');
buttonsDiv.classList.add('buttons');
notesModal.appendChild(buttonsDiv);

// "Email" button
const emailBtn = document.createElement('button');
emailBtn.id = 'emailBtn';
emailBtn.innerText = 'Email';
buttonsDiv.appendChild(emailBtn);

// "Save" button
const saveBtn = document.createElement('button');
saveBtn.id = 'saveBtn';
saveBtn.innerText = 'Save';
buttonsDiv.appendChild(saveBtn);

// 5) Toggle the modal
notesIcon.addEventListener('click', () => {
    if (notesModal.style.display === 'none' || notesModal.style.display === '') {
        notesModal.style.display = 'block';
        notesIcon.src = 'notes-close.png'; // Change icon to close
        // Add video timestamp to the notepad
        const videoTimestamp = videoEl.currentTime;
        const minutes = Math.floor(videoTimestamp / 60);
        const seconds = Math.floor(videoTimestamp % 60);
        notesTextarea.value += `\n[${minutes}:${seconds < 10 ? '0' : ''}${seconds}]\n`;
    } else {
        notesModal.style.display = 'none';
        notesIcon.src = 'notes.png'; // Change icon back to notes
    }
});

// 6) Save button => download notes.txt
saveBtn.addEventListener('click', () => {
    const textContent = notesTextarea.value;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// 7) Email button => open mail client
emailBtn.addEventListener('click', () => {
    const textContent = notesTextarea.value;
    const subject = 'My Notes';
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textContent + emailSignature)}`;
    window.location.href = mailtoLink;
});