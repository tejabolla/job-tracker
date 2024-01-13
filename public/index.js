import axios from "axios";

var data = new Set(); // Use Set to store data and prevent duplicates

var sortingOrder = 'asc'; // Default sorting order

function toggleFilters() {
    var filterRow = document.getElementById('filterRow');
    filterRow.style.display = filterRow.style.display === 'none' ? '' : 'none';
}

var title = document.querySelector('h1');
title.onclick = toggleFilters;

function sortTable(columnIndex) {
    var table = document.getElementById('jobTable');
    var tbody = table.getElementsByTagName('tbody')[0];
    var rows = Array.from(tbody.rows);

    // Toggle the sorting order
    sortingOrder = sortingOrder === 'asc' ? 'desc' : 'asc';

    rows.sort(function (a, b) {
        var aValue = a.cells[columnIndex].innerText.trim().toLowerCase();
        var bValue = b.cells[columnIndex].innerText.trim().toLowerCase();

        // Toggle the sorting order
        var compareResult = sortingOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);

        return compareResult;
    });

    tbody.innerHTML = '';

    rows.forEach(function (row) {
        tbody.appendChild(row);
    });
}

// Add this function for filtering the table
function filterTable(columnIndex) {
    var input = document.getElementsByTagName("th")[columnIndex].getElementsByTagName("input")[0];
    var filter = input.value.toUpperCase();
    var table = document.getElementById('jobTable');
    var tbody = table.getElementsByTagName('tbody')[0];
    var rows = tbody.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName('td')[columnIndex];
        if (cell) {
            var textValue = cell.textContent || cell.innerText;
            if (textValue.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

var filters = new Array(6).fill(''); // Array to store filter values

function filterTable(columnIndex) {
    var filterInput = document.getElementById('filterRow').getElementsByTagName('input')[columnIndex];
    filters[columnIndex] = filterInput.value.toLowerCase();
    applyFilters();
}

function applyFilters() {
    var table = document.getElementById('jobTable');
    var tbody = table.getElementsByTagName('tbody')[0];
    var rows = Array.from(tbody.rows);

    rows.forEach(function (row) {
        var isVisible = filters.every(function (filter, index) {
            var cellValue = row.cells[index].innerText.toLowerCase();
            return cellValue.includes(filter);
        });

        row.style.display = isVisible ? '' : 'none';
    });
}


function addJob() {
    // Reset error messages
    document.getElementById('errorMessages').innerHTML = '';

    // Get form values
    var company = document.getElementById('company').value.trim();
    var jobLink = document.getElementById('jobLink').value.trim();
    var description = document.getElementById('description').value.trim();
    var roleName = document.getElementById('roleName').value.trim();
    var dateApplied = document.getElementById('dateApplied').value;
    var status = document.getElementById('status').value;

    // Validate input fields
    if (!company || !jobLink || !description || !roleName) {
        document.getElementById('errorMessages').innerHTML = 'All input fields (except Date and Status) are required.';
        return;
    }

    // Set default date if not provided
    if (!dateApplied) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        dateApplied = yyyy + '-' + mm + '-' + dd;
    }

    // Check for duplicate rows based on all cell values
    var newData = {
        company: company,
        jobLink: jobLink,
        description: description,
        roleName: roleName,
        dateApplied: dateApplied,
        status: status
    };
    
    // console.log(data);
    if (!data.has(JSON.stringify(newData))) {
        // Add the data to the Set

        data.add(JSON.stringify(newData));
        // console.log('Hello,data is new')
        // Create table row
        var table = document.getElementById('jobTable').getElementsByTagName('tbody')[0];
        var newRow = table.insertRow(table.rows.length);
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);
        var cell6 = newRow.insertCell(5);

        // Set cell values
        cell1.innerHTML = company;
        cell2.innerHTML = '<a href="' + jobLink + '" target="_blank">Link</a>';
        cell3.innerHTML = description;
        cell4.innerHTML = roleName;
        cell5.innerHTML = dateApplied;
        cell6.innerHTML = '<span class="editable" onclick="editStatus(this)">' + status + '</span>';

        // Clear form inputs
        document.getElementById('jobForm').reset();
    } else {
        // Display error for duplicate rows
        document.getElementById('errorMessages').innerHTML = 'Duplicate row. This job is already in the list.';
    }
}


function editStatus(element) {
    var currentStatus = element.innerText;
    var select = document.createElement('select');
    select.innerHTML = `
        <option value="Applied">Applied</option>
        <option value="Interviewed">Interviewed</option>
        <option value="Offer Received">Offer Received</option>
        <option value="Offer Rejected">Offer Rejected</option>
        <!-- Add more options as needed -->
    `;
    select.value = currentStatus;
    select.className = 'editable active';
    select.onchange = function () {
        element.innerText = this.value;
        this.parentNode.removeChild(this);
    };
    element.innerText = '';
    element.appendChild(select);
    select.focus();
}

function navigateToDetails(row) {
    // Extract cell values from the clicked row
    var company = row.cells[0].innerText;
    var jobLink = row.cells[1].querySelector('a').getAttribute('href');
    var description = row.cells[2].innerText;
    var roleName = row.cells[3].innerText;
    var dateApplied = row.cells[4].innerText;
    var status = row.cells[5].innerText;

    // Check if the clicked element is inside the second column (index 1)
    if (event.target.closest('td').cellIndex === 1 && event.target.tagName.toLowerCase() === 'a') {
        // Open the link directly
        window.open(jobLink, '_blank');
    }else if(event.target.closest('td').cellIndex === 5){
        //pass
        console.log('Hello')
    }else {
        // Create a query string to pass data to the new page
        var queryString = `?company=${encodeURIComponent(company)}&jobLink=${encodeURIComponent(jobLink)}&description=${encodeURIComponent(description)}&roleName=${encodeURIComponent(roleName)}&dateApplied=${encodeURIComponent(dateApplied)}&status=${encodeURIComponent(status)}`;

        // Navigate to details.html with the query string
        window.location.href = `details.html${queryString}`;
    }
}


// Attach the click event to table rows
var table = document.getElementById('jobTable');
table.addEventListener('click', function(event) {
    var targetRow = event.target.closest('tr');
    if (targetRow) {
        navigateToDetails(targetRow);
    }
});

function addJobToTable(company, jobLink, description, roleName, dateApplied, status) {
    var table = document.getElementById('jobTable').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.rows.length);
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);
    var cell6 = newRow.insertCell(5);

    cell1.innerHTML = company;
    cell2.innerHTML = '<a href="' + jobLink + '" target="_blank">Link</a>';
    cell3.innerHTML = description;
    cell4.innerHTML = roleName;
    cell5.innerHTML = dateApplied;
    cell6.innerHTML = '<span class="editable" onclick="editStatus(this)">' + status + '</span>';
    console.log("Row inserted")
}

function generateRows() {
    for (var i = 0; i < 30; i++) {
        var company = 'Company ' + (i + 1);
        var jobLink = 'https://www.google.com/';
        var description = 'Description ' + (i + 1);
        var roleName = 'Role ' + (30 - (i + 1));
        var dateApplied = '2023-01-01';
        var status = 'Applied';

        addJobToTable(company, jobLink, description, roleName, dateApplied, status);
        data.add({ company, jobLink, description, roleName, dateApplied, status });
    }
}

// Uncomment the line below if you want to generate rows when the page loads
// window.onload = generateRows;
// console.log('hello');