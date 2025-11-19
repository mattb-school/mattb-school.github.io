// nav bar
document.querySelector("#navHome").addEventListener("click", () => location.replace("index.html"));
document.querySelector("#navNewForm").addEventListener("click", () => {
    window.localStorage.setItem("ID", NCR.GetNewNCRNo());
    window.location.replace("ncr.html");
});
let qaDisplayHidden = false;
let engDisplayHidden = false;
let ncr;
let formFields;
let asterisks;
let valid;
let btns;
let sections;
OnLoad()


function OnLoad(){
    ncr = NCR.GetNCRByID(window.localStorage.getItem("ID"));
    if(typeof ncr === "undefined"){
        ncr = new NCR();
        ncr.ID = NCR.GetNewNCRNo();
        ncr.ncrStage = "Quality Assurance";
        ncr.ncrDateOpened = new Date();
    }
    else if(ncr.ncrActive)
        ncr.ncrStage = "Quality Assurance";
    else
        ncr.ncrStage = "Engineering"
    UpdatePage()
}



function UpdatePage(){
    sections = document.querySelectorAll("section")
    if(ncr.ncrStage == "Quality Assurance"){
        SetUpHeader(sections[0]);
        SetUpQA(sections);
    }
    else if(ncr.ncrStage == "Engineering"){
        SetUpHeader(sections[0]);
        SetUpQADisplay(sections[2]);
        SetUpEng(sections);
    }
    else{
        SetUpHeader(sections[0])
        SetUpQADisplay(sections[2])
        SetUpEngDisplay(sections[4])
        SetUpClosed(sections);
    }
}

function SetUpHeader(section){
    section.style.display="grid";
    let displayFields = sections[0].querySelectorAll(".displayField");
    displayFields[0].innerHTML = ncr.ID;
    displayFields[1].innerHTML = ncr.ncrDateOpened.toLocaleDateString();
    displayFields[2].innerHTML = ncr.ncrStage;
}

