//Button new Position
var newPositionBtn = document.getElementById("novaPosicaoBtn");

var tradesTableBody = document.getElementById("tradesTableBody");

//Set statistics
//Total Profit
document.getElementById("totalProfit").innerText = "Lucro: " + returnCurrencyFormat(getTotalProfit());

//Total Loss
document.getElementById("totalLoss").innerText = "Perda: " + returnCurrencyFormat(getTotalLoss());

//Diference
var dif = "";

if(isNaN(dif) == false){
    dif = getTotalLoss()["value"];
} else {
    dif = getTotalLoss()["value"] + getTotalProfit()["value"];
}

var diference = returnCurrencyFormat(dif);

if(dif > 0){
    document.getElementById("totalDiference").style.color = "green";
} else if (dif < 0){
    document.getElementById("totalDiference").style.color = "red";
} else {
    document.getElementById("totalDiference").style.color = "black";
}

document.getElementById("totalDiference").innerText = "Diferença: " + diference;

if(document.getElementById("totalProfit").innerText == "Lucro: " + undefined){
    document.getElementById("totalProfit").innerText = "Lucro: " + returnCurrencyFormat("0");
}

if(document.getElementById("totalLoss").innerText == "Perda: " + undefined){
    document.getElementById("totalLoss").innerText = "Perda: " + returnCurrencyFormat("0");
}

if(document.getElementById("totalDiference").innerText == "Diferença: " + undefined){
    document.getElementById("totalDiference").innerText = "Diferença: " + returnCurrencyFormat("0");
}


var savePositionBtn = document.getElementById("savePositionBtn");

//New Position
newPositionBtn.onclick = function(){
    $("#newPositionModal").modal('show');
}

showTrades();                                                                                                                                                                                                        

function showTrades(){
    //Show all trades in the table
    var trades = getTrades();

    trades.forEach(element => {
        addTableRow(element["_id"], element["paper"], element["entryDate"], element["endDate"], returnCurrencyFormat(element["entryValue"]), returnCurrencyFormat(element["exitValue"]));
    });    
}

//Save new Position
savePositionBtn.onclick = function(){

    //Get All Inputs
    var paperInput = document.getElementById("paper_input").value;
    var entryDateInput = moment(document.getElementById("entryDate_input").value).format("DD-MM-YYYY");
    var exitDateInput = moment(document.getElementById("exitDate_input").value).format("DD-MM-YYYY");
    var entryValueInput = document.getElementById("entryValue_input").value;
    var exitValueInput = document.getElementById("exitValue_input").value;

    var openDays = getOpenDays(entryDateInput, exitDateInput);
    var diference = "";

    if(exitValueInput == null || exitValueInput == undefined || exitValueInput == ""){
        diference = "";
    } else {
        diference = getDiference(entryValueInput, exitValueInput);
    }

    var difToMadeProf = diference.replace("€", "");
    var madeProfit = "";

    if(difToMadeProf == null || difToMadeProf == undefined || difToMadeProf == ""){
        madeProfit = "to resolve";
    } else if (difToMadeProf <=0) {
        madeProfit = "false";
    } else {
        madeProfit = "true";
    }

    if(entryDateInput == "Invalid date"){
        entryDateInput = "";
    }

    if(exitDateInput == "Invalid date"){
        exitDateInput = "";
    }
    
    saveTrades(paperInput, entryDateInput, exitDateInput, openDays, entryValueInput, exitValueInput, diference, madeProfit);
    $("#newPositionModal").modal('hide');
}

