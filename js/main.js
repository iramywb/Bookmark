var bookmarkNameInput = document.getElementById("name");
var bookmarkURLInput = document.getElementById("url");
var errorLayer = document.getElementById("error-layer");
var rules = document.querySelector("ul.rules");
var submit = document.getElementById("submit");

var tableBody = document.getElementById("content");

var bookmarks = retrieveData(); // on page load get the data if stored
refreshData(); // display the retrieved data (even empty will process nothing and display none)


// Four Main Functions
function addBookmark() {
    var bookmark = { // create new object
        name: capitalizeAll(bookmarkNameInput.value), //capitalize first letter
        url: bookmarkURLInput.value
    };
    bookmarks.push(bookmark); // add to list

    displayBookmark(bookmarks.length - 1); // can use refreshData but not needed as this element will only add at the end of the list which will not change any previous index so we just display the last index
    updateData(); // store the data in storage as its changed
    clearInputs(); // clear inputs and remove the validation classes for security and UX
}
function delBookmark(index) { // delete data
    bookmarks.splice(index, 1); // delete the data at index and count 1 item from that index (which is the index only)
    updateData(); // store the data in storage as its changed
    refreshData(); // needed as all indexes might change so we have to reset data-index for all table
}





// WebPage Utils
function displayBookmark(index) { // will display index of the list (loop to display them all)
    var bookmarkHTML = `<tr>
                            <td>${index + 1}</td>
                            <td>${bookmarks[index].name}</td>
                            <td>
                                <button class="btn btn-visit" data-index="${index}"><i class="fa-solid fa-eye pe-2"></i> Visit</button>
                            </td>
                            <td>
                                <button class="btn btn-delete" data-index="${index}"><i class="fa-solid fa-trash-can pe-2"></i> Delete</button>
                            </td>
                        </tr>`;
    tableBody.innerHTML += bookmarkHTML;
}
function clearInputs() {
    bookmarkNameInput.value = "";
    bookmarkURLInput.value = "";
    bookmarkNameInput.classList.remove("is-valid", "is-invalid");
    bookmarkURLInput.classList.remove("is-valid", "is-invalid");
}

// Data Utils
function updateData() { // update the storage with new data list
    // it will check if the list is empty we will remove everything from the storage to free up space
    if (bookmarks.length > 0) localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    // else save the data
    else localStorage.removeItem("bookmarks");
}
function retrieveData() { // grab data if the page is refreshed
    const data = localStorage.getItem("bookmarks");
    return data ? JSON.parse(data) : []; // data found on user storage parse it, if not create empty list
}
function refreshData() { // refreshData has its own need on delete as we will reset data-index based on new indexes & when page load is needed
    tableBody.innerHTML = "";
    for (var i = 0; i < bookmarks.length; i++) {
        displayBookmark(i);
    }
}

// Data Validation Utils
function getValidLink(link) {
    regex = /^https?:\/\//;
    return (regex.test(link)) ? link : "https://" + link;
}

// String Utils
function capitalizeAll(str) {
    return str.split(" ").map(capitalize).join(" ");
}
function capitalize(str) {
    return str[0].toUpperCase() + str.substring(1);
}


// Listeners

// Button click listener
document.addEventListener("click", function (e) {
    var clickedItem = e.target;
    if (e.target.tagName === "BUTTON") { // if the clicked tag is button only
        if (clickedItem.hasAttribute("data-index")) { // when table button clicked
            var index = Number(clickedItem.getAttribute("data-index")); // get the data-index as number not string
            if (clickedItem.classList.contains("btn-visit")) { // check if visit button
                var url = bookmarks[index].url; // get the url
                url = getValidLink(url); // this will check if url starts with http or https if not will add https.
                window.open(url, "_blank"); // open link in new tab
            } else if (clickedItem.classList.contains("btn-delete")) { // check if delete button
                delBookmark(index);
            }
        } else if (clickedItem === submit) { // submit button clicked
            var validName = bookmarkNameInput.classList.contains("is-valid");
            var validURL = bookmarkURLInput.classList.contains("is-valid");
            if (validName && validURL) addBookmark();
            else {
                var inner = `<li>${getValidityIcon(validName)} Site name must contain at least 3 characters</li>
                    <li>${getValidityIcon(validURL)} Site URL must be a valid one</li>`;

                rules.innerHTML = inner;
                errorLayer.classList.remove("d-none");
            }
        }
    }
    if (clickedItem === errorLayer) errorLayer.classList.add("d-none"); // if clicked outside it will be closed
    // closest checks all parents if the have the characterstics provided in this case if its tagname is button which is the only button in errorLayer
    // also closest starts from the element itself same as e.target then got to get its parents.
    if (errorLayer.contains(clickedItem) && clickedItem.closest("BUTTON")) { // there is one button in the errorLayer so if we clicked on it or on one of its child will be detected.
        errorLayer.classList.add("d-none"); // hide errorLayer if x button clicked
    }
});
function getValidityIcon(isValid) {// validation return for symbols. pass true or false only
    return isValid
        ? `<i class="fa-regular fa-circle-check checkmark p-2"></i>`
        : `<i class="fa-regular fa-circle-xmark xmark p-2"></i>`;
}

// Name Input Listener
bookmarkNameInput.addEventListener('input', function () {
    var regex = /^\w{3,}(\s+\w+)*$/;
    if (regex.test(bookmarkNameInput.value)) {
        bookmarkNameInput.classList.add("is-valid");
        bookmarkNameInput.classList.remove("is-invalid");
    } else {
        bookmarkNameInput.classList.add("is-invalid");
        bookmarkNameInput.classList.remove("is-valid");
    }
});
bookmarkURLInput.addEventListener('input', function () {
    var regex = /^((https?:\/\/)?((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}(:\d{2,5})?)$|^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}(:\d{2,5})?(\/[\w-]*)*$/;
    if (regex.test(bookmarkURLInput.value)) {
        bookmarkURLInput.classList.add("is-valid");
        bookmarkURLInput.classList.remove("is-invalid");
    } else {
        bookmarkURLInput.classList.add("is-invalid");
        bookmarkURLInput.classList.remove("is-valid");
    }
});
document.addEventListener('keydown', function (e) {
    if (e.key === "Escape" && !errorLayer.classList.contains("d-none")) {
        errorLayer.classList.add("d-none");
    }
});