function SetUpQA(sections){
    
    sections[1].style.display="grid";
    sections[2].style.display="none";
    sections[3].style.display="none";
    sections[4].style.display="none";
    sections[5].style.display="none";
    sections[6].style.display="none";
    sections[7].style.display="none";

    formFields = sections[1].querySelectorAll(".formField");

    formFields[0].value = ncr.poID ?? "";
    formFields[1].value = ncr.productID ?? "";
    formFields[2].value = ncr.supplierName ?? "";
    formFields[3].checked = ncr.qaOptSupOrRecInsp;
    formFields[4].checked = ncr.qaOptWIP;
    formFields[5].value = ncr.poSalesOrderNum ?? "";
    formFields[6].value = ncr.poQuantityReceived ?? "";
    formFields[7].value = ncr.qaQuantityDefective ?? "";
    formFields[8].value = ncr.productDesc ?? "";
    formFields[9].checked = ncr.qaNonConforming;
    formFields[10].checked = ncr.qaEngNeeded;
    formFields[11].value = ncr.qaDefectDesc ?? "";

    formFields[0].addEventListener("input", ValidateQA);
    formFields[1].addEventListener("input", ValidateQA);
    formFields[2].addEventListener("input", ValidateQA);
    formFields[3].addEventListener("input", ValidateQA);
    formFields[4].addEventListener("input", ValidateQA);
    formFields[5].addEventListener("input", ValidateQA);
    formFields[6].addEventListener("input", ValidateQA);
    formFields[7].addEventListener("input", ValidateQA);
    formFields[8].addEventListener("input", ValidateQA);
    formFields[9].addEventListener("input", ValidateQA);
    formFields[10].addEventListener("input", ValidateQA);
    formFields[11].addEventListener("input", ValidateQA);


    btns = sections[1].querySelectorAll("button");
    asterisks = sections[1].querySelectorAll(".asterisk")
    ValidateQA();;
    btns[0].addEventListener("click", function(event){
        event.preventDefault();
        window.alert("Please complete all fields with the asterisk attached to it. \n\nFor the fields, NCR No., PO or Prod. No., Sales Order No., Quantity Recieved and Quantity Defective, please only enter valid numbers. \n(No Negatives) \n\nWhen completed, please review your information and select the \"Complete\" button to send your part to the Engineer.");
    });
    btns[1].addEventListener("click", function(event){
        event.preventDefault();
        ValidateQA()
        if(valid[0] && valid[1]){
            window.alert("Saved!");
        }
        else
            window.alert("Save failed.")
    });
    btns[2].addEventListener("click", function(event){
        event.preventDefault();
        ValidateQA();
        if(valid[0] && valid[1] && valid[2] && valid[3] && valid[4] && valid[5] && valid[6] && valid[7] && valid[8]){
            let dialogue = "Are you sure you want to complete this form?\n You won't be able to make changes to it later.\n";
            dialogue += "\nPO or Prod. No.: " + formFields[0].value;
            dialogue += "\nSAP No.: " + formFields[1].value;
            dialogue += "\nSupplier Name.: " + formFields[2].value;
            dialogue += "\nApplicable Process: ";
            if(formFields[3].checked)
                dialogue += "Supplier or Rec-Insp"
            else
                dialogue += "WIP (Production Order"
            dialogue += "\nSales Order No.: " + formFields[5].value;
            dialogue += "\nQuantity Received: " + formFields[6].value;
            dialogue += "\nQuantity Defective: " + formFields[7].value;
            dialogue += "\nDescription of Item: " + formFields[8].value;
            dialogue += "\nItem marked Nonconforming: ";
            if(formFields[9].checked)
                dialogue += "Yes"
            else
                dialogue += "No"
            dialogue += "\nEngineer Disposition Needed: ";
            if(formFields[10].checked)
                dialogue += "Yes"
            else
                dialogue += "No"
            dialogue += "\nDescription of Defect: \n" + formFields[11].value;
            if(window.confirm(dialogue)){
                ncr.poID = formFields[0].value;
                ncr.productID = formFields[1].value;
                ncr.supplierName = formFields[2].value;
                ncr.qaOptSupOrRecInsp = formFields[3].checked;
                ncr.qaOptWIP = formFields[4].checked;
                ncr.poSalesOrderNum = formFields[5].value;
                ncr.poQuantityReceived = formFields[6].value;
                ncr.qaQuantityDefective = formFields[7].value;
                ncr.productDesc = formFields[8].value;
                ncr.qaNonConforming = formFields[9].checked;
                ncr.qaEngNeeded = formFields[10].checked;
                ncr.qaDefectDesc = formFields[11].value;
                ncr.qaDateCompleted = new Date();
                ncr.qaCompletedBy = "Unknown";
                if(formFields[10].checked)
                    ncr.ncrStage = "Engineering";
                else
                    ncr.ncrStage = "Closed";
                window.alert("Completed!")
                UpdatePage();
            }
        }
        else
            window.alert("Completion failed.")
            
    });
    btns[3].addEventListener("click", function(event){
        event.preventDefault();
        if(window.confirm("Are you sure you want to close? All unsaved changes will be lost."))
            window.location.replace("index.html");
    });
}

function ValidateQA(){
    valid = [false, false, false, false, false, false, false, false, false];
    valid[0] = CheckIsDigit(formFields[0].value);
    if(valid[0]){
        asterisks[2].innerHTML = "✓";
        asterisks[2].style.color = "green"
    }
    else{
        asterisks[2].innerHTML = "* Required";
        asterisks[2].style.color = "red"
    }
    valid[1] = CheckIsDigit(formFields[1].value)
    if(valid[1]){
        asterisks[3].innerHTML = "✓";
        asterisks[3].style.color = "green"
    }
    else{
        asterisks[3].innerHTML = "* Required";
        asterisks[3].style.color = "red"
    }
    valid[2] = CheckIsString(formFields[2].value)
    if(valid[2]){
        asterisks[4].innerHTML = "✓";
        asterisks[4].style.color = "green"
    }
    else{
        asterisks[4].innerHTML = "*";
        asterisks[4].style.color = "red"
    }
    valid[3] = CheckOneChecked(formFields, 3, 4)
    if(valid[3]){
        asterisks[5].innerHTML = "✓";
        asterisks[5].style.color = "green"
    }
    else{
        asterisks[5].innerHTML = "*";
        asterisks[5].style.color = "red"
    }
    valid[4] = CheckIsDigit(formFields[5].value)
    if(valid[4]){
        asterisks[6].innerHTML = "✓";
        asterisks[6].style.color = "green"
    }
    else{
        asterisks[6].innerHTML = "*";
        asterisks[6].style.color = "red"
    }
    valid[5] = CheckIsDigit(formFields[6].value)
    if(valid[5]){
        asterisks[7].innerHTML = "✓";
        asterisks[7].style.color = "green"
    }
    else{
        asterisks[7].innerHTML = "*";
        asterisks[7].style.color = "red"
    }
    valid[6] = CheckIsDigit(formFields[7].value) && CheckLessThan(formFields[7].value, formFields[6].value)
    if(valid[6]){
        asterisks[8].innerHTML = "✓";
        asterisks[8].style.color = "green"
    }
    else{
        asterisks[8].innerHTML = "*";
        asterisks[8].style.color = "red"
    }
    valid[7] = CheckIsString(formFields[8].value)
    if(valid[7]){
        asterisks[9].innerHTML = "✓";
        asterisks[9].style.color = "green"
    }
    else{
        asterisks[9].innerHTML = "*";
        asterisks[9].style.color = "red"
    }
    valid[8] = CheckIsString(formFields[11].value)
    if(valid[8]){
        asterisks[10].innerHTML = "✓";
        asterisks[10].style.color = "green"
    }
    else{
        asterisks[10].innerHTML = "*";
        asterisks[10].style.color = "red"
    }
    
    if(valid[0] && valid[1]){
        btns[1].disabled = false;
        if(valid[2] && valid[3] && valid[4] && valid[5] && valid[6] && valid[7] && valid[8])
            btns[2].disabled = false;
        else
            btns[2].disabled = true
    }
    else{
        btns[1].disabled = true;
        btns[2].disabled = true
    }
}