function addTableRow(id, paper, entryDate, exitDate, entryValue, exitValue){
    var newRow = document.createElement("tr");
    newRow.style.textAlign = "center";

    var rowId = document.createElement("td");
    rowId.innerText = id;
    rowId.style.width = 0;
    newRow.appendChild(rowId);

    var rowPaper = document.createElement("td");
    rowPaper.innerText = paper;
    newRow.appendChild(rowPaper);

    var rowEntryDate = document.createElement("td");

    rowEntryDate.innerText = entryDate;
    newRow.appendChild(rowEntryDate);

    var rowExitDate = document.createElement("td");

    if(exitDate == undefined || exitDate == "Invalid date" || exitDate == "Em andamento" || exitDate == ""){
        rowExitDate.innerText = "Em andamento";
    } else {
        rowExitDate.innerText = exitDate;
    }

    newRow.appendChild(rowExitDate);

    var rowTotalDays = document.createElement("td");


    if(rowExitDate.innerText == "Em andamento"){
        rowTotalDays.innerText = "Em andamento";
    } else {
        rowTotalDays.innerText = getOpenDays(entryDate, exitDate);
    }

    newRow.appendChild(rowTotalDays);

    var rowEntryValue = document.createElement("td");
    rowEntryValue.innerText = entryValue;
    newRow.appendChild(rowEntryValue);

    var rowExitValue = document.createElement("td");

    if(exitValue == undefined || exitValue == null || exitValue == ""){
        rowExitValue.innerText = "Por resolver";
    } else {
        rowExitValue.innerText = exitValue;
    }

    newRow.appendChild(rowExitValue);

    var rowDiference = document.createElement("td");

    if(rowExitValue.innerText == "Por resolver"){
        rowDiference.innerText = "Por resolver";
        rowDiference.style.backgroundColor = "yellow";
    } else {
        rowDiference.innerText = getDiference(entryValue, exitValue);

        if(getDiference(entryValue, exitValue).indexOf('-€') > -1){
            rowDiference.style.backgroundColor = "red";
    
        } else {
            rowDiference.style.backgroundColor = "green";
        }
    }

    newRow.appendChild(rowDiference);

    //Buttons
    var div = document.createElement("div");
    div.style.width = "100%";

    var edit = document.createElement("td");
    edit.style.border = "0px";
    edit.style.paddingTop = "10%";
    edit.style.paddingLeft = "30%";
    edit.style.paddingRight = "5p%";
    edit.innerHTML = `<button id="${id}" type="button" class="btn btn-warning btn-sm">E</button>`;
    div.appendChild(edit);

    var remove = document.createElement("td");
    remove.style.border = "0px";
    remove.style.padding = "0px"
    remove.style.paddingTop = "10%";
    remove.style.paddingLeft = "20%";
    remove.innerHTML = `<button type="button" id="${id}" class="btn btn-danger btn-sm">R</button>`;
    div.appendChild(remove);

    newRow.appendChild(div);

    remove.onclick = function(){
        if(confirm("Deseja mesmo eliminar a transação?")) {
            newRow.style.transitionProperty = "opacity";
            newRow.style.transitionDuration = "2s";
            newRow.style.opacity = "0.2";
            newRow.style.opacity = "0";
                
            setTimeout(() => {
                newRow.remove();
            }, 1000);

            //Remove from DB
            //findTradeById
            var tradeId = remove.closest("td").firstElementChild.getAttribute("id");
            console.log(tradeId)
            var trade = findTradeById(tradeId)["_id"];
            console.log(trade);
            removeTrade(trade);


        } else {
            return 0;
        };          
    }

    edit.onclick = function(){

        $("#editPositionModal").modal('show');

        var tradeId = edit.closest("td").firstElementChild.getAttribute("id");

        //Get Inputs
        //Id
        document.getElementById("tradeId").innerHTML = tradeId;

        //get trade with id
        var trade = findTradeById(tradeId);

        if(String(trade["paper"]).length > 0){
            document.getElementById("editPaper_input").value = String(trade["paper"]);
        }

        if(String(trade["entryDate"]).length > 0){
            document.getElementById("editEntryDate_input").value = String(trade["entryDate"]);
        }

        if(String(trade["endDate"]).length > 0){
            document.getElementById("editExitDate_input").value = String(trade["endDate"]);
        }

        if(String(trade["entryValue"]).length > 0){
            document.getElementById("editEntryValue_input").value = String(trade["entryValue"]);
        }

        if(String(trade["exitValue"]).length > 0){
            document.getElementById("editExitValue_input").value = String(trade["exitValue"]);
        }

        document.getElementById("saveEditPositionBtn").onclick = function(){
            
            //moment(document.getElementById("entryDate_input").value).format("DD-MM-YYYY");

            //Get all inputs
            var paper = document.getElementById("editPaper_input").value;
            var entryDate = moment(document.getElementById("editEntryDate_input").value).format("DD-MM-YYYY");
            var exitDate = moment(document.getElementById("editExitDate_input").value).format("DD-MM-YYYY");
            var entryValue = document.getElementById("editEntryValue_input").value
            var exitValue = document.getElementById("editExitValue_input").value

            var openDays = getOpenDays(entryDate, exitDate);
            var diference = getDiference(entryValue, exitValue);

            var difToMadeProf = diference.replace("€", "");
            var madeProfit = "";

            if(difToMadeProf <= 0){
                madeProfit = "false";
            } else {
                madeProfit = "true";
            }

            if(entryDate == "Invalid date"){
                entryDate = "";
            }
    
            if(exitDate == "Invalid date"){
                exitDate = "";
            }

        updateTrades(tradeId, paper, entryDate, exitDate, openDays, entryValue, exitValue, diference, madeProfit);
        //console.log(tradeId, paper, entryDate, exitDate, openDays, entryValue, exitValue, diference, madeProfit);
       }
    }

    tradesTableBody.appendChild(newRow);
}

