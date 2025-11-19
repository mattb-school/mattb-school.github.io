// page navigation
document.querySelector("#navHome").addEventListener("click", () => location.replace("index.html"));
document.querySelector("#navNewForm").addEventListener("click", () => {
    window.localStorage.setItem("ID", NCR.GetNewNCRNo());
    window.location.replace("ncr.html");
});

const collapsableFilts = document.querySelector("#collapsableFilterItems");
collapsableFilts.style.display = "none";
let applyFilters = false;

const nonCollapsableFilterInputs = document.querySelectorAll(".nonCollapsableFilterInput");
const collapsableFilterInputs = document.querySelectorAll(".collapsableFilterInput");
nonCollapsableFilterInputs[0].addEventListener("input", FilterChanged);
nonCollapsableFilterInputs[1].addEventListener("click", ToggleFilters);

// collapses filters, disables them
function ToggleFilters(){
    if(collapsableFilts.style.display == "none"){
        nonCollapsableFilterInputs[1].textContent = "Hide Filters"
        collapsableFilts.style.display = "block";
        applyFilters = true
        UpdateList();
    }
    else{
        nonCollapsableFilterInputs[1].textContent = "Show Filters"
        collapsableFilts.style.display = "none";
        applyFilters = false;
        UpdateList();
    }
}


const pageButtons = document.querySelectorAll(".pageButtons");
//const pageNumSpan = document.querySelector("#pageNumber"); // GeonUk : OLD code, no more use page number span
const pageInput = document.querySelector("#pageInput");      // GeonUk : using instead of pageNumSpan
let listLength = 0;
let pageNum = 1;                                             // GeonUk : initial page number is 1

// GeonUk : sorting function in table head
// #region sorting function
let sortKey = "ncrDateOpened"; // default sort value 
let sortDirection = "desc";    // default sort direction

// up, down arrow display function in table head
function arrowTableHead() {
    document.querySelectorAll("#tableHead th").forEach(headerCell => {
        // before the start, erase the arrows that already exist
        const existingArrow = headerCell.querySelector('.sort-arrow');

        if (existingArrow) {
            existingArrow.remove();
        }
        // add arrow in currently sorted column
        if (headerCell.dataset.sortKey === sortKey) {
            const arrow = document.createElement('span');
            arrow.className = 'sort-arrow';
            if (collapsableFilterInputs[5].value !== 'none') {
                if (headerCell.dataset.sortKey === 'ncrDateOpened') {
                    arrow.innerHTML = (collapsableFilterInputs[5].value === 'new') ? ' &#x25BC' : ' &#x25B2';
                    headerCell.appendChild(arrow);
                }
            } else {
                arrow.innerHTML = sortDirection === 'asc' ? ' &#x25B2' : ' &#x25BC';
                headerCell.appendChild(arrow);
            }
        }
    });
}
// excute the event when table head clicked
document.querySelectorAll("#tableHead th").forEach(headerCell => {
    if (headerCell.dataset.sortKey) {
        headerCell.style.cursor = "pointer";

        headerCell.addEventListener("click", () => {
            const newSortKey = headerCell.dataset.sortKey;

            // before the sort, make dateOpened filter value to 'none'(default))
            collapsableFilterInputs[5].value = "none";

            if (sortKey === newSortKey) {
                sortDirection = sortDirection === "asc" ? "desc" : "asc";
            } else {
                sortKey = newSortKey;
                sortDirection = "asc";
            }
            UpdateList();
        });
    }
});
// #endregion

// sets page to 1, updates list, enables or disables next and back buttons as required
//function FilterChanged(){
//    pageNum = 1;
//    pageNumSpan.innerHTML = "Page " + pageNum;
//    pageButtons[0].disabled = true;
//    UpdateList();
//    if(nonCollapsableFilterInputs[0].value == 0 || pageNum * nonCollapsableFilterInputs[0].value >= listLength)
//        pageButtons[1].disabled = true;
//    else
//        pageButtons[1].disabled = false;
//}                                                          //GeonUk : OLD code, replaced by below code
function FilterChanged() {
    pageNum = 1;
    UpdateList();
}

// back page button updates list to new page, enables or disables page buttons as required
//pageButtons[0].addEventListener("click", () => {
//    pageNum--;
//    pageNumSpan.innerHTML = "Page " + pageNum;
//    UpdateList();
//    if(pageNum == 1)
//        pageButtons[0].disabled = true;
//    if(pageNum * nonCollapsableFilterInputs[0].value < listLength)
//        pageButtons[1].disabled = false;
//    document.querySelector("thead").scrollIntoView();
//});                                                        //GeonUk : OLD code, replaced by below code
pageButtons[0].addEventListener("click", () => {
    pageNum--;
    UpdateList();
    document.querySelector("thead").scrollIntoView();
});

// next page button updates list to new page, enables or disables page buttons as required
//pageButtons[1].addEventListener("click", () => {
//    pageNum++;
//    pageNumSpan.innerHTML = "Page " + pageNum;
//    UpdateList();
//    pageButtons[0].disabled = false;
//    if(pageNum * nonCollapsableFilterInputs[0].value >= listLength)
//        pageButtons[1].disabled = true;
//    document.querySelector("thead").scrollIntoView();
//});                                                        //GeonUk : OLD code, replaced by below code
pageButtons[1].addEventListener("click", () => {
    pageNum++;
    UpdateList();
    document.querySelector("thead").scrollIntoView();
});