function SetUpQADisplay(section){
    section.style.display="grid";
    displayFields = section.querySelectorAll(".displayField");
    displayFields[0].innerHTML = ncr.poID;
    displayFields[1].innerHTML = ncr.productID;
    displayFields[2].innerHTML = ncr.supplierName;
    if(ncr.qaOptSupOrRecInsp)
        displayFields[3].innerHTML = "Supplier or Rec-Insp."
    else
        displayFields[3].innerHTML = "WIP (Production Order)"
    displayFields[4].innerHTML = ncr.poSalesOrderNum;
    displayFields[5].innerHTML = ncr.poQuantityReceived;
    displayFields[6].innerHTML = ncr.qaQuantityDefective;
    displayFields[7].innerHTML = ncr.productDesc;
    if(ncr.qaNonConforming)
        displayFields[8].innerHTML = "Yes";
    else
        displayFields[8].innerHTML = "No";
    if(ncr.qaEngNeeded)
        displayFields[9].innerHTML = "Yes";
    else
        displayFields[9].innerHTML = "No";
    displayFields[10].innerHTML = ncr.qaDefectDesc;
    displayFields[11].innerHTML = ncr.qaCompletedBy
    displayFields[12].innerHTML = ncr.qaDateCompleted.toLocaleDateString();

    let toggledisplay = section.querySelector("button");
    let displayWrapper = section.querySelector(".displaywrapper");
    toggledisplay.addEventListener("click", () => {
        if(toggledisplay.innerHTML == "Hide"){
            displayWrapper.style.display = "none";
            toggledisplay.innerHTML = "Show";
        }
        else{
            displayWrapper.style.display = "grid";
            toggledisplay.innerHTML = "Hide";
        }
    });
}