function getOpenDays(openDate, exitDate){

    var open = moment(openDate, "DD-MM-YYYY");
    var exit = moment(exitDate, "DD-MM-YYYY");
    var duration = exit.diff(open, 'days');

    return duration;
}

function getDiference(entryValue, exitValue){
    var diference = currency(currency(exitValue).subtract(entryValue));
    return currency(diference, { separator: ',', symbol: '€', formatWithSymbol: true }).format();
}

function returnCurrencyFormat(value){

    if(value == null || value == "" || value == undefined){
        return undefined
    } else {
        return currency(value, { separator: ',', symbol: '€', formatWithSymbol: true }).format();
    }
}

//---------------------------------------------Statistics----------------------------------------------
function getTotalProfit(){
    var trades = [];
    var profitTrades = []; 
    trades = getTrades();
    var total = 0;

    //Save all trades with profit
    trades.forEach((element, index) => {
        if(element["madeProfit"] == "true"){
            profitTrades[index] = element["diference"].replace(/[€]/g, "");
        }
    });

    profitTrades.forEach(element => {
        total = currency(total).add(element);
    });
    return total;
}

function getTotalLoss(){
    var trades = [];
    var lossTrades = [];
    trades = getTrades();
    var total = 0;

    //Save all trades with loss
    trades.forEach((element, index) => {
        if(element["madeProfit"] == "false"){
            lossTrades[index] = element["diference"].replace(/[€]/g, "");
        }
    });

    lossTrades.forEach(element => {
        total = currency(total).add(element);
    });

    return total;

}

//---------------------------------------------AJAX----------------------------------------------------
function getTrades(){

    var trades = [];

    $.ajax({
        url: 'https://trade-back.herokuapp.com/trades/all',
        cache: false,
        method: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            
            //console.log(res['result'][0]['paper']);
            trades = res['result'];
            //console.log(trades);
        }
    });

    return trades;
}

function findTradeById(id){
    var trades = [];
    var trade = "";

    $.ajax({
        url: 'https://trade-back.herokuapp.com/trades/all',
        cache: false,
        method: "GET",
        dataType: 'json',
        async: false,
        success: function(res) {
            
            trades = res['result'];

            trades.forEach(element => {

                if(element["_id"] == id){
                    trade = element;
                }
            });
        }
    });
    return trade;
}

function saveTrades(paper, entryDate, endDate, openDays, entryValue, exitValue, diference, madeProfit){

    var newTrade = {
        paper: paper,
        entryDate: entryDate,
        endDate: endDate,
        openDays: openDays,
        entryValue: entryValue,
        exitValue: exitValue,
        diference: diference,
        madeProfit: madeProfit
    }

    $.ajax({
        url: 'https://trade-back.herokuapp.com/trades/new',
        method: "POST",
        data: JSON.stringify(newTrade),
        processData: false,
        contentType: "application/json",
        success: function(res) {
            location.reload();
        }
    });

}

function updateTrades(tradeId, paper, entryDate, endDate, openDays, entryValue, exitValue, diference, madeProfit){

    var newTrade = {
        paper: paper,
        entryDate: entryDate,
        endDate: endDate,
        openDays: openDays,
        entryValue: entryValue,
        exitValue: exitValue,
        diference: diference,
        madeProfit: madeProfit
    }

    $.ajax({
        url: `https://trade-back.herokuapp.com/trades/edit/${tradeId}`,
        method: "POST",
        data: JSON.stringify(newTrade),
        processData: false,
        contentType: "application/json",
        success: function(res) {
            location.reload();
        }
    });
}

function removeTrade(id){
    $.ajax({
        url: `https://trade-back.herokuapp.com/trades/delete/${id}`,
        method: "DELETE",
        processData: false,
        success: function(res) {
            slocation.reload();
        }
    });
}