// GeonUk : update the list when user enter a number in the input window and press enter
pageInput.addEventListener("change", () => {
    const sltNum = parseInt(nonCollapsableFilterInputs[0].value, 10);
    const totalPage = (sltNum === 0) ? 1 : Math.ceil(listLength / sltNum);
    let inputPage = parseInt(pageInput.value, 10);
    if (inputPage < 1) {
        inputPage = 1;
    }
    else if (inputPage > totalPage) {
        inputPage = totalPage;
    }
    pageNum = inputPage;
    UpdateList();
    document.querySelector("thead").scrollIntoView();
});

// filters will update list when interacted with
collapsableFilterInputs.forEach((input) => input.addEventListener("input", FilterChanged));

// gets list of NCRs according to filters, applies them to table as clickable rows leading to the form page. Also gets length of list to help enabling & disabling back and next page buttons
function UpdateList() {
    const dateSort = collapsableFilterInputs[5].value; // GeonUk : get date sort value. it is from 'GetFilteredNCRs' in pseudobackend.js
    if (dateSort !== 'none') {
        sortKey = 'ncrDateOpened';
        sortDirection = (dateSort === 'new') ? 'desc' : 'asc';
    }

    const NCRs = NCR.GetTabledNCRs(
        applyFilters, 
        pageNum, 
        nonCollapsableFilterInputs[0].value, 
        collapsableFilterInputs[0].value, 
        collapsableFilterInputs[1].value, 
        collapsableFilterInputs[2].value, 
        collapsableFilterInputs[3].value, 
        collapsableFilterInputs[4].value, 
        //collapsableFilterInputs[5].value, // GeonUk : replace date filter parameter
        sortKey,                            // GeonUk : same as 'collapsableFilterInputs[5].value' in above line
        sortDirection,                      // GeonUk : new sort direction parameter
        collapsableFilterInputs[6].value
    );

    listLength = NCR.GetFilteredNCRsLength(
        applyFilters, 
        collapsableFilterInputs[0].value, 
        collapsableFilterInputs[1].value, 
        collapsableFilterInputs[2].value, 
        collapsableFilterInputs[3].value, 
        collapsableFilterInputs[4].value, 
        //collapsableFilterInputs[5].value, // GeonUk : replace date filter parameter
        sortKey,                            // GeonUk : same as 'collapsableFilterInputs[5].value' in above line
        sortDirection,                      // GeonUk : new sort direction parameter
        collapsableFilterInputs[6].value
    );

    // GeonUk : add page calculation codes
    //#region page calculation codes
    const sltNum = parseInt(nonCollapsableFilterInputs[0].value, 10);
    let totalPage = 1;
    //GeonUk : page calculation only when sltNum > 0
    if (sltNum > 0) {
        totalPage = Math.ceil(listLength / sltNum);
    }
    //GeonUk : prevent totalPage being 0 when no record found
    if (totalPage === 0) {
        totalPage = 1;
        pageNum = 1;
    } 
    //GeonUk : if pageNum is bigger than totalPage, set pageNum to totalPage
    if (pageNum > totalPage) {
        pageNum = totalPage;
    }
    pageInput.value = pageNum;
    pageInput.max = totalPage;
    pageButtons[0].disabled = (pageNum <= 1);
    pageButtons[1].disabled = (pageNum >= totalPage);
    //#endregion

    const tableBody = document.querySelector("#tableBody");
    tableBody.innerHTML = "";

    NCRs.forEach((ncr) => {
        const row = tableBody.insertRow();
        const NCRNoCell = row.insertCell();
        const PONumCell = row.insertCell();
        const SupplierCell = row.insertCell();
        const SAPNoCell = row.insertCell();
        const DescCell = row.insertCell();
        const DateOpenedCell = row.insertCell();
        const StatusCell = row.insertCell();

        NCRNoCell.innerHTML = ncr.ID;
        PONumCell.innerHTML = ncr.poID;
        SupplierCell.innerHTML = ncr.supplierName;
        SAPNoCell.innerHTML = ncr.productID;
        DescCell.innerHTML = ncr.productDesc;
        DateOpenedCell.innerHTML = ncr.ncrDateOpened.toLocaleDateString('en-US');
        StatusCell.innerHTML = ncr.ncrActive ? "Quality Assurance" : "Engineering";


        // GeonUk : table list tab focusable function
        //#region table list tab focusable function
        row.tabIndex = 0; // GeonUk : make the row focusable by tab

        // GeonUk : make the row clickable by enter key
        row.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                // GeonUk : use same code as row click event
                window.localStorage.setItem("ID", ncr.ID);
                window.location.replace("ncr.html")
            }
        });

        row.addEventListener("click", () => {
            window.localStorage.setItem("ID", ncr.ID);
            
            window.location.replace("ncr.html");
        });
        //#endregion
    });
    arrowTableHead(); // GeonUk : arrow update after table update
}

// initial list on startup
//FilterChanged();      //GeonUk : OLD code, replaced by below code
UpdateList();

document.querySelector("#btnHelp").addEventListener("click", function(event){
    event.preventDefault();
    alert("Click show filters to begin filtering items.\n\nFilters are not case sensitive.");
});

// GeonUk : Clear button function to reset all input fields and prevent hide filter block
document.querySelector("#btnFilterClear").addEventListener("click",function(event) {
    event.preventDefault();                                                             // GeonUk : prevent to hide filter block
    document.querySelector("#collapsableFilterItems").reset();                          // GeonUk : reset all input fields inside the filter block
    FilterChanged();                                                                    // GeonUk : update the list after clearing filters
});