function SetUpEng(sections){
    sections[1].style.display="none";
    sections[3].style.display="grid";
    sections[4].style.display="none";
    sections[5].style.display="none";
    sections[6].style.display="none";
    sections[7].style.display="none";

    formFields = sections[3].querySelectorAll(".formField");
    btns = sections[3].querySelectorAll("button");

    formFields[0].addEventListener("input", ValidateEng);
    formFields[1].addEventListener("input", ValidateEng);
    formFields[2].addEventListener("input", ValidateEng);
    formFields[3].addEventListener("input", ValidateEng);
    formFields[4].addEventListener("input", ValidateEng);
    formFields[5].addEventListener("input", ValidateEng);
    formFields[6].addEventListener("input", ValidateEng);
    formFields[7].addEventListener("input", ValidateEng);
    formFields[8].addEventListener("input", ValidateEng);
    formFields[9].addEventListener("input", ValidateEng);
    formFields[10].addEventListener("input", ValidateEng);

    ValidateEng()

    btns[0].addEventListener("click", function(event){
        event.preventDefault();
        window.alert("Please complete all fields with the asterisk attached to it. \n\nYou can only fill out the disposition if you choose Repair or Rework as your review.\n\nYou can only fill out the revision information if you check yes to updating the drawing. \n\nFor the fields Original Rev Number and Updated Rev Number, please only enter positive integers. \n(No Negatives) \n\nWhen completed, please review your information and select the \"Complete\" button to send your part to the purchasing department.");
    });
    btns[1].addEventListener("click", function(event){
        event.preventDefault();
        window.alert("Saved!"); 
    });
    btns[2].addEventListener("click", function(event){
        event.preventDefault();
        ValidateEng();
        let tempDate = Date.parse(formFields[9].value);
        if(valid[0] && valid[1] && valid[2] && valid[3] && valid[4] && valid[5]){
            let dialogue = "Are you sure you want to complete this form?\n You won't be able to make changes to it later.\n";
            dialogue += "\nReview by CF Engineer: ";
            if(formFields[0].checked)
                dialogue += "Use as is";
            else if(formFields[1].checked)
                dialogue += "Repair";
            else if(formFields[2].checked)
                dialogue += "Rework";
            else
                dialogue += "Scrap";
            dialogue += "\nNotify Customer of NCR: ";
            if(formFields[4].checked)
                dialogue += "Yes";
            else
                dialogue += "No";
            dialogue +=  "\nDisposition: ";
            if(formFields[5].disabled)
                dialogue += "N/A";
            else
                dialogue += "\n" + formFields[5].value;
            if(formFields[6].checked)
                dialogue += "\nDrawing Requires Updating: Yes\nOriginal Rev. Number: " + formFields[7].value + "\nUpdated Rev. Number: " + formFields[8].value + "\nRevision Date: " + new Date(Date.parse(formFields[9].value)).toLocaleDateString() + "\nName of Engineer: " + formFields[10].value;
            else
                dialogue += "\nDrawing Requires Updating: No\nOriginal Rev. Number: N/A\nUpdated Rev. Number: N/A\nRevision Date: N/A\nName of Engineer: N/A";
            if(window.confirm(dialogue)){
                if(formFields[0].checked)
                    ncr.engReview = "Use as is";
                else if(formFields[1].checked)
                    ncr.engReview = "Repair";
                else if(formFields[2].checked)
                    ncr.engReview = "Rework";
                else
                    ncr.engReview = "Scrap";
                ncr.engNotifyCustomer = formFields[4].checked;
                if(formFields[5].disabled)
                    ncr.engDisposition = null;
                else
                    ncr.engDisposition = formFields[5].value;
                ncr.engUpdateDrawing = formFields[6].checked;
                if(formFields[6].checked){
                    ncr.engOriginalRevNo = formFields[7].value;
                    ncr.engUpdatedRevNo = formFields[8].value;
                    ncr.engUpdatedOn = new Date(Date.parse(formFields[9].value)).toLocaleDateString();
                    ncr.engUpdatedBy = formFields[10].value;
                }
                ncr.engDateCompleted = new Date()
                ncr.engCompletedBy = "Unknown"


                ncr.ncrStage = "Closed"
                window.alert("Completed!");
                UpdatePage()
                
            }
        }
        else
            window.alert("Completion failed.")
    });
    btns[3].addEventListener("click", function(event){
        event.preventDefault();
        if(window.confirm("Are you sure you want to close? All unsaved changes will be lost."))
            window.location.replace("index.html");
    });
}

function ValidateEng(section){
    asterisks = sections[3].querySelectorAll(".asterisk")
    valid = [false, false, false, false, false, false];
    
    valid[0] = CheckOneChecked(formFields, 0, 3);
    if(valid[0]){
        asterisks[2].innerHTML = "✓";
        asterisks[2].style.color = "green"
        
    }
    else{
        asterisks[3].innerHTML = "*";
        asterisks[3].style.color = "red"
    }

    if(formFields[1].checked || formFields[2].checked){
        formFields[5].disabled = false;
        valid[1] = CheckIsString(formFields[5].value);
        if(valid[1]){
            asterisks[3].innerHTML = "✓";
            asterisks[3].style.color = "green"
        }
        else{
            asterisks[3].innerHTML = "*";
            asterisks[3].style.color = "red"
        }
    }
    else{
        valid[1] = true;
        formFields[5].disabled = true;
        asterisks[3].innerHTML = "✓";
        asterisks[3].style.color = "green"       
    }

    if(!formFields[6].checked){
        valid[2] = true;
        valid[3] = true;
        valid[4] = true;
        valid[5] = true;
        formFields[7].disabled = true;
        formFields[8].disabled = true;
        formFields[9].disabled = true;
        formFields[10].disabled = true;
        asterisks[4].innerHTML = "✓";
        asterisks[4].style.color = "green"
        asterisks[5].innerHTML = "✓";
        asterisks[5].style.color = "green"
        asterisks[6].innerHTML = "✓";
        asterisks[6].style.color = "green"
        asterisks[7].innerHTML = "✓";
        asterisks[7].style.color = "green"
    }
    else{
        formFields[7].disabled = false;
        formFields[8].disabled = false;
        formFields[9].disabled = false;
        formFields[10].disabled = false;
        valid[2] = CheckIsDigit(formFields[7].value);
        if(valid[2]){
            asterisks[4].innerHTML = "✓";
            asterisks[4].style.color = "green"
        }
        else{
            asterisks[4].innerHTML = "*";
            asterisks[4].style.color = "red"
        }
        valid[3] = CheckIsDigit(formFields[8].value)
        if(valid[3]){
            asterisks[5].innerHTML = "✓";
            asterisks[5].style.color = "green"
        }
        else{
            asterisks[5].innerHTML = "*";
            asterisks[5].style.color = "red"
        }
        valid[4] = (Date.parse(formFields[9].value ?? '9999-12-31')) <= new Date()
        if(valid[4]){
            asterisks[6].innerHTML = "✓";
            asterisks[6].style.color = "green"
        }
        else{
            asterisks[6].innerHTML = "*";
            asterisks[6].style.color = "red"
        }
        valid[5] = CheckIsString(formFields[10].value);
        if(valid[5]){
            
            asterisks[7].innerHTML = "✓";
            asterisks[7].style.color = "green"
        }
        else{
            asterisks[7].innerHTML = "*";
            asterisks[7].style.color = "red"
        }
    }
    if(valid[0] && valid[1] && valid[2] && valid[3] && valid[4] && valid[5])
        btns[2].disabled = false;
    else
        btns[2].disabled = true;
}



function SetUpEngDisplay(section){
    section.style.display="grid";
    displayFields = section.querySelectorAll(".displayField");
    
    displayFields[0].innerHTML = ncr.engReview ?? "N/A";
    if(ncr.engNotifyCustomer)
        displayFields[1].innerHTML = "Yes";
    else
        displayFields[1].innerHTML = "No";
    displayFields[2].innerHTML = ncr.engDisposition ?? "N/A";
    if(ncr.engUpdateDrawing)
        displayFields[3].innerHTML = "Yes";
    else
        displayFields[3].innerHTML = "No";
    displayFields[4].innerHTML = ncr.engOriginalRevNo ?? "N/A";
    displayFields[5].innerHTML = ncr.engUpdatedRevNo ?? "N/A";
    displayFields[6].innerHTML = ncr.engUpdatedOn ?? "N/A";
    displayFields[7].innerHTML = ncr.engUpdatedBy ?? "N/A";
    displayFields[8].innerHTML = ncr.engCompletedBy ?? "N/A";
    displayFields[9].innerHTML = ncr.engDateCompleted.toLocaleDateString() ?? "N/A";


    let toggledisplay = section.querySelector("button");
    let displayWrapper = section.querySelector(".displaywrapper");
    toggledisplay.addEventListener("click", () => {
        if(toggledisplay.innerHTML == "Hide"){
            displayWrapper.style.display = "none";
            toggledisplay.innerHTML = "Show";
        }
        else{
            displayWrapper.style.display = "grid";
            toggledisplay.innerHTML = "Hide";
        }
    });
}

function CheckIsDigit(value){
    return value.length > 0 && /^\d+$/.test(value) && value >= 0;
}

function CheckIsString(value){
    return value.length > 0;
}

function CheckOneChecked(nodelist, start, stop){
    i = 0;
    Array.prototype.slice.call(nodelist).slice(start, stop + 1).forEach(box => {
        if(box.checked)
            i++;
    });
    return i == 1;
}

function CheckLessThan(lesser, greater){
    return Number(lesser) <= Number(greater)
}



function SetUpClosed(sections){
    sections[1].style.display="none";
    sections[3].style.display="none";
    sections[7].style.display="grid";
    btns = sections[7].querySelectorAll("button");
    btns[0].addEventListener('click', () => window.alert("Error. Unable to save as PDF."));
    btns[1].addEventListener('click', () => window.location.replace("index.html"));
